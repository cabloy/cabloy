// eslint-disable
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil } from 'vona';
import { Scope } from 'vona-module-a-bean';

@Scope()
export class ScopeModuleLocaleTest extends BeanScopeBase {}

export interface ScopeModuleLocaleTest {
  util: BeanScopeUtil;
}

import 'vona';
declare module 'vona' {
  export interface IBeanScopeRecord {
    'locale-test': ScopeModuleLocaleTest;
  }

  export interface IBeanScopeContainer {
    localeTest: ScopeModuleLocaleTest;
  }






}
/** scope: end */
