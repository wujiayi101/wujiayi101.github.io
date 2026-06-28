// Generate dist/cv.pdf from the built /cv/ page using headless Chrome.
// No extra npm deps: uses the system Chrome (CHROME_BIN, or common install paths).
// If no Chrome is found, warns and exits 0 so `npm run build` still succeeds.

import { createServer } from 'node:http';
import { readFile, stat, access } from 'node:fs/promises';
import { spawn, spawnSync } from 'node:child_process';
import { join, extname, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('.', import.meta.url));
const DIST = join(root, 'dist');
const OUT = join(DIST, 'cv.pdf');
const PORT = 4399;
const MAX_PAGES = 2;

const CHROME_CANDIDATES = [
  process.env.CHROME_BIN,
  'google-chrome-stable',
  'google-chrome',
  'chromium-browser',
  'chromium',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
].filter(Boolean);

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.woff2': 'font/woff2',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

async function exists(p) {
  try { await access(p); return true; } catch { return false; }
}

// Resolve a Chrome binary: explicit paths checked on disk, bare names looked up on PATH.
async function findChrome() {
  for (const c of CHROME_CANDIDATES) {
    if (c.includes('/')) {
      if (await exists(c)) return c;
    } else if (spawnSync('which', [c], { stdio: 'ignore' }).status === 0) {
      return c;
    }
  }
  return null;
}

function startServer() {
  const server = createServer(async (req, res) => {
    let p = normalize(decodeURIComponent(req.url.split('?')[0])).replace(/^(\.\.[/\\])+/, '');
    let file = join(DIST, p);
    try {
      const s = await stat(file);
      if (s.isDirectory()) file = join(file, 'index.html');
    } catch {
      if (!extname(file)) file = join(file, 'index.html');
    }
    try {
      const data = await readFile(file);
      res.writeHead(200, { 'content-type': TYPES[extname(file)] || 'application/octet-stream' });
      res.end(data);
    } catch {
      res.writeHead(404); res.end('404');
    }
  });
  return new Promise((resolve) => server.listen(PORT, () => resolve(server)));
}

function printPdf(chrome) {
  return new Promise((resolve, reject) => {
    const args = [
      '--headless=new', '--disable-gpu', '--no-sandbox',
      '--no-pdf-header-footer', '--virtual-time-budget=3000',
      `--print-to-pdf=${OUT}`, `http://localhost:${PORT}/cv/`,
    ];
    const child = spawn(chrome, args, { stdio: 'ignore' });
    child.on('error', reject);
    child.on('exit', (code) => (code === 0 ? resolve() : reject(new Error(`Chrome exited ${code}`))));
  });
}

function pdfPageCountViaPdfinfo(path) {
  const r = spawnSync('pdfinfo', [path], { encoding: 'utf8' });
  if (r.status !== 0) return null;
  const m = r.stdout.match(/^Pages:\s+(\d+)/m);
  return m ? parseInt(m[1], 10) : null;
}

async function pdfPageCount(path) {
  const viaPdfinfo = pdfPageCountViaPdfinfo(path);
  if (viaPdfinfo != null) return viaPdfinfo;

  const buf = await readFile(path);
  const text = buf.toString('latin1');
  const counts = [...text.matchAll(/\/Count\s+(\d+)/g)].map((m) => parseInt(m[1], 10));
  return counts.length ? Math.max(...counts) : 0;
}

const chrome = await findChrome();
if (!chrome) {
  console.warn('gen-cv-pdf: no Chrome found — skipping cv.pdf (set CHROME_BIN to enable).');
  process.exit(0);
}
if (!(await exists(join(DIST, 'cv', 'index.html')))) {
  console.warn('gen-cv-pdf: dist/cv/index.html missing — run build first. Skipping.');
  process.exit(0);
}

const server = await startServer();
try {
  await printPdf(chrome);
  const s = await stat(OUT);
  const pages = await pdfPageCount(OUT);
  console.log(`Generated cv.pdf (${(s.size / 1024).toFixed(0)} KB, ${pages} pages) via ${chrome}`);
  if (pages > MAX_PAGES) {
    console.error(
      `gen-cv-pdf: CV exceeds ${MAX_PAGES} pages (${pages}). ` +
      'Trim content or tighten @media print styles in build.mjs renderCvPage().',
    );
    process.exitCode = 1;
  }
} catch (err) {
  console.error(`gen-cv-pdf: failed — ${err.message}`);
  process.exitCode = 1;
} finally {
  server.close();
}
