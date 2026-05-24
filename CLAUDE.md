# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev          # Vite dev server (localhost:5173)
pnpm build        # tsc type-check → vite build → tsx scripts/prerender.ts
pnpm preview      # Serve dist/ locally after build
pnpm lint         # biome check src/
pnpm lint:fix     # biome check --write src/
```

`pnpm build` is three sequential steps — all must pass. Running `vite build` alone skips SSG (no per-route HTML files).

## Architecture

### Build-time data pipeline (key design)

All external data is fetched/processed at **Vite build time**, not at runtime. Two custom Vite plugins in `vite.config.ts` expose this data as virtual modules:

| Virtual module     | Plugin                 | Source                                                                                             |
| ------------------ | ---------------------- | -------------------------------------------------------------------------------------------------- |
| `virtual:posts`    | `virtualPostsPlugin`   | `content/posts/*.md` — parsed with gray-matter, rendered to HTML with unified+shiki                |
| `virtual:releases` | `githubReleasesPlugin` | GitHub API (`/repos/99mini/99mini.github.io/pulls`) — filtered by label or `release:` title prefix |

**Why this matters:** `gray-matter` and Node.js `fs` cannot run in the browser. Any attempt to import these in `src/` will break at runtime. All markdown/file processing must stay in `vite.config.ts` or `scripts/`.

### File Naming Conventions

- kebab-case for files and directories (`src/routes/blog-post/index.tsx`, not `src/routes/BlogPost/index.tsx`)

### SSG flow

```
vite build → dist/ (SPA shell)
     ↓
tsx scripts/prerender.ts
  - copies dist/index.html to dist/{route}/index.html for every known route
  - injects route-specific <title> and og/twitter meta tags into each HTML file
  - writes dist/404.html (GitHub Pages serves this for unknown paths)
  - writes dist/.nojekyll
```

Adding a new static route requires updating the `routes` array in `scripts/prerender.ts`. New post slugs are picked up automatically from `content/posts/`.

### Routing

TanStack Router with file-based routing (`src/routes/`). `@tanstack/router-vite-plugin` auto-generates `src/routeTree.gen.ts` — never edit this file manually.

Route file conventions:

- `__root.tsx` — root layout (Header, Footer, notFoundComponent)
- `index.tsx` — index route for a segment
- `$slug.tsx` — dynamic param (accessed via `Route.useLoaderData()`)

### Theming

Dark/light mode uses CSS custom properties on `:root` vs `:root.dark`. The `dark` class is applied to `<html>` before React hydrates via an inline script in `index.html` (prevents FOUC). `useTheme` hook (`src/hooks/use-theme.ts`) reads from the DOM and persists to `localStorage`.

TailwindCSS v4 is configured CSS-first in `src/styles/global.css` — no `tailwind.config.ts`. Dark variant is set via `@custom-variant dark (&:where(.dark *))`.

### SEO

Two-layer approach:

1. `<seo>` component (`src/scripts/seo.tsx`) — updates `document.title` and meta tags client-side on each navigation
2. `scripts/prerender.ts` — injects static meta tags into each HTML file at build time for crawlers

### Types & validation

Zod schemas in `src/types/index.ts` are the single source of truth for `Post` and `GithubPR`. The same schemas are imported by `vite.config.ts` (Node.js build context) and `src/` (browser context).

## Adding content

**New blog post:** create `content/posts/{slug}.md` with frontmatter:

```yaml
---
title: "..."
date: "YYYY-MM-DD"
summary: "..."
tags: ["tag1"]
draft: false
---
```

The post is picked up automatically by `virtual:posts` at next `pnpm dev` or `pnpm build`. No route file needed.

**New static page:** add a file under `src/routes/`, then add the route path to the `routes` array in `scripts/prerender.ts`.
