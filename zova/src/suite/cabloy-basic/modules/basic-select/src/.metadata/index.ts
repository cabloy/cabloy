// eslint-disable
/** controller: begin */
export * from '../component/formFieldSelect/controller.jsx';
export * from '../component/select/controller.jsx';

import 'zova';
declare module 'zova' {
  
  
}
declare module 'zova-module-basic-select' {
  
        export interface ControllerFormFieldSelect {
          /** @internal */
          get scope(): ScopeModuleBasicSelect;
        }

        export interface ControllerSelect {
          /** @internal */
          get scope(): ScopeModuleBasicSelect;
        } 
}
/** controller: end */
/** controller: begin */
import { ControllerFormFieldSelect } from '../component/formFieldSelect/controller.jsx';
import { ControllerSelect } from '../component/select/controller.jsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordLocal {
    'basic-select.controller.formFieldSelect': ControllerFormFieldSelect;
'basic-select.controller.select': ControllerSelect;
  }
}
/** controller: end */

/** components: begin */
export * from './component/formFieldSelect.js';
import { ZFormFieldSelect } from './component/formFieldSelect.js';
export * from './component/select.js';
import { ZSelect } from './component/select.js';
export const components = {
  'formFieldSelect': ZFormFieldSelect,
'select': ZSelect,
};
import 'zova';
declare module 'zova' {
export interface IComponentRecord {
  'basic-select:formFieldSelect': ControllerFormFieldSelect;
'basic-select:select': ControllerSelect;
}
export interface IZovaComponentRecord {
  'basic-select:formFieldSelect': typeof ZFormFieldSelect;
'basic-select:select': typeof ZSelect;
}
}
/** components: end */
/** tableCell: begin */
export * from '../bean/tableCell.select.jsx';
import { ITableCellOptionsSelect } from '../bean/tableCell.select.jsx';
import 'zova-module-a-table';
declare module 'zova-module-a-table' {
  
    export interface ITableCellRecord {
      'basic-select:select': ITableCellOptionsSelect;
    }

  
}
declare module 'zova-module-basic-select' {
  
        export interface TableCellSelect {
          /** @internal */
          get scope(): ScopeModuleBasicSelect;
        }

        export interface TableCellSelect {
          get $beanFullName(): 'basic-select.tableCell.select';
          get $onionName(): 'basic-select:select';
          get $onionOptions(): ITableCellOptionsSelect;
        } 
}
/** tableCell: end */
/** tableCell: begin */
import { TableCellSelect } from '../bean/tableCell.select.jsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'basic-select.tableCell.select': TableCellSelect;
  }
}
/** tableCell: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil } from 'zova';
import { Scope } from 'zova-module-a-bean';

@Scope()
export class ScopeModuleBasicSelect extends BeanScopeBase {}

export interface ScopeModuleBasicSelect {
  util: BeanScopeUtil;
}

import 'zova';
declare module 'zova' {
  export interface IBeanScopeRecord {
    'basic-select': ScopeModuleBasicSelect;
  }
  
  

  

  
}
  
/** scope: end */
