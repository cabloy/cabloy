// eslint-disable
/** config: begin */
export * from '../config/config.ts';
import { config } from '../config/config.ts';
/** config: end */
/** monkeySys: begin */
export * from '../monkeySys.ts';
/** monkeySys: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil, TypeModuleConfig } from 'zova';
import { Scope } from 'zova-module-a-bean';

@Scope()
export class ScopeModuleASsrhmr extends BeanScopeBase {}

export interface ScopeModuleASsrhmr {
  util: BeanScopeUtil;
config: TypeModuleConfig<typeof config>;
}

import 'zova';
declare module 'zova' {
  export interface IBeanScopeRecord {
    'a-ssrhmr': ScopeModuleASsrhmr;
  }

  export interface IBeanScopeConfig {
    'a-ssrhmr': ReturnType<typeof config>;
  }




}

/** scope: end */
