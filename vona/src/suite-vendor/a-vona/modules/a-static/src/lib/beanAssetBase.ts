import { BeanBase, SymbolModuleBelong } from 'vona';

export class BeanAssetBase<IAssetGetPath> extends BeanBase {
  get<K extends keyof IAssetGetPath, V extends IAssetGetPath[K]>(scene: K, assetPath: V): string {
    return this.app.util.getAssetPathPhysical(
      this[SymbolModuleBelong],
      scene as any,
      assetPath as any,
    );
  }
}
