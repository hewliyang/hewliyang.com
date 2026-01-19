## Commands

```bash
bun dev          # Start development server
bun build        # Build for production (prerenders the site)
bun preview      # Preview production build
bun check        # Type-check with svelte-check
bun lint         # Check formatting (Prettier) and lint (ESLint)
bun format       # Auto-format with Prettier
```

## Environment Setup

Requires `GITHUB_PAT` (GitHub Personal Access Token) in `.env` - see `.env.example`.

## Architecture

This is a personal portfolio site built with SvelteKit 2, Svelte 5, and Tailwind CSS 4.

**Key patterns:**

- Uses Svelte 5 runes syntax (`$props()`, `$state()`, etc.)
- Pages are prerendered at build time (`export const prerender = true`)
- mdsvex is configured for `.svx` files (Markdown in Svelte)
- Tailwind is integrated via Vite plugin, not PostCSS config

**Data flow:**

- `src/routes/+page.server.ts` fetches GitHub PRs/issues at build time using the GitHub Search API
- `src/lib/github.ts` handles API calls with file-based caching (12h TTL, dev-only)
- Data is passed to `GithubActivity.svelte` component via props

**Styling:**

- Global styles in `src/routes/layout.css` (Tailwind + custom fonts)
- Geist Sans for body, Space Grotesk for headings
- Dark mode via `prefers-color-scheme` media query

## Code Style

- Tabs for indentation
- Single quotes, no trailing commas
- 100 char print width

## Developing

- Do not run the dev server; the user will handle it themselves
- When in doubt about new Svelte syntax or conventions, search through the documentation in ../sveltekit-repo and ../svelte-repo.
