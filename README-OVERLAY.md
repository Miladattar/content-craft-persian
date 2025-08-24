
# Overlay for `content-craft-persian` (Vite + React)
Adds:
- Serverless API (`/api`) for OpenAI Responses API (no `response_format`).
- Admin panel: `/public/admin.html` + `src/pages/admin.tsx`
- Brief wizard: `/public/brief.html` + `src/pages/brief.tsx`
- Prompt store: `data/*.json`
Install:
1) Copy all files into repo root (merge).
2) `npm i openai zod`
3) `.env`:
   OPENAI_API_KEY=sk-...
   ADMIN_PASSWORD=your_password
4) Dev: `npm run dev` → open `/admin.html` and `/brief.html`
5) Vercel: set env vars → Deploy.
