# Portfolio Website

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

## Deploy (GitHub Pages)

1. Initialize git and push to GitHub.
2. In the repo settings, enable GitHub Pages with the `main` branch and `/root`.
3. Add a custom domain (optional) and create a `CNAME` file if using one.
4. Commit `404.html` so deep links resolve.

## Formatting

This repo includes `.editorconfig` and `.prettierrc.json`.

Format on demand with Prettier (optional):

```bash
npx prettier . --write
```

## License

Proprietary — all rights reserved. Update this section if you choose a license.
