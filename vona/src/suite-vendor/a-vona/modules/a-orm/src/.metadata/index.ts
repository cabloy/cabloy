// eslint-disable
/** aopMethod: begin */
export * from '../bean/aopMethod.transaction.ts';
import type { IAopMethodOptionsTransaction } from '../bean/aopMethod.transaction.ts';
import 'vona-module-a-aspect';
declare module 'vona-module-a-aspect' {
  
    export interface IAopMethodRecord {
      'a-orm:transaction': IAopMethodOptionsTransaction;
    }

  
}
declare module 'vona-module-a-orm' {
  
        export interface AopMethodTransaction {
          /** @internal */
          get scope(): ScopeModuleAOrm;
        }

          export interface AopMethodTransaction {
            get $beanFullName(): 'a-orm.aopMethod.transaction';
            get $onionName(): 'a-orm:transaction';
            get $onionOptions(): IAopMethodOptionsTransaction;
          } 
}
/** aopMethod: end */
/** bean: begin */
export * from '../bean/bean.database.ts';
export * from '../bean/bean.databaseDialectBase.ts';
export * from '../bean/bean.model.ts';
export * from '../bean/bean.modelBase.ts';

import 'vona';
declare module 'vona' {
  
  
}
declare module 'vona-module-a-orm' {
  
        export interface BeanDatabase {
          /** @internal */
          get scope(): ScopeModuleAOrm;
        } 
}
/** bean: end */
/** bean: begin */
import type { BeanDatabase } from '../bean/bean.database.ts';
import 'vona';  
declare module 'vona' {
  export interface IBeanRecordGlobal {
    'database': BeanDatabase;
  }
}
/** bean: end */
/** service: begin */
export * from '../service/cacheEntity_.ts';
export * from '../service/cacheQuery_.ts';
export * from '../service/columnsCache_.ts';
export * from '../service/columns_.ts';
export * from '../service/database.ts';
export * from '../service/databaseAsyncLocalStorage_.ts';
export * from '../service/databaseClient_.ts';
export * from '../service/db_.ts';
export * from '../service/entityResolver_.ts';
export * from '../service/modelResolver_.ts';
export * from '../service/relations_.ts';
export * from '../service/transactionAsyncLocalStorage_.ts';
export * from '../service/transactionConsistency‌_.ts';
export * from '../service/transactionFiber_.ts';
export * from '../service/transactionState_.ts';
export * from '../service/transaction_.ts';

import 'vona-module-a-bean';
declare module 'vona-module-a-bean' {
  
    export interface IServiceRecord {
      'a-orm:database': never;
    }

  
}
declare module 'vona-module-a-orm' {
  
        export interface ServiceDatabase {
          /** @internal */
          get scope(): ScopeModuleAOrm;
        }

          export interface ServiceDatabase {
            get $beanFullName(): 'a-orm.service.database';
            get $onionName(): 'a-orm:database';
            
          } 
}
/** service: end */
/** service: begin */
import type { ServiceDatabase } from '../service/database.ts';
export interface IModuleService {
  'database': ServiceDatabase;
}
/** service: end */
/** service: begin */

import 'vona';
declare module 'vona' {
  export interface IBeanRecordGeneral {
    'a-orm.service.database': ServiceDatabase;
  }
}
/** service: end */
/** broadcast: begin */
export * from '../bean/broadcast.columnsClear.ts';

import { type IDecoratorBroadcastOptions } from 'vona-module-a-broadcast';
declare module 'vona-module-a-broadcast' {
  
    export interface IBroadcastRecord {
      'a-orm:columnsClear': IDecoratorBroadcastOptions;
    }

  
}
declare module 'vona-module-a-orm' {
  
        export interface BroadcastColumnsClear {
          /** @internal */
          get scope(): ScopeModuleAOrm;
        }

          export interface BroadcastColumnsClear {
            get $beanFullName(): 'a-orm.broadcast.columnsClear';
            get $onionName(): 'a-orm:columnsClear';
            get $onionOptions(): IDecoratorBroadcastOptions;
          } 
}
/** broadcast: end */
/** broadcast: begin */
import type { BroadcastColumnsClear } from '../bean/broadcast.columnsClear.ts';
export interface IModuleBroadcast {
  'columnsClear': BroadcastColumnsClear;
}
/** broadcast: end */
/** event: begin */
export * from '../bean/event.clientNameReal.ts';
export * from '../bean/event.columnsClear.ts';

import 'vona';
declare module 'vona' {
  
  
}
declare module 'vona-module-a-orm' {
  
        export interface EventClientNameReal {
          /** @internal */
          get scope(): ScopeModuleAOrm;
        }

          export interface EventClientNameReal {
            get $beanFullName(): 'a-orm.event.clientNameReal';
            get $onionName(): 'a-orm:clientNameReal';
            
          }

        export interface EventColumnsClear {
          /** @internal */
          get scope(): ScopeModuleAOrm;
        }

