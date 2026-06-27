// Minimal static blog generator.
// Reads markdown from content/blog/, renders to dist/ with a small HTML template.
// No framework. Deps: marked (GFM markdown) + gray-matter (frontmatter).

import { readFileSync, readdirSync, writeFileSync, mkdirSync, rmSync, cpSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Marked } from 'marked';
import matter from 'gray-matter';

const root = dirname(fileURLToPath(import.meta.url));
const POSTS_DIR = join(root, 'content', 'blog');
const PUBLIC_DIR = join(root, 'public');
const OUT_DIR = join(root, 'dist');

const SITE_TITLE = 'Wu Jiayi';
const SITE_DESCRIPTION = 'Notes on engineering, running, and other things.';
const SITE_URL = 'https://wu101.com';

const marked = new Marked({ gfm: true, breaks: false });

const fmtDate = (d) =>
  new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function layout({ title, description, body, canonical }) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description || SITE_DESCRIPTION)}">
${canonical ? `<link rel="canonical" href="${esc(canonical)}">` : ''}
<link rel="icon" href="/favicon.ico">
<link rel="stylesheet" href="/styles.css">
</head>
<body>
<header class="site-header">
  <a class="site-title" href="/">${esc(SITE_TITLE)}</a>
  <nav>
    <a href="/blog/">Blog</a>
  </nav>
</header>
<main>
${body}
</main>
<footer class="site-footer">
  <p>&copy; ${new Date().getFullYear()} ${esc(SITE_TITLE)}</p>
</footer>
</body>
</html>
`;
}

// Standalone minimal landing page. No site header/footer chrome.
function homeLayout({ title, description, canonical, body }) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description || SITE_DESCRIPTION)}">
${canonical ? `<link rel="canonical" href="${esc(canonical)}">` : ''}
<link rel="icon" href="/favicon.ico">
<link rel="stylesheet" href="/styles.css">
</head>
<body class="home">
${body}
</body>
</html>
`;
}

function renderHome() {
  return `<main class="home-main">
  <section class="home-card">
    <h1 class="home-name">${esc(SITE_TITLE)}</h1>
    <p class="home-tagline">${esc(SITE_DESCRIPTION)}</p>
    <nav class="home-nav">
      <a href="/blog/">Blog</a>
      <button type="button" class="home-link" id="cv-btn" aria-haspopup="dialog">CV</button>
      <a href="/rss.xml">RSS</a>
    </nav>
  </section>

  <div class="cv-overlay" id="cv-overlay" hidden>
    <div class="cv-modal" role="dialog" aria-modal="true" aria-labelledby="cv-title">
      <h2 id="cv-title">CV</h2>
      <p>Coming soon.</p>
      <button type="button" class="home-link" id="cv-close">Close</button>
    </div>
  </div>
</main>
<script>
(function () {
  var btn = document.getElementById('cv-btn');
  var overlay = document.getElementById('cv-overlay');
  var close = document.getElementById('cv-close');
  function open() { overlay.hidden = false; close.focus(); }
  function shut() { overlay.hidden = true; btn.focus(); }
  btn.addEventListener('click', open);
  close.addEventListener('click', shut);
  overlay.addEventListener('click', function (e) { if (e.target === overlay) shut(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !overlay.hidden) shut(); });
})();
</script>`;
}

function loadPosts() {
  return readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith('.md'))
    .map((file) => {
      const slug = file.replace(/\.md$/, '');
      const raw = readFileSync(join(POSTS_DIR, file), 'utf8');
      const { data, content } = matter(raw);
      return { slug, data, content };
    })
    .sort((a, b) => new Date(b.data.pubDate) - new Date(a.data.pubDate));
}

function renderIndex(posts) {
  const items = posts
    .map((p) => {
      const tags = (p.data.tags || []).map((t) => `<span class="tag">${esc(t)}</span>`).join('');
      return `<li>
  <a class="post-link" href="/blog/${p.slug}/">${esc(p.data.title)}</a>
  <div class="post-meta"><time>${fmtDate(p.data.pubDate)}</time> ${tags}</div>
</li>`;
    })
    .join('\n');
  return `<h1>Blog</h1>
<ul class="post-list">
${items}
</ul>`;
}

function renderPost(p) {
  const tags = (p.data.tags || []).map((t) => `<span class="tag">${esc(t)}</span>`).join('');
  const html = marked.parse(p.content);
  return `<article class="post">
  <header class="post-header">
    <h1>${esc(p.data.title)}</h1>
    <div class="post-meta"><time>${fmtDate(p.data.pubDate)}</time> ${tags}</div>
  </header>
  ${html}
  <p class="back"><a href="/">&larr; All posts</a></p>
</article>`;
}

function renderRss(posts) {
  const items = posts
    .map(
      (p) => `  <item>
    <title>${esc(p.data.title)}</title>
    <link>${SITE_URL}/blog/${p.slug}/</link>
    <guid>${SITE_URL}/blog/${p.slug}/</guid>
    <pubDate>${new Date(p.data.pubDate).toUTCString()}</pubDate>
    <description>${esc(p.data.description || '')}</description>
  </item>`
    )
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
  <title>${esc(SITE_TITLE)}</title>
  <link>${SITE_URL}</link>
  <description>${esc(SITE_DESCRIPTION)}</description>
${items}
</channel>
</rss>
`;
}

function write(relPath, contents) {
  const full = join(OUT_DIR, relPath);
  mkdirSync(dirname(full), { recursive: true });
  writeFileSync(full, contents);
}

// --- build ---
rmSync(OUT_DIR, { recursive: true, force: true });
mkdirSync(OUT_DIR, { recursive: true });

// copy static assets
if (existsSync(PUBLIC_DIR)) cpSync(PUBLIC_DIR, OUT_DIR, { recursive: true });

const posts = loadPosts();

// / = minimal landing page
write(
  'index.html',
  homeLayout({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    canonical: SITE_URL,
    body: renderHome(),
  })
);

// /blog = post index
write(
  'blog/index.html',
  layout({
    title: `Blog — ${SITE_TITLE}`,
    description: SITE_DESCRIPTION,
    canonical: `${SITE_URL}/blog/`,
    body: renderIndex(posts),
  })
);

for (const p of posts) {
  write(
    `blog/${p.slug}/index.html`,
    layout({
      title: `${p.data.title} — ${SITE_TITLE}`,
      description: p.data.description,
      canonical: `${SITE_URL}/blog/${p.slug}/`,
      body: renderPost(p),
    })
  );
}

write('rss.xml', renderRss(posts));
write('CNAME', 'wu101.com\n');

console.log(`Built ${posts.length} posts -> dist/`);
