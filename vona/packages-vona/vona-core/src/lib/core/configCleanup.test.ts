import assert from 'node:assert/strict';
import { lstat, mkdir, mkdtemp, realpath, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';

import { getSqlite3DatabaseNameDefault } from '../addon/sqlite3.ts';
import {
  getLoggerPathPhysicalRoot,
  getPublicPathPhysicalRoot,
  getRuntimePathPhysicalRoot,
} from './config.ts';
import { resolveVonaLocalPaths } from './testIsolation.ts';

test('internal config resolution computes canonical paths without creating or requiring released roots', async () => {
  const parent = await mkdtemp(path.join(await realpath(os.tmpdir()), 'cleanup-config-'));
  const projectPath = path.join(parent, 'vona');
  await mkdir(projectPath);
  const runId = '20261011010203-deadbeef';
  const app = {
    projectPath,
    name: `cabtest${runId}`,
    options: { projectPath, configResolutionOnly: true },
    meta: { env: { META_MODE: 'test', VONA_TEST_RUN_ID: runId } },
  } as any;
  try {
    const expected = resolveVonaLocalPaths(projectPath, 'test', runId);
    assert.equal(getPublicPathPhysicalRoot(app), expected.publicRoot);
    assert.equal(getRuntimePathPhysicalRoot(app), expected.runtimeRoot);
    assert.equal(getLoggerPathPhysicalRoot(app), expected.logsRoot);
    assert.equal(getSqlite3DatabaseNameDefault(app), '');
    await assert.rejects(lstat(expected.dataRoot), { code: 'ENOENT' });
    await assert.rejects(lstat(expected.generatedRoot), { code: 'ENOENT' });
    app.options.configResolutionOnly = false;
    assert.throws(() => getPublicPathPhysicalRoot(app));
    await assert.rejects(lstat(expected.dataRoot), { code: 'ENOENT' });
  } finally {
    await rm(parent, { recursive: true, force: true });
  }
});
