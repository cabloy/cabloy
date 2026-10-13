import type { ChildProcess } from 'node:child_process';

import { spawn } from 'node:child_process';

import type { TestProcessIdentity } from './testClaimProcesses.ts';

import { sendTestClaimEvent } from '../vona/packages-vona/vona-core/src/lib/core/testClaim.ts';

interface StartMessage {
  type: 'start';
  command: string;
  args: string[];
  cwd: string;
  env: NodeJS.ProcessEnv;
  processId?: string;
  identity?: TestProcessIdentity;
}

if (process.platform === 'win32' || !process.send) {
  throw new Error('Isolated test guardian requires a POSIX process group and parent IPC');
}

let child: ChildProcess | undefined;
let stopping = false;
let finishing = false;
let finished = false;
let failed = false;
let childResult: { code: number | null; signal: NodeJS.Signals | null } | undefined;
let forceTimer: NodeJS.Timeout | undefined;
let launch: StartMessage | undefined;

async function groupMembers(): Promise<number[]> {
  const output = await new Promise<string>((resolvePromise, reject) => {
    const inspector = spawn('ps', ['-A', '-o', 'pid=', '-o', 'pgid=', '-o', 'state='], {
      detached: true,
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    let stdout = '';
    let stderr = '';
    inspector.stdout?.on('data', data => {
      stdout += data;
    });
    inspector.stderr?.on('data', data => {
      stderr += data;
    });
    inspector.once('error', reject);
    inspector.once('close', code => {
      if (code === 0) resolvePromise(stdout);
      else reject(new Error(`Cannot inspect isolated process group: ${stderr}`));
    });
  });
  return output
    .split('\n')
    .map(line => line.trim().split(/\s+/))
    .filter(
      ([pid, pgid, state]) =>
        pid &&
        pgid &&
        state &&
        Number(pgid) === process.pid &&
        Number(pid) !== process.pid &&
        !state.startsWith('Z'),
    )
    .map(([pid]) => Number(pid));
}

function requestStop() {
  if (stopping || finished) return;
  stopping = true;
  forceTimer = setTimeout(() => {
    // The guardian remains its own group leader while issuing the last resort signal.
    process.kill(-process.pid, 'SIGKILL');
  }, 12_000);
  try {
    process.kill(-process.pid, 'SIGINT');
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ESRCH') throw error;
  }
  if (!child) void drain();
}

async function drain() {
  if (finishing || finished) return;
  finishing = true;
  try {
    let deadline = Date.now() + (stopping ? 10_000 : 1_000);
    while ((await groupMembers()).length > 0) {
      if (Date.now() >= deadline) {
        if (stopping) {
          throw new Error('Isolated process group did not drain after shutdown');
        }
        requestStop();
        deadline = Date.now() + 10_000;
      }
      await new Promise(resolvePromise => setTimeout(resolvePromise, 100));
    }
    if (forceTimer) clearTimeout(forceTimer);
    if (launch?.processId && launch.identity) {
      try {
        await sendTestClaimEvent(launch.env, {
          type: 'process',
          process: {
            id: launch.processId,
            role: 'guardian',
            stage: 'drained',
            pid: launch.identity.pid,
            pgid: launch.identity.pgid,
            startTime: launch.identity.startTime,
            host: launch.identity.host,
          },
        });
      } catch {
        failed = true;
      }
    }
    finished = true;
    process.send?.({ type: 'drained', result: childResult, failed }, error => {
      if (error) process.exit(1);
      else process.exit(0);
    });
  } catch (error) {
    console.error(error);
    requestStop();
  }
}

function start(message: StartMessage) {
  if (child || stopping) return;
  launch = message;
  try {
    child = spawn(message.command, message.args, {
      cwd: message.cwd,
      env: message.env,
      stdio: 'inherit',
      detached: false,
    });
    child.once('error', error => {
      failed = true;
      console.error(error);
    });
    child.once('close', (code, signal) => {
      childResult = { code, signal };
      void drain();
    });
    if (stopping) child.kill('SIGINT');
    process.send?.({ type: 'started' });
  } catch (error) {
    console.error(error);
    failed = true;
    childResult = { code: 1, signal: null };
    void drain();
  }
}

process.on('SIGINT', requestStop);
process.on('SIGTERM', requestStop);
process.on('disconnect', requestStop);
process.on('message', message => {
  if (!message || typeof message !== 'object') return;
  if ('type' in message && message.type === 'stop') requestStop();
  if ('type' in message && message.type === 'start') start(message as StartMessage);
});
process.send?.({ type: 'ready' });
