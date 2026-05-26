// eslint-disable
/** bean: begin */
export * from '../bean/bean.redis.ts';

import 'vona';
declare module 'vona' {
  
  
}
declare module 'vona-module-a-redis' {
  
        export interface BeanRedis {
          /** @internal */
          get scope(): ScopeModuleARedis;
        } 
}
/** bean: end */
/** bean: begin */
import type { BeanRedis } from '../bean/bean.redis.ts';
import 'vona';  
declare module 'vona' {
  export interface IBeanRecordGlobal {
    'redis': BeanRedis;
  }
}
/** bean: end */
/** service: begin */
export * from '../service/redis.ts';
export * from '../service/redisClient_.ts';

import 'vona-module-a-bean';
declare module 'vona-module-a-bean' {
  
    export interface IServiceRecord {
      'a-redis:redis': never;
    }

  
}
declare module 'vona-module-a-redis' {
  
        export interface ServiceRedis {
          /** @internal */
          get scope(): ScopeModuleARedis;
        }

          export interface ServiceRedis {
            get $beanFullName(): 'a-redis.service.redis';
            get $onionName(): 'a-redis:redis';
            
          } 
}
/** service: end */
/** service: begin */
import type { ServiceRedis } from '../service/redis.ts';
export interface IModuleService {
  'redis': ServiceRedis;
}
/** service: end */
/** service: begin */

import 'vona';
declare module 'vona' {
  export interface IBeanRecordGeneral {
    'a-redis.service.redis': ServiceRedis;
  }
}
/** service: end */
/** main: begin */
export * from '../main.ts';
/** main: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil } from 'vona';
import { Scope } from 'vona-module-a-bean';

@Scope()
export class ScopeModuleARedis extends BeanScopeBase {}

export interface ScopeModuleARedis {
  util: BeanScopeUtil;
service: IModuleService;
}

import 'vona';
declare module 'vona' {
  export interface IBeanScopeRecord {
    'a-redis': ScopeModuleARedis;
  }

  export interface IBeanScopeContainer {
    redis: ScopeModuleARedis;
  }
  
  

  

  
}
/** scope: end */
