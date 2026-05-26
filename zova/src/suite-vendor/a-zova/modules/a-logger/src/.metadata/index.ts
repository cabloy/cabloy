// eslint-disable
/** aopMethod: begin */
export * from '../bean/aopMethod.log.js';
import { IAopMethodOptionsLog } from '../bean/aopMethod.log.js';
import 'zova-module-a-bean';
declare module 'zova-module-a-bean' {
  
    export interface IAopMethodRecord {
      'a-logger:log': IAopMethodOptionsLog;
    }

  
}
declare module 'zova-module-a-logger' {
  
        export interface AopMethodLog {
          /** @internal */
          get scope(): ScopeModuleALogger;
        }

        export interface AopMethodLog {
          get $beanFullName(): 'a-logger.aopMethod.log';
          get $onionName(): 'a-logger:log';
          get $onionOptions(): IAopMethodOptionsLog;
        } 
}
/** aopMethod: end */
/** aopMethod: begin */
import { AopMethodLog } from '../bean/aopMethod.log.js';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordLocal {
    'a-logger.aopMethod.log': AopMethodLog;
  }
}
/** aopMethod: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil } from 'zova';
import { Scope } from 'zova-module-a-bean';

@Scope()
export class ScopeModuleALogger extends BeanScopeBase {}

export interface ScopeModuleALogger {
  util: BeanScopeUtil;
}

import 'zova';
declare module 'zova' {
  export interface IBeanScopeRecord {
    'a-logger': ScopeModuleALogger;
  }
  
  

  

  
}
  
/** scope: end */
