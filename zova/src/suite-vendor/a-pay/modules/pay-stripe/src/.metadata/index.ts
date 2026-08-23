// eslint-disable
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil } from 'zova';
import { Scope } from 'zova-module-a-bean';

@Scope()
export class ScopeModulePayStripe extends BeanScopeBase {}

export interface ScopeModulePayStripe {
  util: BeanScopeUtil;
}

import 'zova';
declare module 'zova' {
  export interface IBeanScopeRecord {
    'pay-stripe': ScopeModulePayStripe;
  }






}

/** scope: end */
