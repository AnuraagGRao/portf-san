# Portfolio Website

[![Deploy](https://github.com/AnuraagGRao/portf-san/actions/workflows/pages.yml/badge.svg?branch=master)](https://github.com/AnuraagGRao/portf-san/actions/workflows/pages.yml)

Simple, fast, and maintainable personal site for Anuraag Gopinath Rao.

## Structure

- `index.html`: Main page
- `assets/css/styles.css`: Site styles
- `assets/js/main.js`: Interactivity (theme toggle, typewriter)
- `assets/favicon.svg`: Favicon
- `404.html`: GitHub Pages 404 fallback
- `site.webmanifest`: PWA basics
- `robots.txt`: Crawler directives

## Quick Start

Open `index.html` directly in a browser, or run a simple static server:

```bash
# Using npx (no install)
npx serve@latest -l 5173 .
# or
npx http-server -p 5173 -c-1 .
```

Then visit:

```
http://localhost:5173/
```

## Customization

- Update meta tags in `index.html` (description, canonical, JSON-LD).
- Replace `EMAIL` in `assets/js/main.js`.
- Add your resume file and update the Resume link.
- Add more projects/experience sections as needed.

## Theme

- Theme preference persists in `localStorage`.
- Shortcut: press `t` to toggle theme.

## Deploy (GitHub Pages via Actions)

This repo ships with a ready-to-use GitHub Actions workflow: `.github/workflows/pages.yml`.

- Live URL (after first deploy): https://anuraaggrao.github.io/portf-san/
- Workflow runs on push to `main` or `master`, and supports manual triggers.

Steps:
1. Push the repo to GitHub (if not already):
	```bash
	git add .
	git commit -m "ci: deploy static site to GitHub Pages"
	git push
	```
2. In GitHub → Settings → Pages → Build and deployment → Source, select "GitHub Actions".
3. The workflow will upload the static site as a Pages artifact and deploy it.

Troubleshooting:
- Check runs here: https://github.com/AnuraagGRao/portf-san/actions/workflows/pages.yml
- Project Pages serve under a subpath (`/portf-san/`); all asset links are relative in this repo and work out-of-the-box.

## Formatting

This repo includes `.editorconfig` and `.prettierrc.json`.

Format on demand with Prettier (optional):

```bash
npx prettier . --write
```

## License

Proprietary — all rights reserved. Update this section if you choose a license.
