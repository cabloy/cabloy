// eslint-disable
/** controller: begin */
export * from '../component/table/controller.tsx';

import 'zova';
declare module 'zova' {


}
declare module 'zova-module-a-table' {

        export interface ControllerTable {
          /** @internal */
          get scope(): ScopeModuleATable;
        }
}
/** controller: end */
/** controller: begin */
import type { ControllerTable } from '../component/table/controller.tsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordLocal {
    'a-table.controller.table': ControllerTable;
  }
}
/** controller: end */

/** components: begin */
export * from './component/table.ts';
import { ZTable } from './component/table.ts';
export const components = {
  'table': ZTable,
};
import 'zova';
declare module 'zova' {
export interface IComponentRecord {
  'a-table:table': ControllerTable;
}
export interface IZovaComponentRecord {
  'a-table:table': typeof ZTable;
}
}
/** components: end */
/** render: begin */
export * from '../component/table/render.tsx';

import 'zova';
declare module 'zova' {


}
declare module 'zova-module-a-table' {

        export interface RenderTable {
          /** @internal */
          get scope(): ScopeModuleATable;
        }
}
/** render: end */
/** render: begin */
import type { RenderTable } from '../component/table/render.tsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordLocal {
    'a-table.render.table': RenderTable;
  }
}
/** render: end */
/** config: begin */
export * from '../config/config.ts';
import { config } from '../config/config.ts';
/** config: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil, TypeModuleConfig } from 'zova';
import { Scope } from 'zova-module-a-bean';

@Scope()
export class ScopeModuleATable extends BeanScopeBase {}

export interface ScopeModuleATable {
  util: BeanScopeUtil;
config: TypeModuleConfig<typeof config>;
}

import 'zova';
declare module 'zova' {
  export interface IBeanScopeRecord {
    'a-table': ScopeModuleATable;
  }

  export interface IBeanScopeConfig {
    'a-table': ReturnType<typeof config>;
  }




}

/** scope: end */
