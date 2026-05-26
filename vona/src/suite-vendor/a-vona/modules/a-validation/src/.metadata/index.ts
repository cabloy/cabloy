// eslint-disable
/** bean: begin */
export * from '../bean/bean.validator.ts';

import 'vona';
declare module 'vona' {
  
  
}
declare module 'vona-module-a-validation' {
  
        export interface BeanValidator {
          /** @internal */
          get scope(): ScopeModuleAValidation;
        } 
}
/** bean: end */
/** bean: begin */
import type { BeanValidator } from '../bean/bean.validator.ts';
import 'vona';  
declare module 'vona' {
  export interface IBeanRecordGlobal {
    'validator': BeanValidator;
  }
}
/** bean: end */
/** locale: begin */
import { locales } from './locales.ts';
/** locale: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil, type TypeModuleLocales, type TypeLocaleBase } from 'vona';
import { Scope } from 'vona-module-a-bean';

@Scope()
export class ScopeModuleAValidation extends BeanScopeBase {}

export interface ScopeModuleAValidation {
  util: BeanScopeUtil;
locale: TypeModuleLocales<(typeof locales)[TypeLocaleBase]>;
}

import 'vona';
declare module 'vona' {
  export interface IBeanScopeRecord {
    'a-validation': ScopeModuleAValidation;
  }

  export interface IBeanScopeContainer {
    validation: ScopeModuleAValidation;
  }
  
  

  export interface IBeanScopeLocale {
    'a-validation': (typeof locales)[TypeLocaleBase];
  }

  
}
/** scope: end */
