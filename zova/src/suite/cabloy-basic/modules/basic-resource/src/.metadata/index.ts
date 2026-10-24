// eslint-disable
/** controller: begin */
export * from '../component/blockResourcePickerActions/controller.tsx';
export * from '../component/formFieldResourcePicker/controller.tsx';

import 'zova';
declare module 'zova' {


}
declare module 'zova-module-basic-resource' {

        export interface ControllerBlockResourcePickerActions {
          /** @internal */
          get scope(): ScopeModuleBasicResource;
        }

        export interface ControllerFormFieldResourcePicker {
          /** @internal */
          get scope(): ScopeModuleBasicResource;
        }
}
/** controller: end */
/** controller: begin */
import type { ControllerBlockResourcePickerActions } from '../component/blockResourcePickerActions/controller.tsx';
import type { ControllerFormFieldResourcePicker } from '../component/formFieldResourcePicker/controller.tsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordLocal {
    'basic-resource.controller.blockResourcePickerActions': ControllerBlockResourcePickerActions;
'basic-resource.controller.formFieldResourcePicker': ControllerFormFieldResourcePicker;
  }
}
/** controller: end */

/** components: begin */
export * from './component/blockResourcePickerActions.ts';
import { ZBlockResourcePickerActions } from './component/blockResourcePickerActions.ts';
export * from './component/formFieldResourcePicker.ts';
import { ZFormFieldResourcePicker } from './component/formFieldResourcePicker.ts';
export const components = {
  'blockResourcePickerActions': ZBlockResourcePickerActions,
'formFieldResourcePicker': ZFormFieldResourcePicker,
};
import 'zova';
declare module 'zova' {
export interface IComponentRecord {
  'basic-resource:blockResourcePickerActions': ControllerBlockResourcePickerActions;
'basic-resource:formFieldResourcePicker': ControllerFormFieldResourcePicker;
}
export interface IZovaComponentRecord {
  'basic-resource:blockResourcePickerActions': typeof ZBlockResourcePickerActions;
'basic-resource:formFieldResourcePicker': typeof ZFormFieldResourcePicker;
}
}
/** components: end */
/** tableCell: begin */
export * from '../bean/tableCell.resourcePicker.tsx';
import { ITableCellOptionsResourcePicker } from '../bean/tableCell.resourcePicker.tsx';
import 'zova-module-a-table';
declare module 'zova-module-a-table' {

    export interface ITableCellRecord {
      'basic-resource:resourcePicker': ITableCellOptionsResourcePicker;
    }


}
declare module 'zova-module-basic-resource' {

        export interface TableCellResourcePicker {
          /** @internal */
          get scope(): ScopeModuleBasicResource;
        }

        export interface TableCellResourcePicker {
          get $beanFullName(): 'basic-resource.tableCell.resourcePicker';
          get $onionName(): 'basic-resource:resourcePicker';
          get $onionOptions(): ITableCellOptionsResourcePicker;
        }
}
/** tableCell: end */
/** tableCell: begin */
import type { TableCellResourcePicker } from '../bean/tableCell.resourcePicker.tsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'basic-resource.tableCell.resourcePicker': TableCellResourcePicker;
  }
}
/** tableCell: end */
/** locale: begin */
import { locales } from './locales.ts';
/** locale: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil, TypeModuleLocales, TypeLocaleBase } from 'zova';
import { Scope } from 'zova-module-a-bean';

@Scope()
export class ScopeModuleBasicResource extends BeanScopeBase {}

export interface ScopeModuleBasicResource {
  util: BeanScopeUtil;
locale: TypeModuleLocales<(typeof locales)[TypeLocaleBase]>;
}

import 'zova';
declare module 'zova' {
  export interface IBeanScopeRecord {
    'basic-resource': ScopeModuleBasicResource;
  }



  export interface IBeanScopeLocale {
    'basic-resource': (typeof locales)[TypeLocaleBase];
  }


}

export function locale<K extends keyof (typeof locales)[TypeLocaleBase]>(key: K): `basic-resource::${K}` {
  return `basic-resource::${key}`;
}
/** scope: end */
