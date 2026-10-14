# SITAS Official Website

Pixel-faithful React clone of the SITAS / Verisci marketing site, rebuilt as a multi-page Vite + React + TypeScript app with React Router.

Live reference: https://sitas-verisci.teresaling0310.chatgpt.site/

## Stack

- Vite + React 19 + TypeScript
- React Router
- Tailwind CSS v4 (`@tailwindcss/vite`) plus ported original site CSS

## Routes

| Path | Page |
|------|------|
| `/` | Hero |
| `/introduce` | Introduce |
| `/product` | Product |
| `/cases` | Case Studies |
| `/partnership` | Partnership |
| `/development` | Development Plan |
| `/about` | About (company + team + promise) |

## Requirements

- Node.js **20+** (project includes `.nvmrc`; `nvm use`)

## Install / Dev / Build

```bash
cd sitas-official-website
npm install
npm run dev      # http://localhost:5173
npm run build    # output in dist/
npm run preview  # preview production build
```

## Features

- Shared header with nav, Features dropdown, Language (EN/中文), Light/Dark mode
- Theme and language persist in `localStorage`
- Exact English copy from the live site; Chinese UI strings included
- Decorative elements: pixel-field, tech-raster, device-model, comparison scan-line, orb, timeline
- `mailto:partnerships@sitas.bio` on Partnership CTA
- Assets in `public/`: logo, favicon, og image, hero dark/light art

## Notes

- Original was a single-page hash-slide site; this version uses real routes.
- `/about` stacks company, team, and promise sections with snap scrolling.

## Copy to Mac

This project lives on the agent box at `/workspace/sitas-official-website/`.
Do not copy automatically — ask the parent agent / user to pull it to the Mac folder when ready, for example:

```bash
# from the Mac (paths illustrative)
cp -R /path/to/box/workspace/sitas-official-website ~/Desktop/sitas-official-website
```

Or use the agent `CopyFromBox` flow once the destination folder is confirmed.

## GitHub Pages

After push to `main`, Actions deploys to:
https://jjzhang0.github.io/SITAS_OFFICIAL_WENSITE/

Requires Node 20+ locally (`nvm use`).
