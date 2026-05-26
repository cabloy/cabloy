// eslint-disable
/** service: begin */
export * from '../service/election.ts';

import 'vona-module-a-bean';
declare module 'vona-module-a-bean' {
  
    export interface IServiceRecord {
      'a-election:election': never;
    }

  
}
declare module 'vona-module-a-election' {
  
        export interface ServiceElection {
          /** @internal */
          get scope(): ScopeModuleAElection;
        }

          export interface ServiceElection {
            get $beanFullName(): 'a-election.service.election';
            get $onionName(): 'a-election:election';
            
          } 
}
/** service: end */
/** service: begin */
import type { ServiceElection } from '../service/election.ts';
export interface IModuleService {
  'election': ServiceElection;
}
/** service: end */
/** service: begin */

import 'vona';
declare module 'vona' {
  export interface IBeanRecordGeneral {
    'a-election.service.election': ServiceElection;
  }
}
/** service: end */
/** broadcast: begin */
export * from '../bean/broadcast.release.ts';

import { type IDecoratorBroadcastOptions } from 'vona-module-a-broadcast';
declare module 'vona-module-a-broadcast' {
  
    export interface IBroadcastRecord {
      'a-election:release': IDecoratorBroadcastOptions;
    }

  
}
declare module 'vona-module-a-election' {
  
        export interface BroadcastRelease {
          /** @internal */
          get scope(): ScopeModuleAElection;
        }

          export interface BroadcastRelease {
            get $beanFullName(): 'a-election.broadcast.release';
            get $onionName(): 'a-election:release';
            get $onionOptions(): IDecoratorBroadcastOptions;
          } 
}
/** broadcast: end */
/** broadcast: begin */
import type { BroadcastRelease } from '../bean/broadcast.release.ts';
export interface IModuleBroadcast {
  'release': BroadcastRelease;
}
/** broadcast: end */
/** eventListener: begin */
export * from '../bean/eventListener.hmrReload.ts';

import { type IDecoratorEventListenerOptions } from 'vona-module-a-event';
declare module 'vona-module-a-event' {
  
    export interface IEventListenerRecord {
      'a-election:hmrReload': IDecoratorEventListenerOptions;
    }

  
}
declare module 'vona-module-a-election' {
  
        export interface EventListenerHmrReload {
          /** @internal */
          get scope(): ScopeModuleAElection;
        }

          export interface EventListenerHmrReload {
            get $beanFullName(): 'a-election.eventListener.hmrReload';
            get $onionName(): 'a-election:hmrReload';
            get $onionOptions(): IDecoratorEventListenerOptions;
          } 
}
/** eventListener: end */
/** config: begin */
export * from '../config/config.ts';
import type { config } from '../config/config.ts';
/** config: end */
/** monkey: begin */
export * from '../monkey.ts';
/** monkey: end */
/** main: begin */
export * from '../main.ts';
/** main: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil, type TypeModuleConfig } from 'vona';
import { Scope } from 'vona-module-a-bean';

@Scope()
export class ScopeModuleAElection extends BeanScopeBase {}

export interface ScopeModuleAElection {
  util: BeanScopeUtil;
config: TypeModuleConfig<typeof config>;
service: IModuleService;
broadcast: IModuleBroadcast;
}

import 'vona';
declare module 'vona' {
  export interface IBeanScopeRecord {
    'a-election': ScopeModuleAElection;
  }

  export interface IBeanScopeContainer {
    election: ScopeModuleAElection;
  }
  
  export interface IBeanScopeConfig {
    'a-election': ReturnType<typeof config>;
  }

  

  
}
/** scope: end */
