// eslint-disable
/** bean: begin */
export * from '../bean/bean.openapi.ts';

import 'vona';
declare module 'vona' {
  
  
}
declare module 'vona-module-a-openapi' {
  
        export interface BeanOpenapi {
          /** @internal */
          get scope(): ScopeModuleAOpenapi;
        } 
}
/** bean: end */
/** bean: begin */
import type { BeanOpenapi } from '../bean/bean.openapi.ts';
import 'vona';  
declare module 'vona' {
  export interface IBeanRecordGlobal {
    'openapi': BeanOpenapi;
  }
}
/** bean: end */
/** service: begin */
export * from '../service/openapi.ts';

import 'vona-module-a-bean';
declare module 'vona-module-a-bean' {
  
    export interface IServiceRecord {
      'a-openapi:openapi': never;
    }

  
}
declare module 'vona-module-a-openapi' {
  
        export interface ServiceOpenapi {
          /** @internal */
          get scope(): ScopeModuleAOpenapi;
        }

          export interface ServiceOpenapi {
            get $beanFullName(): 'a-openapi.service.openapi';
            get $onionName(): 'a-openapi:openapi';
            
          } 
}
/** service: end */
/** service: begin */
import type { ServiceOpenapi } from '../service/openapi.ts';
export interface IModuleService {
  'openapi': ServiceOpenapi;
}
/** service: end */
/** service: begin */

import 'vona';
declare module 'vona' {
  export interface IBeanRecordGeneral {
    'a-openapi.service.openapi': ServiceOpenapi;
  }
}
/** service: end */
/** summerCache: begin */
export * from '../bean/summerCache.json.ts';

import { type IDecoratorSummerCacheOptions } from 'vona-module-a-summer';
declare module 'vona-module-a-summer' {
  
    export interface ISummerCacheRecord {
      'a-openapi:json': IDecoratorSummerCacheOptions;
    }

  
}
declare module 'vona-module-a-openapi' {
  
        export interface SummerCacheJson {
          /** @internal */
          get scope(): ScopeModuleAOpenapi;
        }

          export interface SummerCacheJson {
            get $beanFullName(): 'a-openapi.summerCache.json';
            get $onionName(): 'a-openapi:json';
            get $onionOptions(): IDecoratorSummerCacheOptions;
          } 
}
/** summerCache: end */
/** summerCache: begin */
import type { SummerCacheJson } from '../bean/summerCache.json.ts';
export interface IModuleSummerCache {
  'json': SummerCacheJson;
}
/** summerCache: end */
/** config: begin */
export * from '../config/config.ts';
import type { config } from '../config/config.ts';
/** config: end */
/** main: begin */
export * from '../main.ts';
/** main: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil, type TypeModuleConfig } from 'vona';
import { Scope } from 'vona-module-a-bean';

@Scope()
export class ScopeModuleAOpenapi extends BeanScopeBase {}

export interface ScopeModuleAOpenapi {
  util: BeanScopeUtil;
config: TypeModuleConfig<typeof config>;
service: IModuleService;
summerCache: IModuleSummerCache;
}

import 'vona';
declare module 'vona' {
  export interface IBeanScopeRecord {
    'a-openapi': ScopeModuleAOpenapi;
  }

  export interface IBeanScopeContainer {
    openapi: ScopeModuleAOpenapi;
  }
  
  export interface IBeanScopeConfig {
    'a-openapi': ReturnType<typeof config>;
  }

  

  
}
/** scope: end */
