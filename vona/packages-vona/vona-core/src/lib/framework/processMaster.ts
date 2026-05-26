import chalk from 'chalk';
import cluster from 'node:cluster';

import { useApp } from './useApp.ts';

let __closing = false;
let __timeout;

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

  for (let i = 0; i < workers; i++) {
    cluster.fork();
  }

  cluster.on('message', (worker, message) => {
    if (message === 'reload-worker') {
      if (!__closing) {
        cluster.fork();
      }
      worker.process.kill('SIGTERM');
    }
  });

  cluster.on('exit', (_worker, _code, _signal) => {
    // console.log(`----------------- worker ${_worker.process.pid} died`, _code, _signal);
    if (cluster.workers && Object.keys(cluster.workers).length === 0) {
      clearTimeout(__timeout);
      // log
      const app = useApp();
      if (app.meta.env.LOGGER_DUMMY !== 'true') {
        const message = `Master shutdown gracefully: ${process.pid}`;
        // eslint-disable-next-line
        console.log(chalk.cyan(message));
      }
      // exit
      process.exit(0);
    }
  });
}
