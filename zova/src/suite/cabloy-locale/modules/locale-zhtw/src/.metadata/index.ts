// eslint-disable
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil } from 'zova';
import { Scope } from 'zova-module-a-bean';

@Scope()
export class ScopeModuleLocaleZhtw extends BeanScopeBase {}

export interface ScopeModuleLocaleZhtw {
  util: BeanScopeUtil;
}

import 'zova';
declare module 'zova' {
  export interface IBeanScopeRecord {
    'locale-zhtw': ScopeModuleLocaleZhtw;
  }






}

/** scope: end */
