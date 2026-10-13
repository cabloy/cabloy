import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

test('rejects a defined E2E_BASE_URL before loading local configuration', () => {
  const entrypoint = fileURLToPath(new URL('./e2e.ts', import.meta.url));
  for (const value of ['', 'http://127.0.0.1:7102']) {
    const result = spawnSync(process.execPath, [entrypoint], {
      env: { ...process.env, E2E_BASE_URL: value },
      encoding: 'utf8',
    });
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /E2E_BASE_URL is unsupported/);
    assert.doesNotMatch(result.stderr, /SERVER_LISTEN_PORT/);
  }
});

test('isolated E2E target follows the assigned listener', () => {
  const entrypoint = fileURLToPath(new URL('./e2e.ts', import.meta.url));
  const result = spawnSync(
    process.execPath,
    [
      '--input-type=module',
      '-e',
      `import { E2E_LOCAL_BASE_URL } from ${JSON.stringify(entrypoint)}; console.log(E2E_LOCAL_BASE_URL)`,
    ],
    {
      env: {
        ...process.env,
        E2E_BASE_URL: undefined,
        VONA_TEST_RUN_ID: '20261014010203-a1b2c3d4',
        APP_NAME: 'cabtest20261014010203-a1b2c3d4',
        SERVER_LISTEN_PORT: '42321',
      },
      encoding: 'utf8',
    },
  );
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stdout.trim(), 'http://127.0.0.1:42321');
});

test('rejects a malformed isolated E2E run ID', () => {
  const entrypoint = fileURLToPath(new URL('./e2e.ts', import.meta.url));
  const result = spawnSync(process.execPath, [entrypoint], {
    env: {
      ...process.env,
      E2E_BASE_URL: undefined,
      VONA_TEST_RUN_ID: '20260230010203-a1b2c3d4',
      SERVER_LISTEN_PORT: '42321',
    },
    encoding: 'utf8',
  });
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Invalid isolated test run ID/);
});
