// eslint-disable
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil } from 'zova';
import { Scope } from 'zova-module-a-bean';

@Scope()
export class ScopeModuleLocaleTest extends BeanScopeBase {}

export interface ScopeModuleLocaleTest {
  util: BeanScopeUtil;
}

import 'zova';
declare module 'zova' {
  export interface IBeanScopeRecord {
    'locale-test': ScopeModuleLocaleTest;
  }






}

/** scope: end */
