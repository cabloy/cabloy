// eslint-disable
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil } from 'vona';
import { Scope } from 'vona-module-a-bean';

@Scope()
export class ScopeModuleLocaleZhtw extends BeanScopeBase {}

export interface ScopeModuleLocaleZhtw {
  util: BeanScopeUtil;
}

import 'vona';
declare module 'vona' {
  export interface IBeanScopeRecord {
    'locale-zhtw': ScopeModuleLocaleZhtw;
  }

  export interface IBeanScopeContainer {
    localeZhtw: ScopeModuleLocaleZhtw;
  }






}
/** scope: end */
