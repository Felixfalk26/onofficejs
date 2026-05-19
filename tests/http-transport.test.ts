import { describe, expect, it, vi } from 'vitest';
import { HttpTransport, buildApiUrl } from '../src/internal/HttpTransport.js';
import { OnOfficeTransportError } from '../src/errors/index.js';

describe('HttpTransport', () => {
  it('buildApiUrl encodes version segment', () => {
    expect(buildApiUrl('https://api.onoffice.de/api/', 'stable')).toBe(
      'https://api.onoffice.de/api/stable/api.php',
    );
  });

  it('throws on non-ok HTTP status', async () => {
    const transport = new HttpTransport({
      apiUrl: 'https://example.test/api.php',
      timeout: 5000,
      fetchImpl: vi.fn().mockResolvedValue({
        ok: false,
        status: 503,
        text: async () => 'Service Unavailable',
      }),
      retries: 0,
    });

    await expect(
      transport.send({ token: 't', request: { actions: [] } }),
    ).rejects.toBeInstanceOf(OnOfficeTransportError);
  });

  it('throws on invalid JSON body', async () => {
    const transport = new HttpTransport({
      apiUrl: 'https://example.test/api.php',
      timeout: 5000,
      fetchImpl: vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        text: async () => 'not-json',
      }),
      retries: 0,
    });

    await expect(
      transport.send({ token: 't', request: { actions: [] } }),
    ).rejects.toBeInstanceOf(OnOfficeTransportError);
  });

  it('throws when response.results is missing', async () => {
    const transport = new HttpTransport({
      apiUrl: 'https://example.test/api.php',
      timeout: 5000,
      fetchImpl: vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        text: async () => JSON.stringify({ response: {} }),
      }),
      retries: 0,
    });

    await expect(
      transport.send({ token: 't', request: { actions: [] } }),
    ).rejects.toBeInstanceOf(OnOfficeTransportError);
  });
});
