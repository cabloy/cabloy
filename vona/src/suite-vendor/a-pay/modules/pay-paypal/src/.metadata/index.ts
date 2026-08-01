// eslint-disable
/** service: begin */
export * from '../service/payPaypal.ts';

import 'vona-module-a-bean';
declare module 'vona-module-a-bean' {
  
    export interface IServiceRecord {
      'pay-paypal:payPaypal': never;
    }

  
}
declare module 'vona-module-pay-paypal' {
  
        export interface ServicePayPaypal {
          /** @internal */
          get scope(): ScopeModulePayPaypal;
        }

          export interface ServicePayPaypal {
            get $beanFullName(): 'pay-paypal.service.payPaypal';
            get $onionName(): 'pay-paypal:payPaypal';
            
          } 
}
/** service: end */
/** service: begin */
import type { ServicePayPaypal } from '../service/payPaypal.ts';
export interface IModuleService {
  'payPaypal': ServicePayPaypal;
}
/** service: end */
/** service: begin */

import 'vona';
declare module 'vona' {
  export interface IBeanRecordGeneral {
    'pay-paypal.service.payPaypal': ServicePayPaypal;
  }
}
/** service: end */
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
service: IModuleService;
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
