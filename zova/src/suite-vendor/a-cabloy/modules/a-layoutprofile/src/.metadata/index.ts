// eslint-disable
/** model: begin */
export * from '../model/layoutprofile.js';
import { IModelOptionsLayoutProfile } from '../model/layoutprofile.js';
import 'zova-module-a-model';
declare module 'zova-module-a-model' {

    export interface IModelRecord {
      'a-layoutprofile:layoutProfile': IModelOptionsLayoutProfile;
    }


}
declare module 'zova-module-a-layoutprofile' {

        export interface ModelLayoutProfile {
          /** @internal */
          get scope(): ScopeModuleALayoutprofile;
        }

        export interface ModelLayoutProfile {
          get $beanFullName(): 'a-layoutprofile.model.layoutProfile';
          get $onionName(): 'a-layoutprofile:layoutProfile';
          get $onionOptions(): IModelOptionsLayoutProfile;
        }
}
/** model: end */
/** model: begin */
import type { ModelLayoutProfile } from '../model/layoutprofile.js';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'a-layoutprofile.model.layoutProfile': ModelLayoutProfile;
  }
}
/** model: end */
/** api: begin */
export * from '../api/layoutprofile.js';

import 'zova';
declare module 'zova' {


}
declare module 'zova-module-a-layoutprofile' {

        export interface ApiLayoutprofile {
          /** @internal */
          get scope(): ScopeModuleALayoutprofile;
        }

        export interface ApiLayoutprofile {
          get $beanFullName(): 'a-layoutprofile.api.layoutprofile';
          get $onionName(): 'a-layoutprofile:layoutprofile';

        }
}
/** api: end */
/** api: begin */
import type { ApiLayoutprofile } from '../api/layoutprofile.js';
export interface IModuleApi {
  'layoutprofile': ApiLayoutprofile;
}
/** api: end */
/** api: begin */

import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'a-layoutprofile.api.layoutprofile': ApiLayoutprofile;
  }
}
/** api: end */
/** openapi: begin */
export * from '../api/openapi/index.js';
/** openapi: end */
/** apiSchema: begin */
export * from '../apiSchema/layoutprofile.js';

import 'zova';
declare module 'zova' {


}
declare module 'zova-module-a-layoutprofile' {

        export interface ApiSchemaLayoutprofile {
          /** @internal */
          get scope(): ScopeModuleALayoutprofile;
        }

        export interface ApiSchemaLayoutprofile {
          get $beanFullName(): 'a-layoutprofile.apiSchema.layoutprofile';
          get $onionName(): 'a-layoutprofile:layoutprofile';

        }
}
/** apiSchema: end */
/** apiSchema: begin */
import type { ApiSchemaLayoutprofile } from '../apiSchema/layoutprofile.js';
export interface IModuleApiSchema {
  'layoutprofile': ApiSchemaLayoutprofile;
}
/** apiSchema: end */
/** apiSchema: begin */

import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'a-layoutprofile.apiSchema.layoutprofile': ApiSchemaLayoutprofile;
  }
}
/** apiSchema: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil } from 'zova';
import { Scope } from 'zova-module-a-bean';

@Scope()
export class ScopeModuleALayoutprofile extends BeanScopeBase {}

export interface ScopeModuleALayoutprofile {
  util: BeanScopeUtil;
api: IModuleApi;
apiSchema: IModuleApiSchema;
}

import 'zova';
declare module 'zova' {
  export interface IBeanScopeRecord {
    'a-layoutprofile': ScopeModuleALayoutprofile;
  }






}

/** scope: end */
