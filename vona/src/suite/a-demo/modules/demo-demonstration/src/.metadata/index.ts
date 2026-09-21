// eslint-disable
/** guard: begin */
export * from '../bean/guard.demonstration.ts';
import type { IGuardOptionsDemonstration } from '../bean/guard.demonstration.ts';
import 'vona-module-a-aspect';
declare module 'vona-module-a-aspect' {

    export interface IGuardRecordGlobal {
      'demo-demonstration:demonstration': IGuardOptionsDemonstration;
    }


}
declare module 'vona-module-demo-demonstration' {

        export interface GuardDemonstration {
          /** @internal */
          get scope(): ScopeModuleDemoDemonstration;
        }

          export interface GuardDemonstration {
            get $beanFullName(): 'demo-demonstration.guard.demonstration';
            get $onionName(): 'demo-demonstration:demonstration';
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
export class ScopeModuleDemoDemonstration extends BeanScopeBase {}

export interface ScopeModuleDemoDemonstration {
  util: BeanScopeUtil;
error: TypeModuleErrors<typeof errors>;
locale: TypeModuleLocales<(typeof locales)[TypeLocaleBase]>;
}

import 'vona';
declare module 'vona' {
  export interface IBeanScopeRecord {
    'demo-demonstration': ScopeModuleDemoDemonstration;
  }

  export interface IBeanScopeContainer {
    demoDemonstration: ScopeModuleDemoDemonstration;
  }



  export interface IBeanScopeLocale {
    'demo-demonstration': (typeof locales)[TypeLocaleBase];
  }

  export interface IBeanScopeErrors {
    'demo-demonstration': typeof errors;
  }
}
/** scope: end */
