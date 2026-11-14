// eslint-disable
import type { TypeEntityMeta,TypeModelsClassLikeGeneral,TypeSymbolKeyFieldsMore,IModelRelationBelongsTo } from 'vona-module-a-orm';
import type { TypeEntityOptionsFields,TypeControllerOptionsActions } from 'vona-module-a-openapi';
import type { TableIdentity } from 'table-identity';
/** entity: begin */
export * from '../entity/authorization.tsx';
export * from '../entity/client.tsx';
export * from '../entity/customScope.tsx';
import type { IEntityOptionsAuthorization } from '../entity/authorization.tsx';
import type { IEntityOptionsClient } from '../entity/client.tsx';
import type { IEntityOptionsCustomScope } from '../entity/customScope.tsx';
import 'vona-module-a-orm';
declare module 'vona-module-a-orm' {

    export interface IEntityRecord {
      'mcp-auth:authorization': IEntityOptionsAuthorization;
'mcp-auth:client': IEntityOptionsClient;
'mcp-auth:customScope': IEntityOptionsCustomScope;
    }


}
declare module 'vona-module-mcp-auth' {

}
/** entity: end */
/** entity: begin */
import type { EntityAuthorization } from '../entity/authorization.tsx';
import type { EntityClient } from '../entity/client.tsx';
import type { EntityCustomScope } from '../entity/customScope.tsx';
export interface IModuleEntity {
  'authorization': EntityAuthorizationMeta;
'client': EntityClientMeta;
'customScope': EntityCustomScopeMeta;
}
/** entity: end */
/** entity: begin */
export type EntityAuthorizationTableName = 'mcpAuthAuthorization';
export type EntityClientTableName = 'mcpAuthClient';
export type EntityCustomScopeTableName = 'mcpAuthCustomScope';
export type EntityAuthorizationMeta=TypeEntityMeta<EntityAuthorization,EntityAuthorizationTableName>;
export type EntityClientMeta=TypeEntityMeta<EntityClient,EntityClientTableName>;
export type EntityCustomScopeMeta=TypeEntityMeta<EntityCustomScope,EntityCustomScopeTableName>;
declare module 'vona-module-a-orm' {
  export interface ITableRecord {
    'mcpAuthAuthorization': EntityAuthorizationMeta;
'mcpAuthClient': EntityClientMeta;
'mcpAuthCustomScope': EntityCustomScopeMeta;
  }
}
declare module 'vona-module-mcp-auth' {

    export interface IEntityOptionsAuthorization {
      fields?: TypeEntityOptionsFields<EntityAuthorization, IEntityOptionsAuthorization[TypeSymbolKeyFieldsMore]>;
    }

    export interface IEntityOptionsClient {
      fields?: TypeEntityOptionsFields<EntityClient, IEntityOptionsClient[TypeSymbolKeyFieldsMore]>;
    }

    export interface IEntityOptionsCustomScope {
      fields?: TypeEntityOptionsFields<EntityCustomScope, IEntityOptionsCustomScope[TypeSymbolKeyFieldsMore]>;
    }
}
/** entity: end */
/** model: begin */
export * from '../model/authorization.ts';
export * from '../model/client.ts';
export * from '../model/customScope.ts';
import type { IModelOptionsAuthorization } from '../model/authorization.ts';
import type { IModelOptionsClient } from '../model/client.ts';
import type { IModelOptionsCustomScope } from '../model/customScope.ts';
import 'vona-module-a-orm';
declare module 'vona-module-a-orm' {

    export interface IModelRecord {
      'mcp-auth:authorization': IModelOptionsAuthorization;
'mcp-auth:client': IModelOptionsClient;
'mcp-auth:customScope': IModelOptionsCustomScope;
    }


}
declare module 'vona-module-mcp-auth' {

        export interface ModelAuthorization {
          /** @internal */
          get scope(): ScopeModuleMcpAuth;
        }

          export interface ModelAuthorization {
            get $beanFullName(): 'mcp-auth.model.authorization';
            get $onionName(): 'mcp-auth:authorization';
            get $onionOptions(): IModelOptionsAuthorization;
          }

        export interface ModelClient {
          /** @internal */
          get scope(): ScopeModuleMcpAuth;
        }

          export interface ModelClient {
            get $beanFullName(): 'mcp-auth.model.client';
            get $onionName(): 'mcp-auth:client';
            get $onionOptions(): IModelOptionsClient;
          }

        export interface ModelCustomScope {
          /** @internal */
          get scope(): ScopeModuleMcpAuth;
        }

          export interface ModelCustomScope {
            get $beanFullName(): 'mcp-auth.model.customScope';
            get $onionName(): 'mcp-auth:customScope';
            get $onionOptions(): IModelOptionsCustomScope;
          }
}
/** model: end */
/** model: begin */
import type { ModelAuthorization } from '../model/authorization.ts';
import type { ModelClient } from '../model/client.ts';
import type { ModelCustomScope } from '../model/customScope.ts';
export interface IModuleModel {
  'authorization': ModelAuthorization;
'client': ModelClient;
'customScope': ModelCustomScope;
}
/** model: end */
/** model: begin */

