// eslint-disable
/** config: begin */
export * from '../config/config.ts';
import type { config } from '../config/config.ts';
/** config: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil, type TypeModuleConfig } from 'vona';
import { Scope } from 'vona-module-a-bean';

@Scope()
export class ScopeModuleCabloyMcp extends BeanScopeBase {}

export interface ScopeModuleCabloyMcp {
  util: BeanScopeUtil;
config: TypeModuleConfig<typeof config>;
}

import 'vona';
declare module 'vona' {
  export interface IBeanScopeRecord {
    'cabloy-mcp': ScopeModuleCabloyMcp;
  }

  export interface IBeanScopeContainer {
    cabloyMcp: ScopeModuleCabloyMcp;
  }

  export interface IBeanScopeConfig {
    'cabloy-mcp': ReturnType<typeof config>;
  }




}
/** scope: end */
