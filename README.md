# MoviesPlus+ (Vite + React)

## Local setup

1. Copy `.env.example` to `.env`
2. Add your TMDB credential
3. Run:

```bash
npm install
npm run dev
```

## Deploying securely (GitHub Pages ready)

Important: **Any `VITE_*` value is public in the browser bundle.**  
For production, do not expose private secrets directly in frontend env vars.

Recommended approach:

- Create a small backend/serverless proxy (Cloudflare Worker, Vercel Function, Netlify Function, etc.)
- Store TMDB secret on that server only
- Expose only a safe proxy URL to frontend:

```env
VITE_TMDB_PROXY_URL=https://your-proxy.example.com/tmdb
```

The app now supports this mode automatically in `src/lib/tmdb.js`.

## Notes

- Pagination is intentionally expanded to 1000 UI pages; backend requests are safely mapped to available TMDB pages.
- Theme, mood filters, and watchlist are persisted in localStorage for better UX.

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
