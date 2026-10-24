// eslint-disable
/** service: begin */
export * from '../service/detail.tsx';

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
import type { ServiceDetail } from '../service/detail.tsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'basic-details.service.detail': ServiceDetail;
  }
}
/** service: end */
/** controller: begin */
export * from '../component/actionCreate/controller.tsx';
export * from '../component/blockDetails/controller.tsx';
export * from '../component/blockForm/controller.tsx';
export * from '../component/blockTable/controller.tsx';
export * from '../component/blockToolbarBulk/controller.tsx';
export * from '../component/formFieldDetails/controller.tsx';

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
import type { ControllerActionCreate } from '../component/actionCreate/controller.tsx';
import type { ControllerBlockDetails } from '../component/blockDetails/controller.tsx';
import type { ControllerBlockForm } from '../component/blockForm/controller.tsx';
import type { ControllerBlockTable } from '../component/blockTable/controller.tsx';
import type { ControllerBlockToolbarBulk } from '../component/blockToolbarBulk/controller.tsx';
import type { ControllerFormFieldDetails } from '../component/formFieldDetails/controller.tsx';
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
export * from './component/actionCreate.ts';
import { ZActionCreate } from './component/actionCreate.ts';
export * from './component/blockDetails.ts';
import { ZBlockDetails } from './component/blockDetails.ts';
export * from './component/blockForm.ts';
import { ZBlockForm } from './component/blockForm.ts';
export * from './component/blockTable.ts';
import { ZBlockTable } from './component/blockTable.ts';
export * from './component/blockToolbarBulk.ts';
import { ZBlockToolbarBulk } from './component/blockToolbarBulk.ts';
export * from './component/formFieldDetails.ts';
import { ZFormFieldDetails } from './component/formFieldDetails.ts';
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
export * from '../bean/tableCell.actionDelete.tsx';
export * from '../bean/tableCell.actionOperationsRow.tsx';
export * from '../bean/tableCell.actionUpdate.tsx';
export * from '../bean/tableCell.actionView.tsx';
export * from '../bean/tableCell.lineNumber.tsx';
import { ITableCellOptionsActionDelete } from '../bean/tableCell.actionDelete.tsx';
import { ITableCellOptionsActionOperationsRow } from '../bean/tableCell.actionOperationsRow.tsx';
import { ITableCellOptionsActionUpdate } from '../bean/tableCell.actionUpdate.tsx';
import { ITableCellOptionsActionView } from '../bean/tableCell.actionView.tsx';
import { ITableCellOptionsLineNumber } from '../bean/tableCell.lineNumber.tsx';
import 'zova-module-a-table';
declare module 'zova-module-a-table' {

    export interface ITableCellRecord {
      'basic-details:actionDelete': ITableCellOptionsActionDelete;
'basic-details:actionOperationsRow': ITableCellOptionsActionOperationsRow;
'basic-details:actionUpdate': ITableCellOptionsActionUpdate;
'basic-details:actionView': ITableCellOptionsActionView;
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

        export interface TableCellActionView {
          /** @internal */
          get scope(): ScopeModuleBasicDetails;
        }

        export interface TableCellActionView {
          get $beanFullName(): 'basic-details.tableCell.actionView';
          get $onionName(): 'basic-details:actionView';
          get $onionOptions(): ITableCellOptionsActionView;
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
import type { TableCellActionDelete } from '../bean/tableCell.actionDelete.tsx';
import type { TableCellActionOperationsRow } from '../bean/tableCell.actionOperationsRow.tsx';
import type { TableCellActionUpdate } from '../bean/tableCell.actionUpdate.tsx';
import type { TableCellActionView } from '../bean/tableCell.actionView.tsx';
import type { TableCellLineNumber } from '../bean/tableCell.lineNumber.tsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'basic-details.tableCell.actionDelete': TableCellActionDelete;
'basic-details.tableCell.actionOperationsRow': TableCellActionOperationsRow;
'basic-details.tableCell.actionUpdate': TableCellActionUpdate;
'basic-details.tableCell.actionView': TableCellActionView;
'basic-details.tableCell.lineNumber': TableCellLineNumber;
  }
}
/** tableCell: end */
/** command: begin */
export * from '../bean/command.delete.tsx';
import { ICommandOptionsDelete } from '../bean/command.delete.tsx';
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
import type { CommandDelete } from '../bean/command.delete.tsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'basic-details.command.delete': CommandDelete;
  }
}
/** command: end */
/** locale: begin */
import { locales } from './locales.ts';
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
