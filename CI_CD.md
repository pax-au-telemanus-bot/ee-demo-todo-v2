# CI/CD Pipeline

## Overview
Recommended CI/CD configuration for this Next.js application.

## GitHub Actions Pipeline

### `.github/workflows/ci.yml`
```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm test -- --coverage
      - run: npm run build

  deploy:
    needs: quality
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      # Deploy to Vercel, AWS, or other platform
```

## Quality Gates
Every PR must pass:
1. **Build** — `npm run build` succeeds
2. **Lint** — `npm run lint` clean
3. **Tests** — `npm test` all passing
4. **Coverage** — ≥85% (enforced via Jest config)

## Deployment Options

| Platform | Command | Notes |
|----------|---------|-------|
| Vercel | `vercel deploy` | Native Next.js support, recommended |
| Docker | `docker build -t todo-app .` | Self-hosted |
| AWS Amplify | Push to connected repo | Auto-deploy |

## Branch Strategy
- `main` — production-ready code
- `feat/*` — feature branches (merge via PR)
- `fix/*` — bug fix branches
- Tags: `phase-1`, `phase-2`, `phase-3` for milestones

## Environment Variables
No environment variables required for this demo. For production:
- `DATABASE_PATH` — SQLite database file location
- `NODE_ENV` — production/development
