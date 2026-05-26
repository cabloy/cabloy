// eslint-disable
import type { TypeControllerOptionsActions } from 'vona-module-a-openapi';
/** bean: begin */
export * from '../bean/bean.mailConfirm.ts';

import 'vona';
declare module 'vona' {
  
  
}
declare module 'vona-module-a-mailconfirm' {
  
        export interface BeanMailConfirm {
          /** @internal */
          get scope(): ScopeModuleAMailconfirm;
        } 
}
/** bean: end */
/** bean: begin */
import type { BeanMailConfirm } from '../bean/bean.mailConfirm.ts';
import 'vona';  
declare module 'vona' {
  export interface IBeanRecordGlobal {
    'mailConfirm': BeanMailConfirm;
  }
}
/** bean: end */
/** cacheRedis: begin */
export * from '../bean/cacheRedis.emailConfirm.ts';
export * from '../bean/cacheRedis.passwordReset.ts';

import { type IDecoratorCacheRedisOptions } from 'vona-module-a-cache';
declare module 'vona-module-a-cache' {
  
    export interface ICacheRedisRecord {
      'a-mailconfirm:emailConfirm': IDecoratorCacheRedisOptions;
'a-mailconfirm:passwordReset': IDecoratorCacheRedisOptions;
    }

  
}
declare module 'vona-module-a-mailconfirm' {
  
        export interface CacheRedisEmailConfirm {
          /** @internal */
          get scope(): ScopeModuleAMailconfirm;
        }

          export interface CacheRedisEmailConfirm {
            get $beanFullName(): 'a-mailconfirm.cacheRedis.emailConfirm';
            get $onionName(): 'a-mailconfirm:emailConfirm';
            get $onionOptions(): IDecoratorCacheRedisOptions;
          }

        export interface CacheRedisPasswordReset {
          /** @internal */
          get scope(): ScopeModuleAMailconfirm;
        }

          export interface CacheRedisPasswordReset {
            get $beanFullName(): 'a-mailconfirm.cacheRedis.passwordReset';
            get $onionName(): 'a-mailconfirm:passwordReset';
            get $onionOptions(): IDecoratorCacheRedisOptions;
          } 
}
/** cacheRedis: end */
/** cacheRedis: begin */
import type { CacheRedisEmailConfirm } from '../bean/cacheRedis.emailConfirm.ts';
import type { CacheRedisPasswordReset } from '../bean/cacheRedis.passwordReset.ts';
export interface IModuleCacheRedis {
  'emailConfirm': CacheRedisEmailConfirm;
'passwordReset': CacheRedisPasswordReset;
}
/** cacheRedis: end */
/** event: begin */
export * from '../bean/event.emailConfirmCallback.ts';
export * from '../bean/event.passwordResetCallback.ts';

import 'vona';
declare module 'vona' {
  
  
}
declare module 'vona-module-a-mailconfirm' {
  
        export interface EventEmailConfirmCallback {
          /** @internal */
          get scope(): ScopeModuleAMailconfirm;
        }

          export interface EventEmailConfirmCallback {
            get $beanFullName(): 'a-mailconfirm.event.emailConfirmCallback';
            get $onionName(): 'a-mailconfirm:emailConfirmCallback';
            
          }

        export interface EventPasswordResetCallback {
          /** @internal */
          get scope(): ScopeModuleAMailconfirm;
        }

          export interface EventPasswordResetCallback {
            get $beanFullName(): 'a-mailconfirm.event.passwordResetCallback';
            get $onionName(): 'a-mailconfirm:passwordResetCallback';
            
          } 
}
/** event: end */
/** event: begin */
import type { EventEmailConfirmCallback } from '../bean/event.emailConfirmCallback.ts';
import type { EventPasswordResetCallback } from '../bean/event.passwordResetCallback.ts';
export interface IModuleEvent {
  'emailConfirmCallback': EventEmailConfirmCallback;
'passwordResetCallback': EventPasswordResetCallback;
}
/** event: end */
/** event: begin */
import type { TypeEventEmailConfirmCallbackData, TypeEventEmailConfirmCallbackResult } from '../bean/event.emailConfirmCallback.ts';
import type { TypeEventPasswordResetCallbackData, TypeEventPasswordResetCallbackResult } from '../bean/event.passwordResetCallback.ts';
import type { EventOn } from 'vona-module-a-event'; 
declare module 'vona-module-a-event' {
  export interface IEventRecord {
    'a-mailconfirm:emailConfirmCallback': EventOn<TypeEventEmailConfirmCallbackData, TypeEventEmailConfirmCallbackResult>;
'a-mailconfirm:passwordResetCallback': EventOn<TypeEventPasswordResetCallbackData, TypeEventPasswordResetCallbackResult>;
  }
}
/** event: end */
/** controller: begin */
export * from '../controller/mail.ts';
import type { IControllerOptionsMail } from '../controller/mail.ts';
import 'vona-module-a-web';
declare module 'vona-module-a-web' {
  
    export interface IControllerRecord {
      'a-mailconfirm:mail': IControllerOptionsMail;
    }

  
}
declare module 'vona-module-a-mailconfirm' {
  
        export interface ControllerMail {
          /** @internal */
          get scope(): ScopeModuleAMailconfirm;
        }

          export interface ControllerMail {
            get $beanFullName(): 'a-mailconfirm.controller.mail';
            get $onionName(): 'a-mailconfirm:mail';
            get $onionOptions(): IControllerOptionsMail;
          } 
}
/** controller: end */
/** controller: begin */
// @ts-ignore ignore
import type { ControllerMail } from '../controller/mail.ts';
declare module 'vona-module-a-mailconfirm' {
  
    export interface IControllerOptionsMail {
      actions?: TypeControllerOptionsActions<ControllerMail>;
    }
}
declare module 'vona-module-a-web' {
  export interface IApiPathGetRecord{
        '/mailconfirm/mail/emailConfirmCallback': undefined;
'/mailconfirm/mail/passwordResetCallback': undefined;
    }

}

/** controller: end */
/** locale: begin */
import { locales } from './locales.ts';
/** locale: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil, type TypeModuleLocales, type TypeLocaleBase } from 'vona';
import { Scope } from 'vona-module-a-bean';

@Scope()
export class ScopeModuleAMailconfirm extends BeanScopeBase {}

export interface ScopeModuleAMailconfirm {
  util: BeanScopeUtil;
locale: TypeModuleLocales<(typeof locales)[TypeLocaleBase]>;
cacheRedis: IModuleCacheRedis;
event: IModuleEvent;
}

import 'vona';
declare module 'vona' {
  export interface IBeanScopeRecord {
    'a-mailconfirm': ScopeModuleAMailconfirm;
  }

  export interface IBeanScopeContainer {
    mailconfirm: ScopeModuleAMailconfirm;
  }
  
  

  export interface IBeanScopeLocale {
    'a-mailconfirm': (typeof locales)[TypeLocaleBase];
  }

  
}
/** scope: end */
