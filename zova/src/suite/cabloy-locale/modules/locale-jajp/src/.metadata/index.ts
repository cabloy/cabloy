// eslint-disable
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil } from 'zova';
import { Scope } from 'zova-module-a-bean';

@Scope()
export class ScopeModuleLocaleJajp extends BeanScopeBase {}

export interface ScopeModuleLocaleJajp {
  util: BeanScopeUtil;
}

import 'zova';
declare module 'zova' {
  export interface IBeanScopeRecord {
    'locale-jajp': ScopeModuleLocaleJajp;
  }






}

/** scope: end */
