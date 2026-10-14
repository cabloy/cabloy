import type { Worker } from 'node:cluster';

import chalk from 'chalk';
import cluster from 'node:cluster';

import { useApp } from './useApp.ts';

let __closing = false;
let __failed = false;
let __timeout;
const __reloading = new WeakSet<Worker>();

async function _closeInner() {
  __timeout = setTimeout(() => {
    // eslint-disable-next-line no-console
    console.log('Cleanup timed out. Forcing termination...');
    process.exit(1);
  }, 5000);
}

export function handleProcessMaster(workers: number) {
  ['SIGINT', 'SIGUSR2'].forEach(signal => {
    process.on(signal, async () => {
      if (__closing) return;
      __closing = true;
      await _closeInner();
    });
  });

  cluster.on('message', (worker, message) => {
    if (message === 'reload-worker') {
      if (!__closing) {
        cluster.fork();
      }
      __reloading.add(worker);
      worker.process.kill('SIGTERM');
    }
  });

  cluster.on('exit', (_worker, _code, _signal) => {
    const expectedSignal =
      (__closing && ['SIGINT', 'SIGUSR2', 'SIGTERM'].includes(_signal)) ||
      (__reloading.has(_worker) && _signal === 'SIGTERM');
    __reloading.delete(_worker);
    if ((_code !== 0 || _signal) && !expectedSignal) {
      __failed = true;
    }
    if (cluster.workers && Object.keys(cluster.workers).length === 0) {
      clearTimeout(__timeout);
      // log
      const app = useApp();
      if (app.meta.env.LOGGER_DUMMY !== 'true') {
        const message = `Master shutdown ${__failed ? 'with worker failure' : 'gracefully'}: ${process.pid}`;
        // eslint-disable-next-line
        console.log(chalk.cyan(message));
      }
      // exit
      process.exit(__failed ? 1 : 0);
    }
  });

  for (let i = 0; i < workers; i++) {
    cluster.fork();
  }
}
