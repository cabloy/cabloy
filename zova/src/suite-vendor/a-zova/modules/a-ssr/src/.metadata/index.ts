// eslint-disable
/** sys: begin */
export * from '../bean/sys.ssrState.ts';

import 'zova';
declare module 'zova' {


}
declare module 'zova-module-a-ssr' {

        export interface SysSsrState {
          /** @internal */
          get scope(): ScopeModuleASsr;
        }

        export interface SysSsrState {
          get $beanFullName(): 'a-ssr.sys.ssrState';
          get $onionName(): 'a-ssr:ssrState';

        }
}
/** sys: end */
/** sys: begin */
import type { SysSsrState } from '../bean/sys.ssrState.ts';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'a-ssr.sys.ssrState': SysSsrState;
  }
}
/** sys: end */
/** config: begin */
export * from '../config/config.ts';
import { config } from '../config/config.ts';
/** config: end */
/** monkey: begin */
export * from '../monkey.ts';
/** monkey: end */
/** monkeySys: begin */
export * from '../monkeySys.ts';
/** monkeySys: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil, TypeModuleConfig } from 'zova';
import { Scope } from 'zova-module-a-bean';

@Scope()
export class ScopeModuleASsr extends BeanScopeBase {}

export interface ScopeModuleASsr {
  util: BeanScopeUtil;
config: TypeModuleConfig<typeof config>;
}

import 'zova';
declare module 'zova' {
  export interface IBeanScopeRecord {
    'a-ssr': ScopeModuleASsr;
  }

  export interface IBeanScopeConfig {
    'a-ssr': ReturnType<typeof config>;
  }




}

/** scope: end */
