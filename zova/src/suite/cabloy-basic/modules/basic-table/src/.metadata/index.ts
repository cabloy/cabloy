// eslint-disable
/** controller: begin */
export * from '../component/actionColumnConfig/controller.jsx';
export * from '../component/actionCreate/controller.jsx';
export * from '../component/actionDeleteBulk/controller.jsx';
export * from '../component/actionRefresh/controller.jsx';
export * from '../component/table/controller.jsx';

import 'zova';
declare module 'zova' {


}
declare module 'zova-module-basic-table' {

        export interface ControllerActionColumnConfig {
          /** @internal */
          get scope(): ScopeModuleBasicTable;
        }

        export interface ControllerActionCreate {
          /** @internal */
          get scope(): ScopeModuleBasicTable;
        }

        export interface ControllerActionDeleteBulk {
          /** @internal */
          get scope(): ScopeModuleBasicTable;
        }

        export interface ControllerActionRefresh {
          /** @internal */
          get scope(): ScopeModuleBasicTable;
        }

        export interface ControllerTable {
          /** @internal */
          get scope(): ScopeModuleBasicTable;
        }
}
/** controller: end */
/** controller: begin */
import type { ControllerActionColumnConfig } from '../component/actionColumnConfig/controller.jsx';
import type { ControllerActionCreate } from '../component/actionCreate/controller.jsx';
import type { ControllerActionDeleteBulk } from '../component/actionDeleteBulk/controller.jsx';
import type { ControllerActionRefresh } from '../component/actionRefresh/controller.jsx';
import type { ControllerTable } from '../component/table/controller.jsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordLocal {
    'basic-table.controller.actionColumnConfig': ControllerActionColumnConfig;
'basic-table.controller.actionCreate': ControllerActionCreate;
'basic-table.controller.actionDeleteBulk': ControllerActionDeleteBulk;
'basic-table.controller.actionRefresh': ControllerActionRefresh;
'basic-table.controller.table': ControllerTable;
  }
}
/** controller: end */

/** components: begin */
export * from './component/actionColumnConfig.js';
import { ZActionColumnConfig } from './component/actionColumnConfig.js';
export * from './component/actionCreate.js';
import { ZActionCreate } from './component/actionCreate.js';
export * from './component/actionDeleteBulk.js';
import { ZActionDeleteBulk } from './component/actionDeleteBulk.js';
export * from './component/actionRefresh.js';
import { ZActionRefresh } from './component/actionRefresh.js';
export * from './component/table.js';
import { ZTable } from './component/table.js';
export const components = {
  'actionColumnConfig': ZActionColumnConfig,
'actionCreate': ZActionCreate,
'actionDeleteBulk': ZActionDeleteBulk,
'actionRefresh': ZActionRefresh,
'table': ZTable,
};
import 'zova';
declare module 'zova' {
export interface IComponentRecord {
  'basic-table:actionColumnConfig': ControllerActionColumnConfig;
'basic-table:actionCreate': ControllerActionCreate;
'basic-table:actionDeleteBulk': ControllerActionDeleteBulk;
'basic-table:actionRefresh': ControllerActionRefresh;
'basic-table:table': ControllerTable;
}
export interface IZovaComponentRecord {
  'basic-table:actionColumnConfig': typeof ZActionColumnConfig;
'basic-table:actionCreate': typeof ZActionCreate;
'basic-table:actionDeleteBulk': typeof ZActionDeleteBulk;
'basic-table:actionRefresh': typeof ZActionRefresh;
'basic-table:table': typeof ZTable;
}
}
/** components: end */
/** render: begin */
export * from '../component/table/render.jsx';

import 'zova';
declare module 'zova' {


}
declare module 'zova-module-basic-table' {

