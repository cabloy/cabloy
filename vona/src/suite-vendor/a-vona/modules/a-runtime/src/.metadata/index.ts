// eslint-disable
/** hmr: begin */
export * from '../bean/hmr.metaRuntime.ts';

import 'vona';
declare module 'vona' {
  
    export interface IHmrRecord {
      'a-runtime:metaRuntime': never;
    }

  
}
declare module 'vona-module-a-runtime' {
  
        export interface HmrMetaRuntime {
          /** @internal */
          get scope(): ScopeModuleARuntime;
        }

          export interface HmrMetaRuntime {
            get $beanFullName(): 'a-runtime.hmr.metaRuntime';
            get $onionName(): 'a-runtime:metaRuntime';
            
          } 
}
/** hmr: end */
/** startup: begin */
export * from '../bean/startup.runtime.ts';

import { type IDecoratorStartupOptions } from 'vona-module-a-startup';
declare module 'vona-module-a-startup' {
  
    export interface IStartupRecord {
      'a-runtime:runtime': IDecoratorStartupOptions;
    }

  
}
declare module 'vona-module-a-runtime' {
  
        export interface StartupRuntime {
          /** @internal */
          get scope(): ScopeModuleARuntime;
        }

          export interface StartupRuntime {
            get $beanFullName(): 'a-runtime.startup.runtime';
            get $onionName(): 'a-runtime:runtime';
            get $onionOptions(): IDecoratorStartupOptions;
          } 
}
/** startup: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil } from 'vona';
import { Scope } from 'vona-module-a-bean';

@Scope()
export class ScopeModuleARuntime extends BeanScopeBase {}

export interface ScopeModuleARuntime {
  util: BeanScopeUtil;
}

import 'vona';
declare module 'vona' {
  export interface IBeanScopeRecord {
    'a-runtime': ScopeModuleARuntime;
  }

  export interface IBeanScopeContainer {
    runtime: ScopeModuleARuntime;
  }
  
  

  

  
}
/** scope: end */
