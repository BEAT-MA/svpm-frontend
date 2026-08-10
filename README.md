# SVPM School Website — Frontend

A React + Vite frontend for the SVPM school website, matching the Figma designs
for Home, About Us, Academics, Admissions, Departments, News & Events, and
Student Life. Blue/grey branding.

## Getting started

```bash
npm install
npm run dev      # start Vite dev server (default http://localhost:5173)
npm run build    # production build -> dist/
npm run preview  # preview the production build
```

The Vite dev server proxies `/api` to the backend at `http://localhost:5000`,
so no CORS issues during development. Start the backend first (`npm run dev` in
the backend project) for live data.

> The site ships with the official SVPM content embedded in
> `src/data/content.js`. Every page displays this content as a fallback, so the
> site is fully populated even when the backend/database is empty. When the
> backend is seeded, its live data takes precedence.

## Quality tooling

```bash
npm run lint          # ESLint (flat config: eslint.config.js)
npm run lint:fix      # auto-fix lint issues
npm run format        # Prettier --write
npm run format:check  # Prettier --check
npm run test          # Vitest unit/component tests (run once)
npm run test:watch    # Vitest watch mode
npm run test:coverage # Vitest + v8 coverage report
```

- **Lint & format** run automatically before every commit via Husky +
  `lint-staged` (`.husky/pre-commit`).
- **Tests** live in `src/test/` and cover the API client, helpers, UI
  primitives, ErrorBoundary, Navbar and 404 page.
- **CI**: `.github/workflows/ci.yml` runs lint, format check, tests and the
  production build on every push/PR.

## Architecture notes

- **Code splitting**: route pages are loaded with `React.lazy` + `Suspense`, so
  each page ships as its own chunk.
- **Data fetching**: `useFetch` (`src/lib/hooks.js`) adds in-memory caching
  (60s TTL), request deduplication, automatic retries, abort-on-unmount and a
  `refetch` trigger. Extend per call with `{ cacheTime, retries, key }`.
- **SEO**: `useSEO` (`src/lib/seo.js`) sets per-page `<title>`, meta
  description, Open Graph / Twitter tags, canonical URL and optional JSON-LD on
  every route. Static assets live in `public/`: `sitemap.xml`, `robots.txt`,
  `site.webmanifest`, `_redirects`.
- **Error handling**: a root `ErrorBoundary` catches render crashes; loading
  skeletons and inline error states with retry are used across pages.
- **Accessibility**: skip link, `aria-expanded`/`aria-controls` on the mobile
  menu, ESC-to-close, `aria-live` testimonials, labelled form fields with
  inline validation errors (`aria-invalid`/`aria-describedby`).
- **Forms**: the Admissions tour + application forms validate client-side
  (required, email, phone, dates, file-size ≤ 5 MB) with accessible errors.

## Pages

- `/` — Home (hero, stats, featured news, events, testimonials, gallery)
- `/about` — About Us (mission/vision/history, leadership)
- `/academics` — Programs + Departments
- `/admissions` — Tuition table, tour booking form, application form, FAQs
- `/departments` — Departments and featured faculty
- `/news-events` — Paginated news, upcoming events, academic calendar
- `/news-events/:id` — News article detail (with `NewsArticle` JSON-LD)
- `/student-life` — Clubs/sports/arts sections and photo galleries
- `/contact` — Contact form (validated, posts to `/api/contact`) + details + map
- `*` — 404 fallback page

## Deployment

The app is a single-page app, so the host must rewrite unknown routes to
`index.html`:

- **Netlify / Cloudflare Pages**: `public/_redirects` is included
  (`/* /index.html 200`).
- **Nginx**: add a fallback location, e.g.

  ```nginx
  location / {
    try_files $uri $uri/ /index.html;
  }
  ```

## Environment

Copy `.env.example` to `.env` to override the API base URL if needed:

```
VITE_API_URL=http://localhost:5000
```

Use the `VITE_` prefix for Vite (or `NEXT_PUBLIC_` for Next.js).
