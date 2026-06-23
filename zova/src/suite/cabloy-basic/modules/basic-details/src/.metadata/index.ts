// eslint-disable
/** service: begin */
export * from '../service/detail.jsx';

import 'zova-module-a-bean';
declare module 'zova-module-a-bean' {
  
    export interface IServiceRecord {
      'basic-details:detail': never;
    }

  
}
declare module 'zova-module-basic-details' {
  
        export interface ServiceDetail {
          /** @internal */
          get scope(): ScopeModuleBasicDetails;
        }

        export interface ServiceDetail {
          get $beanFullName(): 'basic-details.service.detail';
          get $onionName(): 'basic-details:detail';
          
        } 
}
/** service: end */
/** service: begin */
import { ServiceDetail } from '../service/detail.jsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'basic-details.service.detail': ServiceDetail;
  }
}
/** service: end */
/** controller: begin */
export * from '../component/actionCreate/controller.jsx';
export * from '../component/blockDetails/controller.jsx';
export * from '../component/blockForm/controller.jsx';
export * from '../component/blockTable/controller.jsx';
export * from '../component/blockToolbarBulk/controller.jsx';
export * from '../component/formFieldDetails/controller.jsx';

import 'zova';
declare module 'zova' {
  
  
}
declare module 'zova-module-basic-details' {
  
        export interface ControllerActionCreate {
          /** @internal */
          get scope(): ScopeModuleBasicDetails;
        }

        export interface ControllerBlockDetails {
          /** @internal */
          get scope(): ScopeModuleBasicDetails;
        }

        export interface ControllerBlockForm {
          /** @internal */
          get scope(): ScopeModuleBasicDetails;
        }

        export interface ControllerBlockTable {
          /** @internal */
          get scope(): ScopeModuleBasicDetails;
        }

        export interface ControllerBlockToolbarBulk {
          /** @internal */
          get scope(): ScopeModuleBasicDetails;
        }

        export interface ControllerFormFieldDetails {
          /** @internal */
          get scope(): ScopeModuleBasicDetails;
        } 
}
/** controller: end */
/** controller: begin */
import { ControllerActionCreate } from '../component/actionCreate/controller.jsx';
import { ControllerBlockDetails } from '../component/blockDetails/controller.jsx';
import { ControllerBlockForm } from '../component/blockForm/controller.jsx';
import { ControllerBlockTable } from '../component/blockTable/controller.jsx';
import { ControllerBlockToolbarBulk } from '../component/blockToolbarBulk/controller.jsx';
import { ControllerFormFieldDetails } from '../component/formFieldDetails/controller.jsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordLocal {
    'basic-details.controller.actionCreate': ControllerActionCreate;
'basic-details.controller.blockDetails': ControllerBlockDetails;
'basic-details.controller.blockForm': ControllerBlockForm;
'basic-details.controller.blockTable': ControllerBlockTable;
'basic-details.controller.blockToolbarBulk': ControllerBlockToolbarBulk;
'basic-details.controller.formFieldDetails': ControllerFormFieldDetails;
  }
}
/** controller: end */

/** components: begin */
export * from './component/actionCreate.js';
import { ZActionCreate } from './component/actionCreate.js';
export * from './component/blockDetails.js';
import { ZBlockDetails } from './component/blockDetails.js';
export * from './component/blockForm.js';
import { ZBlockForm } from './component/blockForm.js';
export * from './component/blockTable.js';
import { ZBlockTable } from './component/blockTable.js';
export * from './component/blockToolbarBulk.js';
import { ZBlockToolbarBulk } from './component/blockToolbarBulk.js';
export * from './component/formFieldDetails.js';
import { ZFormFieldDetails } from './component/formFieldDetails.js';
export const components = {
  'actionCreate': ZActionCreate,
'blockDetails': ZBlockDetails,
'blockForm': ZBlockForm,
'blockTable': ZBlockTable,
'blockToolbarBulk': ZBlockToolbarBulk,
'formFieldDetails': ZFormFieldDetails,
};
import 'zova';
declare module 'zova' {
export interface IComponentRecord {
  'basic-details:actionCreate': ControllerActionCreate;
'basic-details:blockDetails': ControllerBlockDetails;
'basic-details:blockForm': ControllerBlockForm;
'basic-details:blockTable': ControllerBlockTable;
'basic-details:blockToolbarBulk': ControllerBlockToolbarBulk;
'basic-details:formFieldDetails': ControllerFormFieldDetails;
}
export interface IZovaComponentRecord {
  'basic-details:actionCreate': typeof ZActionCreate;
'basic-details:blockDetails': typeof ZBlockDetails;
'basic-details:blockForm': typeof ZBlockForm;
'basic-details:blockTable': typeof ZBlockTable;
'basic-details:blockToolbarBulk': typeof ZBlockToolbarBulk;
'basic-details:formFieldDetails': typeof ZFormFieldDetails;
}
}
/** components: end */
/** tableCell: begin */
export * from '../bean/tableCell.actionDelete.jsx';
export * from '../bean/tableCell.actionOperationsRow.jsx';
export * from '../bean/tableCell.actionUpdate.jsx';
export * from '../bean/tableCell.lineNumber.jsx';
import { ITableCellOptionsActionDelete } from '../bean/tableCell.actionDelete.jsx';
import { ITableCellOptionsActionOperationsRow } from '../bean/tableCell.actionOperationsRow.jsx';
import { ITableCellOptionsActionUpdate } from '../bean/tableCell.actionUpdate.jsx';
import { ITableCellOptionsLineNumber } from '../bean/tableCell.lineNumber.jsx';
import 'zova-module-a-table';
declare module 'zova-module-a-table' {
  
