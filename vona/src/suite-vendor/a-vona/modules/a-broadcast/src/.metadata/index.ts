// eslint-disable
/** service: begin */
export * from '../service/broadcast.ts';

import 'vona-module-a-bean';
declare module 'vona-module-a-bean' {
  
    export interface IServiceRecord {
      'a-broadcast:broadcast': never;
    }

  
}
declare module 'vona-module-a-broadcast' {
  
        export interface ServiceBroadcast {
          /** @internal */
          get scope(): ScopeModuleABroadcast;
        }

          export interface ServiceBroadcast {
            get $beanFullName(): 'a-broadcast.service.broadcast';
            get $onionName(): 'a-broadcast:broadcast';
            
          } 
}
/** service: end */
/** service: begin */
import type { ServiceBroadcast } from '../service/broadcast.ts';
export interface IModuleService {
  'broadcast': ServiceBroadcast;
}
/** service: end */
/** service: begin */

import 'vona';
declare module 'vona' {
  export interface IBeanRecordGeneral {
    'a-broadcast.service.broadcast': ServiceBroadcast;
  }
}
/** service: end */
/** monkey: begin */
export * from '../monkey.ts';
/** monkey: end */
/** main: begin */
export * from '../main.ts';
/** main: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil } from 'vona';
import { Scope } from 'vona-module-a-bean';

@Scope()
export class ScopeModuleABroadcast extends BeanScopeBase {}

export interface ScopeModuleABroadcast {
  util: BeanScopeUtil;
service: IModuleService;
}

import 'vona';
declare module 'vona' {
  export interface IBeanScopeRecord {
    'a-broadcast': ScopeModuleABroadcast;
  }

  export interface IBeanScopeContainer {
    broadcast: ScopeModuleABroadcast;
  }
  
  

  

  
}
/** scope: end */
