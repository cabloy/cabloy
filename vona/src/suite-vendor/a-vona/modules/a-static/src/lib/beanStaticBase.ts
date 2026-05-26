import { BeanBase, SymbolModuleBelong } from 'vona';

export class BeanStaticBase<TypeStaticGetPath> extends BeanBase {
  get(path: TypeStaticGetPath): string {
    return this.app.util.combineStaticPath(path as string, this[SymbolModuleBelong]);
  }

  getURL(path: TypeStaticGetPath): string {
    const path2 = this.get(path);
    return this.app.util.getAbsoluteUrl(path2);
  }
}
