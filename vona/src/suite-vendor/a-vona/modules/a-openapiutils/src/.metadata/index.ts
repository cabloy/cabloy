// eslint-disable
/** locale: begin */
import { locales } from './locales.ts';
/** locale: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil, type TypeModuleLocales, type TypeLocaleBase } from 'vona';
import { Scope } from 'vona-module-a-bean';

@Scope()
export class ScopeModuleAOpenapiutils extends BeanScopeBase {}

export interface ScopeModuleAOpenapiutils {
  util: BeanScopeUtil;
locale: TypeModuleLocales<(typeof locales)[TypeLocaleBase]>;
}

import 'vona';
declare module 'vona' {
  export interface IBeanScopeRecord {
    'a-openapiutils': ScopeModuleAOpenapiutils;
  }

  export interface IBeanScopeContainer {
    openapiutils: ScopeModuleAOpenapiutils;
  }
  
  

  export interface IBeanScopeLocale {
    'a-openapiutils': (typeof locales)[TypeLocaleBase];
  }

  
}
/** scope: end */
