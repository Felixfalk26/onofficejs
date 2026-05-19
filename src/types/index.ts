export type FilterOperator = '=' | '!=' | '>' | '>=' | '<' | '<=' | 'like' | 'in' | 'not in';

export interface FilterCondition {
  op: FilterOperator;
  val: string | number | boolean | (string | number)[];
}

export type FilterMap = Record<string, FilterCondition[]>;

export type SortDirection = 'ASC' | 'DESC';
export type SortMap = Record<string, SortDirection>;

/** Generic action parameters — API accepts module-specific shapes */
export type ActionParameters = Record<string, unknown>;

export interface ActionPayload {
  actionid: string;
  identifier: string | null;
  parameters: ActionParameters;
  resourceid: string;
  resourcetype: string;
  timestamp: number | null;
}

export interface SignedActionPayload extends ActionPayload {
  timestamp: number;
  hmac_version: 2;
  hmac: string;
}

export interface ApiStatus {
  errorcode: number;
  message?: string;
}

export interface ApiResultRecord {
  id?: number;
  type?: string;
  elements?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface ApiResultData {
  records?: ApiResultRecord[];
  meta?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface ApiResult {
  status: ApiStatus;
  actionid?: string;
  resourcetype?: string;
  data?: ApiResultData;
  cacheable?: boolean;
  [key: string]: unknown;
}

export interface ApiBatchResponse {
  response: {
    results: ApiResult[];
  };
}

export interface ApiRequestBody {
  token: string;
  request: {
    actions: SignedActionPayload[];
  };
}

/** Branded handle returned when queueing a request */
export type RequestHandle = number & { readonly __brand: 'RequestHandle' };

export function asRequestHandle(id: number): RequestHandle {
  return id as RequestHandle;
}

export interface ApiActionResult<TData = ApiResultData> {
  status: ApiStatus;
  actionid: string;
  resourcetype: string;
  data: TData;
  cacheable?: boolean;
  raw: ApiResult;
}

export interface OnOfficeClientOptions {
  /** API token (or set `ONOFFICE_TOKEN` env var) */
  token?: string;
  /** API secret (or set `ONOFFICE_SECRET` env var) */
  secret?: string;
  /** API version path segment — default `stable` */
  apiVersion?: string;
  /** Base URL — default `https://api.onoffice.de/api/` */
  apiServer?: string;
  /** Request timeout in ms — default 30000 */
  timeout?: number;
  /** Max retry attempts on transport failures — default 2 */
  retries?: number;
  /** Throw on API-level errors (errorcode !== 0) — default true */
  throwOnApiError?: boolean;
  /** Log redacted requests/responses — default false */
  debug?: boolean;
  /** Custom fetch implementation */
  fetch?: typeof fetch;
  /** Injectable clock for testing — default Date.now */
  now?: () => number;
  /** Custom timestamp provider (Unix seconds) for signing */
  timestamp?: () => number;
  /** Consume response handle after first read — PHP parity — default false */
  consumeHandles?: boolean;
  /** Auto-flush queue in async methods — default true */
  autoSend?: boolean;
}

export interface FetchOptions {
  headers?: Record<string, string>;
}

export interface EstateReadParams {
  data: string[];
  listlimit?: number;
  listoffset?: number;
  sortby?: SortMap;
  filter?: FilterMap;
  resourceid?: string;
  [key: string]: unknown;
}

export interface AddressReadParams {
  data: string[];
  listlimit?: number;
  listoffset?: number;
  sortby?: SortMap;
  filter?: FilterMap;
  [key: string]: unknown;
}

export interface SearchParams {
  input: string;
  [key: string]: unknown;
}

export interface UnlockProviderParams extends Record<string, string> {
  parameterCacheId: string;
  extendedclaim: string;
}

export interface CalendarReadParams {
  datestart: string;
  dateend: string;
  allusers?: boolean;
  showcancelled?: boolean;
  [key: string]: unknown;
}
