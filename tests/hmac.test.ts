import { describe, expect, it } from 'vitest';
import { createHmacV2 } from '../src/internal/createHmac.js';
import { ApiAction } from '../src/internal/ApiAction.js';
import { Request, resetRequestIdCounter } from '../src/internal/Request.js';
import { ActionId } from '../src/constants/action-id.js';

describe('createHmacV2', () => {
  it('matches PHP SDK test vector', () => {
    const hmac = createHmacV2(
      'mgjIQkNRnaqggVzy9cZW',
      'yOJobbhGLXdp90XxvxedFhH7073L9U',
      123456789,
      'estateCategories',
      ActionId.Get,
    );

    expect(hmac).toBe('dsvg3r4AFcQXges0MZ+3auzQVfnEB39pLkKSgmm9Wvg=');
  });

  it('matches integration test vector', () => {
    const hmac = createHmacV2(
      'testtoken',
      'testsecret',
      1646228220,
      'calendar',
      ActionId.Read,
    );

    expect(hmac).toBe('w6ifKMmAdJoKhu0vl2twvfP+ltyOTQ7LqLpvsZkOnlg=');
  });
});

describe('Request', () => {
  it('builds signed action with fixed timestamp', () => {
    resetRequestIdCounter();
    const apiAction = new ApiAction(ActionId.Get, 'estateCategories', {}, 'someResourceId', 'someIdentifier', 123456789);
    const request = new Request(apiAction);
    const signed = request.createSignedAction('mgjIQkNRnaqggVzy9cZW', 'yOJobbhGLXdp90XxvxedFhH7073L9U', 123456789);

    expect(signed.timestamp).toBe(123456789);
    expect(signed.hmac_version).toBe(2);
    expect(signed.hmac).toBe('dsvg3r4AFcQXges0MZ+3auzQVfnEB39pLkKSgmm9Wvg=');
    expect(signed.resourceid).toBe('someResourceId');
    expect(signed.identifier).toBe('someIdentifier');
  });

  it('defaults timestamp when not provided', () => {
    resetRequestIdCounter();
    const apiAction = new ApiAction(ActionId.Get, 'estateCategories', {});
    const request = new Request(apiAction);
    const signed = request.createSignedAction('mgjIQkNRnaqggVzy9cZW', 'yOJobbhGLXdp90XxvxedFhH7073L9U');

    expect(signed.timestamp).toBeGreaterThan(0);
    expect(signed.hmac).toBeTruthy();
  });

  it('serializes empty identifier as null', () => {
    resetRequestIdCounter();
    const apiAction = new ApiAction(ActionId.Read, 'calendar', {});
    const request = new Request(apiAction);
    const signed = request.createSignedAction('t', 's', 1);

    expect(signed.identifier).toBeNull();
  });
});
