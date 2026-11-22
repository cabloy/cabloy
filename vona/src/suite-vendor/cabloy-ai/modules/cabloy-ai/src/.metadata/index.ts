// eslint-disable
import type { TypeEntityMeta,TypeModelsClassLikeGeneral,TypeSymbolKeyFieldsMore } from 'vona-module-a-orm';
import type { TypeEntityOptionsFields,TypeControllerOptionsActions } from 'vona-module-a-openapi';
import type { TableIdentity } from 'table-identity';
/** entity: begin */
export * from '../entity/aiModel.tsx';
export * from '../entity/aiProvider.tsx';
export * from '../entity/aiScene.tsx';
export * from '../entity/conversation.tsx';
export * from '../entity/message.tsx';
export * from '../entity/run.tsx';
export * from '../entity/usage.tsx';
import type { IEntityOptionsAiModel } from '../entity/aiModel.tsx';
import type { IEntityOptionsAiProvider } from '../entity/aiProvider.tsx';
import type { IEntityOptionsAiScene } from '../entity/aiScene.tsx';
import type { IEntityOptionsConversation } from '../entity/conversation.tsx';
import type { IEntityOptionsMessage } from '../entity/message.tsx';
import type { IEntityOptionsRun } from '../entity/run.tsx';
import type { IEntityOptionsUsage } from '../entity/usage.tsx';
import 'vona-module-a-orm';
declare module 'vona-module-a-orm' {

    export interface IEntityRecord {
      'cabloy-ai:aiModel': IEntityOptionsAiModel;
'cabloy-ai:aiProvider': IEntityOptionsAiProvider;
'cabloy-ai:aiScene': IEntityOptionsAiScene;
'cabloy-ai:conversation': IEntityOptionsConversation;
'cabloy-ai:message': IEntityOptionsMessage;
'cabloy-ai:run': IEntityOptionsRun;
'cabloy-ai:usage': IEntityOptionsUsage;
    }


}
declare module 'vona-module-cabloy-ai' {

}
/** entity: end */
/** entity: begin */
import type { EntityAiModel } from '../entity/aiModel.tsx';
import type { EntityAiProvider } from '../entity/aiProvider.tsx';
import type { EntityAiScene } from '../entity/aiScene.tsx';
import type { EntityConversation } from '../entity/conversation.tsx';
import type { EntityMessage } from '../entity/message.tsx';
import type { EntityRun } from '../entity/run.tsx';
import type { EntityUsage } from '../entity/usage.tsx';
export interface IModuleEntity {
  'aiModel': EntityAiModelMeta;
'aiProvider': EntityAiProviderMeta;
'aiScene': EntityAiSceneMeta;
'conversation': EntityConversationMeta;
'message': EntityMessageMeta;
'run': EntityRunMeta;
'usage': EntityUsageMeta;
}
/** entity: end */
/** entity: begin */
export type EntityAiModelTableName = 'cabloyAiModel';
export type EntityAiProviderTableName = 'cabloyAiProvider';
export type EntityAiSceneTableName = 'cabloyAiScene';
export type EntityConversationTableName = 'cabloyAiConversation';
export type EntityMessageTableName = 'cabloyAiMessage';
export type EntityRunTableName = 'cabloyAiRun';
export type EntityUsageTableName = 'cabloyAiUsage';
export type EntityAiModelMeta=TypeEntityMeta<EntityAiModel,EntityAiModelTableName>;
export type EntityAiProviderMeta=TypeEntityMeta<EntityAiProvider,EntityAiProviderTableName>;
export type EntityAiSceneMeta=TypeEntityMeta<EntityAiScene,EntityAiSceneTableName>;
export type EntityConversationMeta=TypeEntityMeta<EntityConversation,EntityConversationTableName>;
export type EntityMessageMeta=TypeEntityMeta<EntityMessage,EntityMessageTableName>;
export type EntityRunMeta=TypeEntityMeta<EntityRun,EntityRunTableName>;
export type EntityUsageMeta=TypeEntityMeta<EntityUsage,EntityUsageTableName>;
declare module 'vona-module-a-orm' {
  export interface ITableRecord {
    'cabloyAiModel': EntityAiModelMeta;
'cabloyAiProvider': EntityAiProviderMeta;
'cabloyAiScene': EntityAiSceneMeta;
'cabloyAiConversation': EntityConversationMeta;
'cabloyAiMessage': EntityMessageMeta;
'cabloyAiRun': EntityRunMeta;
'cabloyAiUsage': EntityUsageMeta;
  }
}
declare module 'vona-module-cabloy-ai' {

    export interface IEntityOptionsAiModel {
      fields?: TypeEntityOptionsFields<EntityAiModel, IEntityOptionsAiModel[TypeSymbolKeyFieldsMore]>;
    }

    export interface IEntityOptionsAiProvider {
      fields?: TypeEntityOptionsFields<EntityAiProvider, IEntityOptionsAiProvider[TypeSymbolKeyFieldsMore]>;
    }

    export interface IEntityOptionsAiScene {
      fields?: TypeEntityOptionsFields<EntityAiScene, IEntityOptionsAiScene[TypeSymbolKeyFieldsMore]>;
    }

    export interface IEntityOptionsConversation {
      fields?: TypeEntityOptionsFields<EntityConversation, IEntityOptionsConversation[TypeSymbolKeyFieldsMore]>;
    }

    export interface IEntityOptionsMessage {
      fields?: TypeEntityOptionsFields<EntityMessage, IEntityOptionsMessage[TypeSymbolKeyFieldsMore]>;
    }

    export interface IEntityOptionsRun {
      fields?: TypeEntityOptionsFields<EntityRun, IEntityOptionsRun[TypeSymbolKeyFieldsMore]>;
    }

    export interface IEntityOptionsUsage {
      fields?: TypeEntityOptionsFields<EntityUsage, IEntityOptionsUsage[TypeSymbolKeyFieldsMore]>;
    }
}
/** entity: end */
/** model: begin */
export * from '../model/aiModel.ts';
export * from '../model/aiProvider.ts';
export * from '../model/aiScene.ts';
export * from '../model/conversation.ts';
export * from '../model/message.ts';
export * from '../model/run.ts';
export * from '../model/usage.ts';
import type { IModelOptionsAiModel } from '../model/aiModel.ts';
import type { IModelOptionsAiProvider } from '../model/aiProvider.ts';
import type { IModelOptionsAiScene } from '../model/aiScene.ts';
import type { IModelOptionsConversation } from '../model/conversation.ts';
import type { IModelOptionsMessage } from '../model/message.ts';
import type { IModelOptionsRun } from '../model/run.ts';
import type { IModelOptionsUsage } from '../model/usage.ts';
import 'vona-module-a-orm';
declare module 'vona-module-a-orm' {

    export interface IModelRecord {
      'cabloy-ai:aiModel': IModelOptionsAiModel;
'cabloy-ai:aiProvider': IModelOptionsAiProvider;
'cabloy-ai:aiScene': IModelOptionsAiScene;
'cabloy-ai:conversation': IModelOptionsConversation;
'cabloy-ai:message': IModelOptionsMessage;
'cabloy-ai:run': IModelOptionsRun;
'cabloy-ai:usage': IModelOptionsUsage;
    }


}
declare module 'vona-module-cabloy-ai' {

        export interface ModelAiModel {
          /** @internal */
          get scope(): ScopeModuleCabloyAi;
        }

          export interface ModelAiModel {
            get $beanFullName(): 'cabloy-ai.model.aiModel';
            get $onionName(): 'cabloy-ai:aiModel';
            get $onionOptions(): IModelOptionsAiModel;
          }

        export interface ModelAiProvider {
          /** @internal */
          get scope(): ScopeModuleCabloyAi;
        }

