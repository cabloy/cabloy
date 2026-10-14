import assert from 'node:assert/strict';
import { hostname } from 'node:os';
import { test } from 'node:test';

import {
  inspectTestProcess,
  isTestClaimInactive,
  parseTestProcesses,
  waitForTestProcessGroupExit,
} from './testClaimProcesses.ts';

test('parses POSIX start identities and complete command arguments', () => {
  const [process] = parseTestProcesses(
    '  123  123 S Tue Oct 13 00:06:04 2026 /bin/node /path with spaces/test.ts\n',
  );
  assert.equal(process.pid, 123);
  assert.equal(process.pgid, 123);
  assert.equal(process.startTime, 'Tue Oct 13 00:06:04 2026');
  assert.equal(process.args, '/bin/node /path with spaces/test.ts');
  assert.throws(() => parseTestProcesses('unknown output'), /Cannot parse/);
});

test('inactivity fails closed for active, reused, pending and uninspectable processes', async () => {
  const owner = { pid: 100, startTime: 'owner-start', host: hostname() };
  const registered = {
    id: 'browser',
    role: 'browser',
    stage: 'registered' as const,
    pid: 200,
    pgid: 200,
    startTime: 'browser-start',
    host: hostname(),
    profilePath: '/owned/tmp/browser',
  };
  const claim = { owner, processes: [registered] };
  const snapshot = (pid: number, pgid: number, args = 'node', startTime = 'reused-start') => ({
    pid,
    pgid,
    args,
    startTime,
    host: hostname(),
    state: 'S',
  });
  assert.equal((await isTestClaimInactive(claim, false, async () => [])).inactive, true);
  for (const processes of [
    [snapshot(100, 100)],
    [snapshot(200, 300)],
    [snapshot(201, 200)],
    [snapshot(202, 202, 'browser --profile /owned/tmp/browser')],
  ]) {
    assert.equal((await isTestClaimInactive(claim, false, async () => processes)).inactive, false);
  }
  assert.equal(
    (
      await isTestClaimInactive(
        { owner, processes: [{ id: 'pending', role: 'browser', stage: 'pending' }] },
        false,
        async () => [],
      )
    ).inactive,
    false,
  );
  assert.equal(
    (
      await isTestClaimInactive(
        { ...claim, owner: { ...owner, host: 'different-host' } },
        false,
        async () => [],
      )
    ).inactive,
    false,
  );
  await assert.rejects(
    isTestClaimInactive(claim, false, async () => {
      throw new Error('inspection failed');
    }),
    /inspection failed/,
  );
  const current = { ...owner, pid: process.pid };
  const currentSnapshot = snapshot(process.pid, process.pid, 'node', owner.startTime);
  assert.equal(
    (
      await isTestClaimInactive({ owner: current, processes: [] }, true, async () => [
        currentSnapshot,
      ])
    ).inactive,
    true,
  );
  assert.equal(
    (
      await isTestClaimInactive({ owner: current, processes: [] }, false, async () => [
        currentSnapshot,
      ])
    ).inactive,
    false,
  );
});

test('identifies the current process without publishing environment values', async () => {
  const identity = await inspectTestProcess(process.pid);
  assert.equal(identity.pid, process.pid);
  assert.ok(identity.pgid > 0);
  assert.ok(identity.startTime);
  assert.ok(identity.host);
  await assert.rejects(waitForTestProcessGroupExit(identity.pgid, 0), /did not drain/);
});
