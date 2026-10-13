import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
  clearExactRedisPrefix,
  dropExactCleanupDatabase,
  escapeRedisCleanupPattern,
  quoteCleanupDatabase,
} from './testCleanupAdapters.ts';

const validate = (value: string) => {
  if (!value.startsWith('owned:')) throw new Error('foreign');
};
function redis(keys: string[], error?: Error) {
  const deleted: string[][] = [];
  const fallback: string[][] = [];
  const patterns: string[] = [];
  let closed = false;
  return {
    deleted,
    fallback,
    patterns,
    get closed() {
      return closed;
    },
    connection: {
      async scan(
        _cursor: string,
        _match: 'MATCH',
        pattern: string,
        _count: 'COUNT',
        _size: number,
      ): Promise<[string, string[]]> {
        patterns.push(pattern);
        return ['0', keys];
      },
      async unlink(...batch: string[]) {
        if (error) throw error;
        deleted.push(batch);
      },
      async del(...batch: string[]) {
        fallback.push(batch);
      },
      disconnect() {
        closed = true;
      },
    },
  };
}

test('database cleanup quotes exact identifiers, has bounded PG locks, and always closes', async () => {
  assert.equal(quoteCleanupDatabase('a"b', 'pg'), '"a""b"');
  assert.equal(quoteCleanupDatabase('a`b', 'mysql2'), '`a``b`');
  assert.throws(() => quoteCleanupDatabase('x', 'unsupported'));
  const statements: string[] = [];
  let closed = false;
  await dropExactCleanupDatabase(
    {
      async raw(sql) {
        statements.push(sql);
      },
      async destroy() {
        closed = true;
      },
    },
    'pg',
    'owned:exact',
    validate,
  );
  assert.equal(statements.at(-1), 'DROP DATABASE IF EXISTS "owned:exact"');
  assert.equal(statements.length, 3);
  assert.ok(closed);
  assert.ok(statements.every(sql => !/FORCE|terminate|LIKE|pg_database/i.test(sql)));
  await assert.rejects(
    dropExactCleanupDatabase(
      {
        async raw() {
          throw new Error('in use');
        },
        async destroy() {
          closed = true;
        },
      },
      'mysql2',
      'owned:exact',
      validate,
    ),
    /in use/,
  );
});

test('Redis scans escaped literal prefixes, deletes bounded batches and leaves development sentinel', async () => {
  const sentinel = 'dev:important';
  const fake = redis(['owned:[x]:1', 'owned:[x]:2', 'owned:[x]:3']);
  await clearExactRedisPrefix(fake.connection, 'owned:[x]:', validate, { batchSize: 2 });
  assert.equal(escapeRedisCleanupPattern('a*?[x]\\'), 'a\\*\\?\\[x\\]\\\\');
  assert.deepEqual(
    fake.deleted.map(batch => batch.length),
    [2, 1],
  );
  assert.deepEqual(fake.patterns, ['owned:\\[x\\]:*']);
  assert.ok(!fake.deleted.flat().includes(sentinel));
  assert.ok(fake.closed);
});

test('Redis rejects a foreign key before deleting any batch', async () => {
  const fake = redis(['owned:1', 'development:sentinel']);
  await assert.rejects(
    clearExactRedisPrefix(fake.connection, 'owned:', validate, { batchSize: 1 }),
    /foreign key/,
  );
  assert.deepEqual(fake.deleted, []);
  assert.ok(fake.closed);
});

test('Redis only falls back for missing UNLINK, never ACL or network errors', async () => {
  const old = redis(
    ['owned:1'],
    new Error("ERR unknown command 'UNLINK', with args beginning with:"),
  );
  await clearExactRedisPrefix(old.connection, 'owned:', validate);
  assert.deepEqual(old.fallback, [['owned:1']]);
  for (const message of ['NOPERM UNLINK denied', 'connection reset', 'ERR unrelated error']) {
    const fake = redis(['owned:1'], new Error(message));
    await assert.rejects(clearExactRedisPrefix(fake.connection, 'owned:', validate));
    assert.deepEqual(fake.fallback, []);
    assert.ok(fake.closed);
  }
});

test('Redis scan loops have a finite bound', async () => {
  let closed = false;
  const connection = {
    async scan(): Promise<[string, string[]]> {
      return ['1', []];
    },
    async unlink() {},
    async del() {},
    disconnect() {
      closed = true;
    },
  };
  await assert.rejects(
    clearExactRedisPrefix(connection, 'owned:', validate, { maxScans: 2 }),
    /limit exceeded/,
  );
  assert.ok(closed);
});
