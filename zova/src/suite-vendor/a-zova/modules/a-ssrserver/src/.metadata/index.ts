// eslint-disable
/** service: begin */
export * from '../service/ssrHandler.js';

import 'zova-module-a-bean';
declare module 'zova-module-a-bean' {
  
    export interface IServiceRecord {
      'a-ssrserver:ssrHandler': never;
    }

  
}
declare module 'zova-module-a-ssrserver' {
  
        export interface ServiceSsrHandler {
          /** @internal */
          get scope(): ScopeModuleASsrserver;
        }

        export interface ServiceSsrHandler {
          get $beanFullName(): 'a-ssrserver.service.ssrHandler';
          get $onionName(): 'a-ssrserver:ssrHandler';
          
        } 
}
/** service: end */
/** service: begin */
import { ServiceSsrHandler } from '../service/ssrHandler.js';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'a-ssrserver.service.ssrHandler': ServiceSsrHandler;
  }
}
/** service: end */
/** monkeySys: begin */
export * from '../monkeySys.js';
/** monkeySys: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil } from 'zova';
import { Scope } from 'zova-module-a-bean';

@Scope()
export class ScopeModuleASsrserver extends BeanScopeBase {}

export interface ScopeModuleASsrserver {
  util: BeanScopeUtil;
}

import 'zova';
declare module 'zova' {
  export interface IBeanScopeRecord {
    'a-ssrserver': ScopeModuleASsrserver;
  }
  
  

  

  
}
  
/** scope: end */
