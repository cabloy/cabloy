import type { VonaApplication } from 'vona';

import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  assertTestAppIdentity,
  assertTestRunOwner,
  createGeneralApp,
  hasTestClaimTransport,
  resolveVonaLocalPaths,
} from 'vona';

import type { startLocalTransport } from '../src/lib/localTransport.ts';

const VONA_DIR = fileURLToPath(new URL('../../../../../../', import.meta.url));

async function run() {
  const args = process.argv.slice(2);
  if (args.length !== 1 || !/^[1-9]\d{0,2}$/.test(args[0]) || Number(args[0]) > 600) {
    throw new Error('MCP test runtime requires its managed local launcher');
  }
  const seconds = Number(args[0]);
  const runId = assertTestAppIdentity(
    process.env.META_MODE ?? '',
    process.env.VONA_TEST_RUN_ID,
    process.env.APP_NAME ?? '',
  );
  if (
    !runId ||
    !hasTestClaimTransport() ||
    process.env.SERVER_LISTEN_DISABLE !== 'true' ||
    resolve(process.cwd()) !== resolve(VONA_DIR)
  ) {
    throw new Error('MCP test runtime requires its managed local launcher');
  }
  const paths = resolveVonaLocalPaths(VONA_DIR, 'test', runId);
  assertTestRunOwner(paths.dataRoot, runId);
  assertTestRunOwner(paths.generatedRoot, runId);

  let app: VonaApplication | undefined;
  let transport: Awaited<ReturnType<typeof startLocalTransport>> | undefined;
  let timer: ReturnType<typeof setTimeout> | undefined;
  let stopped = false;
  let stop!: () => void;
  const stopping = new Promise<void>(resolvePromise => {
    stop = () => {
      stopped = true;
      resolvePromise();
    };
  });
  process.on('SIGINT', stop);
  process.on('SIGTERM', stop);
  try {
    app = await createGeneralApp(VONA_DIR);
    if (
      !app ||
      !app.meta.isTest ||
      app.meta.env.VONA_TEST_RUN_ID !== runId ||
      app.meta.env.SERVER_LISTEN_DISABLE !== 'true' ||
      assertTestAppIdentity(app.meta.env.META_MODE, runId, app.name) !== runId ||
      app.config.server.listen.disable !== true ||
      app.server
    ) {
      throw new Error('MCP test runtime requires a managed app without its default listener');
    }
    const modules = app.meta.modules;
    const commerceDisabled = (process.env.PROJECT_DISABLED_SUITES ?? '')
      .split(',')
      .includes('a-commerce');
    if (
      !commerceDisabled ||
      !modules['mcp-test'] ||
      !modules['cabloy-mcp'] ||
      Object.keys(modules).some(name => name.startsWith('commerce-') || name === 'test-pay')
    ) {
      throw new Error('MCP test runtime requires the selected module composition');
    }
    if (stopped) return;
    // Business DTO decorators require the configured, started application.
    const { startLocalTransport } = await import('../src/lib/localTransport.ts');
    if (stopped) return;
    transport = await startLocalTransport(app);
    if (stopped) return;
    if (!/^http:\/\/127\.0\.0\.1:[1-9]\d{0,4}\/mcp$/.test(transport.url)) {
      throw new Error('MCP test runtime received an invalid local transport URL');
    }
    process.stdout.write(`MCP test local URL: ${transport.url}\n`);
    process.stdout.write(
      `Local verification only; serving for ${seconds} seconds. MCP: modern 2026-07-28 + native stateless legacy JSON.\n`,
    );
    process.stdout.write(
      'TTL expiry drains work and cleans managed resources; interruption may retain them.\n',
    );
    timer = setTimeout(stop, seconds * 1000);
    await stopping;
  } finally {
    clearTimeout(timer);
    try {
      await transport?.close();
    } finally {
      try {
        await app?.close();
      } finally {
        process.off('SIGINT', stop);
        process.off('SIGTERM', stop);
      }
    }
  }
}

try {
  await run();
} catch {
  console.error('MCP test local runtime failed; managed cleanup is not confirmed.');
  process.exitCode = 1;
}
