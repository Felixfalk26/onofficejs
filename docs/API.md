# API Reference

## `OnOfficeClient`

Main entry point. Implements the onOffice API wire protocol with async ergonomics.

### Constructor

```typescript
new OnOfficeClient(options?: OnOfficeClientOptions)
```

| Option | Type | Default | Description |
|---|---|---|---|
| `token` | `string` | `ONOFFICE_TOKEN` env | API token |
| `secret` | `string` | `ONOFFICE_SECRET` env | API secret |
| `apiVersion` | `string` | `'stable'` | URL version segment |
| `apiServer` | `string` | `'https://api.onoffice.de/api/'` | Base API URL |
| `timeout` | `number` | `30000` | Request timeout (ms) |
| `retries` | `number` | `2` | Transport retry count |
| `throwOnApiError` | `boolean` | `true` | Throw when `errorcode !== 0` |
| `debug` | `boolean` | `false` | Log redacted request metadata |
| `autoSend` | `boolean` | `true` | Auto-flush queue in `*Async` methods |
| `consumeHandles` | `boolean` | `false` | Single-use handles (PHP parity) |
| `fetch` | `typeof fetch` | `globalThis.fetch` | Injectable fetch |
| `timestamp` | `() => number` | Unix seconds now | Signing timestamp override |

### Static methods

#### `OnOfficeClient.withMemoryCache(options?, cacheOptions?)`

Creates a client with an in-memory LRU cache (TTL + max entries).

---

## Request methods

### `callGenericAsync(actionId, resourceType, parameters?)`

Queue and immediately send a generic action. Returns typed result.

### `callAsync(actionId, resourceId, identifier, resourceType, parameters?)`

Full action with resource context. Use for search, calendar, file endpoints, etc.

### `callGeneric(actionId, resourceType, parameters?)` → `RequestHandle`

Queue without sending (batch mode).

### `call(actionId, resourceId, identifier, resourceType, parameters?)` → `RequestHandle`

Queue full action without sending.

### `sendRequests(token?, secret?)`

Flush queued actions in one HTTP POST.

### `getResponse(handle)` → `ApiResult`

Retrieve result by handle. Throws `OnOfficeApiError` if API returned an error.

### `batch(fn)` → `Promise<ApiActionResult[]>`

```typescript
const [a, b] = await client.batch((b) => [
  b.callGeneric(ActionId.Read, 'estate', { data: ['Id'] }),
  b.callGeneric(ActionId.Read, 'address', { data: ['Id'] }),
]);
```

---

## Resource modules

| Property | Methods |
|---|---|
| `client.estates` | `read`, `create`, `modify`, `delete`, `search` |
| `client.addresses` | `read`, `create`, `modify`, `delete` |
| `client.calendar` | `read` |
| `client.marketplace` | `unlockProvider` |
| `client.searchCriteria` | `read`, `create`, `modify` |

---

## Configuration methods

| Method | Description |
|---|---|
| `setApiVersion(v)` | Change API version |
| `setApiServer(url)` | Change base URL |
| `setFetchOptions(init)` | Default fetch options (headers, agent) |
| `setCredentials(token, secret)` | Update credentials |
| `addCache(adapter)` | Register cache |
| `setCaches(adapters[])` | Replace all caches |
| `clearCaches()` | Remove cache adapters |
| `getErrors()` | Map of handle → API error results |

---

## Query helpers

```typescript
import { filter, sort, paginate } from 'onofficejs';

filter().gt('kaufpreis', 300000).eq('status', 1).build();
sort({ kaufpreis: 'ASC', warmmiete: 'DESC' });
paginate(10, 0, { data: ['Id'] });
```

---

## Constants

Import from `onofficejs` or `onofficejs/constants`:

- `ActionId` — Read, Create, Modify, Get, Do, Delete
- `Module` — Estate, Address, SearchCriteria, Calendar, …
- `RelationType` — Buyer, Tenant, Owner, ContactBroker, …

---

## Response shape

```typescript
interface ApiActionResult<TData> {
  status: { errorcode: number; message?: string };
  actionid: string;
  resourcetype: string;
  data: TData;
  cacheable?: boolean;
  raw: ApiResult;
}
```

Typical `data.records[]` entries:

```typescript
{
  id: number;
  type: string;
  elements: Record<string, unknown>;
}
```

See [onOffice API docs](https://apidoc.onoffice.de/) for module-specific fields.

---

## Low-level HMAC

For debugging or custom clients:

```typescript
import { createHmacV2 } from 'onofficejs';

const hmac = createHmacV2(token, secret, timestamp, resourceType, actionId);
```
