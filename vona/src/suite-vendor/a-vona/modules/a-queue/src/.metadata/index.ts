// eslint-disable
/** service: begin */
export * from '../service/queue.ts';

import 'vona-module-a-bean';
declare module 'vona-module-a-bean' {
  
    export interface IServiceRecord {
      'a-queue:queue': never;
    }

  
}
declare module 'vona-module-a-queue' {
  
        export interface ServiceQueue {
          /** @internal */
          get scope(): ScopeModuleAQueue;
        }

          export interface ServiceQueue {
            get $beanFullName(): 'a-queue.service.queue';
            get $onionName(): 'a-queue:queue';
            
          } 
}
/** service: end */
/** service: begin */
import type { ServiceQueue } from '../service/queue.ts';
export interface IModuleService {
  'queue': ServiceQueue;
}
/** service: end */
/** service: begin */

import 'vona';
declare module 'vona' {
  export interface IBeanRecordGeneral {
    'a-queue.service.queue': ServiceQueue;
  }
}
/** service: end */
/** hmr: begin */
export * from '../bean/hmr.queue.ts';

import 'vona';
declare module 'vona' {
  
    export interface IHmrRecord {
      'a-queue:queue': never;
    }

  
}
declare module 'vona-module-a-queue' {
  
        export interface HmrQueue {
          /** @internal */
          get scope(): ScopeModuleAQueue;
        }

          export interface HmrQueue {
            get $beanFullName(): 'a-queue.hmr.queue';
            get $onionName(): 'a-queue:queue';
            
          } 
}
/** hmr: end */
/** startup: begin */
export * from '../bean/startup.loadQueueWorkers.ts';

import { type IDecoratorStartupOptions } from 'vona-module-a-startup';
declare module 'vona-module-a-startup' {
  
    export interface IStartupRecord {
      'a-queue:loadQueueWorkers': IDecoratorStartupOptions;
    }

  
}
declare module 'vona-module-a-queue' {
  
        export interface StartupLoadQueueWorkers {
          /** @internal */
          get scope(): ScopeModuleAQueue;
        }

          export interface StartupLoadQueueWorkers {
            get $beanFullName(): 'a-queue.startup.loadQueueWorkers';
            get $onionName(): 'a-queue:loadQueueWorkers';
            get $onionOptions(): IDecoratorStartupOptions;
          } 
}
/** startup: end */
/** config: begin */
export * from '../config/config.ts';
import type { config } from '../config/config.ts';
/** config: end */
/** monkey: begin */
export * from '../monkey.ts';
/** monkey: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil, type TypeModuleConfig } from 'vona';
import { Scope } from 'vona-module-a-bean';

@Scope()
export class ScopeModuleAQueue extends BeanScopeBase {}

export interface ScopeModuleAQueue {
  util: BeanScopeUtil;
config: TypeModuleConfig<typeof config>;
service: IModuleService;
}

import 'vona';
declare module 'vona' {
  export interface IBeanScopeRecord {
    'a-queue': ScopeModuleAQueue;
  }

  export interface IBeanScopeContainer {
    queue: ScopeModuleAQueue;
  }
  
  export interface IBeanScopeConfig {
    'a-queue': ReturnType<typeof config>;
  }

  

  
}
/** scope: end */
