// eslint-disable
/** controller: begin */
export * from '../page/login/controller.jsx';

import 'zova';
declare module 'zova' {
  
  
}
declare module 'zova-module-home-login' {
  
        export interface ControllerPageLogin {
          /** @internal */
          get scope(): ScopeModuleHomeLogin;
        } 
}
/** controller: end */
/** controller: begin */
import { ControllerPageLogin } from '../page/login/controller.jsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordLocal {
    'home-login.controller.pageLogin': ControllerPageLogin;
  }
}
/** controller: end */
/** pages: begin */
export * from './page/login.js';
export * from '../routes.js';
import { TypePagePathSchema } from 'zova-module-a-router';
import 'zova';
declare module 'zova-module-a-router' {
export interface IPagePathRecord {
  '/home/login': TypePagePathSchema<undefined,undefined>;
}
export interface IPageNameRecord {
  
}
}
export const pagePathSchemas = {

};
export const pageNameSchemas = {

};
declare module 'zova-module-home-login' {
  
}
/** pages: end */

/** render: begin */
export * from '../page/login/render.jsx';

import 'zova';
declare module 'zova' {
  
  
}
declare module 'zova-module-home-login' {
  
        export interface RenderPageLogin {
          /** @internal */
          get scope(): ScopeModuleHomeLogin;
        } 
}
/** render: end */
/** render: begin */
import { RenderPageLogin } from '../page/login/render.jsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordLocal {
    'home-login.render.pageLogin': RenderPageLogin;
  }
}
/** render: end */
/** behavior: begin */
export * from '../bean/behavior.formFieldLayoutLogin.jsx';
import { IBehaviorOptionsFormFieldLayoutLogin } from '../bean/behavior.formFieldLayoutLogin.jsx';
import 'zova-module-a-behavior';
declare module 'zova-module-a-behavior' {
  
    export interface IBehaviorRecord {
      'home-login:formFieldLayoutLogin': IBehaviorOptionsFormFieldLayoutLogin;
    }

  
}
declare module 'zova-module-home-login' {
  
        export interface BehaviorFormFieldLayoutLogin {
          /** @internal */
          get scope(): ScopeModuleHomeLogin;
        }

        export interface BehaviorFormFieldLayoutLogin {
          get $beanFullName(): 'home-login.behavior.formFieldLayoutLogin';
          get $onionName(): 'home-login:formFieldLayoutLogin';
          get $onionOptions(): IBehaviorOptionsFormFieldLayoutLogin;
        } 
}
/** behavior: end */
/** behavior: begin */
import { BehaviorFormFieldLayoutLogin } from '../bean/behavior.formFieldLayoutLogin.jsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordLocal {
    'home-login.behavior.formFieldLayoutLogin': BehaviorFormFieldLayoutLogin;
  }
}
/** behavior: end */
/** behaviors: begin */
import 'vue';
import 'vue/jsx-runtime';

declare module 'vue' {
  export interface InputHTMLAttributes {
    'bs-home-login-formFieldLayoutLogin'?: IBehaviorOptionsFormFieldLayoutLogin | '' | boolean;
  }
}

declare module 'vue/jsx-runtime' {
  namespace JSX {
    // need define class/style in IntrinsicAttributes
    export interface IntrinsicAttributes {
      'bs-home-login-formFieldLayoutLogin'?: IBehaviorOptionsFormFieldLayoutLogin | '' | boolean;
    }
  }
}
/** behaviors: end */
/** locale: begin */
import { locales } from './locales.js';
/** locale: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil, TypeModuleLocales, TypeLocaleBase } from 'zova';
import { Scope } from 'zova-module-a-bean';

@Scope()
export class ScopeModuleHomeLogin extends BeanScopeBase {}

export interface ScopeModuleHomeLogin {
  util: BeanScopeUtil;
locale: TypeModuleLocales<(typeof locales)[TypeLocaleBase]>;
}

import 'zova';
declare module 'zova' {
  export interface IBeanScopeRecord {
    'home-login': ScopeModuleHomeLogin;
  }
  
  

  export interface IBeanScopeLocale {
    'home-login': (typeof locales)[TypeLocaleBase];
  }

  
}

export function locale<K extends keyof (typeof locales)[TypeLocaleBase]>(key: K): `home-login::${K}` {
  return `home-login::${key}`;
}  
/** scope: end */
