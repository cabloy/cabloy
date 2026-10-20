import type { TestContext } from 'node:test';

import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { mkdtemp, rm } from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';
import { assertTestRunOwner, getRuntimePathPhysicalRoot, resolveVonaLocalPaths } from 'vona';
import { app } from 'vona-mock';

import type { ProtectedSqliteRegistry } from '../../../../../../suite-vendor/a-vona/modules/a-ormdialect/src/lib/protectedSqliteRegistry.ts';

import { createProtectedSqliteRegistryForTest } from '../../../../../../suite-vendor/a-vona/modules/a-ormdialect/src/lib/protectedSqliteRegistry.ts';
import { boundedProof } from './boundedProof.ts';

const require = createRequire(import.meta.url);
const Database = require('better-sqlite3') as new (
  filename: string,
  options?: object,
) => DatabaseHandle;

interface DatabaseHandle {
  readonly readonly: boolean;
  readonly open: boolean;
  pragma(sql: string, options?: object): unknown;
  exec(sql: string): void;
  prepare(sql: string): {
    run(...values: unknown[]): unknown;
    all(...values: unknown[]): readonly unknown[];
  };
  close(): void;
}

type Dependencies = Parameters<typeof createProtectedSqliteRegistryForTest>[1];
const insertSql =
  'INSERT INTO aInstance (id, name, disabled, isolate, config, deleted) VALUES (?, ?, ?, ?, ?, ?)';

export function poison() {
  let reads = 0;
  const error = Object.create(null);
  for (const key of [
    'name',
    'message',
    'stack',
    'cause',
    'code',
    'toString',
    'toJSON',
    Symbol.toPrimitive,
  ]) {
    Object.defineProperty(error, key, {
      get() {
        reads++;
        throw new Error('owned poison access');
      },
    });
  }
  return { error, reads: () => reads };
}

export function controlledProfile(
  options: {
    readonly fail?: 'open' | 'inspect' | 'prepare' | 'probe' | 'read' | 'close';
    readonly journal?: unknown;
    readonly timeout?: unknown;
  } = {},
) {
  const thrown = poison();
  const counts = { opens: 0, inspections: 0, prepares: 0, reads: 0, closes: 0 };
  let boundary = false;
  let clock = 0;
  let execute: () => readonly unknown[] = () => [projection()];
  let statementCalls = 0;
  let sql = '';
  const bindings: string[] = [];
  let nativeOptions: unknown;
  const registry = createProtectedSqliteRegistryForTest(
    { filename: path.resolve('controlled.db') },
    {
      now: () => clock,
      hasRequestBoundary: () => boundary,
      open: (_filename, supplied) => {
        counts.opens++;
        nativeOptions = supplied;
        if (options.fail === 'open') throw thrown.error;
        return {
          pragma(query) {
            counts.inspections++;
            if (options.fail === 'inspect') throw thrown.error;
            return query === 'journal_mode' ? (options.journal ?? 'wal') : (options.timeout ?? 100);
          },
          prepare(query) {
            counts.prepares++;
            sql = query;
            if (options.fail === 'prepare') throw thrown.error;
            return {
              all(name) {
                statementCalls++;
                if (statementCalls === 1) {
                  assert.equal(name, '');
                  if (options.fail === 'probe') throw thrown.error;
                  return [];
                }
                counts.reads++;
                bindings.push(name);
                if (options.fail === 'read') throw thrown.error;
                return execute();
              },
            };
          },
          close() {
            counts.closes++;
            if (options.fail === 'close') throw thrown.error;
          },
        };
      },
    },
  );
  return {
    registry,
    counts,
    thrown,
    bindings,
    sql: () => sql,
    nativeOptions: () => nativeOptions,
    boundary: (value: boolean) => {
      boundary = value;
    },
    clock: (value: number) => {
      clock = value;
    },
    execute: (value: () => readonly unknown[]) => {
      execute = value;
    },
  };
}

export function projection(overrides: Record<string, unknown> = {}) {
  return {
    id: 1,
    name: 'alpha',
    disabled: 0,
    isolate: 1,
    config: null,
    __protected_valid: 1,
    ...overrides,
  };
}

export async function closeOwnedRegistries(registries: readonly ProtectedSqliteRegistry[]) {
  let failed = false;
  for (let index = registries.length - 1; index >= 0; index--) {
    const result = await registries[index].close();
    if (result.outcome !== 'closed') failed = true;
  }
  assert.equal(failed, false, 'private close uncertain; retain owned directory');
}

