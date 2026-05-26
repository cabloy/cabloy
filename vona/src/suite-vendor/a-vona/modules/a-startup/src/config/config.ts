import type { VonaApplication } from 'vona';

export function config(_app: VonaApplication) {
  return {
    startup: {
      debounce: 10 * 1000,
    },
  };
}