          export interface ModelAiProvider {
            get $beanFullName(): 'cabloy-ai.model.aiProvider';
            get $onionName(): 'cabloy-ai:aiProvider';
            get $onionOptions(): IModelOptionsAiProvider;
          }

        export interface ModelAiScene {
          /** @internal */
          get scope(): ScopeModuleCabloyAi;
        }

          export interface ModelAiScene {
            get $beanFullName(): 'cabloy-ai.model.aiScene';
            get $onionName(): 'cabloy-ai:aiScene';
            get $onionOptions(): IModelOptionsAiScene;
          }

        export interface ModelConversation {
          /** @internal */
          get scope(): ScopeModuleCabloyAi;
        }

          export interface ModelConversation {
            get $beanFullName(): 'cabloy-ai.model.conversation';
            get $onionName(): 'cabloy-ai:conversation';
            get $onionOptions(): IModelOptionsConversation;
          }

        export interface ModelMessage {
          /** @internal */
          get scope(): ScopeModuleCabloyAi;
        }

          export interface ModelMessage {
            get $beanFullName(): 'cabloy-ai.model.message';
            get $onionName(): 'cabloy-ai:message';
            get $onionOptions(): IModelOptionsMessage;
          }

        export interface ModelRun {
          /** @internal */
          get scope(): ScopeModuleCabloyAi;
        }

          export interface ModelRun {
            get $beanFullName(): 'cabloy-ai.model.run';
            get $onionName(): 'cabloy-ai:run';
            get $onionOptions(): IModelOptionsRun;
          }

        export interface ModelUsage {
          /** @internal */
          get scope(): ScopeModuleCabloyAi;
        }

          export interface ModelUsage {
            get $beanFullName(): 'cabloy-ai.model.usage';
            get $onionName(): 'cabloy-ai:usage';
            get $onionOptions(): IModelOptionsUsage;
          }
}
/** model: end */
/** model: begin */
import type { ModelAiModel } from '../model/aiModel.ts';
import type { ModelAiProvider } from '../model/aiProvider.ts';
import type { ModelAiScene } from '../model/aiScene.ts';
import type { ModelConversation } from '../model/conversation.ts';
import type { ModelMessage } from '../model/message.ts';
import type { ModelRun } from '../model/run.ts';
import type { ModelUsage } from '../model/usage.ts';
export interface IModuleModel {
  'aiModel': ModelAiModel;
'aiProvider': ModelAiProvider;
'aiScene': ModelAiScene;
'conversation': ModelConversation;
'message': ModelMessage;
'run': ModelRun;
'usage': ModelUsage;
}
/** model: end */
/** model: begin */

import 'vona';
declare module 'vona' {
  export interface IBeanRecordGeneral {
    'cabloy-ai.model.aiModel': ModelAiModel;
'cabloy-ai.model.aiProvider': ModelAiProvider;
'cabloy-ai.model.aiScene': ModelAiScene;
'cabloy-ai.model.conversation': ModelConversation;
'cabloy-ai.model.message': ModelMessage;
'cabloy-ai.model.run': ModelRun;
'cabloy-ai.model.usage': ModelUsage;
  }
}
/** model: end */
/** model: begin */
import type { IModelGetOptions, IModelMethodOptions, IModelSelectParams, TypeModelSelectAndCount, TypeModelRelationResult, TypeModelWhere, IModelInsertOptions, TypeModelMutateRelationData, IModelDeleteOptions, IModelUpdateOptions, IModelMutateOptions, IModelSelectCountParams, IModelIncrementParams, IModelSelectAggrParams, TypeModelAggrRelationResult, IModelSelectGroupParams, TypeModelGroupRelationResult } from 'vona-module-a-orm';
import { SymbolKeyEntity, SymbolKeyEntityMeta, SymbolKeyModelOptions } from 'vona-module-a-orm';
declare module 'vona-module-cabloy-ai' {

