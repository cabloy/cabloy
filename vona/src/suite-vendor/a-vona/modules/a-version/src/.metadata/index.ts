// eslint-disable
import type { TypeEntityMeta,TypeModelsClassLikeGeneral,TypeSymbolKeyFieldsMore } from 'vona-module-a-orm';
import type { TypeEntityOptionsFields } from 'vona-module-a-openapi';
import type { TableIdentity } from 'table-identity';
/** entity: begin */
export * from '../entity/version.ts';
export * from '../entity/versionInit.ts';
export * from '../entity/viewRecord.ts';
import type { IEntityOptionsVersion } from '../entity/version.ts';
import type { IEntityOptionsVersionInit } from '../entity/versionInit.ts';
import type { IEntityOptionsViewRecord } from '../entity/viewRecord.ts';
import 'vona-module-a-orm';
declare module 'vona-module-a-orm' {
  
    export interface IEntityRecord {
      'a-version:version': IEntityOptionsVersion;
'a-version:versionInit': IEntityOptionsVersionInit;
'a-version:viewRecord': IEntityOptionsViewRecord;
    }

  
}
declare module 'vona-module-a-version' {
   
}
/** entity: end */
/** entity: begin */
import type { EntityVersion } from '../entity/version.ts';
import type { EntityVersionInit } from '../entity/versionInit.ts';
import type { EntityViewRecord } from '../entity/viewRecord.ts';
export interface IModuleEntity {
  'version': EntityVersionMeta;
'versionInit': EntityVersionInitMeta;
'viewRecord': EntityViewRecordMeta;
}
/** entity: end */
/** entity: begin */
export type EntityVersionTableName = 'aVersion';
export type EntityVersionInitTableName = 'aVersionInit';
export type EntityViewRecordTableName = 'aViewRecord';
export type EntityVersionMeta=TypeEntityMeta<EntityVersion,EntityVersionTableName>;
export type EntityVersionInitMeta=TypeEntityMeta<EntityVersionInit,EntityVersionInitTableName>;
export type EntityViewRecordMeta=TypeEntityMeta<EntityViewRecord,EntityViewRecordTableName>;
declare module 'vona-module-a-orm' {
  export interface ITableRecord {
    'aVersion': EntityVersionMeta;
'aVersionInit': EntityVersionInitMeta;
'aViewRecord': EntityViewRecordMeta;
  }
}
declare module 'vona-module-a-version' {
  
    export interface IEntityOptionsVersion {
      fields?: TypeEntityOptionsFields<EntityVersion, IEntityOptionsVersion[TypeSymbolKeyFieldsMore]>;
    }

    export interface IEntityOptionsVersionInit {
      fields?: TypeEntityOptionsFields<EntityVersionInit, IEntityOptionsVersionInit[TypeSymbolKeyFieldsMore]>;
    }

    export interface IEntityOptionsViewRecord {
      fields?: TypeEntityOptionsFields<EntityViewRecord, IEntityOptionsViewRecord[TypeSymbolKeyFieldsMore]>;
    }
}
/** entity: end */
/** model: begin */
export * from '../model/version.ts';
export * from '../model/versionInit.ts';
export * from '../model/viewRecord.ts';
import type { IModelOptionsVersion } from '../model/version.ts';
import type { IModelOptionsVersionInit } from '../model/versionInit.ts';
import type { IModelOptionsViewRecord } from '../model/viewRecord.ts';
import 'vona-module-a-orm';
declare module 'vona-module-a-orm' {
  
    export interface IModelRecord {
      'a-version:version': IModelOptionsVersion;
'a-version:versionInit': IModelOptionsVersionInit;
'a-version:viewRecord': IModelOptionsViewRecord;
    }

  
}
declare module 'vona-module-a-version' {
  
        export interface ModelVersion {
          /** @internal */
          get scope(): ScopeModuleAVersion;
        }

          export interface ModelVersion {
            get $beanFullName(): 'a-version.model.version';
            get $onionName(): 'a-version:version';
            get $onionOptions(): IModelOptionsVersion;
          }

        export interface ModelVersionInit {
          /** @internal */
          get scope(): ScopeModuleAVersion;
        }

