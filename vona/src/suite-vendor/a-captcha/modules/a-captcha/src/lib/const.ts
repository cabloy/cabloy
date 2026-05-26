import type { VonaApplication } from 'vona';

export const SymbolCacheSceneProviders = Symbol('SymbolCacheSceneProviders');

export function clearAllCacheSceneProviders(app: VonaApplication) {
  delete app.meta[SymbolCacheSceneProviders];
}
