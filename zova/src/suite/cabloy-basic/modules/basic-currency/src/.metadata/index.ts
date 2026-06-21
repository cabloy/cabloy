// eslint-disable
/** controller: begin */
export * from '../component/formFieldCurrency/controller.jsx';

import 'zova';
declare module 'zova' {
  
  
}
declare module 'zova-module-basic-currency' {
  
        export interface ControllerFormFieldCurrency {
          /** @internal */
          get scope(): ScopeModuleBasicCurrency;
        } 
}
/** controller: end */
/** controller: begin */
import { ControllerFormFieldCurrency } from '../component/formFieldCurrency/controller.jsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordLocal {
    'basic-currency.controller.formFieldCurrency': ControllerFormFieldCurrency;
  }
}
/** controller: end */

/** components: begin */
export * from './component/formFieldCurrency.js';
import { ZFormFieldCurrency } from './component/formFieldCurrency.js';
export const components = {
  'formFieldCurrency': ZFormFieldCurrency,
};
import 'zova';
declare module 'zova' {
export interface IComponentRecord {
  'basic-currency:formFieldCurrency': ControllerFormFieldCurrency;
}
export interface IZovaComponentRecord {
  'basic-currency:formFieldCurrency': typeof ZFormFieldCurrency;
}
}
/** components: end */
/** tableCell: begin */
export * from '../bean/tableCell.currency.jsx';
import { ITableCellOptionsCurrency } from '../bean/tableCell.currency.jsx';
import 'zova-module-a-table';
declare module 'zova-module-a-table' {
  
    export interface ITableCellRecord {
      'basic-currency:currency': ITableCellOptionsCurrency;
    }

  
}
declare module 'zova-module-basic-currency' {
  
        export interface TableCellCurrency {
          /** @internal */
          get scope(): ScopeModuleBasicCurrency;
        }

        export interface TableCellCurrency {
          get $beanFullName(): 'basic-currency.tableCell.currency';
          get $onionName(): 'basic-currency:currency';
          get $onionOptions(): ITableCellOptionsCurrency;
        } 
}
/** tableCell: end */
/** tableCell: begin */
import { TableCellCurrency } from '../bean/tableCell.currency.jsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'basic-currency.tableCell.currency': TableCellCurrency;
  }
}
/** tableCell: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil } from 'zova';
import { Scope } from 'zova-module-a-bean';

@Scope()
export class ScopeModuleBasicCurrency extends BeanScopeBase {}

export interface ScopeModuleBasicCurrency {
  util: BeanScopeUtil;
}

import 'zova';
declare module 'zova' {
  export interface IBeanScopeRecord {
    'basic-currency': ScopeModuleBasicCurrency;
  }
  
  

  

  
}
  
/** scope: end */
