// eslint-disable
/** controller: begin */
export * from '../component/date/controller.tsx';
export * from '../component/dateRange/controller.tsx';
export * from '../component/formFieldDate/controller.tsx';
export * from '../component/formFieldDateRange/controller.tsx';

import 'zova';
declare module 'zova' {


}
declare module 'zova-module-basic-date' {

        export interface ControllerDate {
          /** @internal */
          get scope(): ScopeModuleBasicDate;
        }

        export interface ControllerDateRange {
          /** @internal */
          get scope(): ScopeModuleBasicDate;
        }

        export interface ControllerFormFieldDate {
          /** @internal */
          get scope(): ScopeModuleBasicDate;
        }

        export interface ControllerFormFieldDateRange {
          /** @internal */
          get scope(): ScopeModuleBasicDate;
        }
}
/** controller: end */
/** controller: begin */
import type { ControllerDate } from '../component/date/controller.tsx';
import type { ControllerDateRange } from '../component/dateRange/controller.tsx';
import type { ControllerFormFieldDate } from '../component/formFieldDate/controller.tsx';
import type { ControllerFormFieldDateRange } from '../component/formFieldDateRange/controller.tsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordLocal {
    'basic-date.controller.date': ControllerDate;
'basic-date.controller.dateRange': ControllerDateRange;
'basic-date.controller.formFieldDate': ControllerFormFieldDate;
'basic-date.controller.formFieldDateRange': ControllerFormFieldDateRange;
  }
}
/** controller: end */

/** components: begin */
export * from './component/date.ts';
import { ZDate } from './component/date.ts';
export * from './component/dateRange.ts';
import { ZDateRange } from './component/dateRange.ts';
export * from './component/formFieldDate.ts';
import { ZFormFieldDate } from './component/formFieldDate.ts';
export * from './component/formFieldDateRange.ts';
import { ZFormFieldDateRange } from './component/formFieldDateRange.ts';
export const components = {
  'date': ZDate,
'dateRange': ZDateRange,
'formFieldDate': ZFormFieldDate,
'formFieldDateRange': ZFormFieldDateRange,
};
import 'zova';
declare module 'zova' {
export interface IComponentRecord {
  'basic-date:date': ControllerDate;
'basic-date:dateRange': ControllerDateRange;
'basic-date:formFieldDate': ControllerFormFieldDate;
'basic-date:formFieldDateRange': ControllerFormFieldDateRange;
}
export interface IZovaComponentRecord {
  'basic-date:date': typeof ZDate;
'basic-date:dateRange': typeof ZDateRange;
'basic-date:formFieldDate': typeof ZFormFieldDate;
'basic-date:formFieldDateRange': typeof ZFormFieldDateRange;
}
}
/** components: end */
/** tableCell: begin */
export * from '../bean/tableCell.date.tsx';
import { ITableCellOptionsDate } from '../bean/tableCell.date.tsx';
import 'zova-module-a-table';
declare module 'zova-module-a-table' {

    export interface ITableCellRecord {
      'basic-date:date': ITableCellOptionsDate;
    }


}
declare module 'zova-module-basic-date' {

        export interface TableCellDate {
          /** @internal */
          get scope(): ScopeModuleBasicDate;
        }

        export interface TableCellDate {
          get $beanFullName(): 'basic-date.tableCell.date';
          get $onionName(): 'basic-date:date';
          get $onionOptions(): ITableCellOptionsDate;
        }
}
/** tableCell: end */
/** tableCell: begin */
import type { TableCellDate } from '../bean/tableCell.date.tsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'basic-date.tableCell.date': TableCellDate;
  }
}
/** tableCell: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil } from 'zova';
import { Scope } from 'zova-module-a-bean';

@Scope()
export class ScopeModuleBasicDate extends BeanScopeBase {}

export interface ScopeModuleBasicDate {
  util: BeanScopeUtil;
}

import 'zova';
declare module 'zova' {
  export interface IBeanScopeRecord {
    'basic-date': ScopeModuleBasicDate;
  }






}

/** scope: end */
