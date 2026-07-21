import { spawn } from 'node:child_process';

import { E2E_ROOT_DIR } from './e2e.ts';

const child = spawn('npm', ['run', 'dev:one'], {
  cwd: E2E_ROOT_DIR,
  detached: process.platform !== 'win32',
  stdio: 'inherit',
});

let stopping = false;

function stop() {
  if (stopping) return;
  stopping = true;
  if (process.platform === 'win32') {
    child.kill('SIGINT');
  } else if (child.pid) {
    try {
      process.kill(-child.pid, 'SIGINT');
    } catch (error: any) {
      if (error.code !== 'ESRCH') throw error;
    }
  }
}

process.on('SIGINT', stop);
process.on('SIGTERM', stop);

child.on('error', error => {
  // eslint-disable-next-line
  console.error(error);
  process.exit(1);
});

child.on('exit', code => {
  // Playwright waits for this wrapper to exit, not only for Vona's workers to stop.
  process.exit(code ?? 1);
});
