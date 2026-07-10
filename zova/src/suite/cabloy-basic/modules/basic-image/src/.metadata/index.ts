// eslint-disable
/** model: begin */
export * from '../model/image.js';
import { IModelOptionsImage } from '../model/image.js';
import 'zova-module-a-model';
declare module 'zova-module-a-model' {
  
    export interface IModelRecord {
      'basic-image:image': IModelOptionsImage;
    }

  
}
declare module 'zova-module-basic-image' {
  
        export interface ModelImage {
          /** @internal */
          get scope(): ScopeModuleBasicImage;
        }

        export interface ModelImage {
          get $beanFullName(): 'basic-image.model.image';
          get $onionName(): 'basic-image:image';
          get $onionOptions(): IModelOptionsImage;
        } 
}
/** model: end */
/** model: begin */
import { ModelImage } from '../model/image.js';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'basic-image.model.image': ModelImage;
  }
}
/** model: end */
/** api: begin */
export * from '../api/image.js';

import 'zova';
declare module 'zova' {


}
declare module 'zova-module-basic-image' {

        export interface ApiImage {
          /** @internal */
          get scope(): ScopeModuleBasicImage;
        }

        export interface ApiImage {
          get $beanFullName(): 'basic-image.api.image';
          get $onionName(): 'basic-image:image';

        }
}
/** api: end */
/** api: begin */
import { ApiImage } from '../api/image.js';
export interface IModuleApi {
  'image': ApiImage;
}
/** api: end */
/** api: begin */

import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'basic-image.api.image': ApiImage;
  }
}
/** api: end */
/** openapi: begin */
export * from '../api/openapi/index.js';
/** openapi: end */
/** apiSchema: begin */
export * from '../apiSchema/image.js';

import 'zova';
declare module 'zova' {


}
declare module 'zova-module-basic-image' {

        export interface ApiSchemaImage {
          /** @internal */
          get scope(): ScopeModuleBasicImage;
        }

        export interface ApiSchemaImage {
          get $beanFullName(): 'basic-image.apiSchema.image';
          get $onionName(): 'basic-image:image';

        }
}
/** apiSchema: end */
/** apiSchema: begin */
import { ApiSchemaImage } from '../apiSchema/image.js';
export interface IModuleApiSchema {
  'image': ApiSchemaImage;
}
/** apiSchema: end */
/** apiSchema: begin */

import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'basic-image.apiSchema.image': ApiSchemaImage;
  }
}
/** apiSchema: end */
/** controller: begin */
export * from '../component/formFieldImage/controller.jsx';

import 'zova';
declare module 'zova' {
  
  
}
declare module 'zova-module-basic-image' {
  
        export interface ControllerFormFieldImage {
          /** @internal */
          get scope(): ScopeModuleBasicImage;
        } 
}
/** controller: end */
/** controller: begin */
import { ControllerFormFieldImage } from '../component/formFieldImage/controller.jsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordLocal {
    'basic-image.controller.formFieldImage': ControllerFormFieldImage;
  }
}
/** controller: end */

/** components: begin */
export * from './component/formFieldImage.js';
import { ZFormFieldImage } from './component/formFieldImage.js';
export const components = {
  'formFieldImage': ZFormFieldImage,
};
import 'zova';
declare module 'zova' {
export interface IComponentRecord {
  'basic-image:formFieldImage': ControllerFormFieldImage;
}
export interface IZovaComponentRecord {
  'basic-image:formFieldImage': typeof ZFormFieldImage;
}
}
/** components: end */
/** tableCell: begin */
export * from '../bean/tableCell.image.jsx';
import { ITableCellOptionsImage } from '../bean/tableCell.image.jsx';
import 'zova-module-a-table';
declare module 'zova-module-a-table' {
  
    export interface ITableCellRecord {
      'basic-image:image': ITableCellOptionsImage;
    }

  
}
declare module 'zova-module-basic-image' {
  
        export interface TableCellImage {
          /** @internal */
          get scope(): ScopeModuleBasicImage;
        }

        export interface TableCellImage {
          get $beanFullName(): 'basic-image.tableCell.image';
          get $onionName(): 'basic-image:image';
          get $onionOptions(): ITableCellOptionsImage;
        } 
}
/** tableCell: end */
/** tableCell: begin */
import { TableCellImage } from '../bean/tableCell.image.jsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'basic-image.tableCell.image': TableCellImage;
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
export class ScopeModuleBasicImage extends BeanScopeBase {}

export interface ScopeModuleBasicImage {
  util: BeanScopeUtil;
locale: TypeModuleLocales<(typeof locales)[TypeLocaleBase]>;
api: IModuleApi;
apiSchema: IModuleApiSchema;
}

import 'zova';
declare module 'zova' {
  export interface IBeanScopeRecord {
    'basic-image': ScopeModuleBasicImage;
  }
  
  

  export interface IBeanScopeLocale {
    'basic-image': (typeof locales)[TypeLocaleBase];
  }

  
}

export function locale<K extends keyof (typeof locales)[TypeLocaleBase]>(key: K): `basic-image::${K}` {
  return `basic-image::${key}`;
}  
/** scope: end */