export async function createProtectedSqliteFixture(journal: 'wal' | 'delete' = 'wal') {
  await app.bean.executor.mockCtx(async () => {
    assert.equal(app.meta.env.META_MODE, 'test');
    assert.equal(app.meta.env.SERVER_LISTEN_DISABLE, 'true');
    assert.equal(app.server, undefined);
    const runId = app.meta.env.VONA_TEST_RUN_ID;
    assert.ok(runId);
    const paths = resolveVonaLocalPaths(app.projectPath, 'test', runId);
    assert.equal(getRuntimePathPhysicalRoot(app), paths.runtimeRoot);
    assertTestRunOwner(paths.dataRoot, runId);
  });
  const directory = await mkdtemp(path.join(getRuntimePathPhysicalRoot(app), 'protected-sqlite-'));
  const filename = path.join(directory, 'registry.db');
  const handles: DatabaseHandle[] = [];
  const registries: ProtectedSqliteRegistry[] = [];
  let setupClosed = false;
  let closed = false;
  let nativeCloses = 0;
  const setup = new Database(filename, { timeout: 100 });
  handles.push(setup);
  try {
    setup.pragma(`journal_mode = ${journal}`);
    setup.exec(
      'CREATE TABLE aInstance (id, name TEXT COLLATE NOCASE, disabled, isolate, config, deleted)',
    );
    const insert = setup.prepare(insertSql);
    insert.run(1n, 'alpha', 0n, 1n, '{"ok":true}', 0n);
    insert.run(2n, 'disabled', 1n, 0n, null, 0n);
    insert.run(3n, 'deleted', 0n, 0n, null, 1n);
  } finally {
    setup.close();
    setupClosed = !setup.open;
  }
  function withWriter<T>(work: (database: DatabaseHandle) => T): T {
    assert.equal(closed, false);
    const writer = new Database(filename, { fileMustExist: true, timeout: 100 });
    handles.push(writer);
    try {
      return work(writer);
    } finally {
      writer.close();
    }
  }
  const observations = {
    readonly: false,
    writeRefused: false,
    timeout: false,
    wal: false,
    nativeCloses: () => nativeCloses,
  };
  const createRegistry = (
    overrides: Partial<Pick<Dependencies, 'now' | 'hasRequestBoundary'>> = {},
  ) => {
    assert.equal(closed, false);
    const registry = createProtectedSqliteRegistryForTest(
      { filename },
      {
        ...overrides,
        open(file, options) {
          assert.equal(setupClosed, true);
          assert.deepEqual(options, { readonly: true, fileMustExist: true, timeout: 100 });
          const database = new Database(file, options);
          handles.push(database);
          observations.readonly = database.readonly;
          observations.timeout = database.pragma('busy_timeout', { simple: true }) === 100;
          observations.wal = database.pragma('journal_mode', { simple: true }) === 'wal';
          try {
            database.exec('INSERT INTO aInstance (id) VALUES (99)');
          } catch {
            observations.writeRefused = true;
          }
          return {
            pragma: (query, settings) => database.pragma(query, settings),
            prepare: query => database.prepare(query),
            close() {
              nativeCloses++;
              database.close();
            },
          };
        },
      },
    );
    registries.push(registry);
    return registry;
  };
  return {
    filename,
    directory,
    createRegistry,
    withWriter,
    observations,
    insert: (...values: unknown[]) =>
      withWriter(db => {
        // Without column affinity, native number bindings remain REAL; BigInt binds INTEGER.
        db.prepare(insertSql).run(
          ...values.map(value =>
            typeof value === 'number' && Number.isSafeInteger(value) ? BigInt(value) : value,
          ),
        );
      }),
    async close() {
      if (closed) return;
      await closeOwnedRegistries(registries);
      assert.equal(
        handles.every(handle => !handle.open),
        true,
        'retain fixture with open native handle',
      );
      await rm(directory, { recursive: true, force: false });
      assert.equal(existsSync(directory), false);
      closed = true;
    },
    snapshot: () => ({
      setupClosed,
      closed,
      openHandles: handles.filter(handle => handle.open).length,
    }),
  };
}

const serializeProof = boundedProof();
export function proof(t: TestContext, alias: string, counts: Record<string, number | boolean>) {
  assert.match(alias, /^[a-z0-9-]{1,64}$/);
  for (const value of Object.values(counts)) {
    assert.equal(
      typeof value === 'boolean' || (typeof value === 'number' && Number.isFinite(value)),
      true,
    );
  }
  t.diagnostic(
    serializeProof(sequence => ({
      proofClass: 'bounded-qualification',
      alias,
      sequence,
      ...counts,
    })),
  );
}
