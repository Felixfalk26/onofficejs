import type { ApiResult } from '../types/index.js';
import type { Request } from './Request.js';

export class Response {
  constructor(
    private readonly request: Request,
    private readonly responseData: ApiResult,
  ) {}

  isValid(): boolean {
    return (
      typeof this.responseData.actionid === 'string' &&
      typeof this.responseData.resourcetype === 'string' &&
      this.responseData.data !== undefined
    );
  }

  isCacheable(): boolean {
    return this.isValid() && this.responseData.cacheable === true;
  }

  getRequest(): Request {
    return this.request;
  }

  getResponseData(): ApiResult {
    return this.responseData;
  }
}
