import { mkdir, mkdtemp, realpath, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { createTestClaim, getTestClaimRedisPrefix, writeTestClaim } from 'vona-core';

import { prepareCleanupProcess } from '../../../../../../../scripts/testClaimCleanup.ts';

// A fake source config exercises child registration/current resolution/IPC but
// never opens a database, Redis connection, listener, migration or seed.
test('cleanup helper launches via process.execPath and resolves only fake source config', async () => {
  const project = await mkdtemp(path.join(await realpath(os.tmpdir()), 'cleanup-helper-'));
  const runId = '20261011010203-deadbeef';
  try {
    const configDir = path.join(project, 'src/backend/config/config');
    await mkdir(configDir, { recursive: true });
    await writeFile(path.join(project, 'package.json'), '{"type":"module"}');
    await writeFile(
      path.join(project, 'tsconfig.json'),
      '{"compilerOptions":{"module":"NodeNext","moduleResolution":"NodeNext","target":"ESNext","allowImportingTsExtensions":true}}',
    );
    await writeFile(
      path.join(configDir, 'config.ts'),
      `export default async function(app) {
      if (app.server || !app.options.configResolutionOnly) throw new Error('Started application');
      await app.options.modulesMeta().then(() => { throw new Error('Module loading permitted'); }, () => {});
      return { meta: { mode: 'test', flavor: 'normal' }, database: { testDatabase: true }, redis: { base: { host: '127.0.0.1', port: 6379, db: 0 }, clients: { cache: { keyPrefix: true } } } };
    }`,
    );
    const { claimPath, manifest } = await createTestClaim(project, runId, 'unit', {
      pid: process.pid,
      startTime: 'fake',
      host: os.hostname(),
    });
    manifest.redis.push({
      clientName: 'cache',
      ...getTestClaimRedisPrefix(runId, 'cache')!,
      endpoint: { transport: 'tcp', host: '127.0.0.1', port: 6379, db: 0, tls: false },
      released: false,
    });
    await writeTestClaim(claimPath, manifest);
    const session = await prepareCleanupProcess(manifest, claimPath);
    await session.close();
  } finally {
    await rm(project, { recursive: true, force: true });
  }
});
