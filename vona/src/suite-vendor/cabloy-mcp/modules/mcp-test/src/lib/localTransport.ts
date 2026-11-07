import type { VonaApplication } from 'vona';

import { createServer } from 'node:http';
import { assertTestAppIdentity } from 'vona';
import {
  checkFixtureIngress,
  createBusinessTransport,
  failBusinessTransport as fail,
  fixtureIngressLimits,
} from 'vona-module-cabloy-mcp';

import { createBusinessToolServer } from './businessTools.ts';

/** Dedicated managed-test local verification only; never registered by dev/start. */
export async function startLocalTransport(app: VonaApplication) {
  const env = app.meta.env;
  const runId = assertTestAppIdentity(env.META_MODE, env.VONA_TEST_RUN_ID, app.name);
  if (
    !runId ||
    !app.meta.isTest ||
    env.META_MODE !== 'test' ||
    process.env.VONA_TEST_RUN_ID !== runId ||
    process.env.TEST_ONLY === 'true' ||
    app.config.server.listen.disable !== true ||
    app.server
  ) {
    throw new Error('MCP_LOCAL_ISOLATED_APP_REQUIRED');
  }

  let host = '';
  const exchange = createBusinessTransport(app, false, createBusinessToolServer);
  const instanceHeader = app.config.instance.headerField;
  const instanceHeaders = typeof instanceHeader === 'string' ? [instanceHeader] : [];

  const listener = createServer(
    {
      maxHeaderSize: fixtureIngressLimits.headerBytes,
      headersTimeout: 2000,
      connectionsCheckingInterval: 250,
      requestTimeout: 0,
      keepAliveTimeout: 1000,
    },
    (req, res) => {
      const denial = checkFixtureIngress({
        peer: req.socket.remoteAddress,
        host,
        rawHeaders: req.rawHeaders,
        target: req.url,
        method: req.method,
        instanceHeaders,
      });
      if (denial) {
        fail(res, denial.status, -32000, denial.allow);
        return;
      }
      void exchange.handle(req, res, '');
    },
  );
  listener.on('clientError', (_error, socket) => {
    if (socket.writable)
      socket.end('HTTP/1.1 400 Bad Request\r\nConnection: close\r\nContent-Length: 0\r\n\r\n');
  });
  listener.on('checkContinue', (_req, res) => fail(res, 400));
  listener.on('checkExpectation', (_req, res) => fail(res, 400));
  await new Promise<void>((resolve, reject) => {
    listener.once('error', reject);
    listener.listen(0, '127.0.0.1', () => {
      listener.removeListener('error', reject);
      resolve();
    });
  });
  const address = listener.address();
  if (!address || typeof address === 'string') throw new Error('MCP_LOCAL_LISTENER_REQUIRED');
  host = `127.0.0.1:${address.port}`;
  let closure: Promise<void> | undefined;
  return {
    url: `http://${host}/mcp`,
    snapshot: exchange.snapshot,
    close(): Promise<void> {
      return (closure ??= (async () => {
        const stopped = new Promise<void>((resolve, reject) =>
          listener.close(error => (error ? reject(error) : resolve())),
        );
        try {
          await exchange.close();
        } finally {
          await stopped;
        }
      })());
    },
  };
}
