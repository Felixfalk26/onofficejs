# onofficejs

[![CI](https://github.com/Felixfalk26/onofficejs/actions/workflows/ci.yml/badge.svg)](https://github.com/Felixfalk26/onofficejs/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/onofficejs.svg)](https://www.npmjs.com/package/onofficejs)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

**Production-ready TypeScript/JavaScript client for the [onOffice API](https://apidoc.onoffice.de/).**

Built as a modern rewrite of the official PHP SDK — async-first, fully typed, batch-capable, and designed for Node.js 18+, Bun, Deno, and edge runtimes.

---

## Features

- **Async/await** — no manual `sendRequests()` unless you want batch control
- **TypeScript-first** — strict types, declaration maps, IDE autocomplete
- **Batch requests** — multiple API actions in one HTTP round-trip
- **HMAC v2 signing** — verified against official PHP SDK test vectors
- **Pluggable cache** — built-in LRU memory cache with TTL
- **Resource helpers** — `client.estates.read()`, `client.addresses.read()`, etc.
- **Query builders** — fluent filter/sort/pagination helpers
- **Structured errors** — transport vs API vs invalid response
- **Retries & timeouts** — resilient HTTP transport
- **Zero runtime dependencies** — uses native `fetch` and `crypto`
- **Dual package** — ESM + CommonJS exports

---

## Install

```bash
npm install onofficejs
```

### Use in another project

**From npm (after publish):**

```json
{
  "dependencies": {
    "onofficejs": "^1.0.0"
  }
}
```

**From GitHub:**

```bash
npm install github:Felixfalk26/onofficejs
```

**Local development:**

```bash
cd path/to/onofficejs && npm install && npm run build && npm link
cd path/to/your-project && npm link onofficejs
```

---

## Quick start

```typescript
import { OnOfficeClient, filter, sort, paginate } from 'onofficejs';

const client = new OnOfficeClient({
  token: process.env.ONOFFICE_TOKEN,
  secret: process.env.ONOFFICE_SECRET,
});

const { data } = await client.estates.read(
  paginate(10, 0, {
    data: ['Id', 'kaufpreis', 'lage'],
    sortby: sort({ kaufpreis: 'ASC' }),
    filter: filter().gt('kaufpreis', 300_000).eq('status', 1).build(),
  }),
);

console.log(data.records);
```

---

## Documentation

| Guide | Description |
|---|---|
| [API Reference](./docs/API.md) | Full client API |
| [Caching](./docs/CACHING.md) | Cache adapters & TTL |
| [Migration from PHP SDK](./docs/MIGRATION.md) | Side-by-side PHP → JS |
| [Security](./docs/SECURITY.md) | Credential handling |
| [Contributing](./CONTRIBUTING.md) | Dev setup & PR process |

---

## Usage patterns

### Resource helpers (recommended)

```typescript
await client.estates.read({ data: ['Id'], listlimit: 10 });
await client.estates.search('Berlin');
await client.addresses.read({ data: ['Id', 'Vorname', 'Name'] });
```

### Batch mode

```typescript
import { ActionId, Module } from 'onofficejs';

const [estates, addresses] = await client.batch((b) => [
  b.callGeneric(ActionId.Read, Module.Estate, { data: ['Id'], listlimit: 5 }),
  b.callGeneric(ActionId.Read, Module.Address, { data: ['Id'], listlimit: 5 }),
]);
```

### PHP SDK parity

```typescript
import { ActionId, Module, onOfficeSDK } from 'onofficejs';

const sdk = new onOfficeSDK({ token, secret });
const handle = sdk.callGeneric(ActionId.Read, Module.Estate, { data: ['Id'] });
await sdk.sendRequests();
const response = sdk.getResponse(handle);
```

---

## Error handling

```typescript
import { OnOfficeApiError, OnOfficeTransportError } from 'onofficejs';

try {
  await client.estates.read({ data: ['Id'] });
} catch (error) {
  if (error instanceof OnOfficeApiError) {
    console.error(error.errorCode, error.message);
  }
}
```

---

## Requirements

- Node.js 18+
- onOffice API credentials — [apidoc.onoffice.de](https://apidoc.onoffice.de/)

---

## License

MIT — see [LICENSE](./LICENSE).
