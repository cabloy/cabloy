// eslint-disable
import type { TypeEntityMeta,TypeSymbolKeyFieldsMore } from 'vona-module-a-orm';
import type { TypeEntityOptionsFields } from 'vona-module-a-openapi';
/** entity: begin */
export * from '../entity/record.tsx';
import type { IEntityOptionsRecord } from '../entity/record.tsx';
import 'vona-module-a-orm';
declare module 'vona-module-a-orm' {
  
    export interface IEntityRecord {
      'training-record:record': IEntityOptionsRecord;
    }

  
}
declare module 'vona-module-training-record' {
   
}
/** entity: end */
/** entity: begin */
import type { EntityRecord } from '../entity/record.tsx';
export interface IModuleEntity {
  'record': EntityRecordMeta;
}
/** entity: end */
/** entity: begin */
export type EntityRecordTableName = 'trainingRecord';
export type EntityRecordMeta=TypeEntityMeta<EntityRecord,EntityRecordTableName>;
declare module 'vona-module-a-orm' {
  export interface ITableRecord {
    'trainingRecord': EntityRecordMeta;
  }
}
declare module 'vona-module-training-record' {
  
    export interface IEntityOptionsRecord {
      fields?: TypeEntityOptionsFields<EntityRecord, IEntityOptionsRecord[TypeSymbolKeyFieldsMore]>;
    }
}
/** entity: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil } from 'vona';
import { Scope } from 'vona-module-a-bean';

@Scope()
export class ScopeModuleTrainingRecord extends BeanScopeBase {}

export interface ScopeModuleTrainingRecord {
  util: BeanScopeUtil;
entity: IModuleEntity;
}

import 'vona';
declare module 'vona' {
  export interface IBeanScopeRecord {
    'training-record': ScopeModuleTrainingRecord;
  }

  export interface IBeanScopeContainer {
    trainingRecord: ScopeModuleTrainingRecord;
  }
  
  

  

  
}
/** scope: end */
