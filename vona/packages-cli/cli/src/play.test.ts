import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { test } from 'node:test';

const script = `
  import { playAttach } from './play.ts';
  await playAttach('/nonexistent-vona-project', []);
`;

test('play attach accepts the timestamped test identity before locating its runtime', () => {
  const result = spawnSync(process.execPath, ['--input-type=module', '-e', script], {
    cwd: import.meta.dirname,
    env: {
      ...process.env,
      META_MODE: 'test',
      VONA_TEST_RUN_ID: '20261014010203-a1b2c3d4',
    },
    encoding: 'utf8',
  });
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /dev server not running/);
  assert.doesNotMatch(result.stderr, /VONA_TEST_RUN_ID requires/);
});

test('play attach rejects impossible UTC seconds', () => {
  const result = spawnSync(process.execPath, ['--input-type=module', '-e', script], {
    cwd: import.meta.dirname,
    env: {
      ...process.env,
      META_MODE: 'test',
      VONA_TEST_RUN_ID: '20260230010203-a1b2c3d4',
    },
    encoding: 'utf8',
  });
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /VONA_TEST_RUN_ID requires/);
});
