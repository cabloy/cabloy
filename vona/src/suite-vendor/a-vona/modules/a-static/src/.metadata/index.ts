// eslint-disable
/** middlewareSystem: begin */
export * from '../bean/middlewareSystem.static.ts';
import type { IMiddlewareSystemOptionsStatic } from '../bean/middlewareSystem.static.ts';
import 'vona-module-a-aspect';
declare module 'vona-module-a-aspect' {
  
    export interface IMiddlewareSystemRecord {
      'a-static:static': IMiddlewareSystemOptionsStatic;
    }

  
}
declare module 'vona-module-a-static' {
  
        export interface MiddlewareSystemStatic {
          /** @internal */
          get scope(): ScopeModuleAStatic;
        }

          export interface MiddlewareSystemStatic {
            get $beanFullName(): 'a-static.middlewareSystem.static';
            get $onionName(): 'a-static:static';
            get $onionOptions(): IMiddlewareSystemOptionsStatic;
          } 
}
/** middlewareSystem: end */
/** event: begin */
export * from '../bean/event.resolvePath.ts';

import 'vona';
declare module 'vona' {
  
  
}
declare module 'vona-module-a-static' {
  
        export interface EventResolvePath {
          /** @internal */
          get scope(): ScopeModuleAStatic;
        }

          export interface EventResolvePath {
            get $beanFullName(): 'a-static.event.resolvePath';
            get $onionName(): 'a-static:resolvePath';
            
          } 
}
/** event: end */
/** event: begin */
import type { EventResolvePath } from '../bean/event.resolvePath.ts';
export interface IModuleEvent {
  'resolvePath': EventResolvePath;
}
/** event: end */
/** event: begin */
import type { TypeEventResolvePathData, TypeEventResolvePathResult } from '../bean/event.resolvePath.ts';
import type { EventOn } from 'vona-module-a-event'; 
declare module 'vona-module-a-event' {
  export interface IEventRecord {
    'a-static:resolvePath': EventOn<TypeEventResolvePathData, TypeEventResolvePathResult>;
  }
}
/** event: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil } from 'vona';
import { Scope } from 'vona-module-a-bean';

@Scope()
export class ScopeModuleAStatic extends BeanScopeBase {}

export interface ScopeModuleAStatic {
  util: BeanScopeUtil;
event: IModuleEvent;
}

import 'vona';
declare module 'vona' {
  export interface IBeanScopeRecord {
    'a-static': ScopeModuleAStatic;
  }

  export interface IBeanScopeContainer {
    static: ScopeModuleAStatic;
  }
  
  

  

  
}
/** scope: end */
