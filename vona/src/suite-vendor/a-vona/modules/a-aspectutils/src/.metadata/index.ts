// eslint-disable
/** service: begin */
export * from '../service/aop.ts';
export * from '../service/filter.ts';

import 'vona-module-a-bean';
declare module 'vona-module-a-bean' {
  
    export interface IServiceRecord {
      'a-aspectutils:aop': never;
'a-aspectutils:filter': never;
    }

  
}
declare module 'vona-module-a-aspectutils' {
  
        export interface ServiceAop {
          /** @internal */
          get scope(): ScopeModuleAAspectutils;
        }

          export interface ServiceAop {
            get $beanFullName(): 'a-aspectutils.service.aop';
            get $onionName(): 'a-aspectutils:aop';
            
          }

        export interface ServiceFilter {
          /** @internal */
          get scope(): ScopeModuleAAspectutils;
        }

          export interface ServiceFilter {
            get $beanFullName(): 'a-aspectutils.service.filter';
            get $onionName(): 'a-aspectutils:filter';
            
          } 
}
/** service: end */
/** service: begin */
import type { ServiceAop } from '../service/aop.ts';
import type { ServiceFilter } from '../service/filter.ts';
export interface IModuleService {
  'aop': ServiceAop;
'filter': ServiceFilter;
}
/** service: end */
/** service: begin */

import 'vona';
declare module 'vona' {
  export interface IBeanRecordGeneral {
    'a-aspectutils.service.aop': ServiceAop;
'a-aspectutils.service.filter': ServiceFilter;
  }
}
/** service: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil } from 'vona';
import { Scope } from 'vona-module-a-bean';

@Scope()
export class ScopeModuleAAspectutils extends BeanScopeBase {}

export interface ScopeModuleAAspectutils {
  util: BeanScopeUtil;
service: IModuleService;
}

import 'vona';
declare module 'vona' {
  export interface IBeanScopeRecord {
    'a-aspectutils': ScopeModuleAAspectutils;
  }

  export interface IBeanScopeContainer {
    aspectutils: ScopeModuleAAspectutils;
  }
  
  

  

  
}
/** scope: end */
