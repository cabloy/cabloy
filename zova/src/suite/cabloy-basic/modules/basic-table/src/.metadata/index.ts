// eslint-disable
/** controller: begin */
export * from '../component/actionCreate/controller.jsx';
export * from '../component/table/controller.jsx';

import 'zova';
declare module 'zova' {
  
  
}
declare module 'zova-module-basic-table' {
  
        export interface ControllerActionCreate {
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
import { ControllerActionCreate } from '../component/actionCreate/controller.jsx';
import { ControllerTable } from '../component/table/controller.jsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordLocal {
    'basic-table.controller.actionCreate': ControllerActionCreate;
'basic-table.controller.table': ControllerTable;
  }
}
/** controller: end */

/** components: begin */
export * from './component/actionCreate.js';
import { ZActionCreate } from './component/actionCreate.js';
export * from './component/table.js';
import { ZTable } from './component/table.js';
export const components = {
  'actionCreate': ZActionCreate,
'table': ZTable,
};
import 'zova';
declare module 'zova' {
export interface IComponentRecord {
  'basic-table:actionCreate': ControllerActionCreate;
'basic-table:table': ControllerTable;
}
export interface IZovaComponentRecord {
  'basic-table:actionCreate': typeof ZActionCreate;
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
import { RenderTable } from '../component/table/render.jsx';
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
import { TableCellActionDelete } from '../bean/tableCell.actionDelete.jsx';
import { TableCellActionOperationsRow } from '../bean/tableCell.actionOperationsRow.jsx';
import { TableCellActionUpdate } from '../bean/tableCell.actionUpdate.jsx';
import { TableCellActionView } from '../bean/tableCell.actionView.jsx';
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
