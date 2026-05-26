// eslint-disable
/** guard: begin */
export * from '../bean/guard.passport.ts';
export * from '../bean/guard.roleName.ts';
export * from '../bean/guard.userName.ts';
import type { IGuardOptionsPassport } from '../bean/guard.passport.ts';
import type { IGuardOptionsRoleName } from '../bean/guard.roleName.ts';
import type { IGuardOptionsUserName } from '../bean/guard.userName.ts';
import 'vona-module-a-aspect';
declare module 'vona-module-a-aspect' {
  
    export interface IGuardRecordGlobal {
      'a-user:passport': IGuardOptionsPassport;
    }

  
export interface IGuardRecordLocal {
  'a-user:roleName': IGuardOptionsRoleName;
'a-user:userName': IGuardOptionsUserName;
}

}
declare module 'vona-module-a-user' {
  
        export interface GuardPassport {
          /** @internal */
          get scope(): ScopeModuleAUser;
        }

          export interface GuardPassport {
            get $beanFullName(): 'a-user.guard.passport';
            get $onionName(): 'a-user:passport';
            get $onionOptions(): IGuardOptionsPassport;
          }

        export interface GuardRoleName {
          /** @internal */
          get scope(): ScopeModuleAUser;
        }

          export interface GuardRoleName {
            get $beanFullName(): 'a-user.guard.roleName';
            get $onionName(): 'a-user:roleName';
            get $onionOptions(): IGuardOptionsRoleName;
          }

        export interface GuardUserName {
          /** @internal */
          get scope(): ScopeModuleAUser;
        }

          export interface GuardUserName {
            get $beanFullName(): 'a-user.guard.userName';
            get $onionName(): 'a-user:userName';
            get $onionOptions(): IGuardOptionsUserName;
          } 
}
/** guard: end */
/** bean: begin */
export * from '../bean/bean.passport.ts';
export * from '../bean/bean.role.ts';
export * from '../bean/bean.user.ts';

import 'vona';
declare module 'vona' {
  
  
}
declare module 'vona-module-a-user' {
  
        export interface BeanPassport {
          /** @internal */
          get scope(): ScopeModuleAUser;
        }

        export interface BeanRole {
          /** @internal */
          get scope(): ScopeModuleAUser;
        }

        export interface BeanUser {
          /** @internal */
          get scope(): ScopeModuleAUser;
        } 
}
/** bean: end */
/** bean: begin */
import type { BeanPassport } from '../bean/bean.passport.ts';
import type { BeanRole } from '../bean/bean.role.ts';
import type { BeanUser } from '../bean/bean.user.ts';
import 'vona';  
declare module 'vona' {
  export interface IBeanRecordGlobal {
    'passport': BeanPassport;
'role': BeanRole;
'user': BeanUser;
  }
}
/** bean: end */
/** service: begin */
export * from '../service/authTokenAdapter.ts';
export * from '../service/redisToken.ts';

import 'vona-module-a-bean';
declare module 'vona-module-a-bean' {
  
    export interface IServiceRecord {
      'a-user:authTokenAdapter': never;
'a-user:redisToken': never;
    }

  
}
declare module 'vona-module-a-user' {
  
        export interface ServiceAuthTokenAdapter {
          /** @internal */
          get scope(): ScopeModuleAUser;
        }

          export interface ServiceAuthTokenAdapter {
            get $beanFullName(): 'a-user.service.authTokenAdapter';
            get $onionName(): 'a-user:authTokenAdapter';
            
          }

        export interface ServiceRedisToken {
          /** @internal */
          get scope(): ScopeModuleAUser;
        }

          export interface ServiceRedisToken {
            get $beanFullName(): 'a-user.service.redisToken';
            get $onionName(): 'a-user:redisToken';
            
          } 
}
/** service: end */
/** service: begin */
import type { ServiceAuthTokenAdapter } from '../service/authTokenAdapter.ts';
import type { ServiceRedisToken } from '../service/redisToken.ts';
export interface IModuleService {
  'authTokenAdapter': ServiceAuthTokenAdapter;
'redisToken': ServiceRedisToken;
}
/** service: end */
/** service: begin */

import 'vona';
declare module 'vona' {
  export interface IBeanRecordGeneral {
    'a-user.service.authTokenAdapter': ServiceAuthTokenAdapter;
'a-user.service.redisToken': ServiceRedisToken;
  }
}
/** service: end */
/** cacheRedis: begin */
export * from '../bean/cacheRedis.authToken.ts';

import { type IDecoratorCacheRedisOptions } from 'vona-module-a-cache';
declare module 'vona-module-a-cache' {
  
    export interface ICacheRedisRecord {
      'a-user:authToken': IDecoratorCacheRedisOptions;
    }

  
}
declare module 'vona-module-a-user' {
  
        export interface CacheRedisAuthToken {
          /** @internal */
          get scope(): ScopeModuleAUser;
        }

          export interface CacheRedisAuthToken {
            get $beanFullName(): 'a-user.cacheRedis.authToken';
            get $onionName(): 'a-user:authToken';
            get $onionOptions(): IDecoratorCacheRedisOptions;
          } 
}
/** cacheRedis: end */
/** cacheRedis: begin */
import type { CacheRedisAuthToken } from '../bean/cacheRedis.authToken.ts';
export interface IModuleCacheRedis {
  'authToken': CacheRedisAuthToken;
}
/** cacheRedis: end */
/** event: begin */
export * from '../bean/event.activate.ts';
export * from '../bean/event.createAnonymous.ts';
export * from '../bean/event.register.ts';
export * from '../bean/event.signin.ts';
export * from '../bean/event.signout.ts';

