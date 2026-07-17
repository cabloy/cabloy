// eslint-disable
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil } from 'zova';
import { Scope } from 'zova-module-a-bean';

@Scope()
export class ScopeModuleCommercePayment extends BeanScopeBase {}

export interface ScopeModuleCommercePayment {
  util: BeanScopeUtil;
}

import 'zova';
declare module 'zova' {
  export interface IBeanScopeRecord {
    'commerce-payment': ScopeModuleCommercePayment;
  }
  
  

  

  
}
  
/** scope: end */
