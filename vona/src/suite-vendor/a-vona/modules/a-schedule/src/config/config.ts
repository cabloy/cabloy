import type * as Bull from 'bullmq';
import type { VonaApplication } from 'vona';

export function config(_app: VonaApplication) {
  return {
    schedule: {
      templateOptions: {} as Bull.JobSchedulerTemplateOptions,
    },
  };
}
