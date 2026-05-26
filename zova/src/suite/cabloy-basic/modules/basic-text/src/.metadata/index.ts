// eslint-disable
/** controller: begin */
export * from '../component/formFieldTextarea/controller.jsx';

import 'zova';
declare module 'zova' {
  
  
}
declare module 'zova-module-basic-text' {
  
        export interface ControllerFormFieldTextarea {
          /** @internal */
          get scope(): ScopeModuleBasicText;
        } 
}
/** controller: end */
/** controller: begin */
import { ControllerFormFieldTextarea } from '../component/formFieldTextarea/controller.jsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordLocal {
    'basic-text.controller.formFieldTextarea': ControllerFormFieldTextarea;
  }
}
/** controller: end */

/** components: begin */
export * from './component/formFieldTextarea.js';
import { ZFormFieldTextarea } from './component/formFieldTextarea.js';
export const components = {
  'formFieldTextarea': ZFormFieldTextarea,
};
import 'zova';
declare module 'zova' {
export interface IComponentRecord {
  'basic-text:formFieldTextarea': ControllerFormFieldTextarea;
}
export interface IZovaComponentRecord {
  'basic-text:formFieldTextarea': typeof ZFormFieldTextarea;
}
}
/** components: end */
/** tableCell: begin */
export * from '../bean/tableCell.text.jsx';
export * from '../bean/tableCell.textarea.jsx';
import { ITableCellOptionsText } from '../bean/tableCell.text.jsx';
import { ITableCellOptionsTextarea } from '../bean/tableCell.textarea.jsx';
import 'zova-module-a-table';
declare module 'zova-module-a-table' {
  
    export interface ITableCellRecord {
      'basic-text:text': ITableCellOptionsText;
'basic-text:textarea': ITableCellOptionsTextarea;
    }

  
}
declare module 'zova-module-basic-text' {
  
        export interface TableCellText {
          /** @internal */
          get scope(): ScopeModuleBasicText;
        }

        export interface TableCellText {
          get $beanFullName(): 'basic-text.tableCell.text';
          get $onionName(): 'basic-text:text';
          get $onionOptions(): ITableCellOptionsText;
        }

        export interface TableCellTextarea {
          /** @internal */
          get scope(): ScopeModuleBasicText;
        }

        export interface TableCellTextarea {
          get $beanFullName(): 'basic-text.tableCell.textarea';
          get $onionName(): 'basic-text:textarea';
          get $onionOptions(): ITableCellOptionsTextarea;
        } 
}
/** tableCell: end */
/** tableCell: begin */
import { TableCellText } from '../bean/tableCell.text.jsx';
import { TableCellTextarea } from '../bean/tableCell.textarea.jsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'basic-text.tableCell.text': TableCellText;
'basic-text.tableCell.textarea': TableCellTextarea;
  }
}
/** tableCell: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil } from 'zova';
import { Scope } from 'zova-module-a-bean';

@Scope()
export class ScopeModuleBasicText extends BeanScopeBase {}

export interface ScopeModuleBasicText {
  util: BeanScopeUtil;
}

import 'zova';
declare module 'zova' {
  export interface IBeanScopeRecord {
    'basic-text': ScopeModuleBasicText;
  }
  
  

  

  
}
  
/** scope: end */
