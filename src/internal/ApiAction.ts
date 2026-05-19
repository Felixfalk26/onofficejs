import type { ActionParameters, ActionPayload } from '../types/index.js';
import { createCacheKey, sortParameterKeys } from './stableSerialize.js';

export class ApiAction {
  private readonly actionParameters: ActionPayload;

  constructor(
    actionId: string,
    resourceType: string,
    parameters: ActionParameters = {},
    resourceId = '',
    identifier: string | null = '',
    timestamp: number | null = null,
  ) {
    this.actionParameters = {
      actionid: actionId,
      identifier: identifier === '' ? null : identifier,
      parameters: sortParameterKeys(parameters),
      resourceid: resourceId,
      resourcetype: resourceType,
      timestamp,
    };
  }

  getActionParameters(): ActionPayload {
    return { ...this.actionParameters, parameters: { ...this.actionParameters.parameters } };
  }

  getIdentifier(): string {
    return createCacheKey(this.actionParameters);
  }
}
