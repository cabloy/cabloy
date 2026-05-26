// eslint-disable
/** controller: begin */
export * from '../component/dateRange/controller.jsx';
export * from '../component/formFieldDate/controller.jsx';
export * from '../component/formFieldDateRange/controller.jsx';

import 'zova';
declare module 'zova' {
  
  
}
declare module 'zova-module-basic-date' {
  
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
import { ControllerDateRange } from '../component/dateRange/controller.jsx';
import { ControllerFormFieldDate } from '../component/formFieldDate/controller.jsx';
import { ControllerFormFieldDateRange } from '../component/formFieldDateRange/controller.jsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordLocal {
    'basic-date.controller.dateRange': ControllerDateRange;
'basic-date.controller.formFieldDate': ControllerFormFieldDate;
'basic-date.controller.formFieldDateRange': ControllerFormFieldDateRange;
  }
}
/** controller: end */

/** components: begin */
export * from './component/dateRange.js';
import { ZDateRange } from './component/dateRange.js';
export * from './component/formFieldDate.js';
import { ZFormFieldDate } from './component/formFieldDate.js';
export * from './component/formFieldDateRange.js';
import { ZFormFieldDateRange } from './component/formFieldDateRange.js';
export const components = {
  'dateRange': ZDateRange,
'formFieldDate': ZFormFieldDate,
'formFieldDateRange': ZFormFieldDateRange,
};
import 'zova';
declare module 'zova' {
export interface IComponentRecord {
  'basic-date:dateRange': ControllerDateRange;
'basic-date:formFieldDate': ControllerFormFieldDate;
'basic-date:formFieldDateRange': ControllerFormFieldDateRange;
}
export interface IZovaComponentRecord {
  'basic-date:dateRange': typeof ZDateRange;
'basic-date:formFieldDate': typeof ZFormFieldDate;
'basic-date:formFieldDateRange': typeof ZFormFieldDateRange;
}
}
/** components: end */
/** tableCell: begin */
export * from '../bean/tableCell.date.jsx';
import { ITableCellOptionsDate } from '../bean/tableCell.date.jsx';
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
import { TableCellDate } from '../bean/tableCell.date.jsx';
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
