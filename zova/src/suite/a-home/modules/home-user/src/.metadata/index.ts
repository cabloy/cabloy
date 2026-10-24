// eslint-disable
/** model: begin */
export * from '../model/account.ts';
import { IModelOptionsAccount } from '../model/account.ts';
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
import type { ModelAccount } from '../model/account.ts';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'home-user.model.account': ModelAccount;
  }
}
/** model: end */
/** controller: begin */
export * from '../page/account/controller.tsx';
export * from '../page/activation/controller.tsx';
export * from '../page/passwordReset/controller.tsx';
export * from '../page/passwordSet/controller.tsx';

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
import type { ControllerPageAccount } from '../page/account/controller.tsx';
import type { ControllerPageActivation } from '../page/activation/controller.tsx';
import type { ControllerPagePasswordReset } from '../page/passwordReset/controller.tsx';
import type { ControllerPagePasswordSet } from '../page/passwordSet/controller.tsx';
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
export * from './page/account.ts';
export * from './page/activation.ts';
import { NSControllerPageActivation } from './page/activation.ts';
export * from './page/passwordReset.ts';
import { NSControllerPagePasswordReset } from './page/passwordReset.ts';
export * from './page/passwordSet.ts';
import { NSControllerPagePasswordSet } from './page/passwordSet.ts';
export * from '../routes.ts';
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
import { locales } from './locales.ts';
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
