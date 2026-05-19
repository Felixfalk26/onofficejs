# Security

## Credentials

- **Never** embed `token` or `secret` in frontend/browser code.
- Use environment variables or a secrets manager on the server:

```bash
ONOFFICE_TOKEN=your-token
ONOFFICE_SECRET=your-secret
```

```typescript
const client = new OnOfficeClient(); // reads env automatically in Node.js
```

## Browser usage

This SDK can run in browsers with a custom `fetch`, but **API secrets must not ship to clients**. Use a backend proxy:

```
Browser → Your API route → onofficejs → onOffice API
```

## Debug mode

`debug: true` logs redacted tokens (first/last 4 chars only) and action counts — never full secrets.

## Dependency supply chain

- Zero runtime npm dependencies reduces attack surface.
- CI runs `npm audit` on every push.
- Use pinned versions in production (`package-lock.json`).

## Reporting vulnerabilities

See [SECURITY.md](../SECURITY.md) in the repo root.

## TLS

Always use the default `https://api.onoffice.de/api/` endpoint in production. Only disable TLS verification in local integration tests.