import 'vona';
declare module 'vona' {
  
  
}
declare module 'vona-module-a-user' {
  
        export interface EventActivate {
          /** @internal */
          get scope(): ScopeModuleAUser;
        }

          export interface EventActivate {
            get $beanFullName(): 'a-user.event.activate';
            get $onionName(): 'a-user:activate';
            
          }

        export interface EventCreateAnonymous {
          /** @internal */
          get scope(): ScopeModuleAUser;
        }

          export interface EventCreateAnonymous {
            get $beanFullName(): 'a-user.event.createAnonymous';
            get $onionName(): 'a-user:createAnonymous';
            
          }

        export interface EventRegister {
          /** @internal */
          get scope(): ScopeModuleAUser;
        }

          export interface EventRegister {
            get $beanFullName(): 'a-user.event.register';
            get $onionName(): 'a-user:register';
            
          }

        export interface EventSignin {
          /** @internal */
          get scope(): ScopeModuleAUser;
        }

          export interface EventSignin {
            get $beanFullName(): 'a-user.event.signin';
            get $onionName(): 'a-user:signin';
            
          }

        export interface EventSignout {
          /** @internal */
          get scope(): ScopeModuleAUser;
        }

          export interface EventSignout {
            get $beanFullName(): 'a-user.event.signout';
            get $onionName(): 'a-user:signout';
            
          } 
}
/** event: end */
/** event: begin */
import type { EventActivate } from '../bean/event.activate.ts';
import type { EventCreateAnonymous } from '../bean/event.createAnonymous.ts';
import type { EventRegister } from '../bean/event.register.ts';
import type { EventSignin } from '../bean/event.signin.ts';
import type { EventSignout } from '../bean/event.signout.ts';
export interface IModuleEvent {
  'activate': EventActivate;
'createAnonymous': EventCreateAnonymous;
'register': EventRegister;
'signin': EventSignin;
'signout': EventSignout;
}
/** event: end */
/** event: begin */
import type { TypeEventActivateData, TypeEventActivateResult } from '../bean/event.activate.ts';
import type { TypeEventCreateAnonymousData, TypeEventCreateAnonymousResult } from '../bean/event.createAnonymous.ts';
import type { TypeEventRegisterData, TypeEventRegisterResult } from '../bean/event.register.ts';
import type { TypeEventSigninData, TypeEventSigninResult } from '../bean/event.signin.ts';
import type { TypeEventSignoutData, TypeEventSignoutResult } from '../bean/event.signout.ts';
import type { EventOn } from 'vona-module-a-event'; 
declare module 'vona-module-a-event' {
  export interface IEventRecord {
    'a-user:activate': EventOn<TypeEventActivateData, TypeEventActivateResult>;
'a-user:createAnonymous': EventOn<TypeEventCreateAnonymousData, TypeEventCreateAnonymousResult>;
'a-user:register': EventOn<TypeEventRegisterData, TypeEventRegisterResult>;
'a-user:signin': EventOn<TypeEventSigninData, TypeEventSigninResult>;
'a-user:signout': EventOn<TypeEventSignoutData, TypeEventSignoutResult>;
  }
}
/** event: end */
/** meta: begin */
export * from '../bean/meta.printTip.ts';
export * from '../bean/meta.runtime.ts';

import 'vona-module-a-meta';
declare module 'vona-module-a-meta' {
  
    export interface IMetaRecord {
      'a-user:printTip': never;
'a-user:runtime': never;
    }

  
}
declare module 'vona-module-a-user' {
  
        export interface MetaPrintTip {
          /** @internal */
          get scope(): ScopeModuleAUser;
        }

          export interface MetaPrintTip {
            get $beanFullName(): 'a-user.meta.printTip';
            get $onionName(): 'a-user:printTip';
            
          }

        export interface MetaRuntime {
          /** @internal */
          get scope(): ScopeModuleAUser;
        }

          export interface MetaRuntime {
            get $beanFullName(): 'a-user.meta.runtime';
            get $onionName(): 'a-user:runtime';
            
          } 
}
/** meta: end */
/** config: begin */
export * from '../config/config.ts';
import type { config } from '../config/config.ts';
/** config: end */
/** locale: begin */
import { locales } from './locales.ts';
/** locale: end */
/** error: begin */
export * from '../config/errors.ts';
import type { errors } from '../config/errors.ts';
/** error: end */
/** main: begin */
export * from '../main.ts';
/** main: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil, type TypeModuleConfig, type TypeModuleErrors, type TypeModuleLocales, type TypeLocaleBase } from 'vona';
import { Scope } from 'vona-module-a-bean';

@Scope()
export class ScopeModuleAUser extends BeanScopeBase {}

export interface ScopeModuleAUser {
  util: BeanScopeUtil;
config: TypeModuleConfig<typeof config>;
error: TypeModuleErrors<typeof errors>;
locale: TypeModuleLocales<(typeof locales)[TypeLocaleBase]>;
service: IModuleService;
cacheRedis: IModuleCacheRedis;
event: IModuleEvent;
}

import 'vona';
declare module 'vona' {
  export interface IBeanScopeRecord {
    'a-user': ScopeModuleAUser;
  }

  export interface IBeanScopeContainer {
    user: ScopeModuleAUser;
  }
  
  export interface IBeanScopeConfig {
    'a-user': ReturnType<typeof config>;
  }

  export interface IBeanScopeLocale {
    'a-user': (typeof locales)[TypeLocaleBase];
  }

  export interface IBeanScopeErrors {
    'a-user': typeof errors;
  }
}
/** scope: end */
