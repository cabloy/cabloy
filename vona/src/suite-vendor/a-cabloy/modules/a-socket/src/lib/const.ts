import type { VonaApplication } from 'vona';

export const SymbolCacheSocketConnections = Symbol('SymbolCacheSocketConnections');
export const SymbolCacheSocketPackets = Symbol('SymbolCacheSocketPackets');

export function getCacheSocketConnections(app: VonaApplication) {
  if (!app.meta[SymbolCacheSocketConnections]) app.meta[SymbolCacheSocketConnections] = {};
  return app.meta[SymbolCacheSocketConnections];
}

export function clearAllCacheSocketConnections(app: VonaApplication) {
  delete app.meta[SymbolCacheSocketConnections];
}

export function getCacheSocketPackets(app: VonaApplication) {
  if (!app.meta[SymbolCacheSocketPackets]) app.meta[SymbolCacheSocketPackets] = {};
  return app.meta[SymbolCacheSocketPackets];
}

export function clearAllCacheSocketPackets(app: VonaApplication) {
  delete app.meta[SymbolCacheSocketPackets];
}
