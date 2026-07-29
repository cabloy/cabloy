// eslint-disable
/** bean: begin */
export * from '../bean/bean.payProviderMock.ts';

import 'vona';
declare module 'vona' {
  
  
}
declare module 'vona-module-pay-mock' {
  
        export interface BeanPayProviderMock {
          /** @internal */
          get scope(): ScopeModulePayMock;
        } 
}
/** bean: end */
/** bean: begin */
import type { BeanPayProviderMock } from '../bean/bean.payProviderMock.ts';
import 'vona';
declare module 'vona' {
  export interface IBeanRecordGlobal {
    'payProviderMock': BeanPayProviderMock;
  }
}
/** bean: end */
/** service: begin */
export * from '../service/payMock.ts';

import 'vona-module-a-bean';
declare module 'vona-module-a-bean' {
  
    export interface IServiceRecord {
      'pay-mock:payMock': never;
    }

  
}
declare module 'vona-module-pay-mock' {
  
        export interface ServicePayMock {
          /** @internal */
          get scope(): ScopeModulePayMock;
        }

          export interface ServicePayMock {
            get $beanFullName(): 'pay-mock.service.payMock';
            get $onionName(): 'pay-mock:payMock';
            
          } 
}
/** service: end */
/** service: begin */
import type { ServicePayMock } from '../service/payMock.ts';
export interface IModuleService {
  'payMock': ServicePayMock;
}
/** service: end */
/** service: begin */

import 'vona';
declare module 'vona' {
  export interface IBeanRecordGeneral {
    'pay-mock.service.payMock': ServicePayMock;
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
export class ScopeModulePayMock extends BeanScopeBase {}

export interface ScopeModulePayMock {
  util: BeanScopeUtil;
config: TypeModuleConfig<typeof config>;
service: IModuleService;
}

import 'vona';
declare module 'vona' {
  export interface IBeanScopeRecord {
    'pay-mock': ScopeModulePayMock;
  }

  export interface IBeanScopeContainer {
    payMock: ScopeModulePayMock;
  }
  
  export interface IBeanScopeConfig {
    'pay-mock': ReturnType<typeof config>;
  }

  

  
}
/** scope: end */
