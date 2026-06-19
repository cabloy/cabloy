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
/** model: begin */
export * from '../model/student.js';
import { IModelOptionsStudent } from '../model/student.js';
import 'zova-module-a-model';
declare module 'zova-module-a-model' {

    export interface IModelRecord {
      'demo-student:student': IModelOptionsStudent;
    }


}
declare module 'zova-module-demo-student' {

        export interface ModelStudent {
          /** @internal */
          get scope(): ScopeModuleDemoStudent;
        }

        export interface ModelStudent {
          get $beanFullName(): 'demo-student.model.student';
          get $onionName(): 'demo-student:student';
          get $onionOptions(): IModelOptionsStudent;
        }
}
/** model: end */
/** model: begin */
import { ModelStudent } from '../model/student.js';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'demo-student.model.student': ModelStudent;
  }
}
/** model: end */
/** api: begin */
export * from '../api/demoStudent.js';

import 'zova';
declare module 'zova' {


}
declare module 'zova-module-demo-student' {

        export interface ApiDemoStudent {
          /** @internal */
          get scope(): ScopeModuleDemoStudent;
        }

        export interface ApiDemoStudent {
          get $beanFullName(): 'demo-student.api.demoStudent';
          get $onionName(): 'demo-student:demoStudent';

        }
}
/** api: end */
/** api: begin */
import { ApiDemoStudent } from '../api/demoStudent.js';
export interface IModuleApi {
  'demoStudent': ApiDemoStudent;
}
/** api: end */
/** api: begin */

import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'demo-student.api.demoStudent': ApiDemoStudent;
  }
}
/** api: end */
/** tableCell: begin */
export * from '../bean/tableCell.actionDeleteForce.jsx';
export * from '../bean/tableCell.actionSummary.jsx';
export * from '../bean/tableCell.level.jsx';
import { ITableCellOptionsActionDeleteForce } from '../bean/tableCell.actionDeleteForce.jsx';
import { ITableCellOptionsActionSummary } from '../bean/tableCell.actionSummary.jsx';
import { ITableCellOptionsLevel } from '../bean/tableCell.level.jsx';
import 'zova-module-a-table';
declare module 'zova-module-a-table' {

    export interface ITableCellRecord {
      'demo-student:actionDeleteForce': ITableCellOptionsActionDeleteForce;
      'demo-student:actionSummary': ITableCellOptionsActionSummary;
      'demo-student:level': ITableCellOptionsLevel;
    }


}
declare module 'zova-module-demo-student' {

        export interface TableCellActionDeleteForce {
          /** @internal */
          get scope(): ScopeModuleDemoStudent;
        }

        export interface TableCellActionDeleteForce {
          get $beanFullName(): 'demo-student.tableCell.actionDeleteForce';
          get $onionName(): 'demo-student:actionDeleteForce';
          get $onionOptions(): ITableCellOptionsActionDeleteForce;
        }

        export interface TableCellActionSummary {
          /** @internal */
          get scope(): ScopeModuleDemoStudent;
        }

        export interface TableCellActionSummary {
          get $beanFullName(): 'demo-student.tableCell.actionSummary';
          get $onionName(): 'demo-student:actionSummary';
          get $onionOptions(): ITableCellOptionsActionSummary;
        }

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
import { TableCellActionDeleteForce } from '../bean/tableCell.actionDeleteForce.jsx';
import { TableCellActionSummary } from '../bean/tableCell.actionSummary.jsx';
import { TableCellLevel } from '../bean/tableCell.level.jsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'demo-student.tableCell.actionDeleteForce': TableCellActionDeleteForce;
    'demo-student.tableCell.actionSummary': TableCellActionSummary;
    'demo-student.tableCell.level': TableCellLevel;
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
export class ScopeModuleDemoStudent extends BeanScopeBase {}

export interface ScopeModuleDemoStudent {
  util: BeanScopeUtil;
  api: IModuleApi;
  locale: TypeModuleLocales<(typeof locales)[TypeLocaleBase]>;
}

import 'zova';
declare module 'zova' {
  export interface IBeanScopeRecord {
    'demo-student': ScopeModuleDemoStudent;
  }

  export interface IBeanScopeLocale {
    'demo-student': (typeof locales)[TypeLocaleBase];
  }
}

export function locale<K extends keyof (typeof locales)[TypeLocaleBase]>(key: K): `demo-student::${K}` {
  return `demo-student::${key}`;
}
/** scope: end */
