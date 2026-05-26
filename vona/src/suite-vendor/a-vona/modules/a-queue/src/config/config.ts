import type * as Bull from 'bullmq';
import type { VonaApplication } from 'vona';

export function config(_app: VonaApplication) {
  return {
    worker: {
      lockDuration: 30 * 1000,
      maxStalledCount: 1000,
      stalledInterval: 10 * 1000,
    } as Bull.WorkerOptions,
  };
}
