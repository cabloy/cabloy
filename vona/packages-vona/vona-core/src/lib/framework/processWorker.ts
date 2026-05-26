import { catchError, catchErrorSync } from '@cabloy/utils';

import { closeApp, useApp } from './useApp.ts';

let __closing = false;

async function _closeInner() {
  const timeout = setTimeout(() => {
    // eslint-disable-next-line no-console
    console.log('Cleanup timed out. Forcing termination...');
    process.exit(1);
  }, 5000);
  const [_, err] = await catchError(() => {
    return closeApp();
  });
  if (err) {
    console.error(err);
  }
  clearTimeout(timeout);
  process.exit(err ? 1 : 0);
}

export function handleProcessWork() {
  ['SIGINT', 'SIGUSR2'].forEach(signal => {
    process.on(signal, async () => {
      if (__closing) return;
      __closing = true;
      await _closeInner();
    });
  });
  process.on('uncaughtException', async err => {
    const app = useApp();
    if (!app) {
      console.error(err);
      process.exit(1);
    } else {
      const [logger] = catchErrorSync(() => {
        return app.meta.logger.get();
      });
      if (logger) {
        logger.error(err);
      } else {
        console.error(err);
      }
      if (!app.meta.appStarted) {
        await app.meta.logger.dispose();
        process.exit(1);
      }
    }
  });
}
