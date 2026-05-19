import { describe, expect, it } from 'vitest';
import { ApiAction } from '../src/internal/ApiAction.js';
import { Request } from '../src/internal/Request.js';
import { Response } from '../src/internal/Response.js';

describe('Response', () => {
  const makeResponse = (data: Record<string, unknown>) => {
    const apiAction = new ApiAction('someActionId', 'someResourceType', []);
    const request = new Request(apiAction);
    return new Response(request, data as never);
  };

  it('is valid when required fields exist', () => {
    const response = makeResponse({
      actionid: 'someActionId',
      resourcetype: 'someResourceType',
      data: { records: [] },
    });
    expect(response.isValid()).toBe(true);
  });

  it('is invalid when data missing', () => {
    expect(makeResponse({ actionid: 'x', resourcetype: 'y' }).isValid()).toBe(false);
  });

  it('is cacheable when flagged', () => {
    const response = makeResponse({
      actionid: 'a',
      resourcetype: 'b',
      data: {},
      cacheable: true,
    });
    expect(response.isCacheable()).toBe(true);
  });

  it('is not cacheable when flag is false', () => {
    const response = makeResponse({
      actionid: 'a',
      resourcetype: 'b',
      data: {},
      cacheable: false,
    });
    expect(response.isCacheable()).toBe(false);
  });
});
