import type { VonaApplication } from 'vona';

export function config(_app: VonaApplication) {
  return {
    change: {
      debounce: 200,
    },
  };
}
