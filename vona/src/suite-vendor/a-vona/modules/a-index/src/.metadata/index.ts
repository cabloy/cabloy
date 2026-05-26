// eslint-disable
/** hmr: begin */
export * from '../bean/hmr.metaIndex.ts';

import 'vona';
declare module 'vona' {
  
    export interface IHmrRecord {
      'a-index:metaIndex': never;
    }

  
}
declare module 'vona-module-a-index' {
  
        export interface HmrMetaIndex {
          /** @internal */
          get scope(): ScopeModuleAIndex;
        }

          export interface HmrMetaIndex {
            get $beanFullName(): 'a-index.hmr.metaIndex';
            get $onionName(): 'a-index:metaIndex';
            
          } 
}
/** hmr: end */
/** meta: begin */
export * from '../bean/meta.version.ts';

import 'vona-module-a-meta';
declare module 'vona-module-a-meta' {
  
    export interface IMetaRecord {
      'a-index:version': never;
    }

  
}
declare module 'vona-module-a-index' {
  
        export interface MetaVersion {
          /** @internal */
          get scope(): ScopeModuleAIndex;
        }

          export interface MetaVersion {
            get $beanFullName(): 'a-index.meta.version';
            get $onionName(): 'a-index:version';
            
          } 
}
/** meta: end */
/** config: begin */
export * from '../config/config.ts';
import type { config } from '../config/config.ts';
/** config: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil, type TypeModuleConfig } from 'vona';
import { Scope } from 'vona-module-a-bean';

@Scope()
export class ScopeModuleAIndex extends BeanScopeBase {}

export interface ScopeModuleAIndex {
  util: BeanScopeUtil;
config: TypeModuleConfig<typeof config>;
}

import 'vona';
declare module 'vona' {
  export interface IBeanScopeRecord {
    'a-index': ScopeModuleAIndex;
  }

  export interface IBeanScopeContainer {
    index: ScopeModuleAIndex;
  }
  
  export interface IBeanScopeConfig {
    'a-index': ReturnType<typeof config>;
  }

  

  
}
/** scope: end */
