import type { VonaApplication } from 'vona';

import type { IFileProviderRecord } from '../types/fileProvider.ts';

export function config(_app: VonaApplication) {
  return {
    file: {
      defaultProvider: 'file-native:native' as keyof IFileProviderRecord,
      defaultClientName: 'default',
      public: false,
      upload: {
        maxSize: 20 * 1024 * 1024,
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
