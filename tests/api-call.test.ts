import { describe, expect, it, vi } from 'vitest';
import { ApiCall } from '../src/internal/ApiCall.js';
import { MemoryCacheAdapter } from '../src/cache/CacheAdapter.js';
import { OnOfficeApiError, OnOfficeInvalidResponseError, OnOfficeTransportError } from '../src/errors/index.js';
import { ActionId } from '../src/constants/action-id.js';
import type { ApiBatchResponse } from '../src/types/index.js';

function createApiCall(overrides: Partial<ConstructorParameters<typeof ApiCall>[0]> = {}) {
  return new ApiCall({
    apiServer: 'https://api.onoffice.de/api/',
    apiVersion: 'stable',
    timeout: 5000,
    retries: 0,
    fetchImpl: globalThis.fetch,
    debug: false,
    throwOnApiError: true,
    consumeHandles: false,
    ...overrides,
  });
}

describe('ApiCall', () => {
  it('returns incrementing handles', () => {
    const apiCall = createApiCall();
    expect(apiCall.callByRawData('a', '', null, 'estate', {})).toBe(0);
    expect(apiCall.callByRawData('b', '', null, 'address', {})).toBe(1);
  });

  it('no-ops send when queue is empty', async () => {
    const apiCall = createApiCall();
    await expect(apiCall.sendRequests('token', 'secret')).resolves.toBeUndefined();
  });

  it('processes successful batch responses', async () => {
    const apiCall = createApiCall({
      fetchImpl: vi.fn().mockResolvedValue({
        ok: true,
        text: async () =>
          JSON.stringify({
            response: {
              results: [
                {
                  status: { errorcode: 0, message: 'OK' },
                  actionid: ActionId.Read,
                  resourcetype: 'estate',
                  data: { records: [] },
                },
              ],
            },
          } satisfies ApiBatchResponse),
      }),
    });

    const handle = apiCall.callByRawData(ActionId.Read, '', null, 'estate', { data: ['Id'] });
    await apiCall.sendRequests('token', 'secret');
    const result = apiCall.getResponse(handle);
    expect(result.data).toEqual({ records: [] });
  });

  it('throws transport error on malformed response', async () => {
    const apiCall = createApiCall({
      fetchImpl: vi.fn().mockResolvedValue({
        ok: true,
        text: async () => JSON.stringify({ response: {} }),
      }),
    });

    apiCall.callByRawData(ActionId.Read, '', null, 'estate', {});
    await expect(apiCall.sendRequests('token', 'secret')).rejects.toBeInstanceOf(OnOfficeTransportError);
  });

  it('throws api error on non-zero errorcode', async () => {
    const apiCall = createApiCall({
      fetchImpl: vi.fn().mockResolvedValue({
        ok: true,
        text: async () =>
          JSON.stringify({
            response: {
              results: [{ status: { errorcode: 141, message: 'Invalid parameters' } }],
            },
          }),
      }),
    });

    const handle = apiCall.callByRawData(ActionId.Read, '', null, 'estate', {});
    await apiCall.sendRequests('token', 'secret');
    expect(() => apiCall.getResponse(handle)).toThrow(OnOfficeApiError);
  });

  it('uses cache on repeated identical requests', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      text: async () =>
        JSON.stringify({
          response: {
            results: [
              {
                status: { errorcode: 0 },
                actionid: ActionId.Read,
                resourcetype: 'estate',
                data: { records: [{ id: 1 }] },
                cacheable: true,
              },
            ],
          },
        }),
    });

    const apiCall = createApiCall({ fetchImpl: fetchMock });
    apiCall.addCache(new MemoryCacheAdapter({ ttlSeconds: 60 }));

    const params = { data: ['Id'], listlimit: 1 };
    const h1 = apiCall.callByRawData(ActionId.Read, '', null, 'estate', params);
    await apiCall.sendRequests('token', 'secret');
    apiCall.getResponse(h1);

    const h2 = apiCall.callByRawData(ActionId.Read, '', null, 'estate', params);
    await apiCall.sendRequests('token', 'secret');
    apiCall.getResponse(h2);

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('throws invalid response error for missing handle', () => {
    const apiCall = createApiCall();
    expect(() => apiCall.getResponse(999 as never)).toThrow(OnOfficeInvalidResponseError);
  });
});
