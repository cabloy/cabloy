// eslint-disable
/** bean: begin */
export * from '../bean/bean.payProviderPaypal.ts';

import 'vona';
declare module 'vona' {
  
  
}
declare module 'vona-module-pay-paypal' {
  
        export interface BeanPayProviderPaypal {
          /** @internal */
          get scope(): ScopeModulePayPaypal;
        } 
}
/** bean: end */
/** bean: begin */
import type { BeanPayProviderPaypal } from '../bean/bean.payProviderPaypal.ts';
import 'vona';
declare module 'vona' {
  export interface IBeanRecordGlobal {
    'payProviderPaypal': BeanPayProviderPaypal;
  }
}
/** bean: end */
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
/** config: begin */
export * from '../config/config.ts';
import type { config } from '../config/config.ts';
/** config: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil, type TypeModuleConfig } from 'vona';
import { Scope } from 'vona-module-a-bean';

@Scope()
export class ScopeModulePayPaypal extends BeanScopeBase {}

export interface ScopeModulePayPaypal {
  util: BeanScopeUtil;
config: TypeModuleConfig<typeof config>;
service: IModuleService;
}

import 'vona';
declare module 'vona' {
  export interface IBeanScopeRecord {
    'pay-paypal': ScopeModulePayPaypal;
  }

  export interface IBeanScopeContainer {
    payPaypal: ScopeModulePayPaypal;
  }
  
  export interface IBeanScopeConfig {
    'pay-paypal': ReturnType<typeof config>;
  }

  

  
}
/** scope: end */
