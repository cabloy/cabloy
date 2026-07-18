import { spawn } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT_DIR = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const child = spawn('npm', ['run', 'dev:one'], {
  cwd: ROOT_DIR,
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
  process.exitCode = 1;
});

child.on('exit', code => {
  process.exitCode = code ?? 1;
});
