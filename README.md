# onofficejs

> **Unofficial community client — not affiliated with onOffice GmbH.**  
> This is **not** the official onOffice SDK. For the official PHP client see [onOfficeGmbH/sdk](https://github.com/onOfficeGmbH/sdk).  
> See [DISCLAIMER.md](./DISCLAIMER.md) for legal and trademark information.

[![CI](https://github.com/Felixfalk26/onofficejs/actions/workflows/ci.yml/badge.svg)](https://github.com/Felixfalk26/onofficejs/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/onofficejs.svg)](https://www.npmjs.com/package/onofficejs)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Unofficial](https://img.shields.io/badge/onOffice-unofficial-orange)](DISCLAIMER.md)

**Unofficial TypeScript/JavaScript wrapper for the [onOffice API](https://apidoc.onoffice.de/).**

Community-maintained, async-first, fully typed, and designed for Node.js 18+, Bun, Deno, and edge runtimes. Implements the public JSON API protocol documented by onOffice — including HMAC v2 signing and batch requests.

---

## Features

- **Async/await** — no manual `sendRequests()` unless you want batch control
- **TypeScript-first** — strict types, declaration maps, IDE autocomplete
- **Batch requests** — multiple API actions in one HTTP round-trip
- **HMAC v2 signing** — compatible with [documented onOffice API auth](https://apidoc.onoffice.de/onoffice-api-request/request-elemente/action/#hmac)
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
# or from GitHub:
npm install github:Felixfalk26/onofficejs
```

### Use in another project

```json
{
  "dependencies": {
    "onofficejs": "github:Felixfalk26/onofficejs"
  }
}
```

See [docs/USAGE-AS-DEPENDENCY.md](./docs/USAGE-AS-DEPENDENCY.md).

---

## Quick start

Requires a valid **onOffice enterprise API user** (paid module) — see [onOffice API docs](https://apidoc.onoffice.de/erste-schritte/).

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
| [DISCLAIMER.md](./DISCLAIMER.md) | **Unofficial status, legal & trademark notice** |
| [docs/LEGAL.md](./docs/LEGAL.md) | Detailed legal FAQ |
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

### PHP SDK parity layer

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
- Valid onOffice enterprise API credentials — [apidoc.onoffice.de](https://apidoc.onoffice.de/)

---

## Official vs unofficial

| | Official PHP SDK | **onofficejs (this repo)** |
|---|---|---|
| Maintainer | onOffice GmbH | Community |
| Language | PHP | TypeScript / JavaScript |
| Support | apisupport@onoffice.de | GitHub Issues only |
| Status | Official | **Unofficial wrapper** |

---

## License

MIT — see [LICENSE](./LICENSE). Applies to **this library’s source code only**.

Trademarks and API services belong to onOffice GmbH — see [DISCLAIMER.md](./DISCLAIMER.md) and [NOTICE](./NOTICE).
