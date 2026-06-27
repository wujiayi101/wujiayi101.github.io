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
      <a href="/cv/">CV</a>
      <a href="https://www.linkedin.com/in/wu101" rel="me noopener">LinkedIn</a>
    </nav>
  </section>
</main>`;
}

// Standalone CV page (Option A — minimal single column). Self-contained styles.
function renderCvPage() {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Chris Wu — CV</title>
<meta name="description" content="Chris Wu — Platform & DevOps engineer. Curriculum vitae.">
<link rel="canonical" href="${SITE_URL}/cv/">
<link rel="icon" href="/favicon.ico">
<style>
@font-face{font-family:"Space Grotesk";font-weight:400;font-display:swap;src:url("/fonts/space-grotesk-400.woff2") format("woff2");}
@font-face{font-family:"Space Grotesk";font-weight:500;font-display:swap;src:url("/fonts/space-grotesk-500.woff2") format("woff2");}
@font-face{font-family:"Space Grotesk";font-weight:600;font-display:swap;src:url("/fonts/space-grotesk-600.woff2") format("woff2");}
@font-face{font-family:"Space Grotesk";font-weight:700;font-display:swap;src:url("/fonts/space-grotesk-700.woff2") format("woff2");}
:root{--fg:#1a1a1a;--muted:#6b6b6b;--accent:#2f6f4f;--border:#e5e5e5;--bg:#fff;}
*{box-sizing:border-box;margin:0;padding:0;}
body{font-family:"Space Grotesk",system-ui,sans-serif;color:var(--fg);background:#f4f4f2;line-height:1.5;-webkit-font-smoothing:antialiased;}
.bar{position:sticky;top:0;display:flex;justify-content:space-between;align-items:center;gap:1rem;padding:.85rem 1.5rem;background:#fff;border-bottom:1px solid var(--border);}
.bar a.back{color:var(--muted);text-decoration:none;font-size:.9rem;}
.bar a.back:hover{color:var(--accent);}
.dl{display:inline-flex;align-items:center;gap:.5rem;background:var(--accent);color:#fff;text-decoration:none;font-weight:600;font-size:.9rem;padding:.55rem 1rem;border-radius:7px;}
.dl:hover{filter:brightness(1.08);}
.page{max-width:50rem;margin:2rem auto;background:var(--bg);padding:3.2rem 3.5rem;box-shadow:0 4px 30px rgba(0,0,0,.08);}
header.cv{border-bottom:2px solid var(--fg);padding-bottom:1.4rem;margin-bottom:1.6rem;}
.name{font-size:2.6rem;font-weight:700;letter-spacing:-.02em;line-height:1;}
.role{margin-top:.5rem;font-size:1.05rem;font-weight:500;color:var(--accent);}
.meta{margin-top:.6rem;font-size:.85rem;color:var(--muted);display:flex;flex-wrap:wrap;gap:.3rem 1rem;}
.meta a{color:var(--muted);text-decoration:none;}
.summary{font-size:.98rem;margin-bottom:1.8rem;color:#333;}
h2{font-size:.8rem;text-transform:uppercase;letter-spacing:.12em;color:var(--accent);margin:1.7rem 0 .9rem;font-weight:700;}
.job{margin-bottom:1.15rem;page-break-inside:avoid;}
.job-head{display:flex;justify-content:space-between;align-items:baseline;gap:1rem;}
.job-title{font-weight:600;font-size:1rem;}
.job-co{color:var(--accent);}
.job-date{color:var(--muted);font-size:.82rem;white-space:nowrap;}
.job-loc{color:var(--muted);font-size:.82rem;}
ul{list-style:none;margin:.4rem 0 0;}
li{position:relative;padding-left:1.1rem;font-size:.92rem;margin:.28rem 0;color:#333;}
li::before{content:"";position:absolute;left:0;top:.62em;width:5px;height:5px;border-radius:50%;background:var(--accent);}
.sub{margin-left:1.1rem;border-left:2px solid var(--border);padding-left:1.1rem;}
.two{display:grid;grid-template-columns:1fr 1fr;gap:.3rem 2rem;}
.chips{display:flex;flex-wrap:wrap;gap:.4rem;}
.chip{font-size:.82rem;background:#f0f2f0;color:#333;border-radius:5px;padding:.2rem .6rem;}
.kv{font-size:.9rem;margin:.2rem 0;}
.kv b{font-weight:600;}
@media print{
  body{background:#fff;}
  .bar{display:none;}
  .page{margin:0;max-width:none;box-shadow:none;padding:0;}
  @page{size:A4;margin:14mm 15mm;}
}
</style>
</head>
<body>
<div class="bar">
  <a class="back" href="/">&larr; ${esc(SITE_TITLE)}</a>
  <a class="dl" href="/cv.pdf" download>Download PDF</a>
</div>
<div class="page">
  <header class="cv">
    <div class="name">Chris Wu</div>
    <div class="role">Software Engineer · DevOps · Platform</div>
    <div class="meta">
      <span>Hong Kong SAR</span>
      <a href="mailto:wujiayi.chris@gmail.com">wujiayi.chris@gmail.com</a>
      <a href="https://www.linkedin.com/in/wu101" rel="me noopener">linkedin.com/in/wu101</a>
    </div>
  </header>

  <p class="summary">Platform &amp; DevOps engineer with 15 years across global enterprises, scaling product companies, and fast-moving startups. I build the things that make everyone else fast — golden paths, self-service tooling, guardrails, and security baked in by default. I keep production healthy on Kubernetes across AWS and GCP, and I&rsquo;m a little obsessed with observability: seeing the whole system at once and catching strain before it becomes an incident. The best work I do is the kind nobody notices — the team just ships better because the platform underneath works.</p>

  <h2>Experience</h2>

  <div class="job">
    <div class="job-head"><span class="job-title"><span class="job-co">Chaos Theory</span> — Senior Platform Engineer</span><span class="job-date">Apr 2024 – Present</span></div>
    <div class="job-loc">Hong Kong SAR</div>
    <ul>
      <li>Define guidelines and guardrails that embed engineering best practices and security by default across teams.</li>
      <li>Design and build internal tools that reduce friction and standardize workflows.</li>
      <li>Operate production workloads on GCP and Kubernetes for reliability, scalability, and secure configuration.</li>
      <li>Set up monitoring and alerting for security events and resource stress — earlier detection, faster response.</li>
      <li>Cut cloud costs by optimizing network architecture, right-sizing workloads, and removing redundant resources.</li>
    </ul>
  </div>

  <div class="job">
    <div class="job-head"><span class="job-title"><span class="job-co">ExpressVPN</span></span><span class="job-date">Nov 2016 – Apr 2024</span></div>
    <div class="job-loc">Hong Kong SAR · 7 yrs 6 mos</div>
    <div class="sub">
      <div class="job" style="margin-top:.7rem;">
        <div class="job-head"><span class="job-title">Senior Software Engineer, Platform &amp; DevOps</span><span class="job-date">Nov 2022 – Apr 2024</span></div>
        <ul><li>Built golden paths and self-service platform tooling that reduced setup friction and standardized delivery across engineering teams.</li></ul>
      </div>
      <div class="job">
        <div class="job-head"><span class="job-title">Senior Software Engineer, Client Apps</span><span class="job-date">Jan 2019 – Oct 2022</span></div>
        <ul>
          <li>Architected secure, high-efficiency release automation (&ldquo;release trains&rdquo;) shipping apps to 4M+ users multiple times a week.</li>
          <li>Streamlined releases across Android, iOS, Windows, macOS, and Linux.</li>
        </ul>
      </div>
      <div class="job">
        <div class="job-head"><span class="job-title">Lead Quality Assurance Developer</span><span class="job-date">Nov 2016 – Jan 2019</span></div>
        <ul><li>Led a global team of 10+ QA engineers building automated tests across 5 platforms, cutting manual testing time by 90%.</li></ul>
      </div>
    </div>
  </div>

  <div class="job">
    <div class="job-head"><span class="job-title"><span class="job-co">LKK Health Products Group</span> — Senior QA Engineer</span><span class="job-date">Dec 2015 – Nov 2016</span></div>
    <div class="job-loc">Hong Kong</div>
    <ul>
      <li>Enabled developers to write tests by building tools, frameworks, and CI pipelines.</li>
      <li>Championed testing and code-review best practices across teams.</li>
    </ul>
  </div>

  <div class="job">
    <div class="job-head"><span class="job-title"><span class="job-co">Powa Technologies</span> — Software Engineer in Test</span><span class="job-date">Apr 2014 – Dec 2015</span></div>
    <div class="job-loc">Hong Kong</div>
    <ul><li>Built Appium automated tests and internal tooling for omnichannel commerce across laptop, tablet, and mobile.</li></ul>
  </div>

  <div class="job">
    <div class="job-head"><span class="job-title"><span class="job-co">BlackBerry</span> — Automation Test Developer</span><span class="job-date">May 2012 – Dec 2013</span></div>
    <div class="job-loc">Hong Kong</div>
    <ul><li>Developed automated tests for BlackBerry 10 OS devices.</li></ul>
  </div>

  <div class="job">
    <div class="job-head"><span class="job-title"><span class="job-co">Clear2Pay</span> — Software Engineer</span><span class="job-date">Jul 2011 – Mar 2012</span></div>
    <div class="job-loc">Shenzhen, China</div>
    <ul><li>Built and maintained payment hub solutions for BNP Paribas.</li></ul>
  </div>

  <div class="job">
    <div class="job-head"><span class="job-title"><span class="job-co">U-Freight ICIL</span> — Software Engineer</span><span class="job-date">Mar 2010 – Jun 2011</span></div>
    <div class="job-loc">Shenzhen, China</div>
    <ul><li>Developed software for freight and logistics operations.</li></ul>
  </div>

  <h2>Skills</h2>
  <div class="chips">
    <span class="chip">Platform Engineering</span><span class="chip">DevOps</span><span class="chip">Kubernetes (AWS &amp; GCP)</span><span class="chip">Observability</span><span class="chip">CI/CD &amp; Release Automation</span><span class="chip">Golden Paths</span><span class="chip">Self-Service Tooling</span><span class="chip">Security by Default</span><span class="chip">Microservices</span><span class="chip">Cloudflare</span><span class="chip">Infrastructure as Code</span><span class="chip">Cost Optimization</span>
  </div>

  <div class="two" style="margin-top:1.4rem;">
    <div>
      <h2 style="margin-top:0;">Certifications</h2>
      <div class="kv">KCSA — Kubernetes &amp; Cloud Native Security Associate</div>
      <div class="kv">KCNA — Kubernetes &amp; Cloud Native Associate</div>
      <div class="kv">CKAD — Certified Kubernetes Application Developer</div>
      <div class="kv">AWS Certified</div>
    </div>
    <div>
      <h2 style="margin-top:0;">Languages</h2>
      <div class="kv">English — Full Professional</div>
      <div class="kv">Cantonese — Native</div>
      <div class="kv">Mandarin — Native</div>
      <div class="kv">Hokkien / Taiwanese — Native</div>
      <h2>Education</h2>
      <div class="kv"><b>University of Southampton</b><br>MSc, Web Technology</div>
    </div>
  </div>
</div>
</body>
</html>
`;
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

// /cv = standalone CV page
write('cv/index.html', renderCvPage());

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
