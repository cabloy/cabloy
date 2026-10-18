import { execFile } from 'node:child_process';
import { hostname } from 'node:os';
import { promisify } from 'node:util';

import {
  inspectWindowsProcess,
  inspectWindowsProcesses,
} from '../vona/packages-vona/vona-core/src/lib/core/testProcessWindowsNative.ts';

const execFileAsync = promisify(execFile);

export interface TestProcessIdentity {
  pid: number;
  pgid?: number;
  startTime: string;
  host: string;
}

export interface TestProcessSnapshot extends TestProcessIdentity {
  state: string;
  args: string;
}

export function parseTestProcesses(output: string): TestProcessSnapshot[] {
  const processes: TestProcessSnapshot[] = [];
  for (const line of output.split('\n')) {
    if (!line.trim()) continue;
    const match =
      /^\s*(\d+)\s+(\d+)\s+(\S+)\s+(\S+\s+\S+\s+\d+\s+\d{2}:\d{2}:\d{2}\s+\d{4})\s+(.*)$/.exec(
        line,
      );
    if (!match) throw new Error('Cannot parse isolated test process inspection');
    processes.push({
      pid: Number(match[1]),
      pgid: Number(match[2]),
      state: match[3],
      startTime: match[4].replace(/\s+/g, ' '),
      host: hostname(),
      args: match[5],
    });
  }
  return processes;
}

export async function inspectTestProcesses(): Promise<TestProcessSnapshot[]> {
  if (process.platform === 'win32') {
    throw new Error('Windows process inspection requires explicit owned PIDs');
  }
  const { stdout } = await execFileAsync(
    'ps',
    ['-A', '-o', 'pid=', '-o', 'pgid=', '-o', 'state=', '-o', 'lstart=', '-o', 'args='],
    { env: { ...process.env, LC_ALL: 'C' }, timeout: 5000, maxBuffer: 16 * 1024 * 1024 },
  );
  return parseTestProcesses(stdout);
}

export async function inspectTestProcess(pid: number): Promise<TestProcessSnapshot> {
  if (process.platform === 'win32') {
    const item = await inspectWindowsProcess(pid);
    if (!item) throw new Error('Cannot identify isolated test process');
    return item;
  }
  const item = (await inspectTestProcesses()).find(
    item => item.pid === pid && !item.state.startsWith('Z'),
  );
  if (!item) throw new Error('Cannot identify isolated test process');
  return item;
}

export interface TestClaimProcessRecord {
  id: string;
  role: string;
  stage: 'pending' | 'registered' | 'drained';
  pid?: number;
  pgid?: number;
  containment?: 'windows-job';
  jobId?: string;
  startTime?: string;
  host?: string;
  profilePath?: string;
}

export async function isTestClaimInactive(
  claim: {
    owner: { pid: number; startTime: string; host?: string };
    processes: TestClaimProcessRecord[];
  },
  allowCurrentOwner = false,
  inspect?: () => Promise<TestProcessSnapshot[]>,
): Promise<{ inactive: boolean; reason?: string }> {
  if (claim.owner.host !== hostname()) {
    return { inactive: false, reason: 'claim belongs to another or unidentified host' };
  }
  if (
    !inspect &&
    process.platform === 'win32' &&
    claim.processes.some(item => item.containment !== 'windows-job')
  ) {
    return { inactive: false, reason: 'POSIX process ownership cannot be inspected on Windows' };
  }
  const snapshots = inspect
    ? await inspect()
    : process.platform === 'win32'
      ? await inspectWindowsProcesses([
          claim.owner.pid,
          ...claim.processes.flatMap(item => (item.pid ? [item.pid] : [])),
        ])
      : await inspectTestProcesses();
  const processes = snapshots.filter(item => !item.state.startsWith('Z'));
  const owner = processes.find(item => item.pid === claim.owner.pid);
  if (
    owner &&
    !(allowCurrentOwner && owner.pid === process.pid && owner.startTime === claim.owner.startTime)
  ) {
    return { inactive: false, reason: 'claim owner PID is still present' };
  }
  for (const registered of claim.processes) {
    if (registered.stage === 'pending') {
      return { inactive: false, reason: 'process launch registration is incomplete' };
    }
    if (!registered.pid || !registered.startTime || registered.host !== hostname()) {
      return {
        inactive: false,
        reason: 'process identity is incomplete or belongs to another host',
      };
    }
    if (registered.containment === 'windows-job') {
      if (!registered.jobId || registered.pgid !== undefined || registered.stage !== 'drained') {
        return { inactive: false, reason: 'Windows job drainage is unproven' };
      }
      if (processes.some(item => item.pid === registered.pid)) {
        return { inactive: false, reason: 'registered Windows job owner is still present' };
      }
      continue;
    }
    if (!registered.pgid || registered.jobId !== undefined) {
      return { inactive: false, reason: 'POSIX process group identity is incomplete' };
    }
    if (processes.some(item => item.pid === registered.pid || item.pgid === registered.pgid)) {
      return { inactive: false, reason: 'registered process or group is still present' };
    }
    if (
      registered.profilePath &&
      processes.some(item => item.args.includes(registered.profilePath!))
    ) {
      return { inactive: false, reason: 'browser profile remains in use' };
    }
  }
  return { inactive: true };
}

export async function waitForTestProcessGroupExit(pgid: number, timeoutMs = 10_000) {
  if (process.platform === 'win32')
    throw new Error('POSIX browser process groups are unsupported on Windows');
  if (!Number.isSafeInteger(pgid) || pgid <= 0) throw new Error('Invalid isolated process group');
  const deadline = Date.now() + timeoutMs;
  while (true) {
    const live = (await inspectTestProcesses()).some(
      item => item.pgid === pgid && !item.state.startsWith('Z'),
    );
    if (!live) return;
    if (Date.now() >= deadline) throw new Error('Isolated browser process group did not drain');
    await new Promise(resolvePromise => setTimeout(resolvePromise, 100));
  }
}
