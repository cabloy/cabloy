// eslint-disable
/** bean: begin */
export * from '../bean/bean.mutate.ts';

import 'vona';
declare module 'vona' {
  
  
}
declare module 'vona-module-a-beanmutate' {
  
        export interface BeanMutate {
          /** @internal */
          get scope(): ScopeModuleABeanmutate;
        } 
}
/** bean: end */
/** bean: begin */
import type { BeanMutate } from '../bean/bean.mutate.ts';
import 'vona';  
declare module 'vona' {
  export interface IBeanRecordGlobal {
    'mutate': BeanMutate;
  }
}
/** bean: end */
/** broadcast: begin */
export * from '../bean/broadcast.reloadInstances.ts';
export * from '../bean/broadcast.removeInstances.ts';

import { type IDecoratorBroadcastOptions } from 'vona-module-a-broadcast';
declare module 'vona-module-a-broadcast' {
  
    export interface IBroadcastRecord {
      'a-beanmutate:reloadInstances': IDecoratorBroadcastOptions;
'a-beanmutate:removeInstances': IDecoratorBroadcastOptions;
    }

  
}
declare module 'vona-module-a-beanmutate' {
  
        export interface BroadcastReloadInstances {
          /** @internal */
          get scope(): ScopeModuleABeanmutate;
        }

          export interface BroadcastReloadInstances {
            get $beanFullName(): 'a-beanmutate.broadcast.reloadInstances';
            get $onionName(): 'a-beanmutate:reloadInstances';
            get $onionOptions(): IDecoratorBroadcastOptions;
          }

        export interface BroadcastRemoveInstances {
          /** @internal */
          get scope(): ScopeModuleABeanmutate;
        }

          export interface BroadcastRemoveInstances {
            get $beanFullName(): 'a-beanmutate.broadcast.removeInstances';
            get $onionName(): 'a-beanmutate:removeInstances';
            get $onionOptions(): IDecoratorBroadcastOptions;
          } 
}
/** broadcast: end */
/** broadcast: begin */
import type { BroadcastReloadInstances } from '../bean/broadcast.reloadInstances.ts';
import type { BroadcastRemoveInstances } from '../bean/broadcast.removeInstances.ts';
export interface IModuleBroadcast {
  'reloadInstances': BroadcastReloadInstances;
'removeInstances': BroadcastRemoveInstances;
}
/** broadcast: end */
/** event: begin */
export * from '../bean/event.reloadInstances.ts';
export * from '../bean/event.removeInstances.ts';

import 'vona';
declare module 'vona' {
  
  
}
declare module 'vona-module-a-beanmutate' {
  
        export interface EventReloadInstances {
          /** @internal */
          get scope(): ScopeModuleABeanmutate;
        }

          export interface EventReloadInstances {
            get $beanFullName(): 'a-beanmutate.event.reloadInstances';
            get $onionName(): 'a-beanmutate:reloadInstances';
            
          }

        export interface EventRemoveInstances {
          /** @internal */
          get scope(): ScopeModuleABeanmutate;
        }

          export interface EventRemoveInstances {
            get $beanFullName(): 'a-beanmutate.event.removeInstances';
            get $onionName(): 'a-beanmutate:removeInstances';
            
          } 
}
/** event: end */
/** event: begin */
import type { EventReloadInstances } from '../bean/event.reloadInstances.ts';
import type { EventRemoveInstances } from '../bean/event.removeInstances.ts';
export interface IModuleEvent {
  'reloadInstances': EventReloadInstances;
'removeInstances': EventRemoveInstances;
}
/** event: end */
/** event: begin */
import type { TypeEventReloadInstancesData, TypeEventReloadInstancesResult } from '../bean/event.reloadInstances.ts';
import type { TypeEventRemoveInstancesData, TypeEventRemoveInstancesResult } from '../bean/event.removeInstances.ts';
import type { EventOn } from 'vona-module-a-event'; 
declare module 'vona-module-a-event' {
  export interface IEventRecord {
    'a-beanmutate:reloadInstances': EventOn<TypeEventReloadInstancesData, TypeEventReloadInstancesResult>;
'a-beanmutate:removeInstances': EventOn<TypeEventRemoveInstancesData, TypeEventRemoveInstancesResult>;
  }
}
/** event: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil } from 'vona';
import { Scope } from 'vona-module-a-bean';

@Scope()
export class ScopeModuleABeanmutate extends BeanScopeBase {}

export interface ScopeModuleABeanmutate {
  util: BeanScopeUtil;
broadcast: IModuleBroadcast;
event: IModuleEvent;
}

import 'vona';
declare module 'vona' {
  export interface IBeanScopeRecord {
    'a-beanmutate': ScopeModuleABeanmutate;
  }

  export interface IBeanScopeContainer {
    beanmutate: ScopeModuleABeanmutate;
  }
  
  

  

  
}
/** scope: end */
