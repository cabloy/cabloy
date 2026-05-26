import type { VonaApplication } from 'vona';

import type { ConfigMail } from '../types/config.ts';

export function config(_app: VonaApplication) {
  return {} as ConfigMail;
}
