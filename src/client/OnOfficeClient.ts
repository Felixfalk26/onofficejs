/**
 * Unofficial onOffice API client — not affiliated with onOffice GmbH.
 * @see https://github.com/Felixfalk26/onofficejs/blob/main/DISCLAIMER.md
 */
import type { CacheAdapter } from '../cache/CacheAdapter.js';
import { MemoryCacheAdapter } from '../cache/CacheAdapter.js';
import { OnOfficeConfigurationError } from '../errors/index.js';
import { ApiCall } from '../internal/ApiCall.js';
import { createResources, type ResourceBundle } from '../resources/index.js';
import type {
  ActionParameters,
  ApiActionResult,
  ApiResult,
  ApiResultData,
  FetchOptions,
  OnOfficeClientOptions,
  RequestHandle,
} from '../types/index.js';

function readEnv(name: string): string | undefined {
  if (typeof process !== 'undefined' && process.env[name]) {
    return process.env[name];
  }
  return undefined;
}

export class OnOfficeClient {
  private token: string | undefined;
  private secret: string | undefined;
  private readonly apiCall: ApiCall;
  private readonly autoSend: boolean;

  readonly estates: ResourceBundle['estates'];
  readonly addresses: ResourceBundle['addresses'];
  readonly calendar: ResourceBundle['calendar'];
  readonly marketplace: ResourceBundle['marketplace'];
  readonly searchCriteria: ResourceBundle['searchCriteria'];

  constructor(options: OnOfficeClientOptions = {}) {
    this.token = options.token ?? readEnv('ONOFFICE_TOKEN');
    this.secret = options.secret ?? readEnv('ONOFFICE_SECRET');
    this.autoSend = options.autoSend ?? true;

    this.apiCall = new ApiCall({
      apiServer: options.apiServer ?? 'https://api.onoffice.de/api/',
      apiVersion: options.apiVersion ?? 'stable',
      timeout: options.timeout ?? 30_000,
      retries: options.retries ?? 2,
      fetchImpl: options.fetch ?? globalThis.fetch.bind(globalThis),
      debug: options.debug ?? false,
      throwOnApiError: options.throwOnApiError ?? true,
      consumeHandles: options.consumeHandles ?? false,
      timestamp: options.timestamp,
    });

    const resources = createResources(this);
    this.estates = resources.estates;
    this.addresses = resources.addresses;
    this.calendar = resources.calendar;
    this.marketplace = resources.marketplace;
    this.searchCriteria = resources.searchCriteria;
  }

  /** Create a client with in-memory caching enabled */
  static withMemoryCache(options: OnOfficeClientOptions = {}, cacheOptions?: ConstructorParameters<typeof MemoryCacheAdapter>[0]): OnOfficeClient {
    const client = new OnOfficeClient(options);
    client.addCache(new MemoryCacheAdapter(cacheOptions));
    return client;
  }

  setApiVersion(apiVersion: string): this {
    this.apiCall.setApiVersion(apiVersion);
    return this;
  }

  setApiServer(apiServer: string): this {
    this.apiCall.setApiServer(apiServer);
    return this;
  }

  setFetchOptions(fetchOptions: FetchOptions): this {
    this.apiCall.setFetchOptions(fetchOptions);
    return this;
  }

  /** @deprecated Use setFetchOptions — kept for PHP SDK migration parity */
  setApiCurlOptions(fetchOptions: FetchOptions): this {
    return this.setFetchOptions(fetchOptions);
  }

  setCredentials(token: string, secret: string): this {
    this.token = token;
    this.secret = secret;
    return this;
  }

  /**
   * Queue a generic API call (empty resourceId / identifier).
   * Returns a handle for batch mode, or await `callGenericAsync` for convenience.
   */
  callGeneric(actionId: string, resourceType: string, parameters: ActionParameters = {}): RequestHandle {
    return this.apiCall.callByRawData(actionId, '', null, resourceType, parameters);
  }

