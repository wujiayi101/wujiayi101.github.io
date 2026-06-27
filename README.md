# wu101.com

Personal site / blog. Minimal static generator — no framework. ~140 lines of
Node ([`build.mjs`](./build.mjs)) turn Markdown into static HTML.

**Live:** [wu101.com](https://wu101.com) (Cloudflare Pages — also at [wu101.pages.dev](https://wu101.pages.dev))

- **Content**: Markdown with frontmatter in [`content/blog/`](./content/blog/)
- **Assets**: static files in [`public/`](./public/) (copied verbatim to `dist/`)
- **Styling**: a single stylesheet, [`public/styles.css`](./public/styles.css)
- **Output**: static `dist/` — minimal landing `/`, blog index `/blog/`, per-post `/blog/<slug>/`, plus `rss.xml`
- **Deps**: just [`marked`](https://github.com/markedjs/marked) (Markdown) and
  [`gray-matter`](https://github.com/jonschlinkert/gray-matter) (frontmatter)

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command           | Action                                              |
| :---------------- | :-------------------------------------------------- |
| `npm install`     | Install dependencies                                |
| `npm run build`   | Build the site to `./dist/`                         |
| `npm run preview` | Serve `./dist/` locally at `localhost:4321`         |
| `npm run dev`     | Build, then serve locally at `localhost:4321`       |

## Adding a post

Drop a Markdown file in [`content/blog/`](./content/blog/) with frontmatter:

```markdown
---
title: "My post title"
description: "Optional short summary"
pubDate: "Jun 27, 2026"
tags: ["tag1", "tag2"]
---

Post body in Markdown…
```

The filename (minus `.md`) becomes the URL slug: `/blog/<filename>/`.

## Deployment

Pushing to `main` triggers [`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml),
which builds and deploys to **Cloudflare Pages** (project `wu101`).

- **Production domain:** [wu101.com](https://wu101.com) (custom domain, set in the Cloudflare Pages project)
- **Default URL:** [wu101.pages.dev](https://wu101.pages.dev)

Requires two GitHub repository secrets:

- `CLOUDFLARE_API_TOKEN` — token with the *Cloudflare Pages: Edit* permission
- `CLOUDFLARE_ACCOUNT_ID` — your Cloudflare account ID

## Developing in a Devcontainer

[`Devcontainer`](https://code.visualstudio.com/docs/devcontainers/containers) spins up a development environment in a container so you don't have to install dependencies on your host machine:

1. Ensure Docker is installed and running
2. Install [vscode](https://code.visualstudio.com/) and the `Dev Containers` extension
3. Open this project in vscode
4. Launch `Command Palette` (`⌘ + Shift + P` on Mac)
5. Select `Reopen in Container` or `Rebuild Container`
6. Once it starts, open the vscode terminal and use the commands above
