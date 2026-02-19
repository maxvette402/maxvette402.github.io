# maxvette402.github.io

Personal site hosted on GitHub Pages, built with React + TypeScript + Vite.

## Publishing

Push to `main` to deploy:

```bash
git push origin main
```

This triggers the GitHub Actions workflow in [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml), which:

1. Installs dependencies with `npm ci`
2. Runs `npm run build` → TypeScript type-check + Vite build → outputs `/dist`
3. Uploads `/dist` as a GitHub Pages artifact
4. Deploys it to **https://maxvette402.github.io**

The `/dist` folder is never committed — it's built and served entirely on GitHub's infrastructure.

To enable this, GitHub Pages must be set to **Source: GitHub Actions** in the repo settings:
`Settings → Pages → Source → GitHub Actions`

## GitHub Actions

Monitor runs and logs: **https://github.com/maxvette402/maxvette402.github.io/actions**

### Workflows

#### `Build and Deploy` — [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)

Triggered on every push to `main`. Runs two sequential jobs:

| Job | Runner | What it does |
|---|---|---|
| `build` | `ubuntu-latest` | Checkout → `npm ci` → `npm run build` → upload `/dist` as Pages artifact |
| `deploy` | `ubuntu-latest` | Receives the artifact from `build` and publishes it to GitHub Pages |

Permissions required:
- `pages: write` — to publish to GitHub Pages
- `id-token: write` — for OIDC authentication with the Pages deployment API
- `contents: read` — to checkout the repository

## HTTP Headers

Cache-Control is set to `public, max-age=60` in the Vite dev server ([`vite.config.ts`](vite.config.ts)):

```ts
server: {
  headers: {
    'Cache-Control': 'public, max-age=60',
  },
}
```

This keeps assets fresh during development (60 second cache) while still allowing caching. In production, GitHub Pages controls caching — assets hashed by Vite (e.g. `main-abc123.js`) are cached long-term by the browser since their URLs change on every build.

## Development

```bash
npm run dev       # Start dev server with HMR at localhost:5173
npm run build     # Type-check + production build
npm run preview   # Preview the production build locally
npm run lint      # Run ESLint
npm test          # Run tests with Vitest (watch mode)
npm run test:run  # Run tests once
```

## Tech Stack

| Tool | Version | Notes |
|---|---|---|
| React | 19.2 | With React Compiler for automatic memoization |
| TypeScript | 5.9 | Strict mode, `erasableSyntaxOnly` for compiler compat |
| Vite | 8.0 beta | Build tool and dev server with HMR |
| Vitest | 4.0 | Unit testing with jsdom environment |
| ESLint | 9 | Flat config format with TypeScript + React Hooks plugins |

## Multi-page Setup

Vite is configured to automatically discover all `.html` files in the project root as entry points (see [`vite.config.ts`](vite.config.ts)). Adding a new page is as simple as creating a new `.html` file — it gets built and deployed automatically.