          export interface ModelVersionInit {
            get $beanFullName(): 'a-version.model.versionInit';
            get $onionName(): 'a-version:versionInit';
            get $onionOptions(): IModelOptionsVersionInit;
          }

        export interface ModelViewRecord {
          /** @internal */
          get scope(): ScopeModuleAVersion;
        }

          export interface ModelViewRecord {
            get $beanFullName(): 'a-version.model.viewRecord';
            get $onionName(): 'a-version:viewRecord';
            get $onionOptions(): IModelOptionsViewRecord;
          } 
}
/** model: end */
/** model: begin */
import type { ModelVersion } from '../model/version.ts';
import type { ModelVersionInit } from '../model/versionInit.ts';
import type { ModelViewRecord } from '../model/viewRecord.ts';
export interface IModuleModel {
  'version': ModelVersion;
'versionInit': ModelVersionInit;
'viewRecord': ModelViewRecord;
}
/** model: end */
/** model: begin */

import 'vona';
declare module 'vona' {
  export interface IBeanRecordGeneral {
    'a-version.model.version': ModelVersion;
'a-version.model.versionInit': ModelVersionInit;
'a-version.model.viewRecord': ModelViewRecord;
  }
}
/** model: end */
/** model: begin */
import type { IModelGetOptions, IModelMethodOptions, IModelSelectParams, TypeModelSelectAndCount, TypeModelRelationResult, TypeModelWhere, IModelInsertOptions, TypeModelMutateRelationData, IModelDeleteOptions, IModelUpdateOptions, IModelMutateOptions, IModelSelectCountParams, IModelIncrementParams, IModelSelectAggrParams, TypeModelAggrRelationResult, IModelSelectGroupParams, TypeModelGroupRelationResult } from 'vona-module-a-orm';
import { SymbolKeyEntity, SymbolKeyEntityMeta, SymbolKeyModelOptions } from 'vona-module-a-orm';
declare module 'vona-module-a-version' {
  
