// eslint-disable
/** model: begin */
export * from '../model/student.js';
import { IModelOptionsStudent } from '../model/student.js';
import 'zova-module-a-model';
declare module 'zova-module-a-model' {

    export interface IModelRecord {
      'training-student:student': IModelOptionsStudent;
    }


}
declare module 'zova-module-training-student' {

        export interface ModelStudent {
          /** @internal */
          get scope(): ScopeModuleTrainingStudent;
        }

        export interface ModelStudent {
          get $beanFullName(): 'training-student.model.student';
          get $onionName(): 'training-student:student';
          get $onionOptions(): IModelOptionsStudent;
        }
}
/** model: end */
/** model: begin */
import { ModelStudent } from '../model/student.js';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'training-student.model.student': ModelStudent;
  }
}
/** model: end */
/** api: begin */
export * from '../api/trainingStudent.js';

import 'zova';
declare module 'zova' {


}
declare module 'zova-module-training-student' {

        export interface ApiTrainingStudent {
          /** @internal */
          get scope(): ScopeModuleTrainingStudent;
        }

        export interface ApiTrainingStudent {
          get $beanFullName(): 'training-student.api.trainingStudent';
          get $onionName(): 'training-student:trainingStudent';

        }
}
/** api: end */
/** api: begin */
import { ApiTrainingStudent } from '../api/trainingStudent.js';
export interface IModuleApi {
  'trainingStudent': ApiTrainingStudent;
}
/** api: end */
/** api: begin */

import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'training-student.api.trainingStudent': ApiTrainingStudent;
  }
}
/** api: end */
/** openapi: begin */
export * from '../api/openapi/index.js';
/** openapi: end */
/** apiSchema: begin */
export * from '../apiSchema/trainingStudent.js';

import 'zova';
declare module 'zova' {


}
declare module 'zova-module-training-student' {

        export interface ApiSchemaTrainingStudent {
          /** @internal */
          get scope(): ScopeModuleTrainingStudent;
        }

        export interface ApiSchemaTrainingStudent {
          get $beanFullName(): 'training-student.apiSchema.trainingStudent';
          get $onionName(): 'training-student:trainingStudent';

        }
}
/** apiSchema: end */
/** apiSchema: begin */
import { ApiSchemaTrainingStudent } from '../apiSchema/trainingStudent.js';
export interface IModuleApiSchema {
  'trainingStudent': ApiSchemaTrainingStudent;
}
/** apiSchema: end */
/** apiSchema: begin */

import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'training-student.apiSchema.trainingStudent': ApiSchemaTrainingStudent;
  }
}
/** apiSchema: end */
/** controller: begin */
export * from '../component/formFieldLevel/controller.jsx';

import 'zova';
declare module 'zova' {


}
declare module 'zova-module-training-student' {

        export interface ControllerFormFieldLevel {
          /** @internal */
          get scope(): ScopeModuleTrainingStudent;
        }
}
/** controller: end */
/** controller: begin */
import { ControllerFormFieldLevel } from '../component/formFieldLevel/controller.jsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordLocal {
    'training-student.controller.formFieldLevel': ControllerFormFieldLevel;
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
  'training-student:formFieldLevel': ControllerFormFieldLevel;
}
export interface IZovaComponentRecord {
  'training-student:formFieldLevel': typeof ZFormFieldLevel;
}
}
/** components: end */
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
      'training-student:actionDeleteForce': ITableCellOptionsActionDeleteForce;
'training-student:actionSummary': ITableCellOptionsActionSummary;
'training-student:level': ITableCellOptionsLevel;
    }


}
declare module 'zova-module-training-student' {

        export interface TableCellActionDeleteForce {
          /** @internal */
          get scope(): ScopeModuleTrainingStudent;
        }

        export interface TableCellActionDeleteForce {
          get $beanFullName(): 'training-student.tableCell.actionDeleteForce';
          get $onionName(): 'training-student:actionDeleteForce';
          get $onionOptions(): ITableCellOptionsActionDeleteForce;
        }

        export interface TableCellActionSummary {
          /** @internal */
          get scope(): ScopeModuleTrainingStudent;
        }

        export interface TableCellActionSummary {
          get $beanFullName(): 'training-student.tableCell.actionSummary';
          get $onionName(): 'training-student:actionSummary';
          get $onionOptions(): ITableCellOptionsActionSummary;
        }

        export interface TableCellLevel {
          /** @internal */
          get scope(): ScopeModuleTrainingStudent;
        }

        export interface TableCellLevel {
          get $beanFullName(): 'training-student.tableCell.level';
          get $onionName(): 'training-student:level';
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
    'training-student.tableCell.actionDeleteForce': TableCellActionDeleteForce;
'training-student.tableCell.actionSummary': TableCellActionSummary;
'training-student.tableCell.level': TableCellLevel;
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
export class ScopeModuleTrainingStudent extends BeanScopeBase {}

export interface ScopeModuleTrainingStudent {
  util: BeanScopeUtil;
locale: TypeModuleLocales<(typeof locales)[TypeLocaleBase]>;
api: IModuleApi;
apiSchema: IModuleApiSchema;
}

import 'zova';
declare module 'zova' {
  export interface IBeanScopeRecord {
    'training-student': ScopeModuleTrainingStudent;
  }



  export interface IBeanScopeLocale {
    'training-student': (typeof locales)[TypeLocaleBase];
  }


}

export function locale<K extends keyof (typeof locales)[TypeLocaleBase]>(key: K): `training-student::${K}` {
  return `training-student::${key}`;
}
/** scope: end */