          export interface EventColumnsClear {
            get $beanFullName(): 'a-orm.event.columnsClear';
            get $onionName(): 'a-orm:columnsClear';
            
          } 
}
/** event: end */
/** event: begin */
import type { EventClientNameReal } from '../bean/event.clientNameReal.ts';
import type { EventColumnsClear } from '../bean/event.columnsClear.ts';
export interface IModuleEvent {
  'clientNameReal': EventClientNameReal;
'columnsClear': EventColumnsClear;
}
/** event: end */
/** event: begin */
import type { TypeEventClientNameRealData, TypeEventClientNameRealResult } from '../bean/event.clientNameReal.ts';
import type { TypeEventColumnsClearData, TypeEventColumnsClearResult } from '../bean/event.columnsClear.ts';
import type { EventOn } from 'vona-module-a-event'; 
declare module 'vona-module-a-event' {
  export interface IEventRecord {
    'a-orm:clientNameReal': EventOn<TypeEventClientNameRealData, TypeEventClientNameRealResult>;
'a-orm:columnsClear': EventOn<TypeEventColumnsClearData, TypeEventColumnsClearResult>;
  }
}
/** event: end */
/** hmr: begin */
export * from '../bean/hmr.entity.ts';
export * from '../bean/hmr.model.ts';

import 'vona';
declare module 'vona' {
  
    export interface IHmrRecord {
      'a-orm:entity': never;
'a-orm:model': never;
    }

  
}
declare module 'vona-module-a-orm' {
  
        export interface HmrEntity {
          /** @internal */
          get scope(): ScopeModuleAOrm;
        }

          export interface HmrEntity {
            get $beanFullName(): 'a-orm.hmr.entity';
            get $onionName(): 'a-orm:entity';
            
          }

        export interface HmrModel {
          /** @internal */
          get scope(): ScopeModuleAOrm;
        }

          export interface HmrModel {
            get $beanFullName(): 'a-orm.hmr.model';
            get $onionName(): 'a-orm:model';
            
          } 
}
/** hmr: end */
/** queue: begin */
export * from '../bean/queue.doubleDelete.ts';

import { type IDecoratorQueueOptions } from 'vona-module-a-queue';
declare module 'vona-module-a-queue' {
  
    export interface IQueueRecord {
      'a-orm:doubleDelete': IDecoratorQueueOptions;
    }

  
}
declare module 'vona-module-a-orm' {
  
        export interface QueueDoubleDelete {
          /** @internal */
          get scope(): ScopeModuleAOrm;
        }

          export interface QueueDoubleDelete {
            get $beanFullName(): 'a-orm.queue.doubleDelete';
            get $onionName(): 'a-orm:doubleDelete';
            get $onionOptions(): IDecoratorQueueOptions;
          } 
}
/** queue: end */
/** queue: begin */
import type { QueueDoubleDelete } from '../bean/queue.doubleDelete.ts';
export interface IModuleQueue {
  'doubleDelete': QueueDoubleDelete;
}
/** queue: end */
/** schedule: begin */
export * from '../bean/schedule.softDeletionPrune.ts';

import { type IDecoratorScheduleOptions } from 'vona-module-a-schedule';
declare module 'vona-module-a-schedule' {
  
    export interface IScheduleRecord {
      'a-orm:softDeletionPrune': IDecoratorScheduleOptions;
    }

  
}
declare module 'vona-module-a-orm' {
  
        export interface ScheduleSoftDeletionPrune {
          /** @internal */
          get scope(): ScopeModuleAOrm;
        }

          export interface ScheduleSoftDeletionPrune {
            get $beanFullName(): 'a-orm.schedule.softDeletionPrune';
            get $onionName(): 'a-orm:softDeletionPrune';
            get $onionOptions(): IDecoratorScheduleOptions;
          } 
}
/** schedule: end */
/** config: begin */
export * from '../config/config.ts';
import type { config } from '../config/config.ts';
/** config: end */
/** locale: begin */
import { locales } from './locales.ts';
/** locale: end */
/** error: begin */
export * from '../config/errors.ts';
import type { errors } from '../config/errors.ts';
/** error: end */
/** main: begin */
export * from '../main.ts';
/** main: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil, type TypeModuleConfig, type TypeModuleErrors, type TypeModuleLocales, type TypeLocaleBase } from 'vona';
import { Scope } from 'vona-module-a-bean';

@Scope()
export class ScopeModuleAOrm extends BeanScopeBase {}

export interface ScopeModuleAOrm {
  util: BeanScopeUtil;
config: TypeModuleConfig<typeof config>;
error: TypeModuleErrors<typeof errors>;
locale: TypeModuleLocales<(typeof locales)[TypeLocaleBase]>;
service: IModuleService;
broadcast: IModuleBroadcast;
event: IModuleEvent;
queue: IModuleQueue;
}

import 'vona';
declare module 'vona' {
  export interface IBeanScopeRecord {
    'a-orm': ScopeModuleAOrm;
  }

  export interface IBeanScopeContainer {
    orm: ScopeModuleAOrm;
  }
  
  export interface IBeanScopeConfig {
    'a-orm': ReturnType<typeof config>;
  }

  export interface IBeanScopeLocale {
    'a-orm': (typeof locales)[TypeLocaleBase];
  }

  export interface IBeanScopeErrors {
    'a-orm': typeof errors;
  }
}
/** scope: end */
