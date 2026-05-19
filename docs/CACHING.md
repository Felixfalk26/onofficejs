# Caching

onofficejs supports pluggable response caching identical in purpose to the PHP SDK's `onOfficeSDKCache` interface.

## Built-in memory cache

```typescript
import { OnOfficeClient, MemoryCacheAdapter } from 'onofficejs';

// Shortcut
const client = OnOfficeClient.withMemoryCache(
  { token, secret },
  { ttlSeconds: 3600, maxEntries: 500 },
);

// Manual
const client = new OnOfficeClient({ token, secret });
client.addCache(new MemoryCacheAdapter({ ttlSeconds: 1800 }));
```

Only responses with `cacheable: true` from the API are stored.

## Custom cache adapter

```typescript
import type { CacheAdapter, ActionPayload, ApiResult } from 'onofficejs';

class RedisCache implements CacheAdapter {
  async get(params: ActionPayload): Promise<ApiResult | null> { /* ... */ }
  async set(params: ActionPayload, response: ApiResult): Promise<boolean> { /* ... */ }
  async clearAll(): Promise<void> { /* ... */ }
}

client.addCache(new RedisCache());
```

Cache keys are derived from canonical JSON of action parameters (SHA-256, 32 hex chars).

## Multiple caches

Caches are checked in registration order. First hit wins.

```typescript
client.setCaches([memoryCache, redisCache]);
```

## Cleanup

```typescript
await memoryCache.cleanup(); // remove expired entries
await memoryCache.clearAll(); // wipe cache
```

## PHP cache interoperability

The PHP SDK uses `md5(serialize($params))` for keys and PHP `serialize()` for values. The JS SDK uses canonical JSON + SHA-256. **Shared PHP/JS cache stores are not compatible** without a custom adapter.
