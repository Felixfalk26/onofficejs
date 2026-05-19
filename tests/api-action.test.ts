import { describe, expect, it } from 'vitest';
import { ApiAction } from '../src/internal/ApiAction.js';
import { createCacheKey } from '../src/internal/stableSerialize.js';

describe('ApiAction', () => {
  it('normalizes action parameters', () => {
    const parameters = {
      param1: 'value1',
      zparam: 'last',
    };

    const apiAction = new ApiAction('someId', 'someResource', parameters);
    const result = apiAction.getActionParameters();

    expect(result).toEqual({
      actionid: 'someId',
      identifier: null,
      parameters: { param1: 'value1', zparam: 'last' },
      resourceid: '',
      resourcetype: 'someResource',
      timestamp: null,
    });
  });

  it('sorts parameter keys', () => {
    const apiAction = new ApiAction('someId', 'someResource', { z: 1, a: 2 });
    expect(Object.keys(apiAction.getActionParameters().parameters)).toEqual(['a', 'z']);
  });

  it('produces stable cache keys', () => {
    const a = new ApiAction('someId', 'someResource', { param1: 'value1' });
    const b = new ApiAction('someId', 'someResource', { param1: 'value1' });
    expect(a.getIdentifier()).toBe(b.getIdentifier());
    expect(a.getIdentifier()).toHaveLength(32);
  });

  it('differentiates cache keys for different payloads', () => {
    const a = new ApiAction('someId', 'someResource', { param1: 'value1' });
    const b = new ApiAction('someId', 'someResource', { param1: 'value2' });
    expect(a.getIdentifier()).not.toBe(b.getIdentifier());
  });

  it('uses canonical cache key helper', () => {
    const payload = {
      actionid: 'someId',
      identifier: null,
      parameters: { param1: 'value1' },
      resourceid: '',
      resourcetype: 'someResource',
      timestamp: null,
    };
    expect(createCacheKey(payload)).toMatch(/^[a-f0-9]{32}$/);
  });
});
