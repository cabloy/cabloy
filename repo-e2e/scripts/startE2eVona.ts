import type { ChildProcess } from 'node:child_process';

import { spawn } from 'node:child_process';
import { resolve } from 'node:path';

import { E2E_LOCAL_BASE_URL, E2E_ROOT_DIR } from './e2e.ts';

// Root isolated E2E owns the server directly. This wrapper remains for direct, legacy E2E.
if (process.env.VONA_TEST_RUN_ID) {
  throw new Error('Root isolated E2E starts its server through the root runner');
}
const child: ChildProcess = spawn(
  process.execPath,
  [
    './packages-cli/cli/src/bin/vona.ts',
    ':bin:dev',
    '--workers=1',
    '--flavor=normal',
    '--mode=test',
  ],
  {
    cwd: resolve(E2E_ROOT_DIR, 'vona'),
    detached: process.platform !== 'win32',
    stdio: 'inherit',
    env: {
      ...process.env,
      SERVER_SERVE_PROTOCOL: 'http',
      SERVER_SERVE_HOST: E2E_LOCAL_BASE_URL.replace(/^https?:\/\//, ''),
    },
  },
);

const gracefulShutdownTimeout = 7000;

let stopping = false;
let forced = false;
let shutdownTimer: NodeJS.Timeout | undefined;

async function waitForGroupExit(timeoutMs: number): Promise<boolean> {
  if (!child.pid || process.platform === 'win32') return true;
  const deadline = Date.now() + timeoutMs;
  while (true) {
    try {
      process.kill(-child.pid, 0);
    } catch (error: any) {
      if (error.code === 'ESRCH') return true;
      throw error;
    }
    if (Date.now() >= deadline) return false;
    await new Promise(resolve => setTimeout(resolve, 100));
  }
}

let finishing = false;
async function finish(code: number) {
  if (finishing) return;
  finishing = true;
  if (shutdownTimer) {
    clearTimeout(shutdownTimer);
    shutdownTimer = undefined;
  }
  if (child.pid && process.platform !== 'win32' && !(await waitForGroupExit(1000))) {
    signalChild('SIGINT');
    if (!(await waitForGroupExit(3500))) {
      signalChild('SIGKILL');
      if (!(await waitForGroupExit(1000))) {
        console.error(`E2E Vona process group is still active: ${child.pid}`);
        process.exit(1);
      }
    }
  }
  process.exit(code);
}

function signalChild(signal: NodeJS.Signals) {
  if (!child.pid) return;
  try {
    if (process.platform === 'win32') {
      child.kill(signal);
    } else {
      process.kill(-child.pid, signal);
    }
  } catch (error: any) {
    if (error.code !== 'ESRCH') {
      // eslint-disable-next-line
      console.error(error);
    }
  }
}

function forceStop() {
  if (forced) return;
  forced = true;
  // eslint-disable-next-line
  console.error(
    `E2E Vona process group did not stop within ${gracefulShutdownTimeout}ms; forcing termination: ${child.pid}`,
  );
  signalChild('SIGKILL');
  void finish(1);
}

function stop() {
  if (stopping) {
    forceStop();
    return;
  }
  stopping = true;
  // Vona handles SIGINT, not SIGTERM. Keep this deadline below Playwright's 10-second timeout.
  signalChild('SIGINT');
  shutdownTimer = setTimeout(forceStop, gracefulShutdownTimeout);
  shutdownTimer.unref();
}

process.on('SIGINT', stop);
process.on('SIGTERM', stop);

child.on('error', error => {
  // eslint-disable-next-line
  console.error(error);
  void finish(1);
});

child.on('close', (code, signal) => {
  // Playwright waits for this wrapper to exit, not only for Vona's workers to stop.
  void finish(code ?? (signal ? 1 : 0));
});
