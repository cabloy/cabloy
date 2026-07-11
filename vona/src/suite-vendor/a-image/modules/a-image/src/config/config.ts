import type { VonaApplication } from 'vona';

import type { IImageProviderRecord } from '../types/imageProvider.ts';

export function config(_app: VonaApplication) {
  return {
    image: {
      defaultVariant: 'original',
      defaultProvider: 'image-native:native' as keyof IImageProviderRecord,
      defaultClientName: 'default',
      public: true,
      upload: {
        maxSize: 2 * 1024 * 1024,
        mimeTypes: ['image/png', 'image/jpeg', 'image/webp'],
      },
      directUpload: {
        draftExpiresIn: 30 * 60 * 1000,
      },
      delivery: {
        audienceExpiresIn: 8 * 60 * 60,
      },
    },
  };
}
