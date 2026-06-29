import type { VonaApplication } from 'vona';

export function config(_app: VonaApplication) {
  return {
    image: {
      defaultVariant: 'original',
      upload: {
        maxSize: 2 * 1024 * 1024,
        mimeTypes: ['image/png', 'image/jpeg', 'image/webp'],
      },
    },
  };
}
