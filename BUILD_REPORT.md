# Build report

- **Project path:** `/workspace/sitas-official-website/`
- **Build:** `npm install && npm run build` succeeds
- **Routes:** `/`, `/introduce`, `/product`, `/cases`, `/partnership`, `/development`, `/about`
- **Run:** `npm run dev` → http://localhost:5173
- **Not copied to Mac** (as requested)

## Gaps vs live site
- Multi-page React Router instead of single-page hash slides (intentional)
- About page stacks company/team/promise with internal snap scroll
- Chinese translations included (full), not stub-only
- Entrance animations always visible on route load (no IntersectionObserver per slide)
- Canela webfont not bundled (falls back to Cochin/Baskerville/Georgia like original CSS)
