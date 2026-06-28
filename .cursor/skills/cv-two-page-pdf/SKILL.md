---
name: cv-two-page-pdf
description: >-
  Enforces the wu101.com CV two-page PDF limit. Use when editing CV content,
  summary, experience bullets, certifications, or print styles in build.mjs,
  or when the user mentions CV length, page count, or cv.pdf.
---

# CV Two-Page PDF

The CV **must fit on exactly 2 A4 pages** when exported as `dist/cv.pdf`.

## Source of truth

| File | Role |
|------|------|
| `build.mjs` → `renderCvPage()` | CV HTML + inline CSS (including `@media print`) |
| `gen-cv-pdf.mjs` | Renders PDF via headless Chrome; **fails build if > 2 pages** |

## After every CV change

1. Run `npm run build`
2. Confirm output includes `Generated cv.pdf (... 2 pages)`
3. If build fails with `CV exceeds 2 pages`, fix before committing

## How to fit content

Prefer **print CSS** over deleting experience:

1. Tighten `@media print` in `renderCvPage()` — margins, font sizes, line-height, section spacing
2. Shorten summary paragraphs or merge bullets on older roles
3. Reduce bullets on early-career jobs (keep recent roles detailed)

Do **not** remove `@page { size: A4 }` or change paper size to cheat the limit.

## Print styles already in use

The screen layout can breathe; print layout is denser:

- `@page` margin: `10mm 12mm`
- Body: `9pt`, line-height `1.35`
- Summary, jobs, list items: smaller fonts and tighter vertical spacing

When adding content, adjust print styles proportionally.

## Validation

`gen-cv-pdf.mjs` sets `MAX_PAGES = 2` and counts pages after generation (`pdfinfo` when available, PDF `/Count` fallback). CI runs `npm run build` with Chrome — a 3-page CV breaks deploy.

## Checklist

- [ ] `npm run build` succeeds
- [ ] PDF reports **2 pages** (not 1 with huge whitespace, not 3+)
- [ ] Summary and recent roles still readable at print size
- [ ] Web CV at `/cv/` still looks good on screen (print styles only apply to PDF)