        export interface RenderTable {
          /** @internal */
          get scope(): ScopeModuleBasicTable;
        }
}
/** render: end */
/** render: begin */
import type { RenderTable } from '../component/table/render.jsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordLocal {
    'basic-table.render.table': RenderTable;
  }
}
/** render: end */
/** tableCell: begin */
export * from '../bean/tableCell.actionDelete.jsx';
export * from '../bean/tableCell.actionOperationsRow.jsx';
export * from '../bean/tableCell.actionUpdate.jsx';
export * from '../bean/tableCell.actionView.jsx';
import { ITableCellOptionsActionDelete } from '../bean/tableCell.actionDelete.jsx';
import { ITableCellOptionsActionOperationsRow } from '../bean/tableCell.actionOperationsRow.jsx';
import { ITableCellOptionsActionUpdate } from '../bean/tableCell.actionUpdate.jsx';
import { ITableCellOptionsActionView } from '../bean/tableCell.actionView.jsx';
import 'zova-module-a-table';
declare module 'zova-module-a-table' {

    export interface ITableCellRecord {
      'basic-table:actionDelete': ITableCellOptionsActionDelete;
'basic-table:actionOperationsRow': ITableCellOptionsActionOperationsRow;
'basic-table:actionUpdate': ITableCellOptionsActionUpdate;
'basic-table:actionView': ITableCellOptionsActionView;
    }


}
declare module 'zova-module-basic-table' {

        export interface TableCellActionDelete {
          /** @internal */
          get scope(): ScopeModuleBasicTable;
        }

        export interface TableCellActionDelete {
          get $beanFullName(): 'basic-table.tableCell.actionDelete';
          get $onionName(): 'basic-table:actionDelete';
          get $onionOptions(): ITableCellOptionsActionDelete;
        }

        export interface TableCellActionOperationsRow {
          /** @internal */
          get scope(): ScopeModuleBasicTable;
        }

        export interface TableCellActionOperationsRow {
          get $beanFullName(): 'basic-table.tableCell.actionOperationsRow';
          get $onionName(): 'basic-table:actionOperationsRow';
          get $onionOptions(): ITableCellOptionsActionOperationsRow;
        }

        export interface TableCellActionUpdate {
          /** @internal */
          get scope(): ScopeModuleBasicTable;
        }

        export interface TableCellActionUpdate {
          get $beanFullName(): 'basic-table.tableCell.actionUpdate';
          get $onionName(): 'basic-table:actionUpdate';
          get $onionOptions(): ITableCellOptionsActionUpdate;
        }

        export interface TableCellActionView {
          /** @internal */
          get scope(): ScopeModuleBasicTable;
        }

        export interface TableCellActionView {
          get $beanFullName(): 'basic-table.tableCell.actionView';
          get $onionName(): 'basic-table:actionView';
          get $onionOptions(): ITableCellOptionsActionView;
        }
}
/** tableCell: end */
/** tableCell: begin */
import type { TableCellActionDelete } from '../bean/tableCell.actionDelete.jsx';
import type { TableCellActionOperationsRow } from '../bean/tableCell.actionOperationsRow.jsx';
import type { TableCellActionUpdate } from '../bean/tableCell.actionUpdate.jsx';
import type { TableCellActionView } from '../bean/tableCell.actionView.jsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'basic-table.tableCell.actionDelete': TableCellActionDelete;
'basic-table.tableCell.actionOperationsRow': TableCellActionOperationsRow;
'basic-table.tableCell.actionUpdate': TableCellActionUpdate;
'basic-table.tableCell.actionView': TableCellActionView;
  }
}
/** tableCell: end */
/** locale: begin */
import { locales } from './locales.js';
/** locale: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil, TypeModuleLocales, TypeLocaleBase } from 'zova';
import { Scope } from 'zova-module-a-bean';

@Scope()
export class ScopeModuleBasicTable extends BeanScopeBase {}

export interface ScopeModuleBasicTable {
  util: BeanScopeUtil;
locale: TypeModuleLocales<(typeof locales)[TypeLocaleBase]>;
}

import 'zova';
declare module 'zova' {
  export interface IBeanScopeRecord {
    'basic-table': ScopeModuleBasicTable;
  }



  export interface IBeanScopeLocale {
    'basic-table': (typeof locales)[TypeLocaleBase];
  }


}

export function locale<K extends keyof (typeof locales)[TypeLocaleBase]>(key: K): `basic-table::${K}` {
  return `basic-table::${key}`;
}
/** scope: end */
