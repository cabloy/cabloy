// eslint-disable
/** controller: begin */
export * from '../component/formFieldLevel/controller.jsx';

import 'zova';
declare module 'zova' {
  
  
}
declare module 'zova-module-demo-student' {
  
        export interface ControllerFormFieldLevel {
          /** @internal */
          get scope(): ScopeModuleDemoStudent;
        } 
}
/** controller: end */
/** controller: begin */
import { ControllerFormFieldLevel } from '../component/formFieldLevel/controller.jsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordLocal {
    'demo-student.controller.formFieldLevel': ControllerFormFieldLevel;
  }
}
/** controller: end */

/** components: begin */
export * from './component/formFieldLevel.js';
import { ZFormFieldLevel } from './component/formFieldLevel.js';
export const components = {
  'formFieldLevel': ZFormFieldLevel,
};
import 'zova';
declare module 'zova' {
export interface IComponentRecord {
  'demo-student:formFieldLevel': ControllerFormFieldLevel;
}
export interface IZovaComponentRecord {
  'demo-student:formFieldLevel': typeof ZFormFieldLevel;
}
}
/** components: end */
/** tableCell: begin */
export * from '../bean/tableCell.level.jsx';
import { ITableCellOptionsLevel } from '../bean/tableCell.level.jsx';
import 'zova-module-a-table';
declare module 'zova-module-a-table' {
  
    export interface ITableCellRecord {
      'demo-student:level': ITableCellOptionsLevel;
    }

  
}
declare module 'zova-module-demo-student' {
  
        export interface TableCellLevel {
          /** @internal */
          get scope(): ScopeModuleDemoStudent;
        }

        export interface TableCellLevel {
          get $beanFullName(): 'demo-student.tableCell.level';
          get $onionName(): 'demo-student:level';
          get $onionOptions(): ITableCellOptionsLevel;
        } 
}
/** tableCell: end */
/** tableCell: begin */
import { TableCellLevel } from '../bean/tableCell.level.jsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'demo-student.tableCell.level': TableCellLevel;
  }
}
/** tableCell: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil } from 'zova';
import { Scope } from 'zova-module-a-bean';

@Scope()
export class ScopeModuleDemoStudent extends BeanScopeBase {}

export interface ScopeModuleDemoStudent {
  util: BeanScopeUtil;
}

import 'zova';
declare module 'zova' {
  export interface IBeanScopeRecord {
    'demo-student': ScopeModuleDemoStudent;
  }
  
  

  

  
}
  
/** scope: end */
