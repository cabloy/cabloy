// eslint-disable
import type { TypeEntityMeta,TypeModelsClassLikeGeneral,TypeSymbolKeyFieldsMore,IModelRelationBelongsToMany } from 'vona-module-a-orm';
import type { TypeEntityOptionsFields,TypeControllerOptionsActions } from 'vona-module-a-openapi';
import type { TableIdentity } from 'table-identity';
/** entity: begin */
export * from '../entity/role.ts';
export * from '../entity/roleUser.ts';
export * from '../entity/user.ts';
import type { IEntityOptionsRole } from '../entity/role.ts';
import type { IEntityOptionsRoleUser } from '../entity/roleUser.ts';
import type { IEntityOptionsUser } from '../entity/user.ts';
import 'vona-module-a-orm';
declare module 'vona-module-a-orm' {
  
    export interface IEntityRecord {
      'home-user:role': IEntityOptionsRole;
'home-user:roleUser': IEntityOptionsRoleUser;
'home-user:user': IEntityOptionsUser;
    }

  
}
declare module 'vona-module-home-user' {
   
}
/** entity: end */
/** entity: begin */
import type { EntityRole } from '../entity/role.ts';
import type { EntityRoleUser } from '../entity/roleUser.ts';
import type { EntityUser } from '../entity/user.ts';
export interface IModuleEntity {
  'role': EntityRoleMeta;
'roleUser': EntityRoleUserMeta;
'user': EntityUserMeta;
}
/** entity: end */
/** entity: begin */
export type EntityRoleTableName = 'homeRole';
export type EntityRoleUserTableName = 'homeRoleUser';
export type EntityUserTableName = 'homeUser';
export type EntityRoleMeta=TypeEntityMeta<EntityRole,EntityRoleTableName>;
export type EntityRoleUserMeta=TypeEntityMeta<EntityRoleUser,EntityRoleUserTableName>;
export type EntityUserMeta=TypeEntityMeta<EntityUser,EntityUserTableName>;
declare module 'vona-module-a-orm' {
  export interface ITableRecord {
    'homeRole': EntityRoleMeta;
'homeRoleUser': EntityRoleUserMeta;
'homeUser': EntityUserMeta;
  }
}
declare module 'vona-module-home-user' {
  
    export interface IEntityOptionsRole {
      fields?: TypeEntityOptionsFields<EntityRole, IEntityOptionsRole[TypeSymbolKeyFieldsMore]>;
    }

    export interface IEntityOptionsRoleUser {
      fields?: TypeEntityOptionsFields<EntityRoleUser, IEntityOptionsRoleUser[TypeSymbolKeyFieldsMore]>;
    }

    export interface IEntityOptionsUser {
      fields?: TypeEntityOptionsFields<EntityUser, IEntityOptionsUser[TypeSymbolKeyFieldsMore]>;
    }
}
/** entity: end */
/** model: begin */
export * from '../model/role.ts';
export * from '../model/roleUser.ts';
export * from '../model/user.ts';
import type { IModelOptionsRole } from '../model/role.ts';
import type { IModelOptionsRoleUser } from '../model/roleUser.ts';
import type { IModelOptionsUser } from '../model/user.ts';
import 'vona-module-a-orm';
declare module 'vona-module-a-orm' {
  
    export interface IModelRecord {
      'home-user:role': IModelOptionsRole;
'home-user:roleUser': IModelOptionsRoleUser;
'home-user:user': IModelOptionsUser;
    }

  
}
declare module 'vona-module-home-user' {
  
        export interface ModelRole {
          /** @internal */
          get scope(): ScopeModuleHomeUser;
        }

          export interface ModelRole {
            get $beanFullName(): 'home-user.model.role';
            get $onionName(): 'home-user:role';
            get $onionOptions(): IModelOptionsRole;
          }

        export interface ModelRoleUser {
          /** @internal */
          get scope(): ScopeModuleHomeUser;
        }

          export interface ModelRoleUser {
            get $beanFullName(): 'home-user.model.roleUser';
            get $onionName(): 'home-user:roleUser';
            get $onionOptions(): IModelOptionsRoleUser;
          }

        export interface ModelUser {
          /** @internal */
          get scope(): ScopeModuleHomeUser;
        }

          export interface ModelUser {
            get $beanFullName(): 'home-user.model.user';
            get $onionName(): 'home-user:user';
            get $onionOptions(): IModelOptionsUser;
          } 
}
/** model: end */
/** model: begin */
import type { ModelRole } from '../model/role.ts';
import type { ModelRoleUser } from '../model/roleUser.ts';
import type { ModelUser } from '../model/user.ts';
export interface IModuleModel {
  'role': ModelRole;
'roleUser': ModelRoleUser;
'user': ModelUser;
}
/** model: end */
/** model: begin */

