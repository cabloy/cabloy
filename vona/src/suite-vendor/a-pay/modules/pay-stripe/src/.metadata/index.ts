// eslint-disable
/** payProvider: begin */
export * from '../bean/payProvider.stripe.ts';
import type { IPayProviderOptionsStripe } from '../bean/payProvider.stripe.ts';
import 'vona-module-a-pay';
declare module 'vona-module-a-pay' {
  
    export interface IPayProviderRecord {
      'pay-stripe:stripe': IPayProviderOptionsStripe;
    }

  
}
declare module 'vona-module-pay-stripe' {
  
        export interface PayProviderStripe {
          /** @internal */
          get scope(): ScopeModulePayStripe;
        }

          export interface PayProviderStripe {
            get $beanFullName(): 'pay-stripe.payProvider.stripe';
            get $onionName(): 'pay-stripe:stripe';
            get $onionOptions(): IPayProviderOptionsStripe;
          } 
}
/** payProvider: end */
/** payProvider: begin */
import type { PayProviderStripe } from '../bean/payProvider.stripe.ts';
export interface IModulePayProvider {
  'stripe': PayProviderStripe;
}
/** payProvider: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil } from 'vona';
import { Scope } from 'vona-module-a-bean';

@Scope()
export class ScopeModulePayStripe extends BeanScopeBase {}

export interface ScopeModulePayStripe {
  util: BeanScopeUtil;
payProvider: IModulePayProvider;
}

import 'vona';
declare module 'vona' {
  export interface IBeanScopeRecord {
    'pay-stripe': ScopeModulePayStripe;
  }

  export interface IBeanScopeContainer {
    payStripe: ScopeModulePayStripe;
  }
  
  

  

  
}
/** scope: end */
