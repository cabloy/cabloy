// eslint-disable
/** bean: begin */
export * from '../bean/bean.summer.ts';
export * from '../bean/bean.summerCacheBase.ts';

import 'vona';
declare module 'vona' {
  
  
}
declare module 'vona-module-a-summer' {
  
        export interface BeanSummer {
          /** @internal */
          get scope(): ScopeModuleASummer;
        } 
}
/** bean: end */
/** bean: begin */
import type { BeanSummer } from '../bean/bean.summer.ts';
import 'vona';  
declare module 'vona' {
  export interface IBeanRecordGlobal {
    'summer': BeanSummer;
  }
}
/** bean: end */
/** service: begin */
export * from '../service/localFetch_.ts';
export * from '../service/localMem_.ts';
export * from '../service/localRedis_.ts';

import 'vona-module-a-bean';
declare module 'vona-module-a-bean' {
  
  
}
declare module 'vona-module-a-summer' {
   
}
/** service: end */
/** config: begin */
export * from '../config/config.ts';
import type { config } from '../config/config.ts';
/** config: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil, type TypeModuleConfig } from 'vona';
import { Scope } from 'vona-module-a-bean';

@Scope()
export class ScopeModuleASummer extends BeanScopeBase {}

export interface ScopeModuleASummer {
  util: BeanScopeUtil;
config: TypeModuleConfig<typeof config>;
}

import 'vona';
declare module 'vona' {
  export interface IBeanScopeRecord {
    'a-summer': ScopeModuleASummer;
  }

  export interface IBeanScopeContainer {
    summer: ScopeModuleASummer;
  }
  
  export interface IBeanScopeConfig {
    'a-summer': ReturnType<typeof config>;
  }

  

  
}
/** scope: end */
