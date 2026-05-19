import { createHmac } from 'node:crypto';

/**
 * HMAC v2 signing per onOffice API spec.
 *
 * message = timestamp + token + resourcetype + actionid (concatenated, no separators)
 * hmac    = base64(HMAC-SHA256(message, secret))
 */
export function createHmacV2(
  token: string,
  secret: string,
  timestamp: number,
  resourceType: string,
  actionId: string,
): string {
  const message = `${String(timestamp)}${token}${resourceType}${actionId}`;
  return createHmac('sha256', secret).update(message).digest('base64');
}
