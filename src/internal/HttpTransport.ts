import type { ApiBatchResponse, ApiRequestBody, FetchOptions } from '../types/index.js';
import { OnOfficeTransportError } from '../errors/index.js';

export interface HttpTransportOptions {
  apiUrl: string;
  timeout: number;
  fetchImpl: typeof fetch;
  fetchOptions?: FetchOptions;
  debug?: boolean;
  retries?: number;
}

export class HttpTransport {
  constructor(private readonly options: HttpTransportOptions) {}

  async send(body: ApiRequestBody): Promise<ApiBatchResponse> {
    const { apiUrl, timeout, fetchImpl, fetchOptions, debug, retries = 0 } = this.options;

    if (debug) {
      console.debug('[onofficejs] POST', apiUrl, {
        token: redactToken(body.token),
        actionCount: body.request.actions.length,
      });
    }

    let lastError: unknown;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
          controller.abort();
        }, timeout);

        const response = await fetchImpl(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Accept: '*/*',
            ...fetchOptions?.headers,
          },
          body: JSON.stringify(body),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        const text = await response.text();

        if (!response.ok) {
          throw new OnOfficeTransportError(
            `HTTP ${String(response.status)} from onOffice API`,
            response.status,
            text.slice(0, 500),
          );
        }

        let parsed: unknown;
        try {
          parsed = JSON.parse(text) as unknown;
        } catch (cause) {
          throw new OnOfficeTransportError('Invalid JSON response from onOffice API', response.status, text.slice(0, 500), {
            cause,
          });
        }

        if (!isBatchResponse(parsed)) {
          throw new OnOfficeTransportError('Missing response.results in onOffice API response', response.status, text.slice(0, 500));
        }

        if (debug) {
          console.debug('[onofficejs] response', {
            resultCount: parsed.response.results.length,
          });
        }

        return parsed;
      } catch (error) {
        lastError = error;
        if (attempt < retries && isRetryable(error)) {
          await delay(100 * 2 ** attempt);
          continue;
        }
        throw wrapTransportError(error);
      }
    }

    throw wrapTransportError(lastError);
  }
}

function isBatchResponse(value: unknown): value is ApiBatchResponse {
  if (typeof value !== 'object' || value === null) return false;
  const candidate = value as Partial<ApiBatchResponse>;
  return Array.isArray(candidate.response?.results);
}

function isRetryable(error: unknown): boolean {
  if (error instanceof OnOfficeTransportError) {
    const code = error.statusCode;
    return code === undefined || code >= 500;
  }
  if (error instanceof Error && error.name === 'AbortError') {
    return true;
  }
  return error instanceof TypeError;
}

function wrapTransportError(error: unknown): OnOfficeTransportError {
  if (error instanceof OnOfficeTransportError) {
    return error;
  }
  if (error instanceof Error) {
    return new OnOfficeTransportError(error.message, undefined, undefined, { cause: error });
  }
  return new OnOfficeTransportError('Unknown transport error');
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function redactToken(token: string): string {
  if (token.length <= 8) return '***';
  return `${token.slice(0, 4)}…${token.slice(-4)}`;
}

export function buildApiUrl(apiServer: string, apiVersion: string): string {
  const normalizedServer = apiServer.endsWith('/') ? apiServer : `${apiServer}/`;
  return `${normalizedServer}${encodeURIComponent(apiVersion)}/api.php`;
}
