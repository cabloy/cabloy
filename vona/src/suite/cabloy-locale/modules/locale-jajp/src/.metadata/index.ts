// eslint-disable
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil } from 'vona';
import { Scope } from 'vona-module-a-bean';

@Scope()
export class ScopeModuleLocaleJajp extends BeanScopeBase {}

export interface ScopeModuleLocaleJajp {
  util: BeanScopeUtil;
}

import 'vona';
declare module 'vona' {
  export interface IBeanScopeRecord {
    'locale-jajp': ScopeModuleLocaleJajp;
  }

  export interface IBeanScopeContainer {
    localeJajp: ScopeModuleLocaleJajp;
  }






}
/** scope: end */
