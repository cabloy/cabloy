// eslint-disable
/** payProvider: begin */
export * from '../bean/payProvider.paypal.ts';
import type { IPayProviderOptionsPaypal } from '../bean/payProvider.paypal.ts';
import 'vona-module-a-pay';
declare module 'vona-module-a-pay' {
  
    export interface IPayProviderRecord {
      'pay-paypal:paypal': IPayProviderOptionsPaypal;
    }

  
}
declare module 'vona-module-pay-paypal' {
  
        export interface PayProviderPaypal {
          /** @internal */
          get scope(): ScopeModulePayPaypal;
        }

          export interface PayProviderPaypal {
            get $beanFullName(): 'pay-paypal.payProvider.paypal';
            get $onionName(): 'pay-paypal:paypal';
            get $onionOptions(): IPayProviderOptionsPaypal;
          } 
}
/** payProvider: end */
/** payProvider: begin */
import type { PayProviderPaypal } from '../bean/payProvider.paypal.ts';
export interface IModulePayProvider {
  'paypal': PayProviderPaypal;
}
/** payProvider: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil } from 'vona';
import { Scope } from 'vona-module-a-bean';

@Scope()
export class ScopeModulePayPaypal extends BeanScopeBase {}

export interface ScopeModulePayPaypal {
  util: BeanScopeUtil;
payProvider: IModulePayProvider;
}

import 'vona';
declare module 'vona' {
  export interface IBeanScopeRecord {
    'pay-paypal': ScopeModulePayPaypal;
  }

  export interface IBeanScopeContainer {
    payPaypal: ScopeModulePayPaypal;
  }
  
  

  

  
}
/** scope: end */
