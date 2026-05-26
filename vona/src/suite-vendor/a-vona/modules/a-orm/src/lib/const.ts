import type { VonaApplication } from 'vona';

import type { IModelRecord } from '../types/onion/model.ts';
import type { TypeModelClassLikeGeneral } from '../types/relations.ts';

export const SymbolCacheModelsClear = Symbol('SymbolCacheModelsClearAll');
export const SymbolCacheModelCacheInstances = Symbol('SymbolCacheModelCacheInstances');

export function clearAllCacheModelsClear(app: VonaApplication) {
  delete app.meta[SymbolCacheModelsClear];
}

export async function clearCacheModelCacheInstance(app: VonaApplication, beanFullName: string) {
  const cacheModelCacheInstances = getCacheModelCacheInstances(app);
  const instances = cacheModelCacheInstances[beanFullName];
  if (!instances) return;
  delete cacheModelCacheInstances[beanFullName];
  for (const cacheName in instances) {
    await app.bean._removeBean(instances[cacheName]);
  }
}

export function getCacheModelCacheInstances(app: VonaApplication) {
  if (!app.meta[SymbolCacheModelCacheInstances]) app.meta[SymbolCacheModelCacheInstances] = {};
  return app.meta[SymbolCacheModelCacheInstances];
}

export function getCacheModelsClear(
  app: VonaApplication,
): Record<keyof IModelRecord, TypeModelClassLikeGeneral[]> {
  if (!app.meta[SymbolCacheModelsClear]) {
    app.meta[SymbolCacheModelsClear] = _collectModelsClear(app);
  }
  return app.meta[SymbolCacheModelsClear];
}

function _collectModelsClear(app: VonaApplication) {
  const modelsClearAll: Record<keyof IModelRecord, TypeModelClassLikeGeneral[]> = {} as any;
  const onionSlices = app.bean.onion.model.getOnionsEnabledCached();
  for (const onionSlice of onionSlices) {
    const modelName = onionSlice.name;
    if (!modelsClearAll[modelName]) modelsClearAll[modelName] = [];
    //
    const modelsClear = onionSlice.beanOptions.options?.cache?.modelsClear;
    if (modelsClear) {
      const modelsClear2 = Array.isArray(modelsClear) ? modelsClear : [modelsClear];
      modelsClearAll[modelName].push(...modelsClear2);
    }
    //
    const modelsClearedBy = onionSlice.beanOptions.options?.cache?.modelsClearedBy;
    if (modelsClearedBy) {
      const modelsClearedBy2 = Array.isArray(modelsClearedBy) ? modelsClearedBy : [modelsClearedBy];
      for (const modelName2 of modelsClearedBy2) {
        if (!modelsClearAll[modelName2]) modelsClearAll[modelName2] = [];
        modelsClearAll[modelName2].push(modelName);
      }
    }
  }
  return modelsClearAll;
}