  export interface ModelVersion {
      [SymbolKeyEntity]: EntityVersion;
      [SymbolKeyEntityMeta]: EntityVersionMeta;
      [SymbolKeyModelOptions]: IModelOptionsVersion;
      get<T extends IModelGetOptions<EntityVersion,ModelVersion>>(where: TypeModelWhere<EntityVersion>, options?: T): Promise<TypeModelRelationResult<EntityVersion, ModelVersion, T> | undefined>;
      mget<T extends IModelGetOptions<EntityVersion,ModelVersion>>(ids: TableIdentity[], options?: T): Promise<TypeModelRelationResult<EntityVersion, ModelVersion, T>[]>;
      selectAndCount<T extends IModelSelectParams<EntityVersion,ModelVersion,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelSelectAndCount<EntityVersion, ModelVersion, T>>;
      select<T extends IModelSelectParams<EntityVersion,ModelVersion,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelRelationResult<EntityVersion, ModelVersion, T>[]>;
      insert<T extends IModelInsertOptions<EntityVersion,ModelVersion>>(data?: TypeModelMutateRelationData<EntityVersion,ModelVersion, T>, options?: T): Promise<TypeModelMutateRelationData<EntityVersion,ModelVersion, T, true>>;
      insertBulk<T extends IModelInsertOptions<EntityVersion,ModelVersion>>(items: TypeModelMutateRelationData<EntityVersion,ModelVersion, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityVersion,ModelVersion, T, true>[]>;
      update<T extends IModelUpdateOptions<EntityVersion,ModelVersion>>(data: TypeModelMutateRelationData<EntityVersion,ModelVersion, T>, options?: T): Promise<TypeModelMutateRelationData<EntityVersion,ModelVersion, T>>;
      updateBulk<T extends IModelUpdateOptions<EntityVersion,ModelVersion>>(items: TypeModelMutateRelationData<EntityVersion,ModelVersion, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityVersion,ModelVersion, T>[]>;
      delete<T extends IModelDeleteOptions<EntityVersion,ModelVersion>>(where?: TypeModelWhere<EntityVersion>, options?: T): Promise<void>;
      deleteBulk<T extends IModelDeleteOptions<EntityVersion,ModelVersion>>(ids: TableIdentity[], options?: T): Promise<void>;
      mutate<T extends IModelMutateOptions<EntityVersion,ModelVersion>>(data?: TypeModelMutateRelationData<EntityVersion,ModelVersion, T>, options?: T): Promise<TypeModelMutateRelationData<EntityVersion,ModelVersion, T>>;
      mutateBulk<T extends IModelMutateOptions<EntityVersion,ModelVersion>>(items: TypeModelMutateRelationData<EntityVersion,ModelVersion, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityVersion,ModelVersion, T>[]>;
      count<T extends IModelSelectCountParams<EntityVersion,ModelVersion,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<string | undefined>;
      increment<T extends IModelIncrementParams<EntityVersion,ModelVersion,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      decrement<T extends IModelIncrementParams<EntityVersion,ModelVersion,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      aggregate<T extends IModelSelectAggrParams<EntityVersion,ModelVersion,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelAggrRelationResult<T>>;
      group<T extends IModelSelectGroupParams<EntityVersion,ModelVersion,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelGroupRelationResult<EntityVersion, T>[]>;
      getById<T extends IModelGetOptions<EntityVersion,ModelVersion>>(id: number, options?: T): Promise<TypeModelRelationResult<EntityVersion, ModelVersion, T> | undefined>;
updateById<T extends IModelUpdateOptions<EntityVersion,ModelVersion>>(id: number, data: TypeModelMutateRelationData<EntityVersion,ModelVersion, T>, options?: T): Promise<TypeModelMutateRelationData<EntityVersion,ModelVersion, T>>;
deleteById<T extends IModelDeleteOptions<EntityVersion,ModelVersion>>(id: number, options?: T): Promise<void>;
    }
export interface ModelVersionInit {
      [SymbolKeyEntity]: EntityVersionInit;
      [SymbolKeyEntityMeta]: EntityVersionInitMeta;
      [SymbolKeyModelOptions]: IModelOptionsVersionInit;
      get<T extends IModelGetOptions<EntityVersionInit,ModelVersionInit>>(where: TypeModelWhere<EntityVersionInit>, options?: T): Promise<TypeModelRelationResult<EntityVersionInit, ModelVersionInit, T> | undefined>;
      mget<T extends IModelGetOptions<EntityVersionInit,ModelVersionInit>>(ids: TableIdentity[], options?: T): Promise<TypeModelRelationResult<EntityVersionInit, ModelVersionInit, T>[]>;
      selectAndCount<T extends IModelSelectParams<EntityVersionInit,ModelVersionInit,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelSelectAndCount<EntityVersionInit, ModelVersionInit, T>>;
      select<T extends IModelSelectParams<EntityVersionInit,ModelVersionInit,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelRelationResult<EntityVersionInit, ModelVersionInit, T>[]>;
      insert<T extends IModelInsertOptions<EntityVersionInit,ModelVersionInit>>(data?: TypeModelMutateRelationData<EntityVersionInit,ModelVersionInit, T>, options?: T): Promise<TypeModelMutateRelationData<EntityVersionInit,ModelVersionInit, T, true>>;
      insertBulk<T extends IModelInsertOptions<EntityVersionInit,ModelVersionInit>>(items: TypeModelMutateRelationData<EntityVersionInit,ModelVersionInit, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityVersionInit,ModelVersionInit, T, true>[]>;
      update<T extends IModelUpdateOptions<EntityVersionInit,ModelVersionInit>>(data: TypeModelMutateRelationData<EntityVersionInit,ModelVersionInit, T>, options?: T): Promise<TypeModelMutateRelationData<EntityVersionInit,ModelVersionInit, T>>;
      updateBulk<T extends IModelUpdateOptions<EntityVersionInit,ModelVersionInit>>(items: TypeModelMutateRelationData<EntityVersionInit,ModelVersionInit, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityVersionInit,ModelVersionInit, T>[]>;
      delete<T extends IModelDeleteOptions<EntityVersionInit,ModelVersionInit>>(where?: TypeModelWhere<EntityVersionInit>, options?: T): Promise<void>;
      deleteBulk<T extends IModelDeleteOptions<EntityVersionInit,ModelVersionInit>>(ids: TableIdentity[], options?: T): Promise<void>;
      mutate<T extends IModelMutateOptions<EntityVersionInit,ModelVersionInit>>(data?: TypeModelMutateRelationData<EntityVersionInit,ModelVersionInit, T>, options?: T): Promise<TypeModelMutateRelationData<EntityVersionInit,ModelVersionInit, T>>;
      mutateBulk<T extends IModelMutateOptions<EntityVersionInit,ModelVersionInit>>(items: TypeModelMutateRelationData<EntityVersionInit,ModelVersionInit, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityVersionInit,ModelVersionInit, T>[]>;
      count<T extends IModelSelectCountParams<EntityVersionInit,ModelVersionInit,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<string | undefined>;
      increment<T extends IModelIncrementParams<EntityVersionInit,ModelVersionInit,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      decrement<T extends IModelIncrementParams<EntityVersionInit,ModelVersionInit,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      aggregate<T extends IModelSelectAggrParams<EntityVersionInit,ModelVersionInit,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelAggrRelationResult<T>>;
      group<T extends IModelSelectGroupParams<EntityVersionInit,ModelVersionInit,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelGroupRelationResult<EntityVersionInit, T>[]>;
      getById<T extends IModelGetOptions<EntityVersionInit,ModelVersionInit>>(id: number, options?: T): Promise<TypeModelRelationResult<EntityVersionInit, ModelVersionInit, T> | undefined>;
updateById<T extends IModelUpdateOptions<EntityVersionInit,ModelVersionInit>>(id: number, data: TypeModelMutateRelationData<EntityVersionInit,ModelVersionInit, T>, options?: T): Promise<TypeModelMutateRelationData<EntityVersionInit,ModelVersionInit, T>>;
deleteById<T extends IModelDeleteOptions<EntityVersionInit,ModelVersionInit>>(id: number, options?: T): Promise<void>;
    }
export interface ModelViewRecord {
      [SymbolKeyEntity]: EntityViewRecord;
      [SymbolKeyEntityMeta]: EntityViewRecordMeta;
      [SymbolKeyModelOptions]: IModelOptionsViewRecord;
      get<T extends IModelGetOptions<EntityViewRecord,ModelViewRecord>>(where: TypeModelWhere<EntityViewRecord>, options?: T): Promise<TypeModelRelationResult<EntityViewRecord, ModelViewRecord, T> | undefined>;
      mget<T extends IModelGetOptions<EntityViewRecord,ModelViewRecord>>(ids: TableIdentity[], options?: T): Promise<TypeModelRelationResult<EntityViewRecord, ModelViewRecord, T>[]>;
      selectAndCount<T extends IModelSelectParams<EntityViewRecord,ModelViewRecord,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelSelectAndCount<EntityViewRecord, ModelViewRecord, T>>;
      select<T extends IModelSelectParams<EntityViewRecord,ModelViewRecord,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelRelationResult<EntityViewRecord, ModelViewRecord, T>[]>;
      insert<T extends IModelInsertOptions<EntityViewRecord,ModelViewRecord>>(data?: TypeModelMutateRelationData<EntityViewRecord,ModelViewRecord, T>, options?: T): Promise<TypeModelMutateRelationData<EntityViewRecord,ModelViewRecord, T, true>>;
      insertBulk<T extends IModelInsertOptions<EntityViewRecord,ModelViewRecord>>(items: TypeModelMutateRelationData<EntityViewRecord,ModelViewRecord, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityViewRecord,ModelViewRecord, T, true>[]>;
      update<T extends IModelUpdateOptions<EntityViewRecord,ModelViewRecord>>(data: TypeModelMutateRelationData<EntityViewRecord,ModelViewRecord, T>, options?: T): Promise<TypeModelMutateRelationData<EntityViewRecord,ModelViewRecord, T>>;
      updateBulk<T extends IModelUpdateOptions<EntityViewRecord,ModelViewRecord>>(items: TypeModelMutateRelationData<EntityViewRecord,ModelViewRecord, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityViewRecord,ModelViewRecord, T>[]>;
      delete<T extends IModelDeleteOptions<EntityViewRecord,ModelViewRecord>>(where?: TypeModelWhere<EntityViewRecord>, options?: T): Promise<void>;
      deleteBulk<T extends IModelDeleteOptions<EntityViewRecord,ModelViewRecord>>(ids: TableIdentity[], options?: T): Promise<void>;
      mutate<T extends IModelMutateOptions<EntityViewRecord,ModelViewRecord>>(data?: TypeModelMutateRelationData<EntityViewRecord,ModelViewRecord, T>, options?: T): Promise<TypeModelMutateRelationData<EntityViewRecord,ModelViewRecord, T>>;
      mutateBulk<T extends IModelMutateOptions<EntityViewRecord,ModelViewRecord>>(items: TypeModelMutateRelationData<EntityViewRecord,ModelViewRecord, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityViewRecord,ModelViewRecord, T>[]>;
      count<T extends IModelSelectCountParams<EntityViewRecord,ModelViewRecord,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<string | undefined>;
      increment<T extends IModelIncrementParams<EntityViewRecord,ModelViewRecord,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      decrement<T extends IModelIncrementParams<EntityViewRecord,ModelViewRecord,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      aggregate<T extends IModelSelectAggrParams<EntityViewRecord,ModelViewRecord,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelAggrRelationResult<T>>;
      group<T extends IModelSelectGroupParams<EntityViewRecord,ModelViewRecord,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelGroupRelationResult<EntityViewRecord, T>[]>;
      getById<T extends IModelGetOptions<EntityViewRecord,ModelViewRecord>>(id: number, options?: T): Promise<TypeModelRelationResult<EntityViewRecord, ModelViewRecord, T> | undefined>;
updateById<T extends IModelUpdateOptions<EntityViewRecord,ModelViewRecord>>(id: number, data: TypeModelMutateRelationData<EntityViewRecord,ModelViewRecord, T>, options?: T): Promise<TypeModelMutateRelationData<EntityViewRecord,ModelViewRecord, T>>;
deleteById<T extends IModelDeleteOptions<EntityViewRecord,ModelViewRecord>>(id: number, options?: T): Promise<void>;
    }
}
declare module 'vona-module-a-orm' {
  export interface IModelClassRecord {
    'a-version:version': ModelVersion;
'a-version:versionInit': ModelVersionInit;
'a-version:viewRecord': ModelViewRecord;
  }
}
/** model: end */
/** service: begin */
export * from '../service/database.ts';
export * from '../service/version.ts';

import 'vona-module-a-bean';
declare module 'vona-module-a-bean' {
  
    export interface IServiceRecord {
      'a-version:database': never;
'a-version:version': never;
    }

  
}
declare module 'vona-module-a-version' {
  
        export interface ServiceDatabase {
          /** @internal */
          get scope(): ScopeModuleAVersion;
        }

          export interface ServiceDatabase {
            get $beanFullName(): 'a-version.service.database';
            get $onionName(): 'a-version:database';
            
          }

        export interface ServiceVersion {
          /** @internal */
          get scope(): ScopeModuleAVersion;
        }

          export interface ServiceVersion {
            get $beanFullName(): 'a-version.service.version';
            get $onionName(): 'a-version:version';
            
          } 
}
/** service: end */
/** service: begin */
import type { ServiceDatabase } from '../service/database.ts';
import type { ServiceVersion } from '../service/version.ts';
export interface IModuleService {
  'database': ServiceDatabase;
'version': ServiceVersion;
}
/** service: end */
/** service: begin */

import 'vona';
declare module 'vona' {
  export interface IBeanRecordGeneral {
    'a-version.service.database': ServiceDatabase;
'a-version.service.version': ServiceVersion;
  }
}
/** service: end */
/** event: begin */
export * from '../bean/event.versionDone.ts';

import 'vona';
declare module 'vona' {
  
  
}
declare module 'vona-module-a-version' {
  
        export interface EventVersionDone {
          /** @internal */
          get scope(): ScopeModuleAVersion;
        }

          export interface EventVersionDone {
            get $beanFullName(): 'a-version.event.versionDone';
            get $onionName(): 'a-version:versionDone';
            
          } 
}
/** event: end */
/** event: begin */
import type { EventVersionDone } from '../bean/event.versionDone.ts';
export interface IModuleEvent {
  'versionDone': EventVersionDone;
}
/** event: end */
/** event: begin */
import type { TypeEventVersionDoneData, TypeEventVersionDoneResult } from '../bean/event.versionDone.ts';
import type { EventOn } from 'vona-module-a-event'; 
declare module 'vona-module-a-event' {
  export interface IEventRecord {
    'a-version:versionDone': EventOn<TypeEventVersionDoneData, TypeEventVersionDoneResult>;
  }
}
/** event: end */
/** hmr: begin */
export * from '../bean/hmr.metaVersion.ts';

import 'vona';
declare module 'vona' {
  
    export interface IHmrRecord {
      'a-version:metaVersion': never;
    }

  
}
declare module 'vona-module-a-version' {
  
        export interface HmrMetaVersion {
          /** @internal */
          get scope(): ScopeModuleAVersion;
        }

          export interface HmrMetaVersion {
            get $beanFullName(): 'a-version.hmr.metaVersion';
            get $onionName(): 'a-version:metaVersion';
            
          } 
}
/** hmr: end */
/** meta: begin */
export * from '../bean/meta.version.ts';

import 'vona-module-a-meta';
declare module 'vona-module-a-meta' {
  
    export interface IMetaRecord {
      'a-version:version': never;
    }

  
}
declare module 'vona-module-a-version' {
  
        export interface MetaVersion {
          /** @internal */
          get scope(): ScopeModuleAVersion;
        }

          export interface MetaVersion {
            get $beanFullName(): 'a-version.meta.version';
            get $onionName(): 'a-version:version';
            
          } 
}
/** meta: end */
/** startup: begin */
export * from '../bean/startup.databaseInit.ts';
export * from '../bean/startup.databaseName.ts';
export * from '../bean/startup.instanceInit.ts';

import { type IDecoratorStartupOptions } from 'vona-module-a-startup';
declare module 'vona-module-a-startup' {
  
    export interface IStartupRecord {
      'a-version:databaseInit': IDecoratorStartupOptions;
'a-version:databaseName': IDecoratorStartupOptions;
'a-version:instanceInit': IDecoratorStartupOptions;
    }

  
}
declare module 'vona-module-a-version' {
  
        export interface StartupDatabaseInit {
          /** @internal */
          get scope(): ScopeModuleAVersion;
        }

          export interface StartupDatabaseInit {
            get $beanFullName(): 'a-version.startup.databaseInit';
            get $onionName(): 'a-version:databaseInit';
            get $onionOptions(): IDecoratorStartupOptions;
          }

        export interface StartupDatabaseName {
          /** @internal */
          get scope(): ScopeModuleAVersion;
        }

          export interface StartupDatabaseName {
            get $beanFullName(): 'a-version.startup.databaseName';
            get $onionName(): 'a-version:databaseName';
            get $onionOptions(): IDecoratorStartupOptions;
          }

        export interface StartupInstanceInit {
          /** @internal */
          get scope(): ScopeModuleAVersion;
        }

          export interface StartupInstanceInit {
            get $beanFullName(): 'a-version.startup.instanceInit';
            get $onionName(): 'a-version:instanceInit';
            get $onionOptions(): IDecoratorStartupOptions;
          } 
}
/** startup: end */
/** locale: begin */
import { locales } from './locales.ts';
/** locale: end */
/** error: begin */
export * from '../config/errors.ts';
import type { errors } from '../config/errors.ts';
/** error: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil, type TypeModuleErrors, type TypeModuleLocales, type TypeLocaleBase } from 'vona';
import { Scope } from 'vona-module-a-bean';

@Scope()
export class ScopeModuleAVersion extends BeanScopeBase {}

export interface ScopeModuleAVersion {
  util: BeanScopeUtil;
error: TypeModuleErrors<typeof errors>;
locale: TypeModuleLocales<(typeof locales)[TypeLocaleBase]>;
entity: IModuleEntity;
model: IModuleModel;
service: IModuleService;
event: IModuleEvent;
}

import 'vona';
declare module 'vona' {
  export interface IBeanScopeRecord {
    'a-version': ScopeModuleAVersion;
  }

  export interface IBeanScopeContainer {
    version: ScopeModuleAVersion;
  }
  
  

  export interface IBeanScopeLocale {
    'a-version': (typeof locales)[TypeLocaleBase];
  }

  export interface IBeanScopeErrors {
    'a-version': typeof errors;
  }
}
/** scope: end */