  export interface ModelAiModel {
      [SymbolKeyEntity]: EntityAiModel;
      [SymbolKeyEntityMeta]: EntityAiModelMeta;
      [SymbolKeyModelOptions]: IModelOptionsAiModel;
      get<T extends IModelGetOptions<EntityAiModel,ModelAiModel>>(where: TypeModelWhere<EntityAiModel>, options?: T): Promise<TypeModelRelationResult<EntityAiModel, ModelAiModel, T> | undefined>;
      /**
       * Retrieves one matching primary row with a pessimistic FOR UPDATE lock.
       * Requires an active transaction. The lock is released when that transaction completes.
       * Entity and query caches are bypassed.
       */
      getForUpdate<T extends IModelGetOptions<EntityAiModel,ModelAiModel>>(where: TypeModelWhere<EntityAiModel>, options?: T): Promise<TypeModelRelationResult<EntityAiModel, ModelAiModel, T> | undefined>;
      /**
       * Retrieves a primary row by ID with the same pessimistic FOR UPDATE lock semantics.
       * Requires an active transaction. The lock is released when that transaction completes.
       * Entity and query caches are bypassed.
       */
      getByIdForUpdate<T extends IModelGetOptions<EntityAiModel,ModelAiModel>>(id: TableIdentity, options?: T): Promise<TypeModelRelationResult<EntityAiModel, ModelAiModel, T> | undefined>;
      mget<T extends IModelGetOptions<EntityAiModel,ModelAiModel>>(ids: TableIdentity[], options?: T): Promise<TypeModelRelationResult<EntityAiModel, ModelAiModel, T>[]>;
      selectAndCount<T extends IModelSelectParams<EntityAiModel,ModelAiModel,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelSelectAndCount<EntityAiModel, ModelAiModel, T>>;
      select<T extends IModelSelectParams<EntityAiModel,ModelAiModel,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelRelationResult<EntityAiModel, ModelAiModel, T>[]>;
      insert<T extends IModelInsertOptions<EntityAiModel,ModelAiModel>>(data?: TypeModelMutateRelationData<EntityAiModel,ModelAiModel, T>, options?: T): Promise<TypeModelMutateRelationData<EntityAiModel,ModelAiModel, T, true>>;
      insertBulk<T extends IModelInsertOptions<EntityAiModel,ModelAiModel>>(items: TypeModelMutateRelationData<EntityAiModel,ModelAiModel, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityAiModel,ModelAiModel, T, true>[]>;
      update<T extends IModelUpdateOptions<EntityAiModel,ModelAiModel>>(data: TypeModelMutateRelationData<EntityAiModel,ModelAiModel, T>, options?: T): Promise<TypeModelMutateRelationData<EntityAiModel,ModelAiModel, T>>;
      updateBulk<T extends IModelUpdateOptions<EntityAiModel,ModelAiModel>>(items: TypeModelMutateRelationData<EntityAiModel,ModelAiModel, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityAiModel,ModelAiModel, T>[]>;
      delete<T extends IModelDeleteOptions<EntityAiModel,ModelAiModel>>(where?: TypeModelWhere<EntityAiModel>, options?: T): Promise<void>;
      deleteBulk<T extends IModelDeleteOptions<EntityAiModel,ModelAiModel>>(ids: TableIdentity[], options?: T): Promise<void>;
      mutate<T extends IModelMutateOptions<EntityAiModel,ModelAiModel>>(data?: TypeModelMutateRelationData<EntityAiModel,ModelAiModel, T>, options?: T): Promise<TypeModelMutateRelationData<EntityAiModel,ModelAiModel, T>>;
      mutateBulk<T extends IModelMutateOptions<EntityAiModel,ModelAiModel>>(items: TypeModelMutateRelationData<EntityAiModel,ModelAiModel, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityAiModel,ModelAiModel, T>[]>;
      count<T extends IModelSelectCountParams<EntityAiModel,ModelAiModel,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<string | undefined>;
      increment<T extends IModelIncrementParams<EntityAiModel,ModelAiModel,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      decrement<T extends IModelIncrementParams<EntityAiModel,ModelAiModel,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      aggregate<T extends IModelSelectAggrParams<EntityAiModel,ModelAiModel,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelAggrRelationResult<T>>;
      group<T extends IModelSelectGroupParams<EntityAiModel,ModelAiModel,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelGroupRelationResult<EntityAiModel, T>[]>;
      getById<T extends IModelGetOptions<EntityAiModel,ModelAiModel>>(id: TableIdentity, options?: T): Promise<TypeModelRelationResult<EntityAiModel, ModelAiModel, T> | undefined>;
updateById<T extends IModelUpdateOptions<EntityAiModel,ModelAiModel>>(id: TableIdentity, data: TypeModelMutateRelationData<EntityAiModel,ModelAiModel, T>, options?: T): Promise<TypeModelMutateRelationData<EntityAiModel,ModelAiModel, T>>;
deleteById<T extends IModelDeleteOptions<EntityAiModel,ModelAiModel>>(id: TableIdentity, options?: T): Promise<void>;
getByName<T extends IModelGetOptions<EntityAiModel,ModelAiModel>>(name?: string, options?: T): Promise<TypeModelRelationResult<EntityAiModel, ModelAiModel, T> | undefined>;
getByNameEqI<T extends IModelGetOptions<EntityAiModel,ModelAiModel>>(name?: string, options?: T): Promise<TypeModelRelationResult<EntityAiModel, ModelAiModel, T> | undefined>;
selectByName<T extends IModelSelectParams<EntityAiModel,ModelAiModel,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(name?: string, params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelRelationResult<EntityAiModel, ModelAiModel, T>[]>;
selectByNameEqI<T extends IModelSelectParams<EntityAiModel,ModelAiModel,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(name?: string, params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelRelationResult<EntityAiModel, ModelAiModel, T>[]>;
    }
export interface ModelAiProvider {
      [SymbolKeyEntity]: EntityAiProvider;
      [SymbolKeyEntityMeta]: EntityAiProviderMeta;
      [SymbolKeyModelOptions]: IModelOptionsAiProvider;
      get<T extends IModelGetOptions<EntityAiProvider,ModelAiProvider>>(where: TypeModelWhere<EntityAiProvider>, options?: T): Promise<TypeModelRelationResult<EntityAiProvider, ModelAiProvider, T> | undefined>;
      /**
       * Retrieves one matching primary row with a pessimistic FOR UPDATE lock.
       * Requires an active transaction. The lock is released when that transaction completes.
       * Entity and query caches are bypassed.
       */
      getForUpdate<T extends IModelGetOptions<EntityAiProvider,ModelAiProvider>>(where: TypeModelWhere<EntityAiProvider>, options?: T): Promise<TypeModelRelationResult<EntityAiProvider, ModelAiProvider, T> | undefined>;
      /**
       * Retrieves a primary row by ID with the same pessimistic FOR UPDATE lock semantics.
       * Requires an active transaction. The lock is released when that transaction completes.
       * Entity and query caches are bypassed.
       */
      getByIdForUpdate<T extends IModelGetOptions<EntityAiProvider,ModelAiProvider>>(id: TableIdentity, options?: T): Promise<TypeModelRelationResult<EntityAiProvider, ModelAiProvider, T> | undefined>;
      mget<T extends IModelGetOptions<EntityAiProvider,ModelAiProvider>>(ids: TableIdentity[], options?: T): Promise<TypeModelRelationResult<EntityAiProvider, ModelAiProvider, T>[]>;
      selectAndCount<T extends IModelSelectParams<EntityAiProvider,ModelAiProvider,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelSelectAndCount<EntityAiProvider, ModelAiProvider, T>>;
      select<T extends IModelSelectParams<EntityAiProvider,ModelAiProvider,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelRelationResult<EntityAiProvider, ModelAiProvider, T>[]>;
      insert<T extends IModelInsertOptions<EntityAiProvider,ModelAiProvider>>(data?: TypeModelMutateRelationData<EntityAiProvider,ModelAiProvider, T>, options?: T): Promise<TypeModelMutateRelationData<EntityAiProvider,ModelAiProvider, T, true>>;
      insertBulk<T extends IModelInsertOptions<EntityAiProvider,ModelAiProvider>>(items: TypeModelMutateRelationData<EntityAiProvider,ModelAiProvider, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityAiProvider,ModelAiProvider, T, true>[]>;
      update<T extends IModelUpdateOptions<EntityAiProvider,ModelAiProvider>>(data: TypeModelMutateRelationData<EntityAiProvider,ModelAiProvider, T>, options?: T): Promise<TypeModelMutateRelationData<EntityAiProvider,ModelAiProvider, T>>;
      updateBulk<T extends IModelUpdateOptions<EntityAiProvider,ModelAiProvider>>(items: TypeModelMutateRelationData<EntityAiProvider,ModelAiProvider, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityAiProvider,ModelAiProvider, T>[]>;
      delete<T extends IModelDeleteOptions<EntityAiProvider,ModelAiProvider>>(where?: TypeModelWhere<EntityAiProvider>, options?: T): Promise<void>;
      deleteBulk<T extends IModelDeleteOptions<EntityAiProvider,ModelAiProvider>>(ids: TableIdentity[], options?: T): Promise<void>;
      mutate<T extends IModelMutateOptions<EntityAiProvider,ModelAiProvider>>(data?: TypeModelMutateRelationData<EntityAiProvider,ModelAiProvider, T>, options?: T): Promise<TypeModelMutateRelationData<EntityAiProvider,ModelAiProvider, T>>;
      mutateBulk<T extends IModelMutateOptions<EntityAiProvider,ModelAiProvider>>(items: TypeModelMutateRelationData<EntityAiProvider,ModelAiProvider, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityAiProvider,ModelAiProvider, T>[]>;
      count<T extends IModelSelectCountParams<EntityAiProvider,ModelAiProvider,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<string | undefined>;
      increment<T extends IModelIncrementParams<EntityAiProvider,ModelAiProvider,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      decrement<T extends IModelIncrementParams<EntityAiProvider,ModelAiProvider,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      aggregate<T extends IModelSelectAggrParams<EntityAiProvider,ModelAiProvider,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelAggrRelationResult<T>>;
      group<T extends IModelSelectGroupParams<EntityAiProvider,ModelAiProvider,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelGroupRelationResult<EntityAiProvider, T>[]>;
      getById<T extends IModelGetOptions<EntityAiProvider,ModelAiProvider>>(id: TableIdentity, options?: T): Promise<TypeModelRelationResult<EntityAiProvider, ModelAiProvider, T> | undefined>;
updateById<T extends IModelUpdateOptions<EntityAiProvider,ModelAiProvider>>(id: TableIdentity, data: TypeModelMutateRelationData<EntityAiProvider,ModelAiProvider, T>, options?: T): Promise<TypeModelMutateRelationData<EntityAiProvider,ModelAiProvider, T>>;
deleteById<T extends IModelDeleteOptions<EntityAiProvider,ModelAiProvider>>(id: TableIdentity, options?: T): Promise<void>;
getByName<T extends IModelGetOptions<EntityAiProvider,ModelAiProvider>>(name?: string, options?: T): Promise<TypeModelRelationResult<EntityAiProvider, ModelAiProvider, T> | undefined>;
getByNameEqI<T extends IModelGetOptions<EntityAiProvider,ModelAiProvider>>(name?: string, options?: T): Promise<TypeModelRelationResult<EntityAiProvider, ModelAiProvider, T> | undefined>;
selectByName<T extends IModelSelectParams<EntityAiProvider,ModelAiProvider,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(name?: string, params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelRelationResult<EntityAiProvider, ModelAiProvider, T>[]>;
selectByNameEqI<T extends IModelSelectParams<EntityAiProvider,ModelAiProvider,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(name?: string, params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelRelationResult<EntityAiProvider, ModelAiProvider, T>[]>;
    }
export interface ModelAiScene {
      [SymbolKeyEntity]: EntityAiScene;
      [SymbolKeyEntityMeta]: EntityAiSceneMeta;
      [SymbolKeyModelOptions]: IModelOptionsAiScene;
      get<T extends IModelGetOptions<EntityAiScene,ModelAiScene>>(where: TypeModelWhere<EntityAiScene>, options?: T): Promise<TypeModelRelationResult<EntityAiScene, ModelAiScene, T> | undefined>;
      /**
       * Retrieves one matching primary row with a pessimistic FOR UPDATE lock.
       * Requires an active transaction. The lock is released when that transaction completes.
       * Entity and query caches are bypassed.
       */
      getForUpdate<T extends IModelGetOptions<EntityAiScene,ModelAiScene>>(where: TypeModelWhere<EntityAiScene>, options?: T): Promise<TypeModelRelationResult<EntityAiScene, ModelAiScene, T> | undefined>;
      /**
       * Retrieves a primary row by ID with the same pessimistic FOR UPDATE lock semantics.
       * Requires an active transaction. The lock is released when that transaction completes.
       * Entity and query caches are bypassed.
       */
      getByIdForUpdate<T extends IModelGetOptions<EntityAiScene,ModelAiScene>>(id: TableIdentity, options?: T): Promise<TypeModelRelationResult<EntityAiScene, ModelAiScene, T> | undefined>;
      mget<T extends IModelGetOptions<EntityAiScene,ModelAiScene>>(ids: TableIdentity[], options?: T): Promise<TypeModelRelationResult<EntityAiScene, ModelAiScene, T>[]>;
      selectAndCount<T extends IModelSelectParams<EntityAiScene,ModelAiScene,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelSelectAndCount<EntityAiScene, ModelAiScene, T>>;
      select<T extends IModelSelectParams<EntityAiScene,ModelAiScene,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelRelationResult<EntityAiScene, ModelAiScene, T>[]>;
      insert<T extends IModelInsertOptions<EntityAiScene,ModelAiScene>>(data?: TypeModelMutateRelationData<EntityAiScene,ModelAiScene, T>, options?: T): Promise<TypeModelMutateRelationData<EntityAiScene,ModelAiScene, T, true>>;
      insertBulk<T extends IModelInsertOptions<EntityAiScene,ModelAiScene>>(items: TypeModelMutateRelationData<EntityAiScene,ModelAiScene, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityAiScene,ModelAiScene, T, true>[]>;
      update<T extends IModelUpdateOptions<EntityAiScene,ModelAiScene>>(data: TypeModelMutateRelationData<EntityAiScene,ModelAiScene, T>, options?: T): Promise<TypeModelMutateRelationData<EntityAiScene,ModelAiScene, T>>;
      updateBulk<T extends IModelUpdateOptions<EntityAiScene,ModelAiScene>>(items: TypeModelMutateRelationData<EntityAiScene,ModelAiScene, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityAiScene,ModelAiScene, T>[]>;
      delete<T extends IModelDeleteOptions<EntityAiScene,ModelAiScene>>(where?: TypeModelWhere<EntityAiScene>, options?: T): Promise<void>;
      deleteBulk<T extends IModelDeleteOptions<EntityAiScene,ModelAiScene>>(ids: TableIdentity[], options?: T): Promise<void>;
      mutate<T extends IModelMutateOptions<EntityAiScene,ModelAiScene>>(data?: TypeModelMutateRelationData<EntityAiScene,ModelAiScene, T>, options?: T): Promise<TypeModelMutateRelationData<EntityAiScene,ModelAiScene, T>>;
      mutateBulk<T extends IModelMutateOptions<EntityAiScene,ModelAiScene>>(items: TypeModelMutateRelationData<EntityAiScene,ModelAiScene, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityAiScene,ModelAiScene, T>[]>;
      count<T extends IModelSelectCountParams<EntityAiScene,ModelAiScene,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<string | undefined>;
      increment<T extends IModelIncrementParams<EntityAiScene,ModelAiScene,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      decrement<T extends IModelIncrementParams<EntityAiScene,ModelAiScene,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      aggregate<T extends IModelSelectAggrParams<EntityAiScene,ModelAiScene,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelAggrRelationResult<T>>;
      group<T extends IModelSelectGroupParams<EntityAiScene,ModelAiScene,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelGroupRelationResult<EntityAiScene, T>[]>;
      getById<T extends IModelGetOptions<EntityAiScene,ModelAiScene>>(id: TableIdentity, options?: T): Promise<TypeModelRelationResult<EntityAiScene, ModelAiScene, T> | undefined>;
updateById<T extends IModelUpdateOptions<EntityAiScene,ModelAiScene>>(id: TableIdentity, data: TypeModelMutateRelationData<EntityAiScene,ModelAiScene, T>, options?: T): Promise<TypeModelMutateRelationData<EntityAiScene,ModelAiScene, T>>;
deleteById<T extends IModelDeleteOptions<EntityAiScene,ModelAiScene>>(id: TableIdentity, options?: T): Promise<void>;
getByName<T extends IModelGetOptions<EntityAiScene,ModelAiScene>>(name?: string, options?: T): Promise<TypeModelRelationResult<EntityAiScene, ModelAiScene, T> | undefined>;
getByNameEqI<T extends IModelGetOptions<EntityAiScene,ModelAiScene>>(name?: string, options?: T): Promise<TypeModelRelationResult<EntityAiScene, ModelAiScene, T> | undefined>;
selectByName<T extends IModelSelectParams<EntityAiScene,ModelAiScene,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(name?: string, params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelRelationResult<EntityAiScene, ModelAiScene, T>[]>;
selectByNameEqI<T extends IModelSelectParams<EntityAiScene,ModelAiScene,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(name?: string, params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelRelationResult<EntityAiScene, ModelAiScene, T>[]>;
    }
export interface ModelConversation {
      [SymbolKeyEntity]: EntityConversation;
      [SymbolKeyEntityMeta]: EntityConversationMeta;
      [SymbolKeyModelOptions]: IModelOptionsConversation;
      get<T extends IModelGetOptions<EntityConversation,ModelConversation>>(where: TypeModelWhere<EntityConversation>, options?: T): Promise<TypeModelRelationResult<EntityConversation, ModelConversation, T> | undefined>;
      /**
       * Retrieves one matching primary row with a pessimistic FOR UPDATE lock.
       * Requires an active transaction. The lock is released when that transaction completes.
       * Entity and query caches are bypassed.
       */
      getForUpdate<T extends IModelGetOptions<EntityConversation,ModelConversation>>(where: TypeModelWhere<EntityConversation>, options?: T): Promise<TypeModelRelationResult<EntityConversation, ModelConversation, T> | undefined>;
      /**
       * Retrieves a primary row by ID with the same pessimistic FOR UPDATE lock semantics.
       * Requires an active transaction. The lock is released when that transaction completes.
       * Entity and query caches are bypassed.
       */
      getByIdForUpdate<T extends IModelGetOptions<EntityConversation,ModelConversation>>(id: TableIdentity, options?: T): Promise<TypeModelRelationResult<EntityConversation, ModelConversation, T> | undefined>;
      mget<T extends IModelGetOptions<EntityConversation,ModelConversation>>(ids: TableIdentity[], options?: T): Promise<TypeModelRelationResult<EntityConversation, ModelConversation, T>[]>;
      selectAndCount<T extends IModelSelectParams<EntityConversation,ModelConversation,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelSelectAndCount<EntityConversation, ModelConversation, T>>;
      select<T extends IModelSelectParams<EntityConversation,ModelConversation,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelRelationResult<EntityConversation, ModelConversation, T>[]>;
      insert<T extends IModelInsertOptions<EntityConversation,ModelConversation>>(data?: TypeModelMutateRelationData<EntityConversation,ModelConversation, T>, options?: T): Promise<TypeModelMutateRelationData<EntityConversation,ModelConversation, T, true>>;
      insertBulk<T extends IModelInsertOptions<EntityConversation,ModelConversation>>(items: TypeModelMutateRelationData<EntityConversation,ModelConversation, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityConversation,ModelConversation, T, true>[]>;
      update<T extends IModelUpdateOptions<EntityConversation,ModelConversation>>(data: TypeModelMutateRelationData<EntityConversation,ModelConversation, T>, options?: T): Promise<TypeModelMutateRelationData<EntityConversation,ModelConversation, T>>;
      updateBulk<T extends IModelUpdateOptions<EntityConversation,ModelConversation>>(items: TypeModelMutateRelationData<EntityConversation,ModelConversation, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityConversation,ModelConversation, T>[]>;
      delete<T extends IModelDeleteOptions<EntityConversation,ModelConversation>>(where?: TypeModelWhere<EntityConversation>, options?: T): Promise<void>;
      deleteBulk<T extends IModelDeleteOptions<EntityConversation,ModelConversation>>(ids: TableIdentity[], options?: T): Promise<void>;
      mutate<T extends IModelMutateOptions<EntityConversation,ModelConversation>>(data?: TypeModelMutateRelationData<EntityConversation,ModelConversation, T>, options?: T): Promise<TypeModelMutateRelationData<EntityConversation,ModelConversation, T>>;
      mutateBulk<T extends IModelMutateOptions<EntityConversation,ModelConversation>>(items: TypeModelMutateRelationData<EntityConversation,ModelConversation, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityConversation,ModelConversation, T>[]>;
      count<T extends IModelSelectCountParams<EntityConversation,ModelConversation,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<string | undefined>;
      increment<T extends IModelIncrementParams<EntityConversation,ModelConversation,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      decrement<T extends IModelIncrementParams<EntityConversation,ModelConversation,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      aggregate<T extends IModelSelectAggrParams<EntityConversation,ModelConversation,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelAggrRelationResult<T>>;
      group<T extends IModelSelectGroupParams<EntityConversation,ModelConversation,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelGroupRelationResult<EntityConversation, T>[]>;
      getById<T extends IModelGetOptions<EntityConversation,ModelConversation>>(id: TableIdentity, options?: T): Promise<TypeModelRelationResult<EntityConversation, ModelConversation, T> | undefined>;
updateById<T extends IModelUpdateOptions<EntityConversation,ModelConversation>>(id: TableIdentity, data: TypeModelMutateRelationData<EntityConversation,ModelConversation, T>, options?: T): Promise<TypeModelMutateRelationData<EntityConversation,ModelConversation, T>>;
deleteById<T extends IModelDeleteOptions<EntityConversation,ModelConversation>>(id: TableIdentity, options?: T): Promise<void>;
    }
export interface ModelMessage {
      [SymbolKeyEntity]: EntityMessage;
      [SymbolKeyEntityMeta]: EntityMessageMeta;
      [SymbolKeyModelOptions]: IModelOptionsMessage;
      get<T extends IModelGetOptions<EntityMessage,ModelMessage>>(where: TypeModelWhere<EntityMessage>, options?: T): Promise<TypeModelRelationResult<EntityMessage, ModelMessage, T> | undefined>;
      /**
       * Retrieves one matching primary row with a pessimistic FOR UPDATE lock.
       * Requires an active transaction. The lock is released when that transaction completes.
       * Entity and query caches are bypassed.
       */
      getForUpdate<T extends IModelGetOptions<EntityMessage,ModelMessage>>(where: TypeModelWhere<EntityMessage>, options?: T): Promise<TypeModelRelationResult<EntityMessage, ModelMessage, T> | undefined>;
      /**
       * Retrieves a primary row by ID with the same pessimistic FOR UPDATE lock semantics.
       * Requires an active transaction. The lock is released when that transaction completes.
       * Entity and query caches are bypassed.
       */
      getByIdForUpdate<T extends IModelGetOptions<EntityMessage,ModelMessage>>(id: TableIdentity, options?: T): Promise<TypeModelRelationResult<EntityMessage, ModelMessage, T> | undefined>;
      mget<T extends IModelGetOptions<EntityMessage,ModelMessage>>(ids: TableIdentity[], options?: T): Promise<TypeModelRelationResult<EntityMessage, ModelMessage, T>[]>;
      selectAndCount<T extends IModelSelectParams<EntityMessage,ModelMessage,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelSelectAndCount<EntityMessage, ModelMessage, T>>;
      select<T extends IModelSelectParams<EntityMessage,ModelMessage,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelRelationResult<EntityMessage, ModelMessage, T>[]>;
      insert<T extends IModelInsertOptions<EntityMessage,ModelMessage>>(data?: TypeModelMutateRelationData<EntityMessage,ModelMessage, T>, options?: T): Promise<TypeModelMutateRelationData<EntityMessage,ModelMessage, T, true>>;
      insertBulk<T extends IModelInsertOptions<EntityMessage,ModelMessage>>(items: TypeModelMutateRelationData<EntityMessage,ModelMessage, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityMessage,ModelMessage, T, true>[]>;
      update<T extends IModelUpdateOptions<EntityMessage,ModelMessage>>(data: TypeModelMutateRelationData<EntityMessage,ModelMessage, T>, options?: T): Promise<TypeModelMutateRelationData<EntityMessage,ModelMessage, T>>;
      updateBulk<T extends IModelUpdateOptions<EntityMessage,ModelMessage>>(items: TypeModelMutateRelationData<EntityMessage,ModelMessage, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityMessage,ModelMessage, T>[]>;
      delete<T extends IModelDeleteOptions<EntityMessage,ModelMessage>>(where?: TypeModelWhere<EntityMessage>, options?: T): Promise<void>;
      deleteBulk<T extends IModelDeleteOptions<EntityMessage,ModelMessage>>(ids: TableIdentity[], options?: T): Promise<void>;
      mutate<T extends IModelMutateOptions<EntityMessage,ModelMessage>>(data?: TypeModelMutateRelationData<EntityMessage,ModelMessage, T>, options?: T): Promise<TypeModelMutateRelationData<EntityMessage,ModelMessage, T>>;
      mutateBulk<T extends IModelMutateOptions<EntityMessage,ModelMessage>>(items: TypeModelMutateRelationData<EntityMessage,ModelMessage, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityMessage,ModelMessage, T>[]>;
      count<T extends IModelSelectCountParams<EntityMessage,ModelMessage,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<string | undefined>;
      increment<T extends IModelIncrementParams<EntityMessage,ModelMessage,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      decrement<T extends IModelIncrementParams<EntityMessage,ModelMessage,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      aggregate<T extends IModelSelectAggrParams<EntityMessage,ModelMessage,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelAggrRelationResult<T>>;
      group<T extends IModelSelectGroupParams<EntityMessage,ModelMessage,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelGroupRelationResult<EntityMessage, T>[]>;
      getById<T extends IModelGetOptions<EntityMessage,ModelMessage>>(id: TableIdentity, options?: T): Promise<TypeModelRelationResult<EntityMessage, ModelMessage, T> | undefined>;
updateById<T extends IModelUpdateOptions<EntityMessage,ModelMessage>>(id: TableIdentity, data: TypeModelMutateRelationData<EntityMessage,ModelMessage, T>, options?: T): Promise<TypeModelMutateRelationData<EntityMessage,ModelMessage, T>>;
deleteById<T extends IModelDeleteOptions<EntityMessage,ModelMessage>>(id: TableIdentity, options?: T): Promise<void>;
    }
export interface ModelRun {
      [SymbolKeyEntity]: EntityRun;
      [SymbolKeyEntityMeta]: EntityRunMeta;
      [SymbolKeyModelOptions]: IModelOptionsRun;
      get<T extends IModelGetOptions<EntityRun,ModelRun>>(where: TypeModelWhere<EntityRun>, options?: T): Promise<TypeModelRelationResult<EntityRun, ModelRun, T> | undefined>;
      /**
       * Retrieves one matching primary row with a pessimistic FOR UPDATE lock.
       * Requires an active transaction. The lock is released when that transaction completes.
       * Entity and query caches are bypassed.
       */
      getForUpdate<T extends IModelGetOptions<EntityRun,ModelRun>>(where: TypeModelWhere<EntityRun>, options?: T): Promise<TypeModelRelationResult<EntityRun, ModelRun, T> | undefined>;
      /**
       * Retrieves a primary row by ID with the same pessimistic FOR UPDATE lock semantics.
       * Requires an active transaction. The lock is released when that transaction completes.
       * Entity and query caches are bypassed.
       */
      getByIdForUpdate<T extends IModelGetOptions<EntityRun,ModelRun>>(id: TableIdentity, options?: T): Promise<TypeModelRelationResult<EntityRun, ModelRun, T> | undefined>;
      mget<T extends IModelGetOptions<EntityRun,ModelRun>>(ids: TableIdentity[], options?: T): Promise<TypeModelRelationResult<EntityRun, ModelRun, T>[]>;
      selectAndCount<T extends IModelSelectParams<EntityRun,ModelRun,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelSelectAndCount<EntityRun, ModelRun, T>>;
      select<T extends IModelSelectParams<EntityRun,ModelRun,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelRelationResult<EntityRun, ModelRun, T>[]>;
      insert<T extends IModelInsertOptions<EntityRun,ModelRun>>(data?: TypeModelMutateRelationData<EntityRun,ModelRun, T>, options?: T): Promise<TypeModelMutateRelationData<EntityRun,ModelRun, T, true>>;
      insertBulk<T extends IModelInsertOptions<EntityRun,ModelRun>>(items: TypeModelMutateRelationData<EntityRun,ModelRun, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityRun,ModelRun, T, true>[]>;
      update<T extends IModelUpdateOptions<EntityRun,ModelRun>>(data: TypeModelMutateRelationData<EntityRun,ModelRun, T>, options?: T): Promise<TypeModelMutateRelationData<EntityRun,ModelRun, T>>;
      updateBulk<T extends IModelUpdateOptions<EntityRun,ModelRun>>(items: TypeModelMutateRelationData<EntityRun,ModelRun, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityRun,ModelRun, T>[]>;
      delete<T extends IModelDeleteOptions<EntityRun,ModelRun>>(where?: TypeModelWhere<EntityRun>, options?: T): Promise<void>;
      deleteBulk<T extends IModelDeleteOptions<EntityRun,ModelRun>>(ids: TableIdentity[], options?: T): Promise<void>;
      mutate<T extends IModelMutateOptions<EntityRun,ModelRun>>(data?: TypeModelMutateRelationData<EntityRun,ModelRun, T>, options?: T): Promise<TypeModelMutateRelationData<EntityRun,ModelRun, T>>;
      mutateBulk<T extends IModelMutateOptions<EntityRun,ModelRun>>(items: TypeModelMutateRelationData<EntityRun,ModelRun, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityRun,ModelRun, T>[]>;
      count<T extends IModelSelectCountParams<EntityRun,ModelRun,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<string | undefined>;
      increment<T extends IModelIncrementParams<EntityRun,ModelRun,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      decrement<T extends IModelIncrementParams<EntityRun,ModelRun,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      aggregate<T extends IModelSelectAggrParams<EntityRun,ModelRun,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelAggrRelationResult<T>>;
      group<T extends IModelSelectGroupParams<EntityRun,ModelRun,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelGroupRelationResult<EntityRun, T>[]>;
      getById<T extends IModelGetOptions<EntityRun,ModelRun>>(id: TableIdentity, options?: T): Promise<TypeModelRelationResult<EntityRun, ModelRun, T> | undefined>;
updateById<T extends IModelUpdateOptions<EntityRun,ModelRun>>(id: TableIdentity, data: TypeModelMutateRelationData<EntityRun,ModelRun, T>, options?: T): Promise<TypeModelMutateRelationData<EntityRun,ModelRun, T>>;
deleteById<T extends IModelDeleteOptions<EntityRun,ModelRun>>(id: TableIdentity, options?: T): Promise<void>;
    }
export interface ModelUsage {
      [SymbolKeyEntity]: EntityUsage;
      [SymbolKeyEntityMeta]: EntityUsageMeta;
      [SymbolKeyModelOptions]: IModelOptionsUsage;
      get<T extends IModelGetOptions<EntityUsage,ModelUsage>>(where: TypeModelWhere<EntityUsage>, options?: T): Promise<TypeModelRelationResult<EntityUsage, ModelUsage, T> | undefined>;
      /**
       * Retrieves one matching primary row with a pessimistic FOR UPDATE lock.
       * Requires an active transaction. The lock is released when that transaction completes.
       * Entity and query caches are bypassed.
       */
      getForUpdate<T extends IModelGetOptions<EntityUsage,ModelUsage>>(where: TypeModelWhere<EntityUsage>, options?: T): Promise<TypeModelRelationResult<EntityUsage, ModelUsage, T> | undefined>;
      /**
       * Retrieves a primary row by ID with the same pessimistic FOR UPDATE lock semantics.
       * Requires an active transaction. The lock is released when that transaction completes.
       * Entity and query caches are bypassed.
       */
      getByIdForUpdate<T extends IModelGetOptions<EntityUsage,ModelUsage>>(id: TableIdentity, options?: T): Promise<TypeModelRelationResult<EntityUsage, ModelUsage, T> | undefined>;
      mget<T extends IModelGetOptions<EntityUsage,ModelUsage>>(ids: TableIdentity[], options?: T): Promise<TypeModelRelationResult<EntityUsage, ModelUsage, T>[]>;
      selectAndCount<T extends IModelSelectParams<EntityUsage,ModelUsage,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelSelectAndCount<EntityUsage, ModelUsage, T>>;
      select<T extends IModelSelectParams<EntityUsage,ModelUsage,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelRelationResult<EntityUsage, ModelUsage, T>[]>;
      insert<T extends IModelInsertOptions<EntityUsage,ModelUsage>>(data?: TypeModelMutateRelationData<EntityUsage,ModelUsage, T>, options?: T): Promise<TypeModelMutateRelationData<EntityUsage,ModelUsage, T, true>>;
      insertBulk<T extends IModelInsertOptions<EntityUsage,ModelUsage>>(items: TypeModelMutateRelationData<EntityUsage,ModelUsage, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityUsage,ModelUsage, T, true>[]>;
      update<T extends IModelUpdateOptions<EntityUsage,ModelUsage>>(data: TypeModelMutateRelationData<EntityUsage,ModelUsage, T>, options?: T): Promise<TypeModelMutateRelationData<EntityUsage,ModelUsage, T>>;
      updateBulk<T extends IModelUpdateOptions<EntityUsage,ModelUsage>>(items: TypeModelMutateRelationData<EntityUsage,ModelUsage, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityUsage,ModelUsage, T>[]>;
      delete<T extends IModelDeleteOptions<EntityUsage,ModelUsage>>(where?: TypeModelWhere<EntityUsage>, options?: T): Promise<void>;
      deleteBulk<T extends IModelDeleteOptions<EntityUsage,ModelUsage>>(ids: TableIdentity[], options?: T): Promise<void>;
      mutate<T extends IModelMutateOptions<EntityUsage,ModelUsage>>(data?: TypeModelMutateRelationData<EntityUsage,ModelUsage, T>, options?: T): Promise<TypeModelMutateRelationData<EntityUsage,ModelUsage, T>>;
      mutateBulk<T extends IModelMutateOptions<EntityUsage,ModelUsage>>(items: TypeModelMutateRelationData<EntityUsage,ModelUsage, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityUsage,ModelUsage, T>[]>;
      count<T extends IModelSelectCountParams<EntityUsage,ModelUsage,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<string | undefined>;
      increment<T extends IModelIncrementParams<EntityUsage,ModelUsage,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      decrement<T extends IModelIncrementParams<EntityUsage,ModelUsage,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      aggregate<T extends IModelSelectAggrParams<EntityUsage,ModelUsage,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelAggrRelationResult<T>>;
      group<T extends IModelSelectGroupParams<EntityUsage,ModelUsage,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelGroupRelationResult<EntityUsage, T>[]>;
      getById<T extends IModelGetOptions<EntityUsage,ModelUsage>>(id: TableIdentity, options?: T): Promise<TypeModelRelationResult<EntityUsage, ModelUsage, T> | undefined>;
updateById<T extends IModelUpdateOptions<EntityUsage,ModelUsage>>(id: TableIdentity, data: TypeModelMutateRelationData<EntityUsage,ModelUsage, T>, options?: T): Promise<TypeModelMutateRelationData<EntityUsage,ModelUsage, T>>;
deleteById<T extends IModelDeleteOptions<EntityUsage,ModelUsage>>(id: TableIdentity, options?: T): Promise<void>;
    }
}
declare module 'vona-module-a-orm' {
  export interface IModelClassRecord {
    'cabloy-ai:aiModel': ModelAiModel;
'cabloy-ai:aiProvider': ModelAiProvider;
'cabloy-ai:aiScene': ModelAiScene;
'cabloy-ai:conversation': ModelConversation;
'cabloy-ai:message': ModelMessage;
'cabloy-ai:run': ModelRun;
'cabloy-ai:usage': ModelUsage;
  }
}
/** model: end */
/** dto: begin */
export * from '../dto/chatConversation.tsx';
export * from '../dto/chatCreate.tsx';
export * from '../dto/chatHistory.tsx';
export * from '../dto/chatHistoryRequest.tsx';
export * from '../dto/chatList.tsx';
export * from '../dto/chatMessage.tsx';
export * from '../dto/chatPin.tsx';
export * from '../dto/chatRename.tsx';
export * from '../dto/chatRun.tsx';
export * from '../dto/chatSend.tsx';
export * from '../dto/chatStatusRequest.tsx';
import type { IDtoOptionsChatConversation } from '../dto/chatConversation.tsx';
import type { IDtoOptionsChatCreate } from '../dto/chatCreate.tsx';
import type { IDtoOptionsChatHistory } from '../dto/chatHistory.tsx';
import type { IDtoOptionsChatHistoryRequest } from '../dto/chatHistoryRequest.tsx';
import type { IDtoOptionsChatList } from '../dto/chatList.tsx';
import type { IDtoOptionsChatMessage } from '../dto/chatMessage.tsx';
import type { IDtoOptionsChatPin } from '../dto/chatPin.tsx';
import type { IDtoOptionsChatRename } from '../dto/chatRename.tsx';
import type { IDtoOptionsChatRun } from '../dto/chatRun.tsx';
import type { IDtoOptionsChatSend } from '../dto/chatSend.tsx';
import type { IDtoOptionsChatStatusRequest } from '../dto/chatStatusRequest.tsx';
import 'vona-module-a-web';
declare module 'vona-module-a-web' {

    export interface IDtoRecord {
      'cabloy-ai:chatConversation': IDtoOptionsChatConversation;
'cabloy-ai:chatCreate': IDtoOptionsChatCreate;
'cabloy-ai:chatHistory': IDtoOptionsChatHistory;
'cabloy-ai:chatHistoryRequest': IDtoOptionsChatHistoryRequest;
'cabloy-ai:chatList': IDtoOptionsChatList;
'cabloy-ai:chatMessage': IDtoOptionsChatMessage;
'cabloy-ai:chatPin': IDtoOptionsChatPin;
'cabloy-ai:chatRename': IDtoOptionsChatRename;
'cabloy-ai:chatRun': IDtoOptionsChatRun;
'cabloy-ai:chatSend': IDtoOptionsChatSend;
'cabloy-ai:chatStatusRequest': IDtoOptionsChatStatusRequest;
    }


}
declare module 'vona-module-cabloy-ai' {

}
/** dto: end */
/** dto: begin */
import type { DtoChatConversation } from '../dto/chatConversation.tsx';
import type { DtoChatCreate } from '../dto/chatCreate.tsx';
import type { DtoChatHistory } from '../dto/chatHistory.tsx';
import type { DtoChatHistoryRequest } from '../dto/chatHistoryRequest.tsx';
import type { DtoChatList } from '../dto/chatList.tsx';
import type { DtoChatMessage } from '../dto/chatMessage.tsx';
import type { DtoChatPin } from '../dto/chatPin.tsx';
import type { DtoChatRename } from '../dto/chatRename.tsx';
import type { DtoChatRun } from '../dto/chatRun.tsx';
import type { DtoChatSend } from '../dto/chatSend.tsx';
import type { DtoChatStatusRequest } from '../dto/chatStatusRequest.tsx';
declare module 'vona-module-cabloy-ai' {

    export interface IDtoOptionsChatConversation {
      fields?: TypeEntityOptionsFields<DtoChatConversation, IDtoOptionsChatConversation[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsChatCreate {
      fields?: TypeEntityOptionsFields<DtoChatCreate, IDtoOptionsChatCreate[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsChatHistory {
      fields?: TypeEntityOptionsFields<DtoChatHistory, IDtoOptionsChatHistory[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsChatHistoryRequest {
      fields?: TypeEntityOptionsFields<DtoChatHistoryRequest, IDtoOptionsChatHistoryRequest[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsChatList {
      fields?: TypeEntityOptionsFields<DtoChatList, IDtoOptionsChatList[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsChatMessage {
      fields?: TypeEntityOptionsFields<DtoChatMessage, IDtoOptionsChatMessage[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsChatPin {
      fields?: TypeEntityOptionsFields<DtoChatPin, IDtoOptionsChatPin[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsChatRename {
      fields?: TypeEntityOptionsFields<DtoChatRename, IDtoOptionsChatRename[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsChatRun {
      fields?: TypeEntityOptionsFields<DtoChatRun, IDtoOptionsChatRun[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsChatSend {
      fields?: TypeEntityOptionsFields<DtoChatSend, IDtoOptionsChatSend[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsChatStatusRequest {
      fields?: TypeEntityOptionsFields<DtoChatStatusRequest, IDtoOptionsChatStatusRequest[TypeSymbolKeyFieldsMore]>;
    }
}
/** dto: end */
/** controller: begin */
export * from '../controller/chat.ts';
import type { IControllerOptionsChat } from '../controller/chat.ts';
import 'vona-module-a-web';
declare module 'vona-module-a-web' {

    export interface IControllerRecord {
      'cabloy-ai:chat': IControllerOptionsChat;
    }


}
declare module 'vona-module-cabloy-ai' {

        export interface ControllerChat {
          /** @internal */
          get scope(): ScopeModuleCabloyAi;
        }

          export interface ControllerChat {
            get $beanFullName(): 'cabloy-ai.controller.chat';
            get $onionName(): 'cabloy-ai:chat';
            get $onionOptions(): IControllerOptionsChat;
          }
}
/** controller: end */
/** controller: begin */
// @ts-ignore ignore
import type { ControllerChat } from '../controller/chat.ts';
declare module 'vona-module-cabloy-ai' {

    export interface IControllerOptionsChat {
      actions?: TypeControllerOptionsActions<ControllerChat>;
    }
}
declare module 'vona-module-a-web' {
  export interface IApiPathPostRecord{
        '/cabloy/ai/chat/create': undefined;
'/cabloy/ai/chat/list': undefined;
'/cabloy/ai/chat/history': undefined;
'/cabloy/ai/chat/status': undefined;
'/cabloy/ai/chat/remove': undefined;
'/cabloy/ai/chat/rename': undefined;
'/cabloy/ai/chat/pin': undefined;
'/cabloy/ai/chat/send': undefined;
    }

}

/** controller: end */
/** guard: begin */
export * from '../bean/guard.aiChatAccess.ts';
import type { IGuardOptionsAiChatAccess } from '../bean/guard.aiChatAccess.ts';
import 'vona-module-a-aspect';
declare module 'vona-module-a-aspect' {


export interface IGuardRecordLocal {
  'cabloy-ai:aiChatAccess': IGuardOptionsAiChatAccess;
}

}
declare module 'vona-module-cabloy-ai' {

        export interface GuardAiChatAccess {
          /** @internal */
          get scope(): ScopeModuleCabloyAi;
        }

          export interface GuardAiChatAccess {
            get $beanFullName(): 'cabloy-ai.guard.aiChatAccess';
            get $onionName(): 'cabloy-ai:aiChatAccess';
            get $onionOptions(): IGuardOptionsAiChatAccess;
          }
}
/** guard: end */
/** bean: begin */
export * from '../bean/bean.ai.ts';

import 'vona';
declare module 'vona' {


}
declare module 'vona-module-cabloy-ai' {

        export interface BeanAi {
          /** @internal */
          get scope(): ScopeModuleCabloyAi;
        }
}
/** bean: end */
/** bean: begin */
import type { BeanAi } from '../bean/bean.ai.ts';
import 'vona';
declare module 'vona' {
  export interface IBeanRecordGlobal {
    'ai': BeanAi;
  }
}
/** bean: end */
/** service: begin */
export * from '../service/configuration.ts';
export * from '../service/conversation.ts';
export * from '../service/run.ts';

import 'vona-module-a-bean';
declare module 'vona-module-a-bean' {

    export interface IServiceRecord {
      'cabloy-ai:configuration': never;
'cabloy-ai:conversation': never;
'cabloy-ai:run': never;
    }


}
declare module 'vona-module-cabloy-ai' {

        export interface ServiceConfiguration {
          /** @internal */
          get scope(): ScopeModuleCabloyAi;
        }

          export interface ServiceConfiguration {
            get $beanFullName(): 'cabloy-ai.service.configuration';
            get $onionName(): 'cabloy-ai:configuration';
          }

        export interface ServiceConversation {
          /** @internal */
          get scope(): ScopeModuleCabloyAi;
        }

          export interface ServiceConversation {
            get $beanFullName(): 'cabloy-ai.service.conversation';
            get $onionName(): 'cabloy-ai:conversation';
          }

        export interface ServiceRun {
          /** @internal */
          get scope(): ScopeModuleCabloyAi;
        }

          export interface ServiceRun {
            get $beanFullName(): 'cabloy-ai.service.run';
            get $onionName(): 'cabloy-ai:run';
          }
}
/** service: end */
/** service: begin */
import type { ServiceConfiguration } from '../service/configuration.ts';
import type { ServiceConversation } from '../service/conversation.ts';
import type { ServiceRun } from '../service/run.ts';
export interface IModuleService {
  'configuration': ServiceConfiguration;
'conversation': ServiceConversation;
'run': ServiceRun;
}
/** service: end */
/** service: begin */

import 'vona';
declare module 'vona' {
  export interface IBeanRecordGeneral {
    'cabloy-ai.service.configuration': ServiceConfiguration;
'cabloy-ai.service.conversation': ServiceConversation;
'cabloy-ai.service.run': ServiceRun;
  }
}
/** service: end */
/** meta: begin */
export * from '../bean/meta.index.ts';
export * from '../bean/meta.version.ts';
import type { IMetaOptionsIndex } from 'vona-module-a-index';
import 'vona-module-a-meta';
declare module 'vona-module-a-meta' {

    export interface IMetaRecord {
      'cabloy-ai:index': IMetaOptionsIndex;
'cabloy-ai:version': never;
    }


}
declare module 'vona-module-cabloy-ai' {

        export interface MetaIndex {
          /** @internal */
          get scope(): ScopeModuleCabloyAi;
        }

          export interface MetaIndex {
            get $beanFullName(): 'cabloy-ai.meta.index';
            get $onionName(): 'cabloy-ai:index';
            get $onionOptions(): IMetaOptionsIndex;
          }

        export interface MetaVersion {
          /** @internal */
          get scope(): ScopeModuleCabloyAi;
        }

          export interface MetaVersion {
            get $beanFullName(): 'cabloy-ai.meta.version';
            get $onionName(): 'cabloy-ai:version';
          }
}
/** meta: end */
/** aiScene: begin */
export * from '../bean/aiScene.default.ts';

import { type IDecoratorAiSceneOptions } from 'vona-module-cabloy-ai';
declare module 'vona-module-cabloy-ai' {

    export interface IAiSceneRecord {
      'cabloy-ai:default': IDecoratorAiSceneOptions;
    }


}
declare module 'vona-module-cabloy-ai' {

        export interface AiSceneDefault {
          /** @internal */
          get scope(): ScopeModuleCabloyAi;
        }

          export interface AiSceneDefault {
            get $beanFullName(): 'cabloy-ai.aiScene.default';
            get $onionName(): 'cabloy-ai:default';
            get $onionOptions(): IDecoratorAiSceneOptions;
          }
}
/** aiScene: end */
/** config: begin */
export * from '../config/config.ts';
import type { config } from '../config/config.ts';
/** config: end */
/** locale: begin */
import { locales } from './locales.ts';
/** locale: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil, type TypeModuleConfig, type TypeModuleLocales, type TypeLocaleBase } from 'vona';
import { Scope } from 'vona-module-a-bean';

@Scope()
export class ScopeModuleCabloyAi extends BeanScopeBase {}

export interface ScopeModuleCabloyAi {
  util: BeanScopeUtil;
config: TypeModuleConfig<typeof config>;
locale: TypeModuleLocales<(typeof locales)[TypeLocaleBase]>;
entity: IModuleEntity;
model: IModuleModel;
service: IModuleService;
}

import 'vona';
declare module 'vona' {
  export interface IBeanScopeRecord {
    'cabloy-ai': ScopeModuleCabloyAi;
  }

  export interface IBeanScopeContainer {
    cabloyAi: ScopeModuleCabloyAi;
  }

  export interface IBeanScopeConfig {
    'cabloy-ai': ReturnType<typeof config>;
  }

  export interface IBeanScopeLocale {
    'cabloy-ai': (typeof locales)[TypeLocaleBase];
  }


}
/** scope: end */
