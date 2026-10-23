// eslint-disable
/** meta: begin */
export * from '../bean/meta.themeHandler.ts';

import 'zova-module-a-meta';
declare module 'zova-module-a-meta' {

    export interface IMetaRecord {
      'devui-adapter:themeHandler': never;
    }


}
declare module 'zova-module-devui-adapter' {

        export interface MetaThemeHandler {
          /** @internal */
          get scope(): ScopeModuleDevuiAdapter;
        }

        export interface MetaThemeHandler {
          get $beanFullName(): 'devui-adapter.meta.themeHandler';
          get $onionName(): 'devui-adapter:themeHandler';

        }
}
/** meta: end */
/** meta: begin */
import type { MetaThemeHandler } from '../bean/meta.themeHandler.ts';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordLocal {
    'devui-adapter.meta.themeHandler': MetaThemeHandler;
  }
}
/** meta: end */
/** monkeySys: begin */
export * from '../monkeySys.ts';
/** monkeySys: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil } from 'zova';
import { Scope } from 'zova-module-a-bean';

@Scope()
export class ScopeModuleDevuiAdapter extends BeanScopeBase {}

export interface ScopeModuleDevuiAdapter {
  util: BeanScopeUtil;
}

import 'zova';
declare module 'zova' {
  export interface IBeanScopeRecord {
    'devui-adapter': ScopeModuleDevuiAdapter;
  }






}

/** scope: end */
