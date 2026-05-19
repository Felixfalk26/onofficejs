import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';
import { describe, expect, it } from 'vitest';
import { OnOfficeClient } from '../../src/client/OnOfficeClient.ts';
import { ActionId } from '../../src/constants/action-id.ts';

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', (chunk: Buffer) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

describe('HTTP integration shape', () => {
  it('matches PHP SDKIntegrationTest wire format', async () => {
    let captured = '';

    const server = createServer(async (req: IncomingMessage, res: ServerResponse) => {
      captured = await readBody(req);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({
          response: {
            results: [
              {
                status: { errorcode: 0, message: 'OK' },
                actionid: ActionId.Read,
                resourcetype: 'calendar',
                data: { records: [] },
              },
            ],
          },
        }),
      );
    });

    await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
    const address = server.address();
    if (!address || typeof address === 'string') throw new Error('no address');
    const port = address.port;

    const client = new OnOfficeClient({
      token: 'testtoken',
      secret: 'testsecret',
      apiVersion: 'latest',
      apiServer: `http://127.0.0.1:${String(port)}/api/`,
      timestamp: () => 1646228220,
    });

    await client.callAsync(ActionId.Read, '', null, 'calendar', {
      allusers: false,
      dateend: '25-03-2022 02:17:53',
      datestart: '25-03-2022 02:17:53',
      showcancelled: true,
    });

    server.close();

    const parsed = JSON.parse(captured) as {
      token: string;
      request: { actions: Record<string, unknown>[] };
    };

    expect(parsed.token).toBe('testtoken');
    expect(parsed.request.actions).toHaveLength(1);

    const action = parsed.request.actions[0];
    expect(action).toMatchObject({
      actionid: ActionId.Read,
      identifier: null,
      resourceid: '',
      resourcetype: 'calendar',
      timestamp: 1646228220,
      hmac_version: 2,
      hmac: 'w6ifKMmAdJoKhu0vl2twvfP+ltyOTQ7LqLpvsZkOnlg=',
      parameters: {
        allusers: false,
        dateend: '25-03-2022 02:17:53',
        datestart: '25-03-2022 02:17:53',
        showcancelled: true,
      },
    });
  });
});
