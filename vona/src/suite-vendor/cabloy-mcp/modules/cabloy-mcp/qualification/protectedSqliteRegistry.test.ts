import type { TestContext } from 'node:test';

import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { describe, it } from 'node:test';
import { createRequestBoundary, runWithRequestBoundary } from 'vona';

import type { ProtectedSqliteRegistry } from '../../../../../suite-vendor/a-vona/modules/a-ormdialect/src/lib/protectedSqliteRegistry.ts';

import {
  createProtectedSqliteRegistry,
  createProtectedSqliteRegistryForTest,
  PROTECTED_SQLITE_REGISTRY_SQL,
} from '../../../../../suite-vendor/a-vona/modules/a-ormdialect/src/lib/protectedSqliteRegistry.ts';
import {
  closeOwnedRegistries,
  controlledProfile,
  createProtectedSqliteFixture,
  poison,
  projection,
  proof,
} from '../test/support/protectedSqliteRegistryFixture.ts';

function withBoundary<T>(continuation: () => T): T {
  return runWithRequestBoundary(createRequestBoundary(), continuation);
}
function prepare(registry: ProtectedSqliteRegistry) {
  assert.deepEqual(registry.prepare(), { outcome: 'ready' });
}
function lookup(registry: ProtectedSqliteRegistry, name = 'alpha', deadline?: number) {
  return withBoundary(() => registry.lookup(name, deadline));
}
async function fixtureCase(
  t: TestContext,
  work: (fixture: Awaited<ReturnType<typeof createProtectedSqliteFixture>>) => void | Promise<void>,
) {
  const fixture = await createProtectedSqliteFixture();
  try {
    await work(fixture);
  } finally {
    await fixture.close();
  }
  assert.deepEqual(fixture.snapshot(), { setupClosed: true, closed: true, openHandles: 0 });
  proof(t, 'real-cleanup', { closed: true, openHandles: 0 });
}
const caseOptions = { timeout: 15_000 };

