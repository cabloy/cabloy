// eslint-disable
/** bean: begin */
export * from '../bean/bean.event.ts';

import 'vona';
declare module 'vona' {
  
  
}
declare module 'vona-module-a-event' {
  
        export interface BeanEvent {
          /** @internal */
          get scope(): ScopeModuleAEvent;
        } 
}
/** bean: end */
/** bean: begin */
import type { BeanEvent } from '../bean/bean.event.ts';
import 'vona';  
declare module 'vona' {
  export interface IBeanRecordGlobal {
    'event': BeanEvent;
  }
}
/** bean: end */
/** service: begin */
export * from '../service/eventListener.ts';

import 'vona-module-a-bean';
declare module 'vona-module-a-bean' {
  
    export interface IServiceRecord {
      'a-event:eventListener': never;
    }

  
}
declare module 'vona-module-a-event' {
  
        export interface ServiceEventListener {
          /** @internal */
          get scope(): ScopeModuleAEvent;
        }

          export interface ServiceEventListener {
            get $beanFullName(): 'a-event.service.eventListener';
            get $onionName(): 'a-event:eventListener';
            
          } 
}
/** service: end */
/** service: begin */
import type { ServiceEventListener } from '../service/eventListener.ts';
export interface IModuleService {
  'eventListener': ServiceEventListener;
}
/** service: end */
/** service: begin */

import 'vona';
declare module 'vona' {
  export interface IBeanRecordGeneral {
    'a-event.service.eventListener': ServiceEventListener;
  }
}
/** service: end */
/** hmr: begin */
export * from '../bean/hmr.eventListener.ts';

import 'vona';
declare module 'vona' {
  
    export interface IHmrRecord {
      'a-event:eventListener': never;
    }

  
}
declare module 'vona-module-a-event' {
  
        export interface HmrEventListener {
          /** @internal */
          get scope(): ScopeModuleAEvent;
        }

          export interface HmrEventListener {
            get $beanFullName(): 'a-event.hmr.eventListener';
            get $onionName(): 'a-event:eventListener';
            
          } 
}
/** hmr: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil } from 'vona';
import { Scope } from 'vona-module-a-bean';

@Scope()
export class ScopeModuleAEvent extends BeanScopeBase {}

export interface ScopeModuleAEvent {
  util: BeanScopeUtil;
service: IModuleService;
}

import 'vona';
declare module 'vona' {
  export interface IBeanScopeRecord {
    'a-event': ScopeModuleAEvent;
  }

  export interface IBeanScopeContainer {
    event: ScopeModuleAEvent;
  }
  
  

  

  
}
/** scope: end */
