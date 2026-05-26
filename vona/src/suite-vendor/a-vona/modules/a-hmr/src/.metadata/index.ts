// eslint-disable
/** bean: begin */
export * from '../bean/bean.hmr.ts';

import 'vona';
declare module 'vona' {
  
  
}
declare module 'vona-module-a-hmr' {
  
        export interface BeanHmr {
          /** @internal */
          get scope(): ScopeModuleAHmr;
        } 
}
/** bean: end */
/** bean: begin */
import type { BeanHmr } from '../bean/bean.hmr.ts';
import 'vona';  
declare module 'vona' {
  export interface IBeanRecordGlobal {
    'hmr': BeanHmr;
  }
}
/** bean: end */
/** service: begin */
export * from '../service/hmr.ts';
export * from '../service/watch.ts';

import 'vona-module-a-bean';
declare module 'vona-module-a-bean' {
  
    export interface IServiceRecord {
      'a-hmr:hmr': never;
'a-hmr:watch': never;
    }

  
}
declare module 'vona-module-a-hmr' {
  
        export interface ServiceHmr {
          /** @internal */
          get scope(): ScopeModuleAHmr;
        }

          export interface ServiceHmr {
            get $beanFullName(): 'a-hmr.service.hmr';
            get $onionName(): 'a-hmr:hmr';
            
          }

        export interface ServiceWatch {
          /** @internal */
          get scope(): ScopeModuleAHmr;
        }

          export interface ServiceWatch {
            get $beanFullName(): 'a-hmr.service.watch';
            get $onionName(): 'a-hmr:watch';
            
          } 
}
/** service: end */
/** service: begin */
import type { ServiceHmr } from '../service/hmr.ts';
import type { ServiceWatch } from '../service/watch.ts';
export interface IModuleService {
  'hmr': ServiceHmr;
'watch': ServiceWatch;
}
/** service: end */
/** service: begin */

import 'vona';
declare module 'vona' {
  export interface IBeanRecordGeneral {
    'a-hmr.service.hmr': ServiceHmr;
'a-hmr.service.watch': ServiceWatch;
  }
}
/** service: end */
/** broadcast: begin */
export * from '../bean/broadcast.reloadFile.ts';

import { type IDecoratorBroadcastOptions } from 'vona-module-a-broadcast';
declare module 'vona-module-a-broadcast' {
  
    export interface IBroadcastRecord {
      'a-hmr:reloadFile': IDecoratorBroadcastOptions;
    }

  
}
declare module 'vona-module-a-hmr' {
  
        export interface BroadcastReloadFile {
          /** @internal */
          get scope(): ScopeModuleAHmr;
        }

          export interface BroadcastReloadFile {
            get $beanFullName(): 'a-hmr.broadcast.reloadFile';
            get $onionName(): 'a-hmr:reloadFile';
            get $onionOptions(): IDecoratorBroadcastOptions;
          } 
}
/** broadcast: end */
/** broadcast: begin */
import type { BroadcastReloadFile } from '../bean/broadcast.reloadFile.ts';
export interface IModuleBroadcast {
  'reloadFile': BroadcastReloadFile;
}
/** broadcast: end */
/** event: begin */
export * from '../bean/event.hmrReload.ts';

import 'vona';
declare module 'vona' {
  
  
}
declare module 'vona-module-a-hmr' {
  
        export interface EventHmrReload {
          /** @internal */
          get scope(): ScopeModuleAHmr;
        }

          export interface EventHmrReload {
            get $beanFullName(): 'a-hmr.event.hmrReload';
            get $onionName(): 'a-hmr:hmrReload';
            
          } 
}
/** event: end */
/** event: begin */
import type { EventHmrReload } from '../bean/event.hmrReload.ts';
export interface IModuleEvent {
  'hmrReload': EventHmrReload;
}
/** event: end */
/** event: begin */
import type { TypeEventHmrReloadData, TypeEventHmrReloadResult } from '../bean/event.hmrReload.ts';
import type { EventOn } from 'vona-module-a-event'; 
declare module 'vona-module-a-event' {
  export interface IEventRecord {
    'a-hmr:hmrReload': EventOn<TypeEventHmrReloadData, TypeEventHmrReloadResult>;
  }
}
/** event: end */
/** meta: begin */
export * from '../bean/meta.election.ts';

import 'vona-module-a-meta';
declare module 'vona-module-a-meta' {
  
    export interface IMetaRecord {
      'a-hmr:election': never;
    }

  
}
declare module 'vona-module-a-hmr' {
  
        export interface MetaElection {
          /** @internal */
          get scope(): ScopeModuleAHmr;
        }

          export interface MetaElection {
            get $beanFullName(): 'a-hmr.meta.election';
            get $onionName(): 'a-hmr:election';
            
          } 
}
/** meta: end */
/** meta election: begin */
import type { MetaElection } from '../bean/meta.election.ts';
/** meta election: end */
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
export class ScopeModuleAHmr extends BeanScopeBase {}

export interface ScopeModuleAHmr {
  util: BeanScopeUtil;
config: TypeModuleConfig<typeof config>;
service: IModuleService;
broadcast: IModuleBroadcast;
event: IModuleEvent;
election: MetaElection;
}

import 'vona';
declare module 'vona' {
  export interface IBeanScopeRecord {
    'a-hmr': ScopeModuleAHmr;
  }

  export interface IBeanScopeContainer {
    hmr: ScopeModuleAHmr;
  }
  
  export interface IBeanScopeConfig {
    'a-hmr': ReturnType<typeof config>;
  }

  

  
}
/** scope: end */
