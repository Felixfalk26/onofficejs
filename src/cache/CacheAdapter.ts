import type { ActionPayload, ApiResult } from '../types/index.js';
import { createCacheKey } from '../internal/stableSerialize.js';

export interface CacheAdapter {
  get(actionParameters: ActionPayload): Promise<ApiResult | null>;
  set(actionParameters: ActionPayload, response: ApiResult): Promise<boolean>;
  cleanup?(): Promise<void>;
  clearAll(): Promise<void>;
}

export interface MemoryCacheOptions {
  /** Max entries — default 500 */
  maxEntries?: number;
  /** TTL in seconds — default 3600 */
  ttlSeconds?: number;
}

interface CacheEntry {
  value: ApiResult;
  expiresAt: number;
}

export class MemoryCacheAdapter implements CacheAdapter {
  private readonly store = new Map<string, CacheEntry>();
  private readonly maxEntries: number;
  private readonly ttlSeconds: number;

  constructor(options: MemoryCacheOptions = {}) {
    this.maxEntries = options.maxEntries ?? 500;
    this.ttlSeconds = options.ttlSeconds ?? 3600;
  }

  get(actionParameters: ActionPayload): Promise<ApiResult | null> {
    const key = createCacheKey(actionParameters);
    const entry = this.store.get(key);

    if (!entry) return Promise.resolve(null);

    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return Promise.resolve(null);
    }

    return Promise.resolve(structuredClone(entry.value));
  }

  set(actionParameters: ActionPayload, response: ApiResult): Promise<boolean> {
    this.evictIfNeeded();
    const key = createCacheKey(actionParameters);
    this.store.set(key, {
      value: structuredClone(response),
      expiresAt: Date.now() + this.ttlSeconds * 1000,
    });
    return Promise.resolve(true);
  }

  cleanup(): Promise<void> {
    const now = Date.now();
    for (const [key, entry] of this.store.entries()) {
      if (now > entry.expiresAt) {
        this.store.delete(key);
      }
    }
    return Promise.resolve();
  }

  clearAll(): Promise<void> {
    this.store.clear();
    return Promise.resolve();
  }

  get size(): number {
    return this.store.size;
  }

  private evictIfNeeded(): void {
    if (this.store.size < this.maxEntries) return;
    const firstKey = this.store.keys().next().value;
    if (firstKey !== undefined) {
      this.store.delete(firstKey);
    }
  }
}