// Real SQLite probes and controlled lifecycle faults are separate proof classes.
// No global diagnostic/configuration patches or additional application are used.
describe(
  'protected native SQLite registry profile',
  { concurrency: false, timeout: 120_000 },
  () => {
    it(
      '1 refuses unsupported options without evaluating getters or opening files',
      caseOptions,
      async t => {
        const getter = poison();
        let opened = 0;
        let getterReads = 0;
        const getterOptions = Object.defineProperty({}, 'filename', {
          get() {
            getterReads++;
            throw getter.error;
          },
        });
        const candidates: unknown[] = [
          null,
          [],
          {},
          { filename: ':memory:' },
          { filename: '' },
          { filename: 'relative.db' },
          { filename: 'file:/registry.db' },
          { filename: path.resolve('bad\0.db') },
          { filename: path.resolve('bad\uD800.db') },
          {
            filename: path.resolve('ok.db'),
            verbose: () => {
              throw getter.error;
            },
          },
          getterOptions,
          Object.create({ filename: path.resolve('inherited.db') }),
          { filename: path.resolve('ok.db'), [Symbol('unsupported')]: true },
        ];
        for (const options of candidates) {
          const registry = createProtectedSqliteRegistryForTest(options, {
            open() {
              opened++;
              throw getter.error;
            },
          });
          try {
            assert.deepEqual(registry.prepare(), { outcome: 'unsupported' });
            assert.equal(registry.snapshot().state, 'faulted');
          } finally {
            assert.deepEqual(await registry.close(), { outcome: 'closed' });
          }
        }
        assert.equal(opened, 0);
        assert.equal(getterReads, 0);
        assert.equal(getter.reads(), 0);
        await fixtureCase(t, async fixture => {
          const filename = path.join(fixture.directory, 'absent.db');
          const registry = createProtectedSqliteRegistry({ filename });
          try {
            assert.deepEqual(registry.prepare(), { outcome: 'unavailable' });
            assert.equal(existsSync(filename), false);
          } finally {
            assert.deepEqual(await registry.close(), { outcome: 'closed' });
          }
        });
        proof(t, 'unsupported', {
          refused: candidates.length,
          opens: opened,
          poisonReads: getter.reads(),
        });
      },
    );

    it(
      '2 provisions explicitly outside boundaries and never opens on first lookup',
      caseOptions,
      async t => {
        const local = controlledProfile();
        try {
          assert.deepEqual(local.registry.snapshot(), {
            state: 'new',
            active: false,
            closing: false,
          });
          local.boundary(true);
          assert.deepEqual(local.registry.prepare(), { outcome: 'boundary_required' });
          assert.equal(local.registry.lookup('alpha').outcome, 'unavailable');
          assert.equal(local.counts.opens, 0);
          local.boundary(false);
          prepare(local.registry);
          assert.deepEqual(local.registry.prepare(), { outcome: 'already_prepared' });
          assert.equal(local.registry.lookup('alpha').outcome, 'boundary_required');
          local.boundary(true);
          assert.equal(local.registry.lookup('alpha').outcome, 'found');
          assert.deepEqual(local.counts, {
            opens: 1,
            inspections: 2,
            prepares: 1,
            reads: 1,
            closes: 0,
          });
          assert.equal(Object.isFrozen(local.registry), true);
          assert.equal(Object.isFrozen(local.registry.snapshot()), true);
        } finally {
          await local.registry.close();
        }
        await fixtureCase(t, async fixture => {
          const registry = fixture.createRegistry();
          assert.deepEqual(
            withBoundary(() => registry.prepare()),
            { outcome: 'boundary_required' },
          );
          prepare(registry);
          assert.equal(registry.lookup('alpha').outcome, 'boundary_required');
          assert.equal(lookup(registry).outcome, 'found');
        });
        proof(t, 'explicit-lifecycle', local.counts);
      },
    );

    it(
      '3 uses fixed bound SQL and exact binary names with UTF-8 admission',
      caseOptions,
      async t => {
        const local = controlledProfile();
        try {
          prepare(local.registry);
          local.boundary(true);
          assert.equal(local.sql(), PROTECTED_SQLITE_REGISTRY_SQL);
          assert.match(local.sql(), /name COLLATE BINARY = \?/);
          assert.match(local.sql(), /deleted = 0\s+LIMIT 2$/);
          assert.equal((local.sql().match(/\?/g) ?? []).length, 1);
          local.registry.lookup("' OR 1=1 --");
          assert.deepEqual(local.bindings, ["' OR 1=1 --"]);
          const before = local.counts.reads;
          for (const invalid of [null, 1, {}, '\uD800', 'x'.repeat(257), '界'.repeat(86)]) {
            assert.equal(local.registry.lookup(invalid as string).outcome, 'invalid_input');
          }
          assert.equal(local.counts.reads, before);
        } finally {
          await local.registry.close();
        }
        await fixtureCase(t, fixture => {
          fixture.insert(4, '', 0, 0, null, 0);
          const name = `${'界'.repeat(85)}x`;
          fixture.insert(5, name, 0, 0, null, 0);
          fixture.insert(6, 'name\0tail', 0, 0, null, 0);
          const registry = fixture.createRegistry();
          prepare(registry);
          assert.equal(lookup(registry, '').outcome, 'found');
          assert.equal(lookup(registry, name).outcome, 'found');
          assert.equal(lookup(registry, 'ALPHA').outcome, 'missing');
          assert.equal(lookup(registry, 'alpha ').outcome, 'missing');
          assert.equal(lookup(registry, 'name\0tail').outcome, 'found');
        });
        proof(t, 'fixed-sql', { reads: local.counts.reads, maxNameBytes: 256 });
      },
    );

    it(
      '4 classifies zero one and two rows without hiding malformed duplicates',
      caseOptions,
      async t => {
        await fixtureCase(t, fixture => {
          const registry = fixture.createRegistry();
          prepare(registry);
          for (const [name, outcome] of [
            ['missing', 'missing'],
            ['deleted', 'missing'],
            ['disabled', 'disabled'],
            ['alpha', 'found'],
          ] as const) {
            assert.equal(lookup(registry, name).outcome, outcome);
          }
          const result = lookup(registry);
          assert.equal(result.outcome, 'found');
          if (result.outcome === 'found') {
            assert.deepEqual(result.row, {
              id: 1,
              name: 'alpha',
              disabled: false,
              isolate: true,
              config: '{"ok":true}',
            });
            assert.equal(Object.isFrozen(result), true);
            assert.equal(Object.isFrozen(result.row), true);
            assert.equal('__protected_valid' in result.row, false);
          }
          fixture.insert('invalid', 'alpha', 9, 2, Buffer.from([1]), 0);
          assert.equal(lookup(registry).outcome, 'duplicate');
          assert.equal(registry.snapshot().state, 'ready');
          fixture.insert(7, 'alpha', 0, 0, null, 0);
          assert.equal(lookup(registry).outcome, 'duplicate');
        });
        proof(t, 'row-cardinality', { duplicateDenied: true, deletedExcluded: true });
      },
    );

    it(
      '5 preserves invalid SQL markers and rejects malformed bounded projections',
      caseOptions,
      async t => {
        await fixtureCase(t, async fixture => {
          const config = `${'界'.repeat(21845)}x`;
          fixture.insert(4, 'null-config', 0, 0, null, 0);
          fixture.insert(5, 'empty-config', 0, 0, '', 0);
          fixture.insert(6, 'limit-config', 0, 0, config, 0);
          const healthy = fixture.createRegistry();
          prepare(healthy);
          for (const [name, expected] of [
            ['null-config', null],
            ['empty-config', ''],
            ['limit-config', config],
          ] as const) {
            const result = lookup(healthy, name);
            assert.equal(result.outcome, 'found');
            if (result.outcome === 'found') assert.equal(result.row.config === expected, true);
          }
          assert.equal((await healthy.close()).outcome, 'closed');
          const invalidRows = [
            [0, 0, 0, null],
            [-1, 0, 0, null],
            [9007199254740992, 0, 0, null],
            [1.5, 0, 0, null],
            ['1', 0, 0, null],
            [Buffer.from([1]), 0, 0, null],
            [10, '0', 0, null],
            [11, 2, 0, null],
            [12, 0, -1, null],
            [13, 0, '1', null],
            [14, 0, 0, Buffer.from([1])],
            [15, 0, 0, 5],
            [16, 0, 0, 'x'.repeat(65537)],
          ];
          for (const [index, [id, disabled, isolate, value]] of invalidRows.entries()) {
            const name = `invalid-${index}`;
            fixture.insert(id, name, disabled, isolate, value, 0);
            const registry = fixture.createRegistry();
            prepare(registry);
            assert.equal(lookup(registry, name).outcome, 'unavailable');
            assert.equal(registry.snapshot().state, 'faulted');
            assert.equal((await registry.close()).outcome, 'closed');
          }
        });
        for (const row of [
          projection({ name: Buffer.from([1]) }),
          projection({ name: 'x'.repeat(257) }),
          projection({ __protected_valid: 0, config: null }),
          projection({ disabled: true }),
          projection({ isolate: null }),
        ]) {
          const local = controlledProfile();
          try {
            prepare(local.registry);
            local.boundary(true);
            local.execute(() => [row]);
            assert.equal(local.registry.lookup('alpha').outcome, 'unavailable');
            assert.equal(local.registry.snapshot().state, 'faulted');
          } finally {
            await local.registry.close();
          }
        }
        proof(t, 'projection-guards', { malformedRows: 18, maxConfigBytes: 65536 });
      },
    );

    it(
      '6 observes committed changes without mutating previous detached results',
      caseOptions,
      async t => {
        await fixtureCase(t, fixture => {
          const registry = fixture.createRegistry();
          prepare(registry);
          const first = lookup(registry);
          fixture.withWriter(db => {
            db.prepare('UPDATE aInstance SET config = ? WHERE id = 1').run('{"changed":true}');
          });
          const second = lookup(registry);
          assert.equal(first.outcome, 'found');
          assert.equal(second.outcome, 'found');
          if (first.outcome === 'found' && second.outcome === 'found') {
            assert.equal(first.row.config === '{"ok":true}', true);
            assert.equal(second.row.config === '{"changed":true}', true);
            assert.notEqual(first.row, second.row);
          }
          fixture.withWriter(db => {
            db.prepare('UPDATE aInstance SET disabled = 1 WHERE id = 1').run();
          });
          assert.equal(lookup(registry).outcome, 'disabled');
        });
        proof(t, 'committed-change', { detached: true, cacheAbsent: true });
      },
    );

    it('7 never inspects poison errors across native failure boundaries', caseOptions, async t => {
      let checked = 0;
      for (const fail of ['open', 'inspect', 'prepare', 'probe', 'read', 'close'] as const) {
        const local = controlledProfile({ fail });
        try {
          if (fail === 'read' || fail === 'close') {
            prepare(local.registry);
            local.boundary(true);
            assert.equal(
              local.registry.lookup('alpha').outcome,
              fail === 'read' ? 'unavailable' : 'found',
            );
          } else {
            assert.deepEqual(local.registry.prepare(), { outcome: 'unavailable' });
          }
        } finally {
          const disposition = await local.registry.close();
          assert.equal(disposition.outcome, fail === 'close' ? 'close_failed' : 'closed');
        }
        assert.equal(local.thrown.reads(), 0);
        assert.equal(local.counts.opens, 1);
        assert.equal(Object.hasOwn(local.nativeOptions() as object, 'verbose'), false);
        checked++;
      }
      const ordinary = poison();
      assert.throws(() => {
        void ordinary.error.message;
      });
      assert.equal(ordinary.reads(), 1);
      proof(t, 'controlled-poison', { boundaries: checked, protectedReads: 0, ordinaryReads: 1 });
    });

    it(
      '8 quarantines query projection and preparation faults without retry',
      caseOptions,
      async t => {
        for (const rows of [
          null,
          [projection({ __protected_valid: 0 })],
          [projection(), projection(), projection()],
        ]) {
          const local = controlledProfile();
          try {
            prepare(local.registry);
            local.boundary(true);
            local.execute(() => rows as unknown as readonly unknown[]);
            assert.equal(local.registry.lookup('alpha').outcome, 'unavailable');
            assert.equal(local.registry.lookup('alpha').outcome, 'unavailable');
            assert.equal(local.counts.reads, 1);
            assert.equal(local.counts.opens, 1);
            assert.equal(local.registry.snapshot().state, 'faulted');
          } finally {
            await local.registry.close();
          }
        }
        for (const fail of ['prepare', 'read'] as const) {
          const local = controlledProfile({ fail });
          try {
            if (fail === 'prepare') {
              assert.equal(local.registry.prepare().outcome, 'unavailable');
            } else {
              prepare(local.registry);
              local.boundary(true);
              assert.equal(local.registry.lookup('alpha').outcome, 'unavailable');
            }
            assert.equal(local.counts.closes, 0);
            local.boundary(false);
            assert.equal(local.registry.prepare().outcome, 'already_prepared');
            local.boundary(true);
            assert.equal(local.registry.lookup('alpha').outcome, 'unavailable');
            assert.equal(local.counts.opens, 1);
          } finally {
            await local.registry.close();
          }
          assert.equal(local.counts.closes, 1);
        }
        proof(t, 'controlled-quarantine', { faultClasses: 5, retryAbsent: true });
      },
    );

    it(
      '9 refuses preexpired late and reentrant reads without cancellation claims',
      caseOptions,
      async t => {
        const local = controlledProfile();
        try {
          prepare(local.registry);
          local.boundary(true);
          for (const deadline of [0, -1, Number.NaN, Infinity])
            assert.equal(local.registry.lookup('alpha', deadline).outcome, 'expired');
          assert.equal(local.counts.reads, 0);
          local.execute(() => {
            local.clock(1000);
            return [projection()];
          });
          assert.equal(local.registry.lookup('alpha', 1000).outcome, 'expired');
          assert.equal(local.registry.snapshot().active, false);
          local.execute(() => {
            assert.equal(local.registry.snapshot().active, true);
            assert.equal(local.registry.lookup('alpha', 2000).outcome, 'reentrant');
            return [projection()];
          });
          assert.equal(local.registry.lookup('alpha', 2000).outcome, 'found');
          assert.equal(local.counts.reads, 2);
          let closing: ReturnType<ProtectedSqliteRegistry['close']> | undefined;
          local.execute(() => {
            closing = local.registry.close();
            assert.equal(local.registry.close(), closing);
            assert.equal(local.registry.snapshot().active, true);
            assert.equal(local.registry.snapshot().closing, true);
            assert.equal(local.counts.closes, 0);
            assert.equal(local.registry.lookup('alpha', 2000).outcome, 'unavailable');
            return [projection()];
          });
          assert.notEqual(local.registry.lookup('alpha', 2000).outcome, 'found');
          assert.deepEqual(await closing, { outcome: 'closed' });
          assert.equal(local.counts.closes, 1);
        } finally {
          await local.registry.close();
        }
        proof(t, 'controlled-deadline', {
          nativeCalls: local.counts.reads,
          cancellationClaim: false,
          reentryDenied: true,
        });
      },
    );

    it(
      '10 verifies real readonly no-create WAL and timeout without conversion',
      caseOptions,
      async t => {
        await fixtureCase(t, async fixture => {
          const registry = fixture.createRegistry();
          prepare(registry);
          assert.equal(fixture.observations.readonly, true);
          assert.equal(fixture.observations.writeRefused, true);
          assert.equal(fixture.observations.timeout, true);
          assert.equal(fixture.observations.wal, true);
          assert.equal((await registry.close()).outcome, 'closed');
          const production = createProtectedSqliteRegistry({ filename: fixture.filename });
          try {
            prepare(production);
            assert.equal(lookup(production).outcome, 'found');
          } finally {
            assert.equal((await production.close()).outcome, 'closed');
          }
          fixture.withWriter(db => {
            assert.equal(db.readonly, false);
            db.prepare('UPDATE aInstance SET config = NULL WHERE id = 1').run();
          });
        });
        const nonWal = await createProtectedSqliteFixture('delete');
        try {
          assert.equal(nonWal.createRegistry().prepare().outcome, 'unavailable');
          nonWal.withWriter(db => {
            assert.equal(db.pragma('journal_mode', { simple: true }), 'delete');
          });
        } finally {
          await nonWal.close();
        }
        for (const settings of [{ journal: 'delete' }, { timeout: 101 }]) {
          const local = controlledProfile(settings);
          try {
            assert.equal(local.registry.prepare().outcome, 'unavailable');
            assert.equal(local.counts.prepares, 0);
          } finally {
            await local.registry.close();
          }
        }
        proof(t, 'real-private-profile', {
          readonly: true,
          noCreate: true,
          walInspected: true,
          timeoutMs: 100,
        });
      },
    );

    it(
      '11 closes once and forbids prepare after close including native close failure',
      caseOptions,
      async t => {
        const unopened = controlledProfile();
        const first = unopened.registry.close();
        assert.equal(first, unopened.registry.close());
        assert.equal((await first).outcome, 'closed');
        assert.equal(unopened.registry.prepare().outcome, 'unavailable');
        assert.equal(unopened.counts.opens, 0);
        const failed = controlledProfile({ fail: 'close' });
        prepare(failed.registry);
        const failedClose = failed.registry.close();
        assert.equal(failedClose, failed.registry.close());
        assert.equal((await failedClose).outcome, 'close_failed');
        assert.deepEqual(failed.registry.snapshot(), {
          state: 'faulted',
          active: false,
          closing: true,
        });
        assert.equal(failed.registry.prepare().outcome, 'unavailable');
        failed.boundary(true);
        assert.equal(failed.registry.lookup('alpha').outcome, 'unavailable');
        assert.equal(failed.counts.closes, 1);
        assert.equal(failed.thrown.reads(), 0);
        await fixtureCase(t, async fixture => {
          const registry = fixture.createRegistry();
          prepare(registry);
          const closing = registry.close();
          assert.equal(closing, registry.close());
          assert.equal((await closing).outcome, 'closed');
          assert.equal(lookup(registry).outcome, 'unavailable');
          assert.equal(registry.prepare().outcome, 'unavailable');
          assert.equal(fixture.observations.nativeCloses(), 1);
        });
        proof(t, 'close-disposition', {
          unopenedOpens: 0,
          controlledFailedCloses: 1,
          fakeSuccess: false,
        });
      },
    );

    it(
      '12 retains uncertain cleanup and closes healthy handles before exact removal',
      caseOptions,
      async t => {
        const order: number[] = [];
        const owners = [1, 2, 3].map(
          id =>
            ({
              close: async () => {
                order.push(id);
                return { outcome: id === 2 ? 'close_failed' : 'closed' };
              },
            }) as unknown as ProtectedSqliteRegistry,
        );
        let removed = false;
        await assert.rejects(async () => {
          await closeOwnedRegistries(owners);
          removed = true;
        });
        assert.deepEqual(order, [3, 2, 1]);
        assert.equal(removed, false);
        await fixtureCase(t, fixture => {
          const registry = fixture.createRegistry();
          prepare(registry);
          assert.equal(lookup(registry).outcome, 'found');
          assert.equal(fixture.snapshot().openHandles, 1);
        });
        proof(t, 'cleanup-custody', {
          reverseOrder: true,
          uncertainRetained: true,
          actualNativeFailureInjected: false,
        });
      },
    );
  },
);
