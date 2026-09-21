// eslint-disable
/** guard: begin */
export * from '../bean/guard.demonstration.ts';
import type { IGuardOptionsDemonstration } from '../bean/guard.demonstration.ts';
import 'vona-module-a-aspect';
declare module 'vona-module-a-aspect' {

    export interface IGuardRecordGlobal {
      'a-demonstration:demonstration': IGuardOptionsDemonstration;
    }


}
declare module 'vona-module-a-demonstration' {

        export interface GuardDemonstration {
          /** @internal */
          get scope(): ScopeModuleADemonstration;
        }

          export interface GuardDemonstration {
            get $beanFullName(): 'a-demonstration.guard.demonstration';
            get $onionName(): 'a-demonstration:demonstration';
            get $onionOptions(): IGuardOptionsDemonstration;
          }
}
/** guard: end */
/** locale: begin */
import { locales } from './locales.ts';
/** locale: end */
/** error: begin */
export * from '../config/errors.ts';
import type { errors } from '../config/errors.ts';
/** error: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil, type TypeModuleErrors, type TypeModuleLocales, type TypeLocaleBase } from 'vona';
import { Scope } from 'vona-module-a-bean';

@Scope()
export class ScopeModuleADemonstration extends BeanScopeBase {}

export interface ScopeModuleADemonstration {
  util: BeanScopeUtil;
error: TypeModuleErrors<typeof errors>;
locale: TypeModuleLocales<(typeof locales)[TypeLocaleBase]>;
}

import 'vona';
declare module 'vona' {
  export interface IBeanScopeRecord {
    'a-demonstration': ScopeModuleADemonstration;
  }

  export interface IBeanScopeContainer {
    demonstration: ScopeModuleADemonstration;
  }



  export interface IBeanScopeLocale {
    'a-demonstration': (typeof locales)[TypeLocaleBase];
  }

  export interface IBeanScopeErrors {
    'a-demonstration': typeof errors;
  }
}
/** scope: end */
