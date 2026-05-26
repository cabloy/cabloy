// eslint-disable
/** bean: begin */
export * from '../bean/bean.ssrHmr.ts';

import 'vona';
declare module 'vona' {
  
  
}
declare module 'vona-module-a-ssrhmr' {
  
        export interface BeanSsrHmr {
          /** @internal */
          get scope(): ScopeModuleASsrhmr;
        } 
}
/** bean: end */
/** bean: begin */
import type { BeanSsrHmr } from '../bean/bean.ssrHmr.ts';
import 'vona';  
declare module 'vona' {
  export interface IBeanRecordGlobal {
    'ssrHmr': BeanSsrHmr;
  }
}
/** bean: end */
/** socketNamespace: begin */
export * from '../bean/socketNamespace.ssrHmr.ts';
import type { ISocketNamespaceOptionsSsrHmr } from '../bean/socketNamespace.ssrHmr.ts';
import 'vona-module-a-socket';
declare module 'vona-module-a-socket' {
  
    export interface ISocketNamespaceRecord {
      'a-ssrhmr:ssrHmr': ISocketNamespaceOptionsSsrHmr;
    }

  
}
declare module 'vona-module-a-ssrhmr' {
  
        export interface SocketNamespaceSsrHmr {
          /** @internal */
          get scope(): ScopeModuleASsrhmr;
        }

          export interface SocketNamespaceSsrHmr {
            get $beanFullName(): 'a-ssrhmr.socketNamespace.ssrHmr';
            get $onionName(): 'a-ssrhmr:ssrHmr';
            get $onionOptions(): ISocketNamespaceOptionsSsrHmr;
          } 
}
/** socketNamespace: end */
/** socketNamespace: begin */
import type { SocketNamespaceSsrHmr } from '../bean/socketNamespace.ssrHmr.ts';
export interface IModuleSocketNamespace {
  'ssrHmr': SocketNamespaceSsrHmr;
}
/** socketNamespace: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil } from 'vona';
import { Scope } from 'vona-module-a-bean';

@Scope()
export class ScopeModuleASsrhmr extends BeanScopeBase {}

export interface ScopeModuleASsrhmr {
  util: BeanScopeUtil;
socketNamespace: IModuleSocketNamespace;
}

import 'vona';
declare module 'vona' {
  export interface IBeanScopeRecord {
    'a-ssrhmr': ScopeModuleASsrhmr;
  }

  export interface IBeanScopeContainer {
    ssrhmr: ScopeModuleASsrhmr;
  }
  
  

  

  
}
/** scope: end */
