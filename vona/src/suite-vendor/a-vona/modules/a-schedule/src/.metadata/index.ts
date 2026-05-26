// eslint-disable
/** service: begin */
export * from '../service/schedule.ts';

import 'vona-module-a-bean';
declare module 'vona-module-a-bean' {
  
    export interface IServiceRecord {
      'a-schedule:schedule': never;
    }

  
}
declare module 'vona-module-a-schedule' {
  
        export interface ServiceSchedule {
          /** @internal */
          get scope(): ScopeModuleASchedule;
        }

          export interface ServiceSchedule {
            get $beanFullName(): 'a-schedule.service.schedule';
            get $onionName(): 'a-schedule:schedule';
            
          } 
}
/** service: end */
/** service: begin */
import type { ServiceSchedule } from '../service/schedule.ts';
export interface IModuleService {
  'schedule': ServiceSchedule;
}
/** service: end */
/** service: begin */

import 'vona';
declare module 'vona' {
  export interface IBeanRecordGeneral {
    'a-schedule.service.schedule': ServiceSchedule;
  }
}
/** service: end */
/** hmr: begin */
export * from '../bean/hmr.schedule.ts';

import 'vona';
declare module 'vona' {
  
    export interface IHmrRecord {
      'a-schedule:schedule': never;
    }

  
}
declare module 'vona-module-a-schedule' {
  
        export interface HmrSchedule {
          /** @internal */
          get scope(): ScopeModuleASchedule;
        }

          export interface HmrSchedule {
            get $beanFullName(): 'a-schedule.hmr.schedule';
            get $onionName(): 'a-schedule:schedule';
            
          } 
}
/** hmr: end */
/** meta: begin */
export * from '../bean/meta.redlock.ts';

import 'vona-module-a-meta';
declare module 'vona-module-a-meta' {
  
    export interface IMetaRecord {
      'a-schedule:redlock': never;
    }

  
}
declare module 'vona-module-a-schedule' {
  
        export interface MetaRedlock {
          /** @internal */
          get scope(): ScopeModuleASchedule;
        }

          export interface MetaRedlock {
            get $beanFullName(): 'a-schedule.meta.redlock';
            get $onionName(): 'a-schedule:redlock';
            
          } 
}
/** meta: end */
/** meta redlock: begin */
import type { MetaRedlock } from '../bean/meta.redlock.ts';
/** meta redlock: end */
/** queue: begin */
export * from '../bean/queue.schedule.ts';

import { type IDecoratorQueueOptions } from 'vona-module-a-queue';
declare module 'vona-module-a-queue' {
  
    export interface IQueueRecord {
      'a-schedule:schedule': IDecoratorQueueOptions;
    }

  
}
declare module 'vona-module-a-schedule' {
  
        export interface QueueSchedule {
          /** @internal */
          get scope(): ScopeModuleASchedule;
        }

          export interface QueueSchedule {
            get $beanFullName(): 'a-schedule.queue.schedule';
            get $onionName(): 'a-schedule:schedule';
            get $onionOptions(): IDecoratorQueueOptions;
          } 
}
/** queue: end */
/** queue: begin */
import type { QueueSchedule } from '../bean/queue.schedule.ts';
export interface IModuleQueue {
  'schedule': QueueSchedule;
}
/** queue: end */
/** startup: begin */
export * from '../bean/startup.loadSchedules.ts';

import { type IDecoratorStartupOptions } from 'vona-module-a-startup';
declare module 'vona-module-a-startup' {
  
    export interface IStartupRecord {
      'a-schedule:loadSchedules': IDecoratorStartupOptions;
    }

  
}
declare module 'vona-module-a-schedule' {
  
        export interface StartupLoadSchedules {
          /** @internal */
          get scope(): ScopeModuleASchedule;
        }

          export interface StartupLoadSchedules {
            get $beanFullName(): 'a-schedule.startup.loadSchedules';
            get $onionName(): 'a-schedule:loadSchedules';
            get $onionOptions(): IDecoratorStartupOptions;
          } 
}
/** startup: end */
/** config: begin */
export * from '../config/config.ts';
import type { config } from '../config/config.ts';
/** config: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil, type TypeModuleConfig } from 'vona';
import { Scope } from 'vona-module-a-bean';

@Scope()
export class ScopeModuleASchedule extends BeanScopeBase {}

export interface ScopeModuleASchedule {
  util: BeanScopeUtil;
config: TypeModuleConfig<typeof config>;
service: IModuleService;
redlock: MetaRedlock;
queue: IModuleQueue;
}

import 'vona';
declare module 'vona' {
  export interface IBeanScopeRecord {
    'a-schedule': ScopeModuleASchedule;
  }

  export interface IBeanScopeContainer {
    schedule: ScopeModuleASchedule;
  }
  
  export interface IBeanScopeConfig {
    'a-schedule': ReturnType<typeof config>;
  }

  

  
}
/** scope: end */
