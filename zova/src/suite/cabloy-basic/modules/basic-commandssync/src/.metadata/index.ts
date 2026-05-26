// eslint-disable
/** command: begin */
export * from '../bean/command.expr.jsx';
export * from '../bean/command.log.jsx';
import { ICommandOptionsExpr } from '../bean/command.expr.jsx';
import { ICommandOptionsLog } from '../bean/command.log.jsx';
import 'zova-module-a-command';
declare module 'zova-module-a-command' {
  
    export interface ICommandRecord {
      'basic-commandssync:expr': ICommandOptionsExpr;
'basic-commandssync:log': ICommandOptionsLog;
    }

  
}
declare module 'zova-module-basic-commandssync' {
  
        export interface CommandExpr {
          /** @internal */
          get scope(): ScopeModuleBasicCommandssync;
        }

        export interface CommandExpr {
          get $beanFullName(): 'basic-commandssync.command.expr';
          get $onionName(): 'basic-commandssync:expr';
          get $onionOptions(): ICommandOptionsExpr;
        }

        export interface CommandLog {
          /** @internal */
          get scope(): ScopeModuleBasicCommandssync;
        }

        export interface CommandLog {
          get $beanFullName(): 'basic-commandssync.command.log';
          get $onionName(): 'basic-commandssync:log';
          get $onionOptions(): ICommandOptionsLog;
        } 
}
/** command: end */
/** command: begin */
import { CommandExpr } from '../bean/command.expr.jsx';
import { CommandLog } from '../bean/command.log.jsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'basic-commandssync.command.expr': CommandExpr;
'basic-commandssync.command.log': CommandLog;
  }
}
/** command: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil } from 'zova';
import { Scope } from 'zova-module-a-bean';

@Scope()
export class ScopeModuleBasicCommandssync extends BeanScopeBase {}

export interface ScopeModuleBasicCommandssync {
  util: BeanScopeUtil;
}

import 'zova';
declare module 'zova' {
  export interface IBeanScopeRecord {
    'basic-commandssync': ScopeModuleBasicCommandssync;
  }
  
  

  

  
}
  
/** scope: end */
