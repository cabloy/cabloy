import type { VonaApplication } from 'vona';

export function config(_app: VonaApplication) {
  return {
    passwordHash: {
      saltlen: 64,
      iterations: 10000,
      keylen: 64,
      digest: 'sha1',
    },
  };
}