    export interface ITableCellRecord {
      'basic-details:actionDelete': ITableCellOptionsActionDelete;
'basic-details:actionOperationsRow': ITableCellOptionsActionOperationsRow;
'basic-details:actionUpdate': ITableCellOptionsActionUpdate;
'basic-details:lineNumber': ITableCellOptionsLineNumber;
    }

  
}
declare module 'zova-module-basic-details' {
  
        export interface TableCellActionDelete {
          /** @internal */
          get scope(): ScopeModuleBasicDetails;
        }

        export interface TableCellActionDelete {
          get $beanFullName(): 'basic-details.tableCell.actionDelete';
          get $onionName(): 'basic-details:actionDelete';
          get $onionOptions(): ITableCellOptionsActionDelete;
        }

        export interface TableCellActionOperationsRow {
          /** @internal */
          get scope(): ScopeModuleBasicDetails;
        }

        export interface TableCellActionOperationsRow {
          get $beanFullName(): 'basic-details.tableCell.actionOperationsRow';
          get $onionName(): 'basic-details:actionOperationsRow';
          get $onionOptions(): ITableCellOptionsActionOperationsRow;
        }

        export interface TableCellActionUpdate {
          /** @internal */
          get scope(): ScopeModuleBasicDetails;
        }

        export interface TableCellActionUpdate {
          get $beanFullName(): 'basic-details.tableCell.actionUpdate';
          get $onionName(): 'basic-details:actionUpdate';
          get $onionOptions(): ITableCellOptionsActionUpdate;
        }

        export interface TableCellLineNumber {
          /** @internal */
          get scope(): ScopeModuleBasicDetails;
        }

        export interface TableCellLineNumber {
          get $beanFullName(): 'basic-details.tableCell.lineNumber';
          get $onionName(): 'basic-details:lineNumber';
          get $onionOptions(): ITableCellOptionsLineNumber;
        } 
}
/** tableCell: end */
/** tableCell: begin */
import { TableCellActionDelete } from '../bean/tableCell.actionDelete.jsx';
import { TableCellActionOperationsRow } from '../bean/tableCell.actionOperationsRow.jsx';
import { TableCellActionUpdate } from '../bean/tableCell.actionUpdate.jsx';
import { TableCellLineNumber } from '../bean/tableCell.lineNumber.jsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'basic-details.tableCell.actionDelete': TableCellActionDelete;
'basic-details.tableCell.actionOperationsRow': TableCellActionOperationsRow;
'basic-details.tableCell.actionUpdate': TableCellActionUpdate;
'basic-details.tableCell.lineNumber': TableCellLineNumber;
  }
}
/** tableCell: end */
/** command: begin */
export * from '../bean/command.delete.jsx';
import { ICommandOptionsDelete } from '../bean/command.delete.jsx';
import 'zova-module-a-command';
declare module 'zova-module-a-command' {
  
    export interface ICommandRecord {
      'basic-details:delete': ICommandOptionsDelete;
    }

  
}
declare module 'zova-module-basic-details' {
  
        export interface CommandDelete {
          /** @internal */
          get scope(): ScopeModuleBasicDetails;
        }

        export interface CommandDelete {
          get $beanFullName(): 'basic-details.command.delete';
          get $onionName(): 'basic-details:delete';
          get $onionOptions(): ICommandOptionsDelete;
        } 
}
/** command: end */
/** command: begin */
import { CommandDelete } from '../bean/command.delete.jsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'basic-details.command.delete': CommandDelete;
  }
}
/** command: end */
/** locale: begin */
import { locales } from './locales.js';
/** locale: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil, TypeModuleLocales, TypeLocaleBase } from 'zova';
import { Scope } from 'zova-module-a-bean';

@Scope()
export class ScopeModuleBasicDetails extends BeanScopeBase {}

export interface ScopeModuleBasicDetails {
  util: BeanScopeUtil;
locale: TypeModuleLocales<(typeof locales)[TypeLocaleBase]>;
}

import 'zova';
declare module 'zova' {
  export interface IBeanScopeRecord {
    'basic-details': ScopeModuleBasicDetails;
  }
  
  

  export interface IBeanScopeLocale {
    'basic-details': (typeof locales)[TypeLocaleBase];
  }

  
}

export function locale<K extends keyof (typeof locales)[TypeLocaleBase]>(key: K): `basic-details::${K}` {
  return `basic-details::${key}`;
}  
/** scope: end */
