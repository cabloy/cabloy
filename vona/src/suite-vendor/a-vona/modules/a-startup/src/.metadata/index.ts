// eslint-disable
/** service: begin */
export * from '../service/startup.ts';

import 'vona-module-a-bean';
declare module 'vona-module-a-bean' {
  
    export interface IServiceRecord {
      'a-startup:startup': never;
    }

  
}
declare module 'vona-module-a-startup' {
  
        export interface ServiceStartup {
          /** @internal */
          get scope(): ScopeModuleAStartup;
        }

          export interface ServiceStartup {
            get $beanFullName(): 'a-startup.service.startup';
            get $onionName(): 'a-startup:startup';
            
          } 
}
/** service: end */
/** service: begin */
import type { ServiceStartup } from '../service/startup.ts';
export interface IModuleService {
  'startup': ServiceStartup;
}
/** service: end */
/** service: begin */

import 'vona';
declare module 'vona' {
  export interface IBeanRecordGeneral {
    'a-startup.service.startup': ServiceStartup;
  }
}
/** service: end */
/** cacheRedis: begin */
export * from '../bean/cacheRedis.startupDebounce.ts';

import { type IDecoratorCacheRedisOptions } from 'vona-module-a-cache';
declare module 'vona-module-a-cache' {
  
    export interface ICacheRedisRecord {
      'a-startup:startupDebounce': IDecoratorCacheRedisOptions;
    }

  
}
declare module 'vona-module-a-startup' {
  
        export interface CacheRedisStartupDebounce {
          /** @internal */
          get scope(): ScopeModuleAStartup;
        }

          export interface CacheRedisStartupDebounce {
            get $beanFullName(): 'a-startup.cacheRedis.startupDebounce';
            get $onionName(): 'a-startup:startupDebounce';
            get $onionOptions(): IDecoratorCacheRedisOptions;
          } 
}
/** cacheRedis: end */
/** cacheRedis: begin */
import type { CacheRedisStartupDebounce } from '../bean/cacheRedis.startupDebounce.ts';
export interface IModuleCacheRedis {
  'startupDebounce': CacheRedisStartupDebounce;
}
/** cacheRedis: end */
/** hmr: begin */
export * from '../bean/hmr.startup.ts';

import 'vona';
declare module 'vona' {
  
    export interface IHmrRecord {
      'a-startup:startup': never;
    }

  
}
declare module 'vona-module-a-startup' {
  
        export interface HmrStartup {
          /** @internal */
          get scope(): ScopeModuleAStartup;
        }

          export interface HmrStartup {
            get $beanFullName(): 'a-startup.hmr.startup';
            get $onionName(): 'a-startup:startup';
            
          } 
}
/** hmr: end */
/** meta: begin */
export * from '../bean/meta.redlock.ts';

import 'vona-module-a-meta';
declare module 'vona-module-a-meta' {
  
    export interface IMetaRecord {
      'a-startup:redlock': never;
    }

  
}
declare module 'vona-module-a-startup' {
  
        export interface MetaRedlock {
          /** @internal */
          get scope(): ScopeModuleAStartup;
        }

          export interface MetaRedlock {
            get $beanFullName(): 'a-startup.meta.redlock';
            get $onionName(): 'a-startup:redlock';
            
          } 
}
/** meta: end */
/** meta redlock: begin */
import type { MetaRedlock } from '../bean/meta.redlock.ts';
/** meta redlock: end */
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
export class ScopeModuleAStartup extends BeanScopeBase {}

export interface ScopeModuleAStartup {
  util: BeanScopeUtil;
config: TypeModuleConfig<typeof config>;
service: IModuleService;
cacheRedis: IModuleCacheRedis;
redlock: MetaRedlock;
}

import 'vona';
declare module 'vona' {
  export interface IBeanScopeRecord {
    'a-startup': ScopeModuleAStartup;
  }

  export interface IBeanScopeContainer {
    startup: ScopeModuleAStartup;
  }
  
  export interface IBeanScopeConfig {
    'a-startup': ReturnType<typeof config>;
  }

  

  
}
/** scope: end */
