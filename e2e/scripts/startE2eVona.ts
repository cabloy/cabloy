import type { ChildProcess } from 'node:child_process';

import { spawn } from 'node:child_process';

import { E2E_ROOT_DIR } from './e2e.ts';

const environment = Object.fromEntries(
  Object.entries(process.env).filter((entry): entry is [string, string] => entry[1] !== undefined),
);
environment.PAY_MOCK_WEBHOOK_SECRET = 'pay-mock-e2e-secret';

const child: ChildProcess = spawn('npm', ['run', 'dev:one'], {
  cwd: E2E_ROOT_DIR,
  detached: process.platform !== 'win32',
  stdio: 'inherit',
  env: environment as NodeJS.ProcessEnv,
});

const gracefulShutdownTimeout = 7000;

let stopping = false;
let forced = false;
let shutdownTimer: NodeJS.Timeout | undefined;

function finish(code: number) {
  if (shutdownTimer) {
    clearTimeout(shutdownTimer);
    shutdownTimer = undefined;
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
  finish(1);
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
  finish(1);
});

child.on('exit', (code, signal) => {
  // Playwright waits for this wrapper to exit, not only for Vona's workers to stop.
  finish(code ?? (signal ? 1 : 0));
});
