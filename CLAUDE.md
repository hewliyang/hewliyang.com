# CLAUDE.md

## Development Commands

Use pnpm as the package manager for this project:

- **Development server**: `pnpm dev` - Starts the SvelteKit development server with hot reload
- **Build**: `pnpm build` - Creates production build using Vite
- **Preview**: `pnpm preview` - Preview the production build locally
- **Type checking**: `pnpm check` - Run svelte-check with TypeScript validation
- **Watch mode type checking**: `pnpm check:watch` - Run type checking in watch mode
- **Linting**: `pnpm lint` - Run Prettier and ESLint checks
- **Formatting**: `pnpm format` - Auto-format code with Prettier

## Architecture Overview

This is a personal blog and portfolio site built with SvelteKit, featuring:

### Core Technologies

- **SvelteKit** - Full-stack Svelte framework with static site generation
- **TypeScript** - Type safety throughout the codebase
- **TailwindCSS** - Utility-first CSS framework with custom design system
- **mdsvex** - Markdown preprocessing for Svelte with enhanced features

### Content Architecture

- **Blog posts** are stored as Markdown files in `src/content/`
- **mdsvex** processes Markdown with:
  - Syntax highlighting using Shiki (vitesse-dark theme)
  - Math rendering with KaTeX via rehype-katex-svelte
  - Auto-generated heading links via rehype-slug and rehype-autolink-headings
  - Custom Svelte layout in `src/mdsvex.svelte`

### Component Structure

- **UI Components**: Located in `src/lib/components/ui/` - shadcn-ui style components
- **Custom Components**: Located in `src/lib/components/custom/` - Custom Markdown renderers
- **Site Components**: Header, ProjectCard, WorkCard, Theme switcher in `src/lib/components/`

### Configuration & Data

- **Site configuration**: `src/lib/config.ts` contains skills, work experience, education, and projects
- **Theme system**: Uses mode-watcher for dark/light mode with CSS custom properties
- **Typography**: Uses Inter Variable and JetBrains Mono Variable fonts

### Key Features

- Static site generation with prerendering enabled
- Responsive design with custom Tailwind configuration
- Math equation support in blog posts
- Syntax highlighting for code blocks
- SEO-friendly with proper meta tags

### Route Structure

- `/` - Homepage with intro and project showcase
- `/blog/[slug]` - Dynamic blog post pages from Markdown content
- `/resume` - Resume/CV page with work experience and skills
- `/api/posts` - API endpoint for blog post metadata

### Development Notes

- Uses Vite for fast builds and HMR
- ESLint and Prettier configured with Svelte-specific rules
- All routes are prerendered for static deployment
- Blog content supports LaTeX math notation and advanced Markdown features
