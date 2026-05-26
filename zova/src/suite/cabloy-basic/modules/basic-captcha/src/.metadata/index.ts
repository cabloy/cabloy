// eslint-disable
/** controller: begin */
export * from '../component/formFieldCaptcha/controller.jsx';

import 'zova';
declare module 'zova' {
  
  
}
declare module 'zova-module-basic-captcha' {
  
        export interface ControllerFormFieldCaptcha {
          /** @internal */
          get scope(): ScopeModuleBasicCaptcha;
        } 
}
/** controller: end */
/** controller: begin */
import { ControllerFormFieldCaptcha } from '../component/formFieldCaptcha/controller.jsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordLocal {
    'basic-captcha.controller.formFieldCaptcha': ControllerFormFieldCaptcha;
  }
}
/** controller: end */

/** components: begin */
export * from './component/formFieldCaptcha.js';
import { ZFormFieldCaptcha } from './component/formFieldCaptcha.js';
export const components = {
  'formFieldCaptcha': ZFormFieldCaptcha,
};
import 'zova';
declare module 'zova' {
export interface IComponentRecord {
  'basic-captcha:formFieldCaptcha': ControllerFormFieldCaptcha;
}
export interface IZovaComponentRecord {
  'basic-captcha:formFieldCaptcha': typeof ZFormFieldCaptcha;
}
}
/** components: end */
/** locale: begin */
import { locales } from './locales.js';
/** locale: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil, TypeModuleLocales, TypeLocaleBase } from 'zova';
import { Scope } from 'zova-module-a-bean';

@Scope()
export class ScopeModuleBasicCaptcha extends BeanScopeBase {}

export interface ScopeModuleBasicCaptcha {
  util: BeanScopeUtil;
locale: TypeModuleLocales<(typeof locales)[TypeLocaleBase]>;
}

import 'zova';
declare module 'zova' {
  export interface IBeanScopeRecord {
    'basic-captcha': ScopeModuleBasicCaptcha;
  }
  
  

  export interface IBeanScopeLocale {
    'basic-captcha': (typeof locales)[TypeLocaleBase];
  }

  
}

export function locale<K extends keyof (typeof locales)[TypeLocaleBase]>(key: K): `basic-captcha::${K}` {
  return `basic-captcha::${key}`;
}  
/** scope: end */
