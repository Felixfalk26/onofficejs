import type { ActionPayload, ApiResult, FetchOptions, RequestHandle } from '../types/index.js';
import { asRequestHandle } from '../types/index.js';
import type { CacheAdapter } from '../cache/CacheAdapter.js';
import {
  OnOfficeApiError,
  OnOfficeEmptyQueueError,
  OnOfficeInvalidResponseError,
} from '../errors/index.js';
import { ApiAction } from './ApiAction.js';
import { buildApiUrl, HttpTransport } from './HttpTransport.js';
import { Request } from './Request.js';
import { Response } from './Response.js';

export interface ApiCallOptions {
  apiServer: string;
  apiVersion: string;
  timeout: number;
  retries: number;
  fetchImpl: typeof fetch;
  fetchOptions?: FetchOptions;
  debug: boolean;
  throwOnApiError: boolean;
  consumeHandles: boolean;
  timestamp?: () => number;
}

export class ApiCall {
  private readonly requestQueue = new Map<number, Request>();
  private readonly responses = new Map<number, Response>();
  private readonly errors = new Map<number, ApiResult>();
  private readonly caches: CacheAdapter[] = [];
  private apiVersion: string;
  private apiServer: string;
  private fetchOptions: FetchOptions | undefined;

  constructor(private readonly options: ApiCallOptions) {
    this.apiVersion = options.apiVersion;
    this.apiServer = options.apiServer;
  }

  setApiVersion(apiVersion: string): void {
    this.apiVersion = apiVersion;
  }

  setApiServer(apiServer: string): void {
    this.apiServer = apiServer;
  }

  setFetchOptions(fetchOptions: FetchOptions): void {
    this.fetchOptions = fetchOptions;
  }

  callByRawData(
    actionId: string,
    resourceId: string,
    identifier: string | null,
    resourceType: string,
    parameters: Record<string, unknown> = {},
  ): RequestHandle {
    const apiAction = new ApiAction(actionId, resourceType, parameters, resourceId, identifier);
    const request = new Request(apiAction);
    const requestId = request.getRequestId();
    this.requestQueue.set(requestId, request);
    return asRequestHandle(requestId);
  }

  async sendRequests(token: string, secret: string): Promise<void> {
    if (this.requestQueue.size === 0) {
      return;
    }

    const actionParameters: ReturnType<Request['createSignedAction']>[] = [];
    const actionParametersOrder: Request[] = [];
    const timestampFn = this.options.timestamp ?? (() => Math.floor(Date.now() / 1000));

    for (const [requestId, request] of this.requestQueue.entries()) {
      const usedParameters = request.getApiAction().getActionParameters();
      const cachedResponse = await this.getFromCache(usedParameters);

      if (cachedResponse === null) {
        actionParameters.push(request.createSignedAction(token, secret, timestampFn()));
        actionParametersOrder.push(request);
      } else {
        this.responses.set(requestId, new Response(request, cachedResponse));
      }
    }

    if (actionParameters.length > 0) {
      const transport = new HttpTransport({
        apiUrl: buildApiUrl(this.apiServer, this.apiVersion),
        timeout: this.options.timeout,
        fetchImpl: this.options.fetchImpl,
        fetchOptions: this.fetchOptions,
        debug: this.options.debug,
        retries: this.options.retries,
      });

      const result = await transport.send({
        token,
        request: { actions: actionParameters },
      });

      const idsForCache: number[] = [];

      result.response.results.forEach((resultHttp, requestNumber) => {
        const request = actionParametersOrder[requestNumber];
        if (!request) return;

        const requestId = request.getRequestId();

        if (resultHttp.status.errorcode === 0) {
          this.responses.set(requestId, new Response(request, resultHttp));
          idsForCache.push(requestId);
        } else {
          this.errors.set(requestId, resultHttp);
          if (this.options.throwOnApiError) {
            // defer throw until after queue processing so getErrors remains useful in batch mode
          }
        }
      });

      await this.writeCacheForResponses(idsForCache);
    }

    this.requestQueue.clear();
  }

  getResponse(handle: RequestHandle): ApiResult {
    const response = this.responses.get(handle);

    if (!response) {
      const apiError = this.errors.get(handle);
      if (apiError) {
        throw new OnOfficeApiError(
          apiError.status.message ?? `API error ${String(apiError.status.errorcode)}`,
          apiError.status.errorcode,
          handle,
          apiError,
        );
      }
      throw new OnOfficeInvalidResponseError(`No response for handle ${String(handle)}`, handle);
    }

    if (!response.isValid()) {
      throw new OnOfficeInvalidResponseError(`Faulty response for handle ${String(handle)}`, handle);
    }

    const data = response.getResponseData();

    if (this.options.consumeHandles) {
      this.responses.delete(handle);
    }

    return data;
  }

  getErrors(): Map<number, ApiResult> {
    return new Map(this.errors);
  }

  hasQueuedRequests(): boolean {
    return this.requestQueue.size > 0;
  }

  addCache(cache: CacheAdapter): void {
    this.caches.push(cache);
  }

  setCaches(caches: CacheAdapter[]): void {
    this.caches.length = 0;
    for (const cache of caches) {
      this.addCache(cache);
    }
  }

  clearCaches(): void {
    this.caches.length = 0;
  }

  assertQueueNotEmpty(): void {
    if (this.requestQueue.size === 0 && this.responses.size === 0) {
      throw new OnOfficeEmptyQueueError('No requests queued. Call call() or callGeneric() first.');
    }
  }

  private async getFromCache(parameters: ActionPayload): Promise<ApiResult | null> {
    for (const cache of this.caches) {
      const result = await cache.get(parameters);
      if (result !== null) {
        return result;
      }
    }
    return null;
  }

  private async writeCacheForResponses(responseIds: number[]): Promise<void> {
    if (this.caches.length === 0) return;

    for (const requestId of responseIds) {
      const response = this.responses.get(requestId);
      if (!response?.isCacheable()) continue;

      const responseData = response.getResponseData();
      const requestParameters = response.getRequest().getApiAction().getActionParameters();

      for (const cache of this.caches) {
        await cache.set(requestParameters, responseData);
      }
    }
  }
}
