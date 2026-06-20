// eslint-disable
/** api: begin */
export * from '../api/trainingRecord.js';

import 'zova';
declare module 'zova' {
  
  
}
declare module 'zova-module-training-record' {
  
        export interface ApiTrainingRecord {
          /** @internal */
          get scope(): ScopeModuleTrainingRecord;
        }

        export interface ApiTrainingRecord {
          get $beanFullName(): 'training-record.api.trainingRecord';
          get $onionName(): 'training-record:trainingRecord';
          
        } 
}
/** api: end */
/** api: begin */
import { ApiTrainingRecord } from '../api/trainingRecord.js';
export interface IModuleApi {
  'trainingRecord': ApiTrainingRecord;
}
/** api: end */
/** api: begin */

import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'training-record.api.trainingRecord': ApiTrainingRecord;
  }
}
/** api: end */
/** openapi: begin */
export * from '../api/openapi/index.js';
/** openapi: end */
/** apiSchema: begin */
export * from '../apiSchema/trainingRecord.js';

import 'zova';
declare module 'zova' {
  
  
}
declare module 'zova-module-training-record' {
  
        export interface ApiSchemaTrainingRecord {
          /** @internal */
          get scope(): ScopeModuleTrainingRecord;
        }

        export interface ApiSchemaTrainingRecord {
          get $beanFullName(): 'training-record.apiSchema.trainingRecord';
          get $onionName(): 'training-record:trainingRecord';
          
        } 
}
/** apiSchema: end */
/** apiSchema: begin */
import { ApiSchemaTrainingRecord } from '../apiSchema/trainingRecord.js';
export interface IModuleApiSchema {
  'trainingRecord': ApiSchemaTrainingRecord;
}
/** apiSchema: end */
/** apiSchema: begin */

import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'training-record.apiSchema.trainingRecord': ApiSchemaTrainingRecord;
  }
}
/** apiSchema: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil } from 'zova';
import { Scope } from 'zova-module-a-bean';

@Scope()
export class ScopeModuleTrainingRecord extends BeanScopeBase {}

export interface ScopeModuleTrainingRecord {
  util: BeanScopeUtil;
api: IModuleApi;
apiSchema: IModuleApiSchema;
}

import 'zova';
declare module 'zova' {
  export interface IBeanScopeRecord {
    'training-record': ScopeModuleTrainingRecord;
  }
  
  

  

  
}
  
/** scope: end */