import 'vona';
declare module 'vona' {
  export interface IBeanRecordGeneral {
    'mcp-auth.model.authorization': ModelAuthorization;
'mcp-auth.model.client': ModelClient;
'mcp-auth.model.customScope': ModelCustomScope;
  }
}
/** model: end */
/** model: begin */
import type { IModelGetOptions, IModelMethodOptions, IModelSelectParams, TypeModelSelectAndCount, TypeModelRelationResult, TypeModelWhere, IModelInsertOptions, TypeModelMutateRelationData, IModelDeleteOptions, IModelUpdateOptions, IModelMutateOptions, IModelSelectCountParams, IModelIncrementParams, IModelSelectAggrParams, TypeModelAggrRelationResult, IModelSelectGroupParams, TypeModelGroupRelationResult } from 'vona-module-a-orm';
import { SymbolKeyEntity, SymbolKeyEntityMeta, SymbolKeyModelOptions } from 'vona-module-a-orm';
declare module 'vona-module-mcp-auth' {
  export interface IModelOptionsAuthorization {
        relations: {
          client: IModelRelationBelongsTo<'mcp-auth:authorization', 'mcp-auth:client', false, 'id'|'oauthClientId'|'name'|'issuer'>;
        };
      }
  export interface ModelAuthorization {
      [SymbolKeyEntity]: EntityAuthorization;
      [SymbolKeyEntityMeta]: EntityAuthorizationMeta;
      [SymbolKeyModelOptions]: IModelOptionsAuthorization;
      get<T extends IModelGetOptions<EntityAuthorization,ModelAuthorization>>(where: TypeModelWhere<EntityAuthorization>, options?: T): Promise<TypeModelRelationResult<EntityAuthorization, ModelAuthorization, T> | undefined>;
      /**
       * Retrieves one matching primary row with a pessimistic FOR UPDATE lock.
       * Requires an active transaction. The lock is released when that transaction completes.
       * Entity and query caches are bypassed.
       */
      getForUpdate<T extends IModelGetOptions<EntityAuthorization,ModelAuthorization>>(where: TypeModelWhere<EntityAuthorization>, options?: T): Promise<TypeModelRelationResult<EntityAuthorization, ModelAuthorization, T> | undefined>;
      /**
       * Retrieves a primary row by ID with the same pessimistic FOR UPDATE lock semantics.
       * Requires an active transaction. The lock is released when that transaction completes.
       * Entity and query caches are bypassed.
       */
      getByIdForUpdate<T extends IModelGetOptions<EntityAuthorization,ModelAuthorization>>(id: TableIdentity, options?: T): Promise<TypeModelRelationResult<EntityAuthorization, ModelAuthorization, T> | undefined>;
      mget<T extends IModelGetOptions<EntityAuthorization,ModelAuthorization>>(ids: TableIdentity[], options?: T): Promise<TypeModelRelationResult<EntityAuthorization, ModelAuthorization, T>[]>;
      selectAndCount<T extends IModelSelectParams<EntityAuthorization,ModelAuthorization,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelSelectAndCount<EntityAuthorization, ModelAuthorization, T>>;
      select<T extends IModelSelectParams<EntityAuthorization,ModelAuthorization,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelRelationResult<EntityAuthorization, ModelAuthorization, T>[]>;
      insert<T extends IModelInsertOptions<EntityAuthorization,ModelAuthorization>>(data?: TypeModelMutateRelationData<EntityAuthorization,ModelAuthorization, T>, options?: T): Promise<TypeModelMutateRelationData<EntityAuthorization,ModelAuthorization, T, true>>;
      insertBulk<T extends IModelInsertOptions<EntityAuthorization,ModelAuthorization>>(items: TypeModelMutateRelationData<EntityAuthorization,ModelAuthorization, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityAuthorization,ModelAuthorization, T, true>[]>;
      update<T extends IModelUpdateOptions<EntityAuthorization,ModelAuthorization>>(data: TypeModelMutateRelationData<EntityAuthorization,ModelAuthorization, T>, options?: T): Promise<TypeModelMutateRelationData<EntityAuthorization,ModelAuthorization, T>>;
      updateBulk<T extends IModelUpdateOptions<EntityAuthorization,ModelAuthorization>>(items: TypeModelMutateRelationData<EntityAuthorization,ModelAuthorization, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityAuthorization,ModelAuthorization, T>[]>;
      delete<T extends IModelDeleteOptions<EntityAuthorization,ModelAuthorization>>(where?: TypeModelWhere<EntityAuthorization>, options?: T): Promise<void>;
      deleteBulk<T extends IModelDeleteOptions<EntityAuthorization,ModelAuthorization>>(ids: TableIdentity[], options?: T): Promise<void>;
      mutate<T extends IModelMutateOptions<EntityAuthorization,ModelAuthorization>>(data?: TypeModelMutateRelationData<EntityAuthorization,ModelAuthorization, T>, options?: T): Promise<TypeModelMutateRelationData<EntityAuthorization,ModelAuthorization, T>>;
      mutateBulk<T extends IModelMutateOptions<EntityAuthorization,ModelAuthorization>>(items: TypeModelMutateRelationData<EntityAuthorization,ModelAuthorization, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityAuthorization,ModelAuthorization, T>[]>;
      count<T extends IModelSelectCountParams<EntityAuthorization,ModelAuthorization,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<string | undefined>;
      increment<T extends IModelIncrementParams<EntityAuthorization,ModelAuthorization,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      decrement<T extends IModelIncrementParams<EntityAuthorization,ModelAuthorization,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      aggregate<T extends IModelSelectAggrParams<EntityAuthorization,ModelAuthorization,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelAggrRelationResult<T>>;
      group<T extends IModelSelectGroupParams<EntityAuthorization,ModelAuthorization,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelGroupRelationResult<EntityAuthorization, T>[]>;
      getById<T extends IModelGetOptions<EntityAuthorization,ModelAuthorization>>(id: TableIdentity, options?: T): Promise<TypeModelRelationResult<EntityAuthorization, ModelAuthorization, T> | undefined>;
updateById<T extends IModelUpdateOptions<EntityAuthorization,ModelAuthorization>>(id: TableIdentity, data: TypeModelMutateRelationData<EntityAuthorization,ModelAuthorization, T>, options?: T): Promise<TypeModelMutateRelationData<EntityAuthorization,ModelAuthorization, T>>;
deleteById<T extends IModelDeleteOptions<EntityAuthorization,ModelAuthorization>>(id: TableIdentity, options?: T): Promise<void>;
getByName<T extends IModelGetOptions<EntityAuthorization,ModelAuthorization>>(name?: string, options?: T): Promise<TypeModelRelationResult<EntityAuthorization, ModelAuthorization, T> | undefined>;
getByNameEqI<T extends IModelGetOptions<EntityAuthorization,ModelAuthorization>>(name?: string, options?: T): Promise<TypeModelRelationResult<EntityAuthorization, ModelAuthorization, T> | undefined>;
selectByName<T extends IModelSelectParams<EntityAuthorization,ModelAuthorization,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(name?: string, params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelRelationResult<EntityAuthorization, ModelAuthorization, T>[]>;
selectByNameEqI<T extends IModelSelectParams<EntityAuthorization,ModelAuthorization,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(name?: string, params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelRelationResult<EntityAuthorization, ModelAuthorization, T>[]>;
    }
export interface ModelClient {
      [SymbolKeyEntity]: EntityClient;
      [SymbolKeyEntityMeta]: EntityClientMeta;
      [SymbolKeyModelOptions]: IModelOptionsClient;
      get<T extends IModelGetOptions<EntityClient,ModelClient>>(where: TypeModelWhere<EntityClient>, options?: T): Promise<TypeModelRelationResult<EntityClient, ModelClient, T> | undefined>;
      /**
       * Retrieves one matching primary row with a pessimistic FOR UPDATE lock.
       * Requires an active transaction. The lock is released when that transaction completes.
       * Entity and query caches are bypassed.
       */
      getForUpdate<T extends IModelGetOptions<EntityClient,ModelClient>>(where: TypeModelWhere<EntityClient>, options?: T): Promise<TypeModelRelationResult<EntityClient, ModelClient, T> | undefined>;
      /**
       * Retrieves a primary row by ID with the same pessimistic FOR UPDATE lock semantics.
       * Requires an active transaction. The lock is released when that transaction completes.
       * Entity and query caches are bypassed.
       */
      getByIdForUpdate<T extends IModelGetOptions<EntityClient,ModelClient>>(id: TableIdentity, options?: T): Promise<TypeModelRelationResult<EntityClient, ModelClient, T> | undefined>;
      mget<T extends IModelGetOptions<EntityClient,ModelClient>>(ids: TableIdentity[], options?: T): Promise<TypeModelRelationResult<EntityClient, ModelClient, T>[]>;
      selectAndCount<T extends IModelSelectParams<EntityClient,ModelClient,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelSelectAndCount<EntityClient, ModelClient, T>>;
      select<T extends IModelSelectParams<EntityClient,ModelClient,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelRelationResult<EntityClient, ModelClient, T>[]>;
      insert<T extends IModelInsertOptions<EntityClient,ModelClient>>(data?: TypeModelMutateRelationData<EntityClient,ModelClient, T>, options?: T): Promise<TypeModelMutateRelationData<EntityClient,ModelClient, T, true>>;
      insertBulk<T extends IModelInsertOptions<EntityClient,ModelClient>>(items: TypeModelMutateRelationData<EntityClient,ModelClient, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityClient,ModelClient, T, true>[]>;
      update<T extends IModelUpdateOptions<EntityClient,ModelClient>>(data: TypeModelMutateRelationData<EntityClient,ModelClient, T>, options?: T): Promise<TypeModelMutateRelationData<EntityClient,ModelClient, T>>;
      updateBulk<T extends IModelUpdateOptions<EntityClient,ModelClient>>(items: TypeModelMutateRelationData<EntityClient,ModelClient, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityClient,ModelClient, T>[]>;
      delete<T extends IModelDeleteOptions<EntityClient,ModelClient>>(where?: TypeModelWhere<EntityClient>, options?: T): Promise<void>;
      deleteBulk<T extends IModelDeleteOptions<EntityClient,ModelClient>>(ids: TableIdentity[], options?: T): Promise<void>;
      mutate<T extends IModelMutateOptions<EntityClient,ModelClient>>(data?: TypeModelMutateRelationData<EntityClient,ModelClient, T>, options?: T): Promise<TypeModelMutateRelationData<EntityClient,ModelClient, T>>;
      mutateBulk<T extends IModelMutateOptions<EntityClient,ModelClient>>(items: TypeModelMutateRelationData<EntityClient,ModelClient, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityClient,ModelClient, T>[]>;
      count<T extends IModelSelectCountParams<EntityClient,ModelClient,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<string | undefined>;
      increment<T extends IModelIncrementParams<EntityClient,ModelClient,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      decrement<T extends IModelIncrementParams<EntityClient,ModelClient,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      aggregate<T extends IModelSelectAggrParams<EntityClient,ModelClient,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelAggrRelationResult<T>>;
      group<T extends IModelSelectGroupParams<EntityClient,ModelClient,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelGroupRelationResult<EntityClient, T>[]>;
      getById<T extends IModelGetOptions<EntityClient,ModelClient>>(id: TableIdentity, options?: T): Promise<TypeModelRelationResult<EntityClient, ModelClient, T> | undefined>;
updateById<T extends IModelUpdateOptions<EntityClient,ModelClient>>(id: TableIdentity, data: TypeModelMutateRelationData<EntityClient,ModelClient, T>, options?: T): Promise<TypeModelMutateRelationData<EntityClient,ModelClient, T>>;
deleteById<T extends IModelDeleteOptions<EntityClient,ModelClient>>(id: TableIdentity, options?: T): Promise<void>;
getByName<T extends IModelGetOptions<EntityClient,ModelClient>>(name?: string, options?: T): Promise<TypeModelRelationResult<EntityClient, ModelClient, T> | undefined>;
getByNameEqI<T extends IModelGetOptions<EntityClient,ModelClient>>(name?: string, options?: T): Promise<TypeModelRelationResult<EntityClient, ModelClient, T> | undefined>;
selectByName<T extends IModelSelectParams<EntityClient,ModelClient,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(name?: string, params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelRelationResult<EntityClient, ModelClient, T>[]>;
selectByNameEqI<T extends IModelSelectParams<EntityClient,ModelClient,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(name?: string, params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelRelationResult<EntityClient, ModelClient, T>[]>;
    }
export interface ModelCustomScope {
      [SymbolKeyEntity]: EntityCustomScope;
      [SymbolKeyEntityMeta]: EntityCustomScopeMeta;
      [SymbolKeyModelOptions]: IModelOptionsCustomScope;
      get<T extends IModelGetOptions<EntityCustomScope,ModelCustomScope>>(where: TypeModelWhere<EntityCustomScope>, options?: T): Promise<TypeModelRelationResult<EntityCustomScope, ModelCustomScope, T> | undefined>;
      /**
       * Retrieves one matching primary row with a pessimistic FOR UPDATE lock.
       * Requires an active transaction. The lock is released when that transaction completes.
       * Entity and query caches are bypassed.
       */
      getForUpdate<T extends IModelGetOptions<EntityCustomScope,ModelCustomScope>>(where: TypeModelWhere<EntityCustomScope>, options?: T): Promise<TypeModelRelationResult<EntityCustomScope, ModelCustomScope, T> | undefined>;
      /**
       * Retrieves a primary row by ID with the same pessimistic FOR UPDATE lock semantics.
       * Requires an active transaction. The lock is released when that transaction completes.
       * Entity and query caches are bypassed.
       */
      getByIdForUpdate<T extends IModelGetOptions<EntityCustomScope,ModelCustomScope>>(id: TableIdentity, options?: T): Promise<TypeModelRelationResult<EntityCustomScope, ModelCustomScope, T> | undefined>;
      mget<T extends IModelGetOptions<EntityCustomScope,ModelCustomScope>>(ids: TableIdentity[], options?: T): Promise<TypeModelRelationResult<EntityCustomScope, ModelCustomScope, T>[]>;
      selectAndCount<T extends IModelSelectParams<EntityCustomScope,ModelCustomScope,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelSelectAndCount<EntityCustomScope, ModelCustomScope, T>>;
      select<T extends IModelSelectParams<EntityCustomScope,ModelCustomScope,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelRelationResult<EntityCustomScope, ModelCustomScope, T>[]>;
      insert<T extends IModelInsertOptions<EntityCustomScope,ModelCustomScope>>(data?: TypeModelMutateRelationData<EntityCustomScope,ModelCustomScope, T>, options?: T): Promise<TypeModelMutateRelationData<EntityCustomScope,ModelCustomScope, T, true>>;
      insertBulk<T extends IModelInsertOptions<EntityCustomScope,ModelCustomScope>>(items: TypeModelMutateRelationData<EntityCustomScope,ModelCustomScope, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityCustomScope,ModelCustomScope, T, true>[]>;
      update<T extends IModelUpdateOptions<EntityCustomScope,ModelCustomScope>>(data: TypeModelMutateRelationData<EntityCustomScope,ModelCustomScope, T>, options?: T): Promise<TypeModelMutateRelationData<EntityCustomScope,ModelCustomScope, T>>;
      updateBulk<T extends IModelUpdateOptions<EntityCustomScope,ModelCustomScope>>(items: TypeModelMutateRelationData<EntityCustomScope,ModelCustomScope, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityCustomScope,ModelCustomScope, T>[]>;
      delete<T extends IModelDeleteOptions<EntityCustomScope,ModelCustomScope>>(where?: TypeModelWhere<EntityCustomScope>, options?: T): Promise<void>;
      deleteBulk<T extends IModelDeleteOptions<EntityCustomScope,ModelCustomScope>>(ids: TableIdentity[], options?: T): Promise<void>;
      mutate<T extends IModelMutateOptions<EntityCustomScope,ModelCustomScope>>(data?: TypeModelMutateRelationData<EntityCustomScope,ModelCustomScope, T>, options?: T): Promise<TypeModelMutateRelationData<EntityCustomScope,ModelCustomScope, T>>;
      mutateBulk<T extends IModelMutateOptions<EntityCustomScope,ModelCustomScope>>(items: TypeModelMutateRelationData<EntityCustomScope,ModelCustomScope, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityCustomScope,ModelCustomScope, T>[]>;
      count<T extends IModelSelectCountParams<EntityCustomScope,ModelCustomScope,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<string | undefined>;
      increment<T extends IModelIncrementParams<EntityCustomScope,ModelCustomScope,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      decrement<T extends IModelIncrementParams<EntityCustomScope,ModelCustomScope,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      aggregate<T extends IModelSelectAggrParams<EntityCustomScope,ModelCustomScope,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelAggrRelationResult<T>>;
      group<T extends IModelSelectGroupParams<EntityCustomScope,ModelCustomScope,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelGroupRelationResult<EntityCustomScope, T>[]>;
      getById<T extends IModelGetOptions<EntityCustomScope,ModelCustomScope>>(id: TableIdentity, options?: T): Promise<TypeModelRelationResult<EntityCustomScope, ModelCustomScope, T> | undefined>;
updateById<T extends IModelUpdateOptions<EntityCustomScope,ModelCustomScope>>(id: TableIdentity, data: TypeModelMutateRelationData<EntityCustomScope,ModelCustomScope, T>, options?: T): Promise<TypeModelMutateRelationData<EntityCustomScope,ModelCustomScope, T>>;
deleteById<T extends IModelDeleteOptions<EntityCustomScope,ModelCustomScope>>(id: TableIdentity, options?: T): Promise<void>;
getByName<T extends IModelGetOptions<EntityCustomScope,ModelCustomScope>>(name?: string, options?: T): Promise<TypeModelRelationResult<EntityCustomScope, ModelCustomScope, T> | undefined>;
getByNameEqI<T extends IModelGetOptions<EntityCustomScope,ModelCustomScope>>(name?: string, options?: T): Promise<TypeModelRelationResult<EntityCustomScope, ModelCustomScope, T> | undefined>;
selectByName<T extends IModelSelectParams<EntityCustomScope,ModelCustomScope,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(name?: string, params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelRelationResult<EntityCustomScope, ModelCustomScope, T>[]>;
selectByNameEqI<T extends IModelSelectParams<EntityCustomScope,ModelCustomScope,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(name?: string, params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelRelationResult<EntityCustomScope, ModelCustomScope, T>[]>;
    }
}
declare module 'vona-module-a-orm' {
  export interface IModelClassRecord {
    'mcp-auth:authorization': ModelAuthorization;
'mcp-auth:client': ModelClient;
'mcp-auth:customScope': ModelCustomScope;
  }
}
/** model: end */
/** dto: begin */
export * from '../dto/accessToken.tsx';
export * from '../dto/accessTokenCreate.tsx';
export * from '../dto/accessTokenCreateRes.tsx';
export * from '../dto/accessTokenMineReq.tsx';
export * from '../dto/accessTokenMineRes.tsx';
export * from '../dto/authorizationDecision.ts';
export * from '../dto/authorizationGrant.tsx';
export * from '../dto/authorizationGrantMineReq.tsx';
export * from '../dto/authorizationGrantMineRes.tsx';
export * from '../dto/authorizationRedirect.ts';
export * from '../dto/authorizationSummary.ts';
export * from '../dto/customScopeCreate.tsx';
export * from '../dto/customScopeView.tsx';
export * from '../dto/mcpSiteQuery.ts';
export * from '../dto/mcpTool.ts';
import type { IDtoOptionsAccessToken } from '../dto/accessToken.tsx';
import type { IDtoOptionsAccessTokenCreate } from '../dto/accessTokenCreate.tsx';
import type { IDtoOptionsAccessTokenCreateRes } from '../dto/accessTokenCreateRes.tsx';
import type { IDtoOptionsAccessTokenMineReq } from '../dto/accessTokenMineReq.tsx';
import type { IDtoOptionsAccessTokenMineRes } from '../dto/accessTokenMineRes.tsx';
import type { IDtoOptionsAuthorizationDecision } from '../dto/authorizationDecision.ts';
import type { IDtoOptionsAuthorizationGrant } from '../dto/authorizationGrant.tsx';
import type { IDtoOptionsAuthorizationGrantMineReq } from '../dto/authorizationGrantMineReq.tsx';
import type { IDtoOptionsAuthorizationGrantMineRes } from '../dto/authorizationGrantMineRes.tsx';
import type { IDtoOptionsAuthorizationRedirect } from '../dto/authorizationRedirect.ts';
import type { IDtoOptionsAuthorizationSummary } from '../dto/authorizationSummary.ts';
import type { IDtoOptionsMcpSiteQuery } from '../dto/mcpSiteQuery.ts';
import { type IDecoratorDtoOptions } from 'vona-module-a-web';
declare module 'vona-module-a-web' {

    export interface IDtoRecord {
      'mcp-auth:accessToken': IDtoOptionsAccessToken;
'mcp-auth:accessTokenCreate': IDtoOptionsAccessTokenCreate;
'mcp-auth:accessTokenCreateRes': IDtoOptionsAccessTokenCreateRes;
'mcp-auth:accessTokenMineReq': IDtoOptionsAccessTokenMineReq;
'mcp-auth:accessTokenMineRes': IDtoOptionsAccessTokenMineRes;
'mcp-auth:authorizationDecision': IDtoOptionsAuthorizationDecision;
'mcp-auth:authorizationGrant': IDtoOptionsAuthorizationGrant;
'mcp-auth:authorizationGrantMineReq': IDtoOptionsAuthorizationGrantMineReq;
'mcp-auth:authorizationGrantMineRes': IDtoOptionsAuthorizationGrantMineRes;
'mcp-auth:authorizationRedirect': IDtoOptionsAuthorizationRedirect;
'mcp-auth:authorizationSummary': IDtoOptionsAuthorizationSummary;
'mcp-auth:customScopeCreate': IDecoratorDtoOptions;
'mcp-auth:customScopeView': IDecoratorDtoOptions;
'mcp-auth:mcpSiteQuery': IDtoOptionsMcpSiteQuery;
'mcp-auth:mcpTool': IDecoratorDtoOptions;
    }


}
declare module 'vona-module-mcp-auth' {

}
/** dto: end */
/** dto: begin */
import type { DtoAccessToken } from '../dto/accessToken.tsx';
import type { DtoAccessTokenCreate } from '../dto/accessTokenCreate.tsx';
import type { DtoAccessTokenCreateRes } from '../dto/accessTokenCreateRes.tsx';
import type { DtoAccessTokenMineReq } from '../dto/accessTokenMineReq.tsx';
import type { DtoAccessTokenMineRes } from '../dto/accessTokenMineRes.tsx';
import type { DtoAuthorizationDecision } from '../dto/authorizationDecision.ts';
import type { DtoAuthorizationGrant } from '../dto/authorizationGrant.tsx';
import type { DtoAuthorizationGrantMineReq } from '../dto/authorizationGrantMineReq.tsx';
import type { DtoAuthorizationGrantMineRes } from '../dto/authorizationGrantMineRes.tsx';
import type { DtoAuthorizationRedirect } from '../dto/authorizationRedirect.ts';
import type { DtoAuthorizationSummary } from '../dto/authorizationSummary.ts';
import type { DtoCustomScopeCreate } from '../dto/customScopeCreate.tsx';
import type { DtoCustomScopeView } from '../dto/customScopeView.tsx';
import type { DtoMcpSiteQuery } from '../dto/mcpSiteQuery.ts';
import type { DtoMcpTool } from '../dto/mcpTool.ts';
declare module 'vona-module-mcp-auth' {

    export interface IDtoOptionsAccessToken {
      fields?: TypeEntityOptionsFields<DtoAccessToken, IDtoOptionsAccessToken[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsAccessTokenCreate {
      fields?: TypeEntityOptionsFields<DtoAccessTokenCreate, IDtoOptionsAccessTokenCreate[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsAccessTokenCreateRes {
      fields?: TypeEntityOptionsFields<DtoAccessTokenCreateRes, IDtoOptionsAccessTokenCreateRes[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsAccessTokenMineReq {
      fields?: TypeEntityOptionsFields<DtoAccessTokenMineReq, IDtoOptionsAccessTokenMineReq[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsAccessTokenMineRes {
      fields?: TypeEntityOptionsFields<DtoAccessTokenMineRes, IDtoOptionsAccessTokenMineRes[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsAuthorizationDecision {
      fields?: TypeEntityOptionsFields<DtoAuthorizationDecision, IDtoOptionsAuthorizationDecision[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsAuthorizationGrant {
      fields?: TypeEntityOptionsFields<DtoAuthorizationGrant, IDtoOptionsAuthorizationGrant[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsAuthorizationGrantMineReq {
      fields?: TypeEntityOptionsFields<DtoAuthorizationGrantMineReq, IDtoOptionsAuthorizationGrantMineReq[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsAuthorizationGrantMineRes {
      fields?: TypeEntityOptionsFields<DtoAuthorizationGrantMineRes, IDtoOptionsAuthorizationGrantMineRes[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsAuthorizationRedirect {
      fields?: TypeEntityOptionsFields<DtoAuthorizationRedirect, IDtoOptionsAuthorizationRedirect[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsAuthorizationSummary {
      fields?: TypeEntityOptionsFields<DtoAuthorizationSummary, IDtoOptionsAuthorizationSummary[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsCustomScopeCreate {
      fields?: TypeEntityOptionsFields<DtoCustomScopeCreate, IDtoOptionsCustomScopeCreate[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsCustomScopeView {
      fields?: TypeEntityOptionsFields<DtoCustomScopeView, IDtoOptionsCustomScopeView[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsMcpSiteQuery {
      fields?: TypeEntityOptionsFields<DtoMcpSiteQuery, IDtoOptionsMcpSiteQuery[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsMcpTool {
      fields?: TypeEntityOptionsFields<DtoMcpTool, IDtoOptionsMcpTool[TypeSymbolKeyFieldsMore]>;
    }
}
/** dto: end */
/** controller: begin */
export * from '../controller/accessToken.ts';
export * from '../controller/authorization.ts';
export * from '../controller/authorizationGrant.ts';
export * from '../controller/customScope.ts';
import type { IControllerOptionsAccessToken } from '../controller/accessToken.ts';
import type { IControllerOptionsAuthorization } from '../controller/authorization.ts';
import type { IControllerOptionsAuthorizationGrant } from '../controller/authorizationGrant.ts';
import type { IControllerOptionsCustomScope } from '../controller/customScope.ts';
import 'vona-module-a-web';
declare module 'vona-module-a-web' {

    export interface IControllerRecord {
      'mcp-auth:accessToken': IControllerOptionsAccessToken;
'mcp-auth:authorization': IControllerOptionsAuthorization;
'mcp-auth:authorizationGrant': IControllerOptionsAuthorizationGrant;
'mcp-auth:customScope': IControllerOptionsCustomScope;
    }


}
declare module 'vona-module-mcp-auth' {

        export interface ControllerAccessToken {
          /** @internal */
          get scope(): ScopeModuleMcpAuth;
        }

          export interface ControllerAccessToken {
            get $beanFullName(): 'mcp-auth.controller.accessToken';
            get $onionName(): 'mcp-auth:accessToken';
            get $onionOptions(): IControllerOptionsAccessToken;
          }

        export interface ControllerAuthorization {
          /** @internal */
          get scope(): ScopeModuleMcpAuth;
        }

          export interface ControllerAuthorization {
            get $beanFullName(): 'mcp-auth.controller.authorization';
            get $onionName(): 'mcp-auth:authorization';
            get $onionOptions(): IControllerOptionsAuthorization;
          }

        export interface ControllerAuthorizationGrant {
          /** @internal */
          get scope(): ScopeModuleMcpAuth;
        }

          export interface ControllerAuthorizationGrant {
            get $beanFullName(): 'mcp-auth.controller.authorizationGrant';
            get $onionName(): 'mcp-auth:authorizationGrant';
            get $onionOptions(): IControllerOptionsAuthorizationGrant;
          }

        export interface ControllerCustomScope {
          /** @internal */
          get scope(): ScopeModuleMcpAuth;
        }

          export interface ControllerCustomScope {
            get $beanFullName(): 'mcp-auth.controller.customScope';
            get $onionName(): 'mcp-auth:customScope';
            get $onionOptions(): IControllerOptionsCustomScope;
          }
}
/** controller: end */
/** controller: begin */
// @ts-ignore ignore
import type { ControllerAccessToken } from '../controller/accessToken.ts';
// @ts-ignore ignore
import type { ControllerAuthorization } from '../controller/authorization.ts';
// @ts-ignore ignore
import type { ControllerAuthorizationGrant } from '../controller/authorizationGrant.ts';
// @ts-ignore ignore
import type { ControllerCustomScope } from '../controller/customScope.ts';
declare module 'vona-module-mcp-auth' {

    export interface IControllerOptionsAccessToken {
      actions?: TypeControllerOptionsActions<ControllerAccessToken>;
    }

    export interface IControllerOptionsAuthorization {
      actions?: TypeControllerOptionsActions<ControllerAuthorization>;
    }

    export interface IControllerOptionsAuthorizationGrant {
      actions?: TypeControllerOptionsActions<ControllerAuthorizationGrant>;
    }

    export interface IControllerOptionsCustomScope {
      actions?: TypeControllerOptionsActions<ControllerCustomScope>;
    }
}
declare module 'vona-module-a-web' {
  export interface IApiPathGetRecord{
        '/mcp/auth/accessToken/mine': undefined;
'//mcp/auth/summary': undefined;
'/mcp/auth/authorizationGrant/mine': undefined;
'/mcp/auth/customScope/mine': undefined;
'/mcp/auth/customScope/catalog': undefined;
    }
export interface IApiPathPostRecord{
        '/mcp/auth/accessToken/createMine': undefined;
'//mcp/auth/decision': undefined;
'/mcp/auth/authorizationGrant/revokeMine/:id': undefined;
'/mcp/auth/customScope/createMine': undefined;
'/mcp/auth/customScope/updateMine/:id': undefined;
    }
export interface IApiPathDeleteRecord{
        '/mcp/auth/accessToken/deleteMine/:id': undefined;
'/mcp/auth/authorizationGrant/deleteMine/:id': undefined;
'/mcp/auth/customScope/deleteMine/:id': undefined;
    }

}

/** controller: end */
/** middlewareSystem: begin */
export * from '../bean/middlewareSystem.authorization.ts';
import type { IMiddlewareSystemOptionsAuthorization } from '../bean/middlewareSystem.authorization.ts';
import 'vona-module-a-aspect';
declare module 'vona-module-a-aspect' {

    export interface IMiddlewareSystemRecord {
      'mcp-auth:authorization': IMiddlewareSystemOptionsAuthorization;
    }


}
declare module 'vona-module-mcp-auth' {

        export interface MiddlewareSystemAuthorization {
          /** @internal */
          get scope(): ScopeModuleMcpAuth;
        }

          export interface MiddlewareSystemAuthorization {
            get $beanFullName(): 'mcp-auth.middlewareSystem.authorization';
            get $onionName(): 'mcp-auth:authorization';
            get $onionOptions(): IMiddlewareSystemOptionsAuthorization;
          }
}
/** middlewareSystem: end */
/** service: begin */
export * from '../service/accessToken.ts';
export * from '../service/authTokenAdapter.ts';
export * from '../service/authorization.ts';
export * from '../service/authorizationGrant.ts';
export * from '../service/customScope.ts';
export * from '../service/registration.ts';

import 'vona-module-a-bean';
declare module 'vona-module-a-bean' {

    export interface IServiceRecord {
      'mcp-auth:accessToken': never;
'mcp-auth:authTokenAdapter': never;
'mcp-auth:authorization': never;
'mcp-auth:authorizationGrant': never;
'mcp-auth:customScope': never;
'mcp-auth:registration': never;
    }


}
declare module 'vona-module-mcp-auth' {

        export interface ServiceAccessToken {
          /** @internal */
          get scope(): ScopeModuleMcpAuth;
        }

          export interface ServiceAccessToken {
            get $beanFullName(): 'mcp-auth.service.accessToken';
            get $onionName(): 'mcp-auth:accessToken';
          }

        export interface ServiceAuthTokenAdapter {
          /** @internal */
          get scope(): ScopeModuleMcpAuth;
        }

          export interface ServiceAuthTokenAdapter {
            get $beanFullName(): 'mcp-auth.service.authTokenAdapter';
            get $onionName(): 'mcp-auth:authTokenAdapter';
          }

        export interface ServiceAuthorization {
          /** @internal */
          get scope(): ScopeModuleMcpAuth;
        }

          export interface ServiceAuthorization {
            get $beanFullName(): 'mcp-auth.service.authorization';
            get $onionName(): 'mcp-auth:authorization';
          }

        export interface ServiceAuthorizationGrant {
          /** @internal */
          get scope(): ScopeModuleMcpAuth;
        }

          export interface ServiceAuthorizationGrant {
            get $beanFullName(): 'mcp-auth.service.authorizationGrant';
            get $onionName(): 'mcp-auth:authorizationGrant';
          }

        export interface ServiceCustomScope {
          /** @internal */
          get scope(): ScopeModuleMcpAuth;
        }

          export interface ServiceCustomScope {
            get $beanFullName(): 'mcp-auth.service.customScope';
            get $onionName(): 'mcp-auth:customScope';
          }

        export interface ServiceRegistration {
          /** @internal */
          get scope(): ScopeModuleMcpAuth;
        }

          export interface ServiceRegistration {
            get $beanFullName(): 'mcp-auth.service.registration';
            get $onionName(): 'mcp-auth:registration';
          }
}
/** service: end */
/** service: begin */
import type { ServiceAccessToken } from '../service/accessToken.ts';
import type { ServiceAuthTokenAdapter } from '../service/authTokenAdapter.ts';
import type { ServiceAuthorization } from '../service/authorization.ts';
import type { ServiceAuthorizationGrant } from '../service/authorizationGrant.ts';
import type { ServiceCustomScope } from '../service/customScope.ts';
import type { ServiceRegistration } from '../service/registration.ts';
export interface IModuleService {
  'accessToken': ServiceAccessToken;
'authTokenAdapter': ServiceAuthTokenAdapter;
'authorization': ServiceAuthorization;
'authorizationGrant': ServiceAuthorizationGrant;
'customScope': ServiceCustomScope;
'registration': ServiceRegistration;
}
/** service: end */
/** service: begin */

import 'vona';
declare module 'vona' {
  export interface IBeanRecordGeneral {
    'mcp-auth.service.accessToken': ServiceAccessToken;
'mcp-auth.service.authTokenAdapter': ServiceAuthTokenAdapter;
'mcp-auth.service.authorization': ServiceAuthorization;
'mcp-auth.service.authorizationGrant': ServiceAuthorizationGrant;
'mcp-auth.service.customScope': ServiceCustomScope;
'mcp-auth.service.registration': ServiceRegistration;
  }
}
/** service: end */
/** meta: begin */
export * from '../bean/meta.index.ts';
export * from '../bean/meta.redlock.ts';
export * from '../bean/meta.version.ts';
import type { IMetaOptionsIndex } from 'vona-module-a-index';
import 'vona-module-a-meta';
declare module 'vona-module-a-meta' {

    export interface IMetaRecord {
      'mcp-auth:index': IMetaOptionsIndex;
'mcp-auth:redlock': never;
'mcp-auth:version': never;
    }


}
declare module 'vona-module-mcp-auth' {

        export interface MetaIndex {
          /** @internal */
          get scope(): ScopeModuleMcpAuth;
        }

          export interface MetaIndex {
            get $beanFullName(): 'mcp-auth.meta.index';
            get $onionName(): 'mcp-auth:index';
            get $onionOptions(): IMetaOptionsIndex;
          }

        export interface MetaRedlock {
          /** @internal */
          get scope(): ScopeModuleMcpAuth;
        }

          export interface MetaRedlock {
            get $beanFullName(): 'mcp-auth.meta.redlock';
            get $onionName(): 'mcp-auth:redlock';
          }

        export interface MetaVersion {
          /** @internal */
          get scope(): ScopeModuleMcpAuth;
        }

          export interface MetaVersion {
            get $beanFullName(): 'mcp-auth.meta.version';
            get $onionName(): 'mcp-auth:version';
          }
}
/** meta: end */
/** meta redlock: begin */
import type { MetaRedlock } from '../bean/meta.redlock.ts';
/** meta redlock: end */
/** config: begin */
export * from '../config/config.ts';
import type { config } from '../config/config.ts';
/** config: end */
/** locale: begin */
import { locales } from './locales.ts';
/** locale: end */
/** monkey: begin */
export * from '../monkey.ts';
/** monkey: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil, type TypeModuleConfig, type TypeModuleLocales, type TypeLocaleBase } from 'vona';
import { Scope } from 'vona-module-a-bean';

@Scope()
export class ScopeModuleMcpAuth extends BeanScopeBase {}

export interface ScopeModuleMcpAuth {
  util: BeanScopeUtil;
config: TypeModuleConfig<typeof config>;
locale: TypeModuleLocales<(typeof locales)[TypeLocaleBase]>;
entity: IModuleEntity;
model: IModuleModel;
service: IModuleService;
redlock: MetaRedlock;
}

import 'vona';
declare module 'vona' {
  export interface IBeanScopeRecord {
    'mcp-auth': ScopeModuleMcpAuth;
  }

  export interface IBeanScopeContainer {
    mcpAuth: ScopeModuleMcpAuth;
  }

  export interface IBeanScopeConfig {
    'mcp-auth': ReturnType<typeof config>;
  }

  export interface IBeanScopeLocale {
    'mcp-auth': (typeof locales)[TypeLocaleBase];
  }


}
/** scope: end */
