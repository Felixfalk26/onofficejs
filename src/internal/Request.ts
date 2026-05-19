import type { SignedActionPayload } from '../types/index.js';
import { ApiAction } from './ApiAction.js';
import { createHmacV2 } from './createHmac.js';
import { identifierForWire } from './stableSerialize.js';

let requestIdCounter = 0;

export function resetRequestIdCounter(): void {
  requestIdCounter = 0;
}

export class Request {
  private readonly apiAction: ApiAction;
  private readonly requestId: number;

  constructor(apiAction: ApiAction, requestId?: number) {
    this.apiAction = apiAction;
    this.requestId = requestId ?? requestIdCounter++;
  }

  createSignedAction(token: string, secret: string, timestamp?: number): SignedActionPayload {
    const actionParameters = this.apiAction.getActionParameters();
    const resolvedTimestamp = timestamp ?? Math.floor(Date.now() / 1000);

    const hmac = createHmacV2(
      token,
      secret,
      resolvedTimestamp,
      actionParameters.resourcetype,
      actionParameters.actionid,
    );

    return {
      actionid: actionParameters.actionid,
      identifier: identifierForWire(actionParameters.identifier),
      parameters: actionParameters.parameters,
      resourceid: actionParameters.resourceid,
      resourcetype: actionParameters.resourcetype,
      timestamp: resolvedTimestamp,
      hmac_version: 2,
      hmac,
    };
  }

  getRequestId(): number {
    return this.requestId;
  }

  getApiAction(): ApiAction {
    return this.apiAction;
  }
}
