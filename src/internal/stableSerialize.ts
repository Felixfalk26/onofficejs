import { createHash } from 'node:crypto';

/**
 * Recursively sort object keys (PHP ksort parity for top-level and nested objects).
 * Arrays preserve order.
 */
export function sortKeysDeep(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map((item) => sortKeysDeep(item));
  }

  if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
    const record = value as Record<string, unknown>;
    const sorted: Record<string, unknown> = {};
    for (const key of Object.keys(record).sort()) {
      sorted[key] = sortKeysDeep(record[key]);
    }
    return sorted;
  }

  return value;
}

/** Stable JSON string for cache keys */
export function stableStringify(value: unknown): string {
  return JSON.stringify(sortKeysDeep(value));
}

/** Cache identifier hash — canonical JSON + SHA-256 (first 32 hex chars, MD5-length parity) */
export function createCacheKey(value: unknown): string {
  return createHash('sha256').update(stableStringify(value)).digest('hex').slice(0, 32);
}

/** Sort top-level parameter keys only (PHP ksort on parameters array) */
export function sortParameterKeys(parameters: Record<string, unknown>): Record<string, unknown> {
  const sorted: Record<string, unknown> = {};
  for (const key of Object.keys(parameters).sort()) {
    sorted[key] = parameters[key];
  }
  return sorted;
}

/** Normalize empty identifier/resourceid for wire format */
export function normalizeOptionalString(value: string | null | undefined): string {
  return value ?? '';
}

export function identifierForWire(value: string | null | undefined): string | null {
  if (value === null || value === undefined || value === '') {
    return null;
  }
  return value;
}
