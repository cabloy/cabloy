// eslint-disable
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil } from 'zova';
import { Scope } from 'zova-module-a-bean';

@Scope()
export class ScopeModulePayPaypal extends BeanScopeBase {}

export interface ScopeModulePayPaypal {
  util: BeanScopeUtil;
}

import 'zova';
declare module 'zova' {
  export interface IBeanScopeRecord {
    'pay-paypal': ScopeModulePayPaypal;
  }
  
  

  

  
}

/** scope: end */
