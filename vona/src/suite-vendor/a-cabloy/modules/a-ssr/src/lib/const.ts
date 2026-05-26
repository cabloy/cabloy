import type { VonaApplication } from 'vona';

export const SymbolCacheSites = Symbol('SymbolCacheSites');
export const SymbolCacheMenus = Symbol('SymbolCacheMenus');

export function clearAllCacheSites(app: VonaApplication) {
  delete app.meta[SymbolCacheSites];
}

export function clearAllCacheMenus(app: VonaApplication) {
  delete app.meta[SymbolCacheMenus];
}
