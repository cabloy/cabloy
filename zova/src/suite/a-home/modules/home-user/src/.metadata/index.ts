// eslint-disable
/** model: begin */
export * from '../model/account.js';
import { IModelOptionsAccount } from '../model/account.js';
import 'zova-module-a-model';
declare module 'zova-module-a-model' {
  
    export interface IModelRecord {
      'home-user:account': IModelOptionsAccount;
    }

  
}
declare module 'zova-module-home-user' {
  
        export interface ModelAccount {
          /** @internal */
          get scope(): ScopeModuleHomeUser;
        }

        export interface ModelAccount {
          get $beanFullName(): 'home-user.model.account';
          get $onionName(): 'home-user:account';
          get $onionOptions(): IModelOptionsAccount;
        } 
}
/** model: end */
/** model: begin */
import { ModelAccount } from '../model/account.js';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'home-user.model.account': ModelAccount;
  }
}
/** model: end */
/** controller: begin */
export * from '../page/account/controller.jsx';
export * from '../page/activation/controller.jsx';
export * from '../page/passwordReset/controller.jsx';
export * from '../page/passwordSet/controller.jsx';

import 'zova';
declare module 'zova' {
  
  
}
declare module 'zova-module-home-user' {
  
        export interface ControllerPageAccount {
          /** @internal */
          get scope(): ScopeModuleHomeUser;
        }

        export interface ControllerPageActivation {
          /** @internal */
          get scope(): ScopeModuleHomeUser;
        }

        export interface ControllerPagePasswordReset {
          /** @internal */
          get scope(): ScopeModuleHomeUser;
        }

        export interface ControllerPagePasswordSet {
          /** @internal */
          get scope(): ScopeModuleHomeUser;
        } 
}
/** controller: end */
/** controller: begin */
import { ControllerPageAccount } from '../page/account/controller.jsx';
import { ControllerPageActivation } from '../page/activation/controller.jsx';
import { ControllerPagePasswordReset } from '../page/passwordReset/controller.jsx';
import { ControllerPagePasswordSet } from '../page/passwordSet/controller.jsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordLocal {
    'home-user.controller.pageAccount': ControllerPageAccount;
'home-user.controller.pageActivation': ControllerPageActivation;
'home-user.controller.pagePasswordReset': ControllerPagePasswordReset;
'home-user.controller.pagePasswordSet': ControllerPagePasswordSet;
  }
}
/** controller: end */
/** pages: begin */
export * from './page/account.js';
export * from './page/activation.js';
import { NSControllerPageActivation } from './page/activation.js';
export * from './page/passwordReset.js';
import { NSControllerPagePasswordReset } from './page/passwordReset.js';
export * from './page/passwordSet.js';
import { NSControllerPagePasswordSet } from './page/passwordSet.js';
export * from '../routes.js';
import { TypePagePathSchema } from 'zova-module-a-router';
import 'zova';
declare module 'zova-module-a-router' {
export interface IPagePathRecord {
  '/home/user/account': TypePagePathSchema<undefined,undefined>;
'/home/user/activation': TypePagePathSchema<undefined,NSControllerPageActivation.QueryInput>;
'/home/user/password-reset': TypePagePathSchema<undefined,NSControllerPagePasswordReset.QueryInput>;
'/home/user/password-set': TypePagePathSchema<undefined,NSControllerPagePasswordSet.QueryInput>;
}
export interface IPageNameRecord {
  
}
}
export const pagePathSchemas = {
'/home/user/activation': {
          query: NSControllerPageActivation.querySchema,
        },
'/home/user/password-reset': {
          query: NSControllerPagePasswordReset.querySchema,
        },
'/home/user/password-set': {
          query: NSControllerPagePasswordSet.querySchema,
        },
};
export const pageNameSchemas = {

};
declare module 'zova-module-home-user' {
  export interface ControllerPageActivation {
        $query: NSControllerPageActivation.QueryOutput;
      }
export interface ControllerPagePasswordReset {
        $query: NSControllerPagePasswordReset.QueryOutput;
      }
export interface ControllerPagePasswordSet {
        $query: NSControllerPagePasswordSet.QueryOutput;
      }
}
/** pages: end */

/** locale: begin */
import { locales } from './locales.js';
/** locale: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil, TypeModuleLocales, TypeLocaleBase } from 'zova';
import { Scope } from 'zova-module-a-bean';

@Scope()
export class ScopeModuleHomeUser extends BeanScopeBase {}

export interface ScopeModuleHomeUser {
  util: BeanScopeUtil;
locale: TypeModuleLocales<(typeof locales)[TypeLocaleBase]>;
}

import 'zova';
declare module 'zova' {
  export interface IBeanScopeRecord {
    'home-user': ScopeModuleHomeUser;
  }
  
  

  export interface IBeanScopeLocale {
    'home-user': (typeof locales)[TypeLocaleBase];
  }

  
}

export function locale<K extends keyof (typeof locales)[TypeLocaleBase]>(key: K): `home-user::${K}` {
  return `home-user::${key}`;
}
/** scope: end */
