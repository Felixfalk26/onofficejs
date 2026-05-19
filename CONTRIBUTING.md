# Contributing

Thanks for helping improve onofficejs!

## Development setup

```bash
git clone https://github.com/onofficejs/onofficejs.git
cd onofficejs
npm install
npm test
npm run build
```

## Scripts

| Command | Description |
|---|---|
| `npm test` | Run unit + integration tests |
| `npm run test:coverage` | Tests with coverage thresholds |
| `npm run typecheck` | TypeScript strict check |
| `npm run lint` | ESLint |
| `npm run build` | Build ESM + CJS to `dist/` |

## Pull requests

1. Fork and create a feature branch
2. Add tests for behavior changes
3. Ensure `npm run typecheck && npm run lint && npm test && npm run build` pass
4. Update docs if public API changes
5. Open a PR with a clear description

## Code standards

- TypeScript strict mode
- No runtime dependencies unless discussed first
- Match existing naming and file structure
- HMAC / wire-format changes require integration test updates

## Commit messages

Use clear, imperative messages: `Add estate modify helper`, `Fix batch cache lookup`.