import 'vona';
declare module 'vona' {
  export interface IBeanRecordGeneral {
    'home-user.model.role': ModelRole;
'home-user.model.roleUser': ModelRoleUser;
'home-user.model.user': ModelUser;
  }
}
/** model: end */
/** model: begin */
import type { IModelGetOptions, IModelMethodOptions, IModelSelectParams, TypeModelSelectAndCount, TypeModelRelationResult, TypeModelWhere, IModelInsertOptions, TypeModelMutateRelationData, IModelDeleteOptions, IModelUpdateOptions, IModelMutateOptions, IModelSelectCountParams, IModelIncrementParams, IModelSelectAggrParams, TypeModelAggrRelationResult, IModelSelectGroupParams, TypeModelGroupRelationResult } from 'vona-module-a-orm';
import { SymbolKeyEntity, SymbolKeyEntityMeta, SymbolKeyModelOptions } from 'vona-module-a-orm';
declare module 'vona-module-home-user' {
  export interface IModelOptionsUser {
        relations: {
          roles: IModelRelationBelongsToMany<'home-user:roleUser', 'home-user:role', false, '*',undefined,undefined,undefined>;
        };
      }
  export interface ModelRole {
      [SymbolKeyEntity]: EntityRole;
      [SymbolKeyEntityMeta]: EntityRoleMeta;
      [SymbolKeyModelOptions]: IModelOptionsRole;
      get<T extends IModelGetOptions<EntityRole,ModelRole>>(where: TypeModelWhere<EntityRole>, options?: T): Promise<TypeModelRelationResult<EntityRole, ModelRole, T> | undefined>;
      /**
       * Retrieves one matching primary row with a pessimistic FOR UPDATE lock.
       * Requires an active transaction. The lock is released when that transaction completes.
       * Entity and query caches are bypassed.
       */
      getForUpdate<T extends IModelGetOptions<EntityRole,ModelRole>>(where: TypeModelWhere<EntityRole>, options?: T): Promise<TypeModelRelationResult<EntityRole, ModelRole, T> | undefined>;
      /**
       * Retrieves a primary row by ID with the same pessimistic FOR UPDATE lock semantics.
       * Requires an active transaction. The lock is released when that transaction completes.
       * Entity and query caches are bypassed.
       */
      getByIdForUpdate<T extends IModelGetOptions<EntityRole,ModelRole>>(id: TableIdentity, options?: T): Promise<TypeModelRelationResult<EntityRole, ModelRole, T> | undefined>;
      mget<T extends IModelGetOptions<EntityRole,ModelRole>>(ids: TableIdentity[], options?: T): Promise<TypeModelRelationResult<EntityRole, ModelRole, T>[]>;
      selectAndCount<T extends IModelSelectParams<EntityRole,ModelRole,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelSelectAndCount<EntityRole, ModelRole, T>>;
      select<T extends IModelSelectParams<EntityRole,ModelRole,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelRelationResult<EntityRole, ModelRole, T>[]>;
      insert<T extends IModelInsertOptions<EntityRole,ModelRole>>(data?: TypeModelMutateRelationData<EntityRole,ModelRole, T>, options?: T): Promise<TypeModelMutateRelationData<EntityRole,ModelRole, T, true>>;
      insertBulk<T extends IModelInsertOptions<EntityRole,ModelRole>>(items: TypeModelMutateRelationData<EntityRole,ModelRole, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityRole,ModelRole, T, true>[]>;
      update<T extends IModelUpdateOptions<EntityRole,ModelRole>>(data: TypeModelMutateRelationData<EntityRole,ModelRole, T>, options?: T): Promise<TypeModelMutateRelationData<EntityRole,ModelRole, T>>;
      updateBulk<T extends IModelUpdateOptions<EntityRole,ModelRole>>(items: TypeModelMutateRelationData<EntityRole,ModelRole, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityRole,ModelRole, T>[]>;
      delete<T extends IModelDeleteOptions<EntityRole,ModelRole>>(where?: TypeModelWhere<EntityRole>, options?: T): Promise<void>;
      deleteBulk<T extends IModelDeleteOptions<EntityRole,ModelRole>>(ids: TableIdentity[], options?: T): Promise<void>;
      mutate<T extends IModelMutateOptions<EntityRole,ModelRole>>(data?: TypeModelMutateRelationData<EntityRole,ModelRole, T>, options?: T): Promise<TypeModelMutateRelationData<EntityRole,ModelRole, T>>;
      mutateBulk<T extends IModelMutateOptions<EntityRole,ModelRole>>(items: TypeModelMutateRelationData<EntityRole,ModelRole, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityRole,ModelRole, T>[]>;
      count<T extends IModelSelectCountParams<EntityRole,ModelRole,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<string | undefined>;
      increment<T extends IModelIncrementParams<EntityRole,ModelRole,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      decrement<T extends IModelIncrementParams<EntityRole,ModelRole,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      aggregate<T extends IModelSelectAggrParams<EntityRole,ModelRole,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelAggrRelationResult<T>>;
      group<T extends IModelSelectGroupParams<EntityRole,ModelRole,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelGroupRelationResult<EntityRole, T>[]>;
      getById<T extends IModelGetOptions<EntityRole,ModelRole>>(id: TableIdentity, options?: T): Promise<TypeModelRelationResult<EntityRole, ModelRole, T> | undefined>;
updateById<T extends IModelUpdateOptions<EntityRole,ModelRole>>(id: TableIdentity, data: TypeModelMutateRelationData<EntityRole,ModelRole, T>, options?: T): Promise<TypeModelMutateRelationData<EntityRole,ModelRole, T>>;
deleteById<T extends IModelDeleteOptions<EntityRole,ModelRole>>(id: TableIdentity, options?: T): Promise<void>;
getByName<T extends IModelGetOptions<EntityRole,ModelRole>>(name?: string, options?: T): Promise<TypeModelRelationResult<EntityRole, ModelRole, T> | undefined>;
getByNameEqI<T extends IModelGetOptions<EntityRole,ModelRole>>(name?: string, options?: T): Promise<TypeModelRelationResult<EntityRole, ModelRole, T> | undefined>;
selectByName<T extends IModelSelectParams<EntityRole,ModelRole,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(name?: string, params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelRelationResult<EntityRole, ModelRole, T>[]>;
selectByNameEqI<T extends IModelSelectParams<EntityRole,ModelRole,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(name?: string, params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelRelationResult<EntityRole, ModelRole, T>[]>;
    }
export interface ModelRoleUser {
      [SymbolKeyEntity]: EntityRoleUser;
      [SymbolKeyEntityMeta]: EntityRoleUserMeta;
      [SymbolKeyModelOptions]: IModelOptionsRoleUser;
      get<T extends IModelGetOptions<EntityRoleUser,ModelRoleUser>>(where: TypeModelWhere<EntityRoleUser>, options?: T): Promise<TypeModelRelationResult<EntityRoleUser, ModelRoleUser, T> | undefined>;
      /**
       * Retrieves one matching primary row with a pessimistic FOR UPDATE lock.
       * Requires an active transaction. The lock is released when that transaction completes.
       * Entity and query caches are bypassed.
       */
      getForUpdate<T extends IModelGetOptions<EntityRoleUser,ModelRoleUser>>(where: TypeModelWhere<EntityRoleUser>, options?: T): Promise<TypeModelRelationResult<EntityRoleUser, ModelRoleUser, T> | undefined>;
      /**
       * Retrieves a primary row by ID with the same pessimistic FOR UPDATE lock semantics.
       * Requires an active transaction. The lock is released when that transaction completes.
       * Entity and query caches are bypassed.
       */
      getByIdForUpdate<T extends IModelGetOptions<EntityRoleUser,ModelRoleUser>>(id: TableIdentity, options?: T): Promise<TypeModelRelationResult<EntityRoleUser, ModelRoleUser, T> | undefined>;
      mget<T extends IModelGetOptions<EntityRoleUser,ModelRoleUser>>(ids: TableIdentity[], options?: T): Promise<TypeModelRelationResult<EntityRoleUser, ModelRoleUser, T>[]>;
      selectAndCount<T extends IModelSelectParams<EntityRoleUser,ModelRoleUser,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelSelectAndCount<EntityRoleUser, ModelRoleUser, T>>;
      select<T extends IModelSelectParams<EntityRoleUser,ModelRoleUser,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelRelationResult<EntityRoleUser, ModelRoleUser, T>[]>;
      insert<T extends IModelInsertOptions<EntityRoleUser,ModelRoleUser>>(data?: TypeModelMutateRelationData<EntityRoleUser,ModelRoleUser, T>, options?: T): Promise<TypeModelMutateRelationData<EntityRoleUser,ModelRoleUser, T, true>>;
      insertBulk<T extends IModelInsertOptions<EntityRoleUser,ModelRoleUser>>(items: TypeModelMutateRelationData<EntityRoleUser,ModelRoleUser, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityRoleUser,ModelRoleUser, T, true>[]>;
      update<T extends IModelUpdateOptions<EntityRoleUser,ModelRoleUser>>(data: TypeModelMutateRelationData<EntityRoleUser,ModelRoleUser, T>, options?: T): Promise<TypeModelMutateRelationData<EntityRoleUser,ModelRoleUser, T>>;
      updateBulk<T extends IModelUpdateOptions<EntityRoleUser,ModelRoleUser>>(items: TypeModelMutateRelationData<EntityRoleUser,ModelRoleUser, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityRoleUser,ModelRoleUser, T>[]>;
      delete<T extends IModelDeleteOptions<EntityRoleUser,ModelRoleUser>>(where?: TypeModelWhere<EntityRoleUser>, options?: T): Promise<void>;
      deleteBulk<T extends IModelDeleteOptions<EntityRoleUser,ModelRoleUser>>(ids: TableIdentity[], options?: T): Promise<void>;
      mutate<T extends IModelMutateOptions<EntityRoleUser,ModelRoleUser>>(data?: TypeModelMutateRelationData<EntityRoleUser,ModelRoleUser, T>, options?: T): Promise<TypeModelMutateRelationData<EntityRoleUser,ModelRoleUser, T>>;
      mutateBulk<T extends IModelMutateOptions<EntityRoleUser,ModelRoleUser>>(items: TypeModelMutateRelationData<EntityRoleUser,ModelRoleUser, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityRoleUser,ModelRoleUser, T>[]>;
      count<T extends IModelSelectCountParams<EntityRoleUser,ModelRoleUser,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<string | undefined>;
      increment<T extends IModelIncrementParams<EntityRoleUser,ModelRoleUser,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      decrement<T extends IModelIncrementParams<EntityRoleUser,ModelRoleUser,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      aggregate<T extends IModelSelectAggrParams<EntityRoleUser,ModelRoleUser,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelAggrRelationResult<T>>;
      group<T extends IModelSelectGroupParams<EntityRoleUser,ModelRoleUser,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelGroupRelationResult<EntityRoleUser, T>[]>;
      getById<T extends IModelGetOptions<EntityRoleUser,ModelRoleUser>>(id: TableIdentity, options?: T): Promise<TypeModelRelationResult<EntityRoleUser, ModelRoleUser, T> | undefined>;
updateById<T extends IModelUpdateOptions<EntityRoleUser,ModelRoleUser>>(id: TableIdentity, data: TypeModelMutateRelationData<EntityRoleUser,ModelRoleUser, T>, options?: T): Promise<TypeModelMutateRelationData<EntityRoleUser,ModelRoleUser, T>>;
deleteById<T extends IModelDeleteOptions<EntityRoleUser,ModelRoleUser>>(id: TableIdentity, options?: T): Promise<void>;
    }
export interface ModelUser {
      [SymbolKeyEntity]: EntityUser;
      [SymbolKeyEntityMeta]: EntityUserMeta;
      [SymbolKeyModelOptions]: IModelOptionsUser;
      get<T extends IModelGetOptions<EntityUser,ModelUser>>(where: TypeModelWhere<EntityUser>, options?: T): Promise<TypeModelRelationResult<EntityUser, ModelUser, T> | undefined>;
      /**
       * Retrieves one matching primary row with a pessimistic FOR UPDATE lock.
       * Requires an active transaction. The lock is released when that transaction completes.
       * Entity and query caches are bypassed.
       */
      getForUpdate<T extends IModelGetOptions<EntityUser,ModelUser>>(where: TypeModelWhere<EntityUser>, options?: T): Promise<TypeModelRelationResult<EntityUser, ModelUser, T> | undefined>;
      /**
       * Retrieves a primary row by ID with the same pessimistic FOR UPDATE lock semantics.
       * Requires an active transaction. The lock is released when that transaction completes.
       * Entity and query caches are bypassed.
       */
      getByIdForUpdate<T extends IModelGetOptions<EntityUser,ModelUser>>(id: TableIdentity, options?: T): Promise<TypeModelRelationResult<EntityUser, ModelUser, T> | undefined>;
      mget<T extends IModelGetOptions<EntityUser,ModelUser>>(ids: TableIdentity[], options?: T): Promise<TypeModelRelationResult<EntityUser, ModelUser, T>[]>;
      selectAndCount<T extends IModelSelectParams<EntityUser,ModelUser,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelSelectAndCount<EntityUser, ModelUser, T>>;
      select<T extends IModelSelectParams<EntityUser,ModelUser,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelRelationResult<EntityUser, ModelUser, T>[]>;
      insert<T extends IModelInsertOptions<EntityUser,ModelUser>>(data?: TypeModelMutateRelationData<EntityUser,ModelUser, T>, options?: T): Promise<TypeModelMutateRelationData<EntityUser,ModelUser, T, true>>;
      insertBulk<T extends IModelInsertOptions<EntityUser,ModelUser>>(items: TypeModelMutateRelationData<EntityUser,ModelUser, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityUser,ModelUser, T, true>[]>;
      update<T extends IModelUpdateOptions<EntityUser,ModelUser>>(data: TypeModelMutateRelationData<EntityUser,ModelUser, T>, options?: T): Promise<TypeModelMutateRelationData<EntityUser,ModelUser, T>>;
      updateBulk<T extends IModelUpdateOptions<EntityUser,ModelUser>>(items: TypeModelMutateRelationData<EntityUser,ModelUser, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityUser,ModelUser, T>[]>;
      delete<T extends IModelDeleteOptions<EntityUser,ModelUser>>(where?: TypeModelWhere<EntityUser>, options?: T): Promise<void>;
      deleteBulk<T extends IModelDeleteOptions<EntityUser,ModelUser>>(ids: TableIdentity[], options?: T): Promise<void>;
      mutate<T extends IModelMutateOptions<EntityUser,ModelUser>>(data?: TypeModelMutateRelationData<EntityUser,ModelUser, T>, options?: T): Promise<TypeModelMutateRelationData<EntityUser,ModelUser, T>>;
      mutateBulk<T extends IModelMutateOptions<EntityUser,ModelUser>>(items: TypeModelMutateRelationData<EntityUser,ModelUser, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityUser,ModelUser, T>[]>;
      count<T extends IModelSelectCountParams<EntityUser,ModelUser,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<string | undefined>;
      increment<T extends IModelIncrementParams<EntityUser,ModelUser,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      decrement<T extends IModelIncrementParams<EntityUser,ModelUser,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      aggregate<T extends IModelSelectAggrParams<EntityUser,ModelUser,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelAggrRelationResult<T>>;
      group<T extends IModelSelectGroupParams<EntityUser,ModelUser,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelGroupRelationResult<EntityUser, T>[]>;
      getById<T extends IModelGetOptions<EntityUser,ModelUser>>(id: TableIdentity, options?: T): Promise<TypeModelRelationResult<EntityUser, ModelUser, T> | undefined>;
updateById<T extends IModelUpdateOptions<EntityUser,ModelUser>>(id: TableIdentity, data: TypeModelMutateRelationData<EntityUser,ModelUser, T>, options?: T): Promise<TypeModelMutateRelationData<EntityUser,ModelUser, T>>;
deleteById<T extends IModelDeleteOptions<EntityUser,ModelUser>>(id: TableIdentity, options?: T): Promise<void>;
getByName<T extends IModelGetOptions<EntityUser,ModelUser>>(name?: string, options?: T): Promise<TypeModelRelationResult<EntityUser, ModelUser, T> | undefined>;
getByNameEqI<T extends IModelGetOptions<EntityUser,ModelUser>>(name?: string, options?: T): Promise<TypeModelRelationResult<EntityUser, ModelUser, T> | undefined>;
selectByName<T extends IModelSelectParams<EntityUser,ModelUser,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(name?: string, params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelRelationResult<EntityUser, ModelUser, T>[]>;
selectByNameEqI<T extends IModelSelectParams<EntityUser,ModelUser,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(name?: string, params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelRelationResult<EntityUser, ModelUser, T>[]>;
    }
}
declare module 'vona-module-a-orm' {
  export interface IModelClassRecord {
    'home-user:role': ModelRole;
'home-user:roleUser': ModelRoleUser;
'home-user:user': ModelUser;
  }
}
/** model: end */
/** service: begin */
export * from '../service/account.ts';
export * from '../service/passportAdapter.ts';
export * from '../service/roleAdapter.ts';
export * from '../service/userAdapter.ts';

import 'vona-module-a-bean';
declare module 'vona-module-a-bean' {
  
    export interface IServiceRecord {
      'home-user:account': never;
'home-user:passportAdapter': never;
'home-user:roleAdapter': never;
'home-user:userAdapter': never;
    }

  
}
declare module 'vona-module-home-user' {
  
        export interface ServiceAccount {
          /** @internal */
          get scope(): ScopeModuleHomeUser;
        }

          export interface ServiceAccount {
            get $beanFullName(): 'home-user.service.account';
            get $onionName(): 'home-user:account';
          }

        export interface ServicePassportAdapter {
          /** @internal */
          get scope(): ScopeModuleHomeUser;
        }

          export interface ServicePassportAdapter {
            get $beanFullName(): 'home-user.service.passportAdapter';
            get $onionName(): 'home-user:passportAdapter';
          }

        export interface ServiceRoleAdapter {
          /** @internal */
          get scope(): ScopeModuleHomeUser;
        }

          export interface ServiceRoleAdapter {
            get $beanFullName(): 'home-user.service.roleAdapter';
            get $onionName(): 'home-user:roleAdapter';
          }

        export interface ServiceUserAdapter {
          /** @internal */
          get scope(): ScopeModuleHomeUser;
        }

          export interface ServiceUserAdapter {
            get $beanFullName(): 'home-user.service.userAdapter';
            get $onionName(): 'home-user:userAdapter';
          } 
}
/** service: end */
/** service: begin */
import type { ServiceAccount } from '../service/account.ts';
import type { ServicePassportAdapter } from '../service/passportAdapter.ts';
import type { ServiceRoleAdapter } from '../service/roleAdapter.ts';
import type { ServiceUserAdapter } from '../service/userAdapter.ts';
export interface IModuleService {
  'account': ServiceAccount;
'passportAdapter': ServicePassportAdapter;
'roleAdapter': ServiceRoleAdapter;
'userAdapter': ServiceUserAdapter;
}
/** service: end */
/** service: begin */

import 'vona';
declare module 'vona' {
  export interface IBeanRecordGeneral {
    'home-user.service.account': ServiceAccount;
'home-user.service.passportAdapter': ServicePassportAdapter;
'home-user.service.roleAdapter': ServiceRoleAdapter;
'home-user.service.userAdapter': ServiceUserAdapter;
  }
}
/** service: end */
/** cacheRedis: begin */
export * from '../bean/cacheRedis.activation.ts';
export * from '../bean/cacheRedis.activationCurrent.ts';
export * from '../bean/cacheRedis.passwordReset.ts';
export * from '../bean/cacheRedis.passwordResetCurrent.ts';
export * from '../bean/cacheRedis.passwordResetRecipient.ts';
export * from '../bean/cacheRedis.passwordSet.ts';
export * from '../bean/cacheRedis.passwordSetCurrent.ts';

import { type IDecoratorCacheRedisOptions } from 'vona-module-a-cache';
declare module 'vona-module-a-cache' {
  
    export interface ICacheRedisRecord {
      'home-user:activation': IDecoratorCacheRedisOptions;
'home-user:activationCurrent': IDecoratorCacheRedisOptions;
'home-user:passwordReset': IDecoratorCacheRedisOptions;
'home-user:passwordResetCurrent': IDecoratorCacheRedisOptions;
'home-user:passwordResetRecipient': IDecoratorCacheRedisOptions;
'home-user:passwordSet': IDecoratorCacheRedisOptions;
'home-user:passwordSetCurrent': IDecoratorCacheRedisOptions;
    }

  
}
declare module 'vona-module-home-user' {
  
        export interface CacheRedisActivation {
          /** @internal */
          get scope(): ScopeModuleHomeUser;
        }

          export interface CacheRedisActivation {
            get $beanFullName(): 'home-user.cacheRedis.activation';
            get $onionName(): 'home-user:activation';
            get $onionOptions(): IDecoratorCacheRedisOptions;
          }

        export interface CacheRedisActivationCurrent {
          /** @internal */
          get scope(): ScopeModuleHomeUser;
        }

          export interface CacheRedisActivationCurrent {
            get $beanFullName(): 'home-user.cacheRedis.activationCurrent';
            get $onionName(): 'home-user:activationCurrent';
            get $onionOptions(): IDecoratorCacheRedisOptions;
          }

        export interface CacheRedisPasswordReset {
          /** @internal */
          get scope(): ScopeModuleHomeUser;
        }

          export interface CacheRedisPasswordReset {
            get $beanFullName(): 'home-user.cacheRedis.passwordReset';
            get $onionName(): 'home-user:passwordReset';
            get $onionOptions(): IDecoratorCacheRedisOptions;
          }

        export interface CacheRedisPasswordResetCurrent {
          /** @internal */
          get scope(): ScopeModuleHomeUser;
        }

          export interface CacheRedisPasswordResetCurrent {
            get $beanFullName(): 'home-user.cacheRedis.passwordResetCurrent';
            get $onionName(): 'home-user:passwordResetCurrent';
            get $onionOptions(): IDecoratorCacheRedisOptions;
          }

        export interface CacheRedisPasswordResetRecipient {
          /** @internal */
          get scope(): ScopeModuleHomeUser;
        }

          export interface CacheRedisPasswordResetRecipient {
            get $beanFullName(): 'home-user.cacheRedis.passwordResetRecipient';
            get $onionName(): 'home-user:passwordResetRecipient';
            get $onionOptions(): IDecoratorCacheRedisOptions;
          }

        export interface CacheRedisPasswordSet {
          /** @internal */
          get scope(): ScopeModuleHomeUser;
        }

          export interface CacheRedisPasswordSet {
            get $beanFullName(): 'home-user.cacheRedis.passwordSet';
            get $onionName(): 'home-user:passwordSet';
            get $onionOptions(): IDecoratorCacheRedisOptions;
          }

        export interface CacheRedisPasswordSetCurrent {
          /** @internal */
          get scope(): ScopeModuleHomeUser;
        }

          export interface CacheRedisPasswordSetCurrent {
            get $beanFullName(): 'home-user.cacheRedis.passwordSetCurrent';
            get $onionName(): 'home-user:passwordSetCurrent';
            get $onionOptions(): IDecoratorCacheRedisOptions;
          } 
}
/** cacheRedis: end */
/** cacheRedis: begin */
import type { CacheRedisActivation } from '../bean/cacheRedis.activation.ts';
import type { CacheRedisActivationCurrent } from '../bean/cacheRedis.activationCurrent.ts';
import type { CacheRedisPasswordReset } from '../bean/cacheRedis.passwordReset.ts';
import type { CacheRedisPasswordResetCurrent } from '../bean/cacheRedis.passwordResetCurrent.ts';
import type { CacheRedisPasswordResetRecipient } from '../bean/cacheRedis.passwordResetRecipient.ts';
import type { CacheRedisPasswordSet } from '../bean/cacheRedis.passwordSet.ts';
import type { CacheRedisPasswordSetCurrent } from '../bean/cacheRedis.passwordSetCurrent.ts';
export interface IModuleCacheRedis {
  'activation': CacheRedisActivation;
'activationCurrent': CacheRedisActivationCurrent;
'passwordReset': CacheRedisPasswordReset;
'passwordResetCurrent': CacheRedisPasswordResetCurrent;
'passwordResetRecipient': CacheRedisPasswordResetRecipient;
'passwordSet': CacheRedisPasswordSet;
'passwordSetCurrent': CacheRedisPasswordSetCurrent;
}
/** cacheRedis: end */
/** eventListener: begin */
export * from '../bean/eventListener.activate.ts';

import { type IDecoratorEventListenerOptions } from 'vona-module-a-event';
declare module 'vona-module-a-event' {
  
    export interface IEventListenerRecord {
      'home-user:activate': IDecoratorEventListenerOptions;
    }

  
}
declare module 'vona-module-home-user' {
  
        export interface EventListenerActivate {
          /** @internal */
          get scope(): ScopeModuleHomeUser;
        }

          export interface EventListenerActivate {
            get $beanFullName(): 'home-user.eventListener.activate';
            get $onionName(): 'home-user:activate';
            get $onionOptions(): IDecoratorEventListenerOptions;
          } 
}
/** eventListener: end */
/** meta: begin */
export * from '../bean/meta.index.ts';
export * from '../bean/meta.redlock.ts';
export * from '../bean/meta.version.ts';
import type { IMetaOptionsIndex } from 'vona-module-a-index';
import 'vona-module-a-meta';
declare module 'vona-module-a-meta' {
  
    export interface IMetaRecord {
      'home-user:index': IMetaOptionsIndex;
'home-user:redlock': never;
'home-user:version': never;
    }

  
}
declare module 'vona-module-home-user' {
  
        export interface MetaIndex {
          /** @internal */
          get scope(): ScopeModuleHomeUser;
        }

          export interface MetaIndex {
            get $beanFullName(): 'home-user.meta.index';
            get $onionName(): 'home-user:index';
            get $onionOptions(): IMetaOptionsIndex;
          }

        export interface MetaRedlock {
          /** @internal */
          get scope(): ScopeModuleHomeUser;
        }

          export interface MetaRedlock {
            get $beanFullName(): 'home-user.meta.redlock';
            get $onionName(): 'home-user:redlock';
          }

        export interface MetaVersion {
          /** @internal */
          get scope(): ScopeModuleHomeUser;
        }

          export interface MetaVersion {
            get $beanFullName(): 'home-user.meta.version';
            get $onionName(): 'home-user:version';
          } 
}
/** meta: end */
/** meta redlock: begin */
import type { MetaRedlock } from '../bean/meta.redlock.ts';
/** meta redlock: end */
/** dto: begin */
export * from '../dto/accountActivation.ts';
export * from '../dto/accountCurrent.ts';
export * from '../dto/accountPasswordChange.ts';
export * from '../dto/accountPasswordReset.ts';
export * from '../dto/accountPasswordResetRequest.ts';
export * from '../dto/accountPasswordResetRequestResult.ts';
export * from '../dto/accountPasswordSet.ts';
export * from '../dto/accountPasswordSetIssue.ts';
export * from '../dto/accountProfileUpdate.ts';
export * from '../dto/accountRelogin.ts';
export * from '../dto/login.ts';
export * from '../dto/passport.ts';
export * from '../dto/passportJwt.ts';
export * from '../dto/passportUser.ts';
export * from '../dto/register.ts';
import type { IDtoOptionsAccountActivation } from '../dto/accountActivation.ts';
import type { IDtoOptionsAccountCurrent } from '../dto/accountCurrent.ts';
import type { IDtoOptionsAccountPasswordChange } from '../dto/accountPasswordChange.ts';
import type { IDtoOptionsAccountPasswordReset } from '../dto/accountPasswordReset.ts';
import type { IDtoOptionsAccountPasswordResetRequest } from '../dto/accountPasswordResetRequest.ts';
import type { IDtoOptionsAccountPasswordResetRequestResult } from '../dto/accountPasswordResetRequestResult.ts';
import type { IDtoOptionsAccountPasswordSet } from '../dto/accountPasswordSet.ts';
import type { IDtoOptionsAccountPasswordSetIssue } from '../dto/accountPasswordSetIssue.ts';
import type { IDtoOptionsAccountProfileUpdate } from '../dto/accountProfileUpdate.ts';
import type { IDtoOptionsAccountRelogin } from '../dto/accountRelogin.ts';
import type { IDtoOptionsLogin } from '../dto/login.ts';
import type { IDtoOptionsPassport } from '../dto/passport.ts';
import type { IDtoOptionsPassportJwt } from '../dto/passportJwt.ts';
import type { IDtoOptionsPassportUser } from '../dto/passportUser.ts';
import type { IDtoOptionsRegister } from '../dto/register.ts';
import 'vona-module-a-web';
declare module 'vona-module-a-web' {
  
    export interface IDtoRecord {
      'home-user:accountActivation': IDtoOptionsAccountActivation;
'home-user:accountCurrent': IDtoOptionsAccountCurrent;
'home-user:accountPasswordChange': IDtoOptionsAccountPasswordChange;
'home-user:accountPasswordReset': IDtoOptionsAccountPasswordReset;
'home-user:accountPasswordResetRequest': IDtoOptionsAccountPasswordResetRequest;
'home-user:accountPasswordResetRequestResult': IDtoOptionsAccountPasswordResetRequestResult;
'home-user:accountPasswordSet': IDtoOptionsAccountPasswordSet;
'home-user:accountPasswordSetIssue': IDtoOptionsAccountPasswordSetIssue;
'home-user:accountProfileUpdate': IDtoOptionsAccountProfileUpdate;
'home-user:accountRelogin': IDtoOptionsAccountRelogin;
'home-user:login': IDtoOptionsLogin;
'home-user:passport': IDtoOptionsPassport;
'home-user:passportJwt': IDtoOptionsPassportJwt;
'home-user:passportUser': IDtoOptionsPassportUser;
'home-user:register': IDtoOptionsRegister;
    }

  
}
declare module 'vona-module-home-user' {
   
}
/** dto: end */
/** dto: begin */
import type { DtoAccountActivation } from '../dto/accountActivation.ts';
import type { DtoAccountCurrent } from '../dto/accountCurrent.ts';
import type { DtoAccountPasswordChange } from '../dto/accountPasswordChange.ts';
import type { DtoAccountPasswordReset } from '../dto/accountPasswordReset.ts';
import type { DtoAccountPasswordResetRequest } from '../dto/accountPasswordResetRequest.ts';
import type { DtoAccountPasswordResetRequestResult } from '../dto/accountPasswordResetRequestResult.ts';
import type { DtoAccountPasswordSet } from '../dto/accountPasswordSet.ts';
import type { DtoAccountPasswordSetIssue } from '../dto/accountPasswordSetIssue.ts';
import type { DtoAccountProfileUpdate } from '../dto/accountProfileUpdate.ts';
import type { DtoAccountRelogin } from '../dto/accountRelogin.ts';
import type { DtoLogin } from '../dto/login.ts';
import type { DtoPassport } from '../dto/passport.ts';
import type { DtoPassportJwt } from '../dto/passportJwt.ts';
import type { DtoPassportUser } from '../dto/passportUser.ts';
import type { DtoRegister } from '../dto/register.ts';
declare module 'vona-module-home-user' {
  
    export interface IDtoOptionsAccountActivation {
      fields?: TypeEntityOptionsFields<DtoAccountActivation, IDtoOptionsAccountActivation[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsAccountCurrent {
      fields?: TypeEntityOptionsFields<DtoAccountCurrent, IDtoOptionsAccountCurrent[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsAccountPasswordChange {
      fields?: TypeEntityOptionsFields<DtoAccountPasswordChange, IDtoOptionsAccountPasswordChange[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsAccountPasswordReset {
      fields?: TypeEntityOptionsFields<DtoAccountPasswordReset, IDtoOptionsAccountPasswordReset[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsAccountPasswordResetRequest {
      fields?: TypeEntityOptionsFields<DtoAccountPasswordResetRequest, IDtoOptionsAccountPasswordResetRequest[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsAccountPasswordResetRequestResult {
      fields?: TypeEntityOptionsFields<DtoAccountPasswordResetRequestResult, IDtoOptionsAccountPasswordResetRequestResult[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsAccountPasswordSet {
      fields?: TypeEntityOptionsFields<DtoAccountPasswordSet, IDtoOptionsAccountPasswordSet[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsAccountPasswordSetIssue {
      fields?: TypeEntityOptionsFields<DtoAccountPasswordSetIssue, IDtoOptionsAccountPasswordSetIssue[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsAccountProfileUpdate {
      fields?: TypeEntityOptionsFields<DtoAccountProfileUpdate, IDtoOptionsAccountProfileUpdate[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsAccountRelogin {
      fields?: TypeEntityOptionsFields<DtoAccountRelogin, IDtoOptionsAccountRelogin[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsLogin {
      fields?: TypeEntityOptionsFields<DtoLogin, IDtoOptionsLogin[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsPassport {
      fields?: TypeEntityOptionsFields<DtoPassport, IDtoOptionsPassport[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsPassportJwt {
      fields?: TypeEntityOptionsFields<DtoPassportJwt, IDtoOptionsPassportJwt[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsPassportUser {
      fields?: TypeEntityOptionsFields<DtoPassportUser, IDtoOptionsPassportUser[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsRegister {
      fields?: TypeEntityOptionsFields<DtoRegister, IDtoOptionsRegister[TypeSymbolKeyFieldsMore]>;
    }
}
/** dto: end */
/** controller: begin */
export * from '../controller/account.ts';
export * from '../controller/passport.ts';
export * from '../controller/passportTest.ts';
import type { IControllerOptionsAccount } from '../controller/account.ts';
import type { IControllerOptionsPassport } from '../controller/passport.ts';
import type { IControllerOptionsPassportTest } from '../controller/passportTest.ts';
import 'vona-module-a-web';
declare module 'vona-module-a-web' {
  
    export interface IControllerRecord {
      'home-user:account': IControllerOptionsAccount;
'home-user:passport': IControllerOptionsPassport;
'home-user:passportTest': IControllerOptionsPassportTest;
    }

  
}
declare module 'vona-module-home-user' {
  
        export interface ControllerAccount {
          /** @internal */
          get scope(): ScopeModuleHomeUser;
        }

          export interface ControllerAccount {
            get $beanFullName(): 'home-user.controller.account';
            get $onionName(): 'home-user:account';
            get $onionOptions(): IControllerOptionsAccount;
          }

        export interface ControllerPassport {
          /** @internal */
          get scope(): ScopeModuleHomeUser;
        }

          export interface ControllerPassport {
            get $beanFullName(): 'home-user.controller.passport';
            get $onionName(): 'home-user:passport';
            get $onionOptions(): IControllerOptionsPassport;
          }

        export interface ControllerPassportTest {
          /** @internal */
          get scope(): ScopeModuleHomeUser;
        }

          export interface ControllerPassportTest {
            get $beanFullName(): 'home-user.controller.passportTest';
            get $onionName(): 'home-user:passportTest';
            get $onionOptions(): IControllerOptionsPassportTest;
          } 
}
/** controller: end */
/** controller: begin */
// @ts-ignore ignore
import type { ControllerAccount } from '../controller/account.ts';
// @ts-ignore ignore
import type { ControllerPassport } from '../controller/passport.ts';
// @ts-ignore ignore
import type { ControllerPassportTest } from '../controller/passportTest.ts';
declare module 'vona-module-home-user' {
  
    export interface IControllerOptionsAccount {
      actions?: TypeControllerOptionsActions<ControllerAccount>;
    }

    export interface IControllerOptionsPassport {
      actions?: TypeControllerOptionsActions<ControllerPassport>;
    }

    export interface IControllerOptionsPassportTest {
      actions?: TypeControllerOptionsActions<ControllerPassportTest>;
    }
}
declare module 'vona-module-a-web' {
  export interface IApiPathGetRecord{
        '/home/user/account/current': undefined;
'/home/user/passport/current': undefined;
'/home/user/passport/login/:module/:providerName/:clientName?': undefined;
'/home/user/passport/associate/:module/:providerName/:clientName?': undefined;
'/home/user/passport/migrate/:module/:providerName/:clientName?': undefined;
    }
export interface IApiPathPatchRecord{
        '/home/user/account/profile': undefined;
    }
export interface IApiPathPostRecord{
        '/home/user/account/activation/consume': undefined;
'/home/user/account/password/change': undefined;
'/home/user/account/password-set/issue': undefined;
'/home/user/account/password-set/consume': undefined;
'/home/user/account/password-reset/request': undefined;
'/home/user/account/password-reset/consume': undefined;
'/home/user/passport/logout': undefined;
'/home/user/passport/register': undefined;
'/home/user/passport/login': undefined;
'/home/user/passport/refreshAuthToken': undefined;
'/home/user/passport/createPassportJwtFromOauthCode': undefined;
'/home/user/passport/createTempAuthToken': undefined;
'/home/user/passportTest/activateCurrent': undefined;
    }

}

/** controller: end */
/** zodRefine: begin */
export * from '../bean/zodRefine.emailUnique.ts';
export * from '../bean/zodRefine.passwordConfirm.ts';
export * from '../bean/zodRefine.usernameUnique.ts';
import type { IZodRefineOptionsEmailUnique } from '../bean/zodRefine.emailUnique.ts';
import type { IZodRefineOptionsPasswordConfirm } from '../bean/zodRefine.passwordConfirm.ts';
import type { IZodRefineOptionsUsernameUnique } from '../bean/zodRefine.usernameUnique.ts';
import 'vona-module-a-zod';
declare module 'vona-module-a-zod' {
  
    export interface IZodRefineRecord {
      'home-user:emailUnique': IZodRefineOptionsEmailUnique;
'home-user:passwordConfirm': IZodRefineOptionsPasswordConfirm;
'home-user:usernameUnique': IZodRefineOptionsUsernameUnique;
    }

  
}
declare module 'vona-module-home-user' {
  
        export interface ZodRefineEmailUnique {
          /** @internal */
          get scope(): ScopeModuleHomeUser;
        }

          export interface ZodRefineEmailUnique {
            get $beanFullName(): 'home-user.zodRefine.emailUnique';
            get $onionName(): 'home-user:emailUnique';
            get $onionOptions(): IZodRefineOptionsEmailUnique;
          }

        export interface ZodRefinePasswordConfirm {
          /** @internal */
          get scope(): ScopeModuleHomeUser;
        }

          export interface ZodRefinePasswordConfirm {
            get $beanFullName(): 'home-user.zodRefine.passwordConfirm';
            get $onionName(): 'home-user:passwordConfirm';
            get $onionOptions(): IZodRefineOptionsPasswordConfirm;
          }

        export interface ZodRefineUsernameUnique {
          /** @internal */
          get scope(): ScopeModuleHomeUser;
        }

          export interface ZodRefineUsernameUnique {
            get $beanFullName(): 'home-user.zodRefine.usernameUnique';
            get $onionName(): 'home-user:usernameUnique';
            get $onionOptions(): IZodRefineOptionsUsernameUnique;
          } 
}
/** zodRefine: end */
/** imageScene: begin */
export * from '../bean/imageScene.homeUserAvatar.ts';

import { type IDecoratorImageSceneOptions } from 'vona-module-a-image';
declare module 'vona-module-a-image' {
  
    export interface IImageSceneRecord {
      'home-user:homeUserAvatar': IDecoratorImageSceneOptions;
    }

  
}
declare module 'vona-module-home-user' {
  
        export interface ImageSceneHomeUserAvatar {
          /** @internal */
          get scope(): ScopeModuleHomeUser;
        }

          export interface ImageSceneHomeUserAvatar {
            get $beanFullName(): 'home-user.imageScene.homeUserAvatar';
            get $onionName(): 'home-user:homeUserAvatar';
            get $onionOptions(): IDecoratorImageSceneOptions;
          } 
}
/** imageScene: end */
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
export class ScopeModuleHomeUser extends BeanScopeBase {}

export interface ScopeModuleHomeUser {
  util: BeanScopeUtil;
config: TypeModuleConfig<typeof config>;
locale: TypeModuleLocales<(typeof locales)[TypeLocaleBase]>;
entity: IModuleEntity;
model: IModuleModel;
service: IModuleService;
cacheRedis: IModuleCacheRedis;
redlock: MetaRedlock;
}

import 'vona';
declare module 'vona' {
  export interface IBeanScopeRecord {
    'home-user': ScopeModuleHomeUser;
  }

  export interface IBeanScopeContainer {
    homeUser: ScopeModuleHomeUser;
  }
  
  export interface IBeanScopeConfig {
    'home-user': ReturnType<typeof config>;
  }

  export interface IBeanScopeLocale {
    'home-user': (typeof locales)[TypeLocaleBase];
  }

  
}
/** scope: end */
