export class OnOfficeError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = 'OnOfficeError';
  }
}

export class OnOfficeTransportError extends OnOfficeError {
  constructor(
    message: string,
    public readonly statusCode?: number,
    public readonly responseBody?: string,
    options?: ErrorOptions,
  ) {
    super(message, options);
    this.name = 'OnOfficeTransportError';
  }
}

export class OnOfficeApiError extends OnOfficeError {
  constructor(
    message: string,
    public readonly errorCode: number,
    public readonly handle: number,
    public readonly raw: Record<string, unknown>,
  ) {
    super(message);
    this.name = 'OnOfficeApiError';
  }
}

export class OnOfficeInvalidResponseError extends OnOfficeError {
  constructor(
    message: string,
    public readonly handle: number,
  ) {
    super(message);
    this.name = 'OnOfficeInvalidResponseError';
  }
}

export class OnOfficeConfigurationError extends OnOfficeError {
  constructor(message: string) {
    super(message);
    this.name = 'OnOfficeConfigurationError';
  }
}

export class OnOfficeEmptyQueueError extends OnOfficeError {
  constructor(message: string) {
    super(message);
    this.name = 'OnOfficeEmptyQueueError';
  }
}
