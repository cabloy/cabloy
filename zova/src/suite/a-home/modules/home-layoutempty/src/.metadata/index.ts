// eslint-disable
/** controller: begin */
export * from '../component/layoutEmpty/controller.tsx';

import 'zova';
declare module 'zova' {


}
declare module 'zova-module-home-layoutempty' {

        export interface ControllerLayoutEmpty {
          /** @internal */
          get scope(): ScopeModuleHomeLayoutempty;
        }
}
/** controller: end */
/** controller: begin */
import type { ControllerLayoutEmpty } from '../component/layoutEmpty/controller.tsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordLocal {
    'home-layoutempty.controller.layoutEmpty': ControllerLayoutEmpty;
  }
}
/** controller: end */

/** components: begin */
export * from './component/layoutEmpty.ts';
import { ZLayoutEmpty } from './component/layoutEmpty.ts';
export const components = {
  'layoutEmpty': ZLayoutEmpty,
};
import 'zova';
declare module 'zova' {
export interface IComponentRecord {
  'home-layoutempty:layoutEmpty': ControllerLayoutEmpty;
}
export interface IZovaComponentRecord {
  'home-layoutempty:layoutEmpty': typeof ZLayoutEmpty;
}
}
/** components: end */
/** config: begin */
export * from '../config/config.ts';
import { config } from '../config/config.ts';
/** config: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil, TypeModuleConfig } from 'zova';
import { Scope } from 'zova-module-a-bean';

@Scope()
export class ScopeModuleHomeLayoutempty extends BeanScopeBase {}

export interface ScopeModuleHomeLayoutempty {
  util: BeanScopeUtil;
config: TypeModuleConfig<typeof config>;
}

import 'zova';
declare module 'zova' {
  export interface IBeanScopeRecord {
    'home-layoutempty': ScopeModuleHomeLayoutempty;
  }

  export interface IBeanScopeConfig {
    'home-layoutempty': ReturnType<typeof config>;
  }




}

/** scope: end */
