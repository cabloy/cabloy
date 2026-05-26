import type { VonaApplication } from 'vona';

export const SymbolCacheMemories = Symbol('SymbolCacheMemories');

export function clearAllCacheMemories(app: VonaApplication) {
  delete app[SymbolCacheMemories];
}

export function getCacheMemories(app: VonaApplication) {
  if (!app[SymbolCacheMemories]) app[SymbolCacheMemories] = {};
  return app[SymbolCacheMemories];
}