  /**
   * Queue a full API call with resourceId and identifier.
   */
  call(
    actionId: string,
    resourceId: string,
    identifier: string | null,
    resourceType: string,
    parameters: ActionParameters = {},
  ): RequestHandle {
    return this.apiCall.callByRawData(actionId, resourceId, identifier, resourceType, parameters);
  }

  async callGenericAsync<TData = ApiResultData>(
    actionId: string,
    resourceType: string,
    parameters: ActionParameters = {},
  ): Promise<ApiActionResult<TData>> {
    const handle = this.callGeneric(actionId, resourceType, parameters);
    if (this.autoSend) {
      await this.sendRequests();
    }
    return this.toActionResult(this.getResponse(handle), handle);
  }

  async callAsync<TData = ApiResultData>(
    actionId: string,
    resourceId: string,
    identifier: string | null,
    resourceType: string,
    parameters: ActionParameters = {},
  ): Promise<ApiActionResult<TData>> {
    const handle = this.call(actionId, resourceId, identifier, resourceType, parameters);
    if (this.autoSend) {
      await this.sendRequests();
    }
    return this.toActionResult(this.getResponse(handle), handle);
  }

  /**
   * Queue multiple calls and send them in a single HTTP batch.
   *
   * @example
   * ```ts
   * const [estates, addresses] = await client.batch((b) => [
   *   b.callGeneric(ActionId.Read, 'estate', { data: ['Id'], listlimit: 5 }),
   *   b.callGeneric(ActionId.Read, 'address', { data: ['Id'], listlimit: 5 }),
   * ]);
   * ```
   */
  async batch<T extends readonly RequestHandle[]>(
    fn: (builder: BatchBuilder) => T,
  ): Promise<{ [K in keyof T]: ApiActionResult }> {
    const handles = fn(new BatchBuilder(this.apiCall));
    await this.sendRequests();
    return handles.map((handle) =>
      this.toActionResult(this.getResponse(handle), handle),
    ) as { [K in keyof T]: ApiActionResult };
  }

  async sendRequests(token?: string, secret?: string): Promise<void> {
    const resolvedToken = token ?? this.token;
    const resolvedSecret = secret ?? this.secret;

    if (!resolvedToken || !resolvedSecret) {
      throw new OnOfficeConfigurationError(
        'API token and secret are required. Pass them to sendRequests(), setCredentials(), or use ONOFFICE_TOKEN / ONOFFICE_SECRET env vars.',
      );
    }

    await this.apiCall.sendRequests(resolvedToken, resolvedSecret);
  }

  getResponse(handle: RequestHandle): ApiResult {
    return this.apiCall.getResponse(handle);
  }

  getErrors(): Map<number, ApiResult> {
    return this.apiCall.getErrors();
  }

  addCache(cache: CacheAdapter): this {
    this.apiCall.addCache(cache);
    return this;
  }

  setCaches(caches: CacheAdapter[]): this {
    this.apiCall.setCaches(caches);
    return this;
  }

  clearCaches(): this {
    this.apiCall.clearCaches();
    return this;
  }

  /** @deprecated Use clearCaches() */
  removeCacheInstances(): this {
    return this.clearCaches();
  }

  private toActionResult<TData>(raw: ApiResult, _handle: RequestHandle): ApiActionResult<TData> {
    return {
      status: raw.status,
      actionid: raw.actionid ?? '',
      resourcetype: raw.resourcetype ?? '',
      data: raw.data as TData,
      cacheable: raw.cacheable,
      raw,
    };
  }
}

/** Queues requests without sending — use with {@link OnOfficeClient.batch} */
export class BatchBuilder {
  constructor(private readonly apiCall: ApiCall) {}

  callGeneric(actionId: string, resourceType: string, parameters: ActionParameters = {}): RequestHandle {
    return this.apiCall.callByRawData(actionId, '', null, resourceType, parameters);
  }

  call(
    actionId: string,
    resourceId: string,
    identifier: string | null,
    resourceType: string,
    parameters: ActionParameters = {},
  ): RequestHandle {
    return this.apiCall.callByRawData(actionId, resourceId, identifier, resourceType, parameters);
  }
}

/** Alias for PHP SDK migration */
export { OnOfficeClient as onOfficeSDK };
