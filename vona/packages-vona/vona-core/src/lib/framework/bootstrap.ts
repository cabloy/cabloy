import type { BootstrapOptions } from '../../types/interface/bootstrap.ts';
import type { VonaApplication } from '../core/application.ts';

import { prepareEnv } from '../utils/util.ts';
import { startCluster, startWorker } from './cluster.ts';

export async function bootstrap(
  bootstrapOptions: BootstrapOptions,
): Promise<VonaApplication | undefined> {
  const env = prepareEnv(bootstrapOptions.env);
  const workers = Number.parseInt(env.SERVER_WORKERS!);
  const alwaysCluster = process.env.META_MODE === 'dev' || process.platform.startsWith('win');
  if (workers > 1 || alwaysCluster) {
    await startCluster(workers, bootstrapOptions);
  } else {
    return await startWorker(bootstrapOptions);
  }
}
