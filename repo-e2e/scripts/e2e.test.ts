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
