import { describe, expect, it, vi } from 'vitest';
import { OnOfficeClient } from '../src/client/OnOfficeClient.js';
import { ActionId, Module } from '../src/constants/index.js';
import { OnOfficeConfigurationError } from '../src/errors/index.js';
import { filter, sort, paginate } from '../src/query/index.js';

describe('OnOfficeClient', () => {
  it('requires credentials on send', async () => {
    const client = new OnOfficeClient({ token: undefined, secret: undefined });
    client.callGeneric(ActionId.Read, Module.Estate, { data: ['Id'] });
    await expect(client.sendRequests()).rejects.toBeInstanceOf(OnOfficeConfigurationError);
  });

  it('callGenericAsync sends and returns typed result', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      text: async () =>
        JSON.stringify({
          response: {
            results: [
              {
                status: { errorcode: 0, message: 'OK' },
                actionid: ActionId.Read,
                resourcetype: Module.Estate,
                data: { records: [{ id: 42 }] },
              },
            ],
          },
        }),
    });

    const client = new OnOfficeClient({ token: 't', secret: 's', fetch: fetchMock });

    const result = await client.callGenericAsync(ActionId.Read, Module.Estate, { data: ['Id'] });
    expect(result.data.records).toEqual([{ id: 42 }]);
    expect(fetchMock).toHaveBeenCalledOnce();
  });

  it('exposes resource helpers', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      text: async () =>
        JSON.stringify({
          response: {
            results: [
              {
                status: { errorcode: 0 },
                actionid: ActionId.Get,
                resourcetype: Module.Search,
                data: { records: [] },
              },
            ],
          },
        }),
    });

    const client = new OnOfficeClient({ token: 't', secret: 's', fetch: fetchMock });

    const result = await client.estates.search('Berlin');
    expect(result.resourcetype).toBe(Module.Search);
  });

  it('sends estate field updates with resourceid outside parameters', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      text: async () =>
        JSON.stringify({
          response: {
            results: [
              {
                status: { errorcode: 0 },
                actionid: ActionId.Modify,
                resourcetype: Module.Estate,
                data: { records: [] },
              },
            ],
          },
        }),
    });

    const client = new OnOfficeClient({ token: 't', secret: 's', fetch: fetchMock });

    await client.estates.modifyFields('568', { kaufpreis: 200000 });

    const body = JSON.parse((fetchMock.mock.calls[0]?.[1] as RequestInit).body as string) as {
      request: { actions: Array<{ resourceid: string; resourcetype: string; parameters: Record<string, unknown> }> };
    };
    expect(body.request.actions[0]).toMatchObject({
      resourceid: '568',
      resourcetype: Module.Estate,
      parameters: { data: { kaufpreis: 200000 } },
    });
    expect(body.request.actions[0]?.parameters).not.toHaveProperty('resourceid');
  });

  it('batch sends multiple actions in one request', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      text: async () =>
        JSON.stringify({
          response: {
            results: [
              {
                status: { errorcode: 0 },
                actionid: ActionId.Read,
                resourcetype: Module.Estate,
                data: { records: [] },
              },
              {
                status: { errorcode: 0 },
                actionid: ActionId.Read,
                resourcetype: Module.Address,
                data: { records: [] },
              },
            ],
          },
        }),
    });

    const client = new OnOfficeClient({ token: 't', secret: 's', fetch: fetchMock });

    const [estates, addresses] = await client.batch((b) => [
      b.callGeneric(ActionId.Read, Module.Estate, { data: ['Id'] }),
      b.callGeneric(ActionId.Read, Module.Address, { data: ['Id'] }),
    ]);

    expect(estates.resourcetype).toBe(Module.Estate);
    expect(addresses.resourcetype).toBe(Module.Address);

    const body = JSON.parse((fetchMock.mock.calls[0]?.[1] as RequestInit).body as string) as {
      request: { actions: unknown[] };
    };
    expect(body.request.actions).toHaveLength(2);
  });
});

describe('query helpers', () => {
  it('builds filters', () => {
    const built = filter().gt('kaufpreis', 300000).eq('status', 1).build();
    expect(built).toEqual({
      kaufpreis: [{ op: '>', val: 300000 }],
      status: [{ op: '=', val: 1 }],
    });
  });

  it('builds paginated params', () => {
    expect(
      paginate(10, 0, {
        data: ['Id'],
        sortby: sort({ kaufpreis: 'ASC' }),
        filter: filter().gt('kaufpreis', 1).build(),
      }),
    ).toMatchObject({ listlimit: 10, listoffset: 0 });
  });
});
