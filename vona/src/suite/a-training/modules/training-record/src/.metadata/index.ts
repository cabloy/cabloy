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
/** meta: begin */
export * from '../bean/meta.index.ts';
export * from '../bean/meta.version.ts';
import type { IMetaOptionsIndex } from 'vona-module-a-index';
import 'vona-module-a-meta';
declare module 'vona-module-a-meta' {
  
    export interface IMetaRecord {
      'training-record:index': IMetaOptionsIndex;
'training-record:version': never;
    }

  
}
declare module 'vona-module-training-record' {
  
        export interface MetaIndex {
          /** @internal */
          get scope(): ScopeModuleTrainingRecord;
        }

          export interface MetaIndex {
            get $beanFullName(): 'training-record.meta.index';
            get $onionName(): 'training-record:index';
            get $onionOptions(): IMetaOptionsIndex;
          }

        export interface MetaVersion {
          /** @internal */
          get scope(): ScopeModuleTrainingRecord;
        }

          export interface MetaVersion {
            get $beanFullName(): 'training-record.meta.version';
            get $onionName(): 'training-record:version';
            
          } 
}
/** meta: end */
/** locale: begin */
import { locales } from './locales.ts';
/** locale: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil, type TypeModuleLocales, type TypeLocaleBase } from 'vona';
import { Scope } from 'vona-module-a-bean';

@Scope()
export class ScopeModuleTrainingRecord extends BeanScopeBase {}

export interface ScopeModuleTrainingRecord {
  util: BeanScopeUtil;
locale: TypeModuleLocales<(typeof locales)[TypeLocaleBase]>;
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
  
  

  export interface IBeanScopeLocale {
    'training-record': (typeof locales)[TypeLocaleBase];
  }

  
}
/** scope: end */
