// eslint-disable
/** model: begin */
export * from '../model/file.js';
import { IModelOptionsFile } from '../model/file.js';
import 'zova-module-a-model';
declare module 'zova-module-a-model' {
  
    export interface IModelRecord {
      'basic-file:file': IModelOptionsFile;
    }

  
}
declare module 'zova-module-basic-file' {
  
        export interface ModelFile {
          /** @internal */
          get scope(): ScopeModuleBasicFile;
        }

        export interface ModelFile {
          get $beanFullName(): 'basic-file.model.file';
          get $onionName(): 'basic-file:file';
          get $onionOptions(): IModelOptionsFile;
        } 
}
/** model: end */
/** model: begin */
import { ModelFile } from '../model/file.js';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'basic-file.model.file': ModelFile;
  }
}
/** model: end */
/** api: begin */
export * from '../api/file.js';

import 'zova';
declare module 'zova' {
  
  
}
declare module 'zova-module-basic-file' {
  
        export interface ApiFile {
          /** @internal */
          get scope(): ScopeModuleBasicFile;
        }

        export interface ApiFile {
          get $beanFullName(): 'basic-file.api.file';
          get $onionName(): 'basic-file:file';
          
        } 
}
/** api: end */
/** api: begin */
import { ApiFile } from '../api/file.js';
export interface IModuleApi {
  'file': ApiFile;
}
/** api: end */
/** api: begin */

import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'basic-file.api.file': ApiFile;
  }
}
/** api: end */
/** openapi: begin */
export * from '../api/openapi/index.js';
/** openapi: end */
/** apiSchema: begin */
export * from '../apiSchema/file.js';

import 'zova';
declare module 'zova' {
  
  
}
declare module 'zova-module-basic-file' {
  
        export interface ApiSchemaFile {
          /** @internal */
          get scope(): ScopeModuleBasicFile;
        }

        export interface ApiSchemaFile {
          get $beanFullName(): 'basic-file.apiSchema.file';
          get $onionName(): 'basic-file:file';
          
        } 
}
/** apiSchema: end */
/** apiSchema: begin */
import { ApiSchemaFile } from '../apiSchema/file.js';
export interface IModuleApiSchema {
  'file': ApiSchemaFile;
}
/** apiSchema: end */
/** apiSchema: begin */

import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'basic-file.apiSchema.file': ApiSchemaFile;
  }
}
/** apiSchema: end */
/** controller: begin */
export * from '../component/formFieldFile/controller.jsx';

import 'zova';
declare module 'zova' {
  
  
}
declare module 'zova-module-basic-file' {
  
        export interface ControllerFormFieldFile {
          /** @internal */
          get scope(): ScopeModuleBasicFile;
        } 
}
/** controller: end */
/** controller: begin */
import { ControllerFormFieldFile } from '../component/formFieldFile/controller.jsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordLocal {
    'basic-file.controller.formFieldFile': ControllerFormFieldFile;
  }
}
/** controller: end */

/** components: begin */
export * from './component/formFieldFile.js';
import { ZFormFieldFile } from './component/formFieldFile.js';
export const components = {
  'formFieldFile': ZFormFieldFile,
};
import 'zova';
declare module 'zova' {
export interface IComponentRecord {
  'basic-file:formFieldFile': ControllerFormFieldFile;
}
export interface IZovaComponentRecord {
  'basic-file:formFieldFile': typeof ZFormFieldFile;
}
}
/** components: end */
/** tableCell: begin */
export * from '../bean/tableCell.file.jsx';
import { ITableCellOptionsFile } from '../bean/tableCell.file.jsx';
import 'zova-module-a-table';
declare module 'zova-module-a-table' {
  
    export interface ITableCellRecord {
      'basic-file:file': ITableCellOptionsFile;
    }

  
}
declare module 'zova-module-basic-file' {
  
        export interface TableCellFile {
          /** @internal */
          get scope(): ScopeModuleBasicFile;
        }

        export interface TableCellFile {
          get $beanFullName(): 'basic-file.tableCell.file';
          get $onionName(): 'basic-file:file';
          get $onionOptions(): ITableCellOptionsFile;
        } 
}
/** tableCell: end */
/** tableCell: begin */
import { TableCellFile } from '../bean/tableCell.file.jsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'basic-file.tableCell.file': TableCellFile;
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
export class ScopeModuleBasicFile extends BeanScopeBase {}

export interface ScopeModuleBasicFile {
  util: BeanScopeUtil;
locale: TypeModuleLocales<(typeof locales)[TypeLocaleBase]>;
api: IModuleApi;
apiSchema: IModuleApiSchema;
}

import 'zova';
declare module 'zova' {
  export interface IBeanScopeRecord {
    'basic-file': ScopeModuleBasicFile;
  }
  
  

  export interface IBeanScopeLocale {
    'basic-file': (typeof locales)[TypeLocaleBase];
  }

  
}

export function locale<K extends keyof (typeof locales)[TypeLocaleBase]>(key: K): `basic-file::${K}` {
  return `basic-file::${key}`;
}
/** scope: end */
