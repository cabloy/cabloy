import cluster from 'node:cluster';

import type { BootstrapOptions } from '../../types/interface/bootstrap.ts';

import { createApp, createAppMaster } from './createApp.ts';
import { handleProcessMaster } from './processMaster.ts';
import { handleProcessWork } from './processWorker.ts';

export async function startCluster(workers: number, bootstrapOptions: BootstrapOptions) {
  if (cluster.isPrimary) {
    handleProcessMaster(workers);
    createAppMaster(bootstrapOptions);
  } else {
    await startWorker(bootstrapOptions);
  }
}

export async function startWorker(bootstrapOptions: BootstrapOptions) {
  handleProcessWork();
  return await createApp(bootstrapOptions);
}
