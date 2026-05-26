// eslint-disable
/** config: begin */
export * from '../config/config.ts';
import type { config } from '../config/config.ts';
/** config: end */
/** main: begin */
export * from '../main.ts';
/** main: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil, type TypeModuleConfig } from 'vona';
import { Scope } from 'vona-module-a-bean';

@Scope()
export class ScopeModuleALocale extends BeanScopeBase {}

export interface ScopeModuleALocale {
  util: BeanScopeUtil;
config: TypeModuleConfig<typeof config>;
}

import 'vona';
declare module 'vona' {
  export interface IBeanScopeRecord {
    'a-locale': ScopeModuleALocale;
  }

  export interface IBeanScopeContainer {
    locale: ScopeModuleALocale;
  }
  
  export interface IBeanScopeConfig {
    'a-locale': ReturnType<typeof config>;
  }

  

  
}
/** scope: end */
