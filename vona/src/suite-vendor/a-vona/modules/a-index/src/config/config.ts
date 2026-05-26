import type { VonaApplication } from 'vona';

import type { MetaOptionsIndexModuleIndexes } from '../types/indexes.ts';

export type ConfigModulesIndexes = Record<string, MetaOptionsIndexModuleIndexes>;
export function config(_app: VonaApplication) {
  return {
    indexes: {} as ConfigModulesIndexes,
    indexesCheck: true,
  };
}
