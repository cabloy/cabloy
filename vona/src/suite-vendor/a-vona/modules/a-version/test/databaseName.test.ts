import assert from 'node:assert';
import { describe, it } from 'node:test';

import { createDatabaseTestName, getDatabaseTestPrefix } from '../src/lib/databaseTestName.ts';

const timestamp = '20260923-104500';

describe('databaseTestName', () => {
  it('keeps a short shared app name readable with its shared marker', () => {
    const prefix = getDatabaseTestPrefix('cabloy-start', 'share');
    const databaseName = createDatabaseTestName(prefix, timestamp);

    assert.equal(prefix, 'vona-test-cabloy-start-s-');
    assert.equal(databaseName, 'vona-test-cabloy-start-s-20260923-104500');
    assert.ok(Buffer.byteLength(databaseName, 'utf8') <= 63);
  });

  it('keeps a short isolated app name readable with its isolate identity', () => {
    const sharedPrefix = getDatabaseTestPrefix('cabloy-start', 'share');
    const isolatedPrefix = getDatabaseTestPrefix('cabloy-start', 'isolate-isolateTest');

    assert.equal(isolatedPrefix, 'vona-test-cabloy-start-i-isolateTest-');
    assert.notEqual(sharedPrefix, isolatedPrefix);
  });

  it('uses the readable format through 63 bytes and the fallback at 64 bytes', () => {
    const readableAppName = 'a'.repeat(35);
    const fallbackAppName = `${readableAppName}a`;
    const readablePrefix = getDatabaseTestPrefix(readableAppName, 'share');
    const fallbackPrefix = getDatabaseTestPrefix(fallbackAppName, 'share');
    const readableName = createDatabaseTestName(readablePrefix, timestamp);
    const fallbackName = createDatabaseTestName(fallbackPrefix, timestamp);

    assert.equal(readablePrefix, `vona-test-${readableAppName}-s-`);
    assert.equal(Buffer.byteLength(readableName, 'utf8'), 63);
    assert.match(fallbackPrefix, /^vona-test-a{13}-s-[\w-]{10}-$/);
    assert.ok(Buffer.byteLength(fallbackName, 'utf8') <= 63);
  });

  it('uses UTF-8 byte length and preserves code points in the fallback', () => {
    const readableAppName = '商'.repeat(11);
    const fallbackAppName = `${readableAppName}店`;
    const readablePrefix = getDatabaseTestPrefix(readableAppName, 'share');
    const fallbackPrefix = getDatabaseTestPrefix(fallbackAppName, 'share');
    const fallbackName = createDatabaseTestName(fallbackPrefix, timestamp);

    assert.equal(readablePrefix, `vona-test-${readableAppName}-s-`);
    assert.match(fallbackPrefix, /^vona-test-商{4}-s-[\w-]{10}-$/);
    assert.ok(!fallbackPrefix.includes('�'));
    assert.ok(Buffer.byteLength(fallbackName, 'utf8') <= 63);
  });

  it('distinguishes fallback namespaces with the same visible app head and distinct scopes', () => {
    const appHead = 'same-readable';
    const first = getDatabaseTestPrefix(
      `${appHead}-worktree-one-that-overflows`,
      'isolate-isolateTest',
    );
    const second = getDatabaseTestPrefix(
      `${appHead}-worktree-two-that-overflows`,
      'isolate-isolateTest',
    );
    const third = getDatabaseTestPrefix(
      `${appHead}-worktree-one-that-overflows`,
      'isolate-isolatePeerTest',
    );

    assert.notEqual(first, second);
    assert.notEqual(first, third);
    assert.match(first, /-i-[\w-]{10}-$/);
  });
});
