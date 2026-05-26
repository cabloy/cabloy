// eslint-disable
import type { TypeEntityMeta,TypeModelsClassLikeGeneral,TypeSymbolKeyFieldsMore,IModelRelationBelongsTo } from 'vona-module-a-orm';
import type { TypeEntityOptionsFields,TypeControllerOptionsActions } from 'vona-module-a-openapi';
import type { TableIdentity } from 'table-identity';
/** entity: begin */
export * from '../entity/auth.ts';
export * from '../entity/authProvider.ts';
import type { IEntityOptionsAuth } from '../entity/auth.ts';
import type { IEntityOptionsAuthProvider } from '../entity/authProvider.ts';
import 'vona-module-a-orm';
declare module 'vona-module-a-orm' {
  
    export interface IEntityRecord {
      'a-auth:auth': IEntityOptionsAuth;
'a-auth:authProvider': IEntityOptionsAuthProvider;
    }

  
}
declare module 'vona-module-a-auth' {
   
}
/** entity: end */
/** entity: begin */
import type { EntityAuth } from '../entity/auth.ts';
import type { EntityAuthProvider } from '../entity/authProvider.ts';
export interface IModuleEntity {
  'auth': EntityAuthMeta;
'authProvider': EntityAuthProviderMeta;
}
/** entity: end */
/** entity: begin */
export type EntityAuthTableName = 'aAuth';
export type EntityAuthProviderTableName = 'aAuthProvider';
export type EntityAuthMeta=TypeEntityMeta<EntityAuth,EntityAuthTableName>;
export type EntityAuthProviderMeta=TypeEntityMeta<EntityAuthProvider,EntityAuthProviderTableName>;
declare module 'vona-module-a-orm' {
  export interface ITableRecord {
    'aAuth': EntityAuthMeta;
'aAuthProvider': EntityAuthProviderMeta;
  }
}
declare module 'vona-module-a-auth' {
  
    export interface IEntityOptionsAuth {
      fields?: TypeEntityOptionsFields<EntityAuth, IEntityOptionsAuth[TypeSymbolKeyFieldsMore]>;
    }

    export interface IEntityOptionsAuthProvider {
      fields?: TypeEntityOptionsFields<EntityAuthProvider, IEntityOptionsAuthProvider[TypeSymbolKeyFieldsMore]>;
    }
}
/** entity: end */
/** model: begin */
export * from '../model/auth.ts';
export * from '../model/authProvider.ts';
import type { IModelOptionsAuth } from '../model/auth.ts';
import type { IModelOptionsAuthProvider } from '../model/authProvider.ts';
import 'vona-module-a-orm';
declare module 'vona-module-a-orm' {
  
    export interface IModelRecord {
      'a-auth:auth': IModelOptionsAuth;
'a-auth:authProvider': IModelOptionsAuthProvider;
    }

  
}
declare module 'vona-module-a-auth' {
  
        export interface ModelAuth {
          /** @internal */
          get scope(): ScopeModuleAAuth;
        }

          export interface ModelAuth {
            get $beanFullName(): 'a-auth.model.auth';
            get $onionName(): 'a-auth:auth';
            get $onionOptions(): IModelOptionsAuth;
          }

        export interface ModelAuthProvider {
          /** @internal */
          get scope(): ScopeModuleAAuth;
        }

          export interface ModelAuthProvider {
            get $beanFullName(): 'a-auth.model.authProvider';
            get $onionName(): 'a-auth:authProvider';
            get $onionOptions(): IModelOptionsAuthProvider;
          } 
}
/** model: end */
/** model: begin */
import type { ModelAuth } from '../model/auth.ts';
import type { ModelAuthProvider } from '../model/authProvider.ts';
export interface IModuleModel {
  'auth': ModelAuth;
'authProvider': ModelAuthProvider;
}
/** model: end */
/** model: begin */

import 'vona';
declare module 'vona' {
  export interface IBeanRecordGeneral {
    'a-auth.model.auth': ModelAuth;
'a-auth.model.authProvider': ModelAuthProvider;
  }
}
/** model: end */
/** model: begin */
import type { IModelGetOptions, IModelMethodOptions, IModelSelectParams, TypeModelSelectAndCount, TypeModelRelationResult, TypeModelWhere, IModelInsertOptions, TypeModelMutateRelationData, IModelDeleteOptions, IModelUpdateOptions, IModelMutateOptions, IModelSelectCountParams, IModelIncrementParams, IModelSelectAggrParams, TypeModelAggrRelationResult, IModelSelectGroupParams, TypeModelGroupRelationResult } from 'vona-module-a-orm';
import { SymbolKeyEntity, SymbolKeyEntityMeta, SymbolKeyModelOptions } from 'vona-module-a-orm';
declare module 'vona-module-a-auth' {
  export interface IModelOptionsAuth {
        relations: {
          authProvider: IModelRelationBelongsTo<ModelAuth, ModelAuthProvider, false, 'id'|'providerName'|'clientName'>;
        };
      }
  export interface ModelAuth {
      [SymbolKeyEntity]: EntityAuth;
      [SymbolKeyEntityMeta]: EntityAuthMeta;
      [SymbolKeyModelOptions]: IModelOptionsAuth;
      get<T extends IModelGetOptions<EntityAuth,ModelAuth>>(where: TypeModelWhere<EntityAuth>, options?: T): Promise<TypeModelRelationResult<EntityAuth, ModelAuth, T> | undefined>;
      mget<T extends IModelGetOptions<EntityAuth,ModelAuth>>(ids: TableIdentity[], options?: T): Promise<TypeModelRelationResult<EntityAuth, ModelAuth, T>[]>;
      selectAndCount<T extends IModelSelectParams<EntityAuth,ModelAuth,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelSelectAndCount<EntityAuth, ModelAuth, T>>;
      select<T extends IModelSelectParams<EntityAuth,ModelAuth,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelRelationResult<EntityAuth, ModelAuth, T>[]>;
      insert<T extends IModelInsertOptions<EntityAuth,ModelAuth>>(data?: TypeModelMutateRelationData<EntityAuth,ModelAuth, T>, options?: T): Promise<TypeModelMutateRelationData<EntityAuth,ModelAuth, T, true>>;
      insertBulk<T extends IModelInsertOptions<EntityAuth,ModelAuth>>(items: TypeModelMutateRelationData<EntityAuth,ModelAuth, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityAuth,ModelAuth, T, true>[]>;
      update<T extends IModelUpdateOptions<EntityAuth,ModelAuth>>(data: TypeModelMutateRelationData<EntityAuth,ModelAuth, T>, options?: T): Promise<TypeModelMutateRelationData<EntityAuth,ModelAuth, T>>;
      updateBulk<T extends IModelUpdateOptions<EntityAuth,ModelAuth>>(items: TypeModelMutateRelationData<EntityAuth,ModelAuth, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityAuth,ModelAuth, T>[]>;
      delete<T extends IModelDeleteOptions<EntityAuth,ModelAuth>>(where?: TypeModelWhere<EntityAuth>, options?: T): Promise<void>;
      deleteBulk<T extends IModelDeleteOptions<EntityAuth,ModelAuth>>(ids: TableIdentity[], options?: T): Promise<void>;
      mutate<T extends IModelMutateOptions<EntityAuth,ModelAuth>>(data?: TypeModelMutateRelationData<EntityAuth,ModelAuth, T>, options?: T): Promise<TypeModelMutateRelationData<EntityAuth,ModelAuth, T>>;
      mutateBulk<T extends IModelMutateOptions<EntityAuth,ModelAuth>>(items: TypeModelMutateRelationData<EntityAuth,ModelAuth, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityAuth,ModelAuth, T>[]>;
      count<T extends IModelSelectCountParams<EntityAuth,ModelAuth,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<string | undefined>;
      increment<T extends IModelIncrementParams<EntityAuth,ModelAuth,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      decrement<T extends IModelIncrementParams<EntityAuth,ModelAuth,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      aggregate<T extends IModelSelectAggrParams<EntityAuth,ModelAuth,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelAggrRelationResult<T>>;
      group<T extends IModelSelectGroupParams<EntityAuth,ModelAuth,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelGroupRelationResult<EntityAuth, T>[]>;
      getById<T extends IModelGetOptions<EntityAuth,ModelAuth>>(id: TableIdentity, options?: T): Promise<TypeModelRelationResult<EntityAuth, ModelAuth, T> | undefined>;
updateById<T extends IModelUpdateOptions<EntityAuth,ModelAuth>>(id: TableIdentity, data: TypeModelMutateRelationData<EntityAuth,ModelAuth, T>, options?: T): Promise<TypeModelMutateRelationData<EntityAuth,ModelAuth, T>>;
deleteById<T extends IModelDeleteOptions<EntityAuth,ModelAuth>>(id: TableIdentity, options?: T): Promise<void>;
    }
export interface ModelAuthProvider {
      [SymbolKeyEntity]: EntityAuthProvider;
      [SymbolKeyEntityMeta]: EntityAuthProviderMeta;
      [SymbolKeyModelOptions]: IModelOptionsAuthProvider;
      get<T extends IModelGetOptions<EntityAuthProvider,ModelAuthProvider>>(where: TypeModelWhere<EntityAuthProvider>, options?: T): Promise<TypeModelRelationResult<EntityAuthProvider, ModelAuthProvider, T> | undefined>;
      mget<T extends IModelGetOptions<EntityAuthProvider,ModelAuthProvider>>(ids: TableIdentity[], options?: T): Promise<TypeModelRelationResult<EntityAuthProvider, ModelAuthProvider, T>[]>;
      selectAndCount<T extends IModelSelectParams<EntityAuthProvider,ModelAuthProvider,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelSelectAndCount<EntityAuthProvider, ModelAuthProvider, T>>;
      select<T extends IModelSelectParams<EntityAuthProvider,ModelAuthProvider,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelRelationResult<EntityAuthProvider, ModelAuthProvider, T>[]>;
      insert<T extends IModelInsertOptions<EntityAuthProvider,ModelAuthProvider>>(data?: TypeModelMutateRelationData<EntityAuthProvider,ModelAuthProvider, T>, options?: T): Promise<TypeModelMutateRelationData<EntityAuthProvider,ModelAuthProvider, T, true>>;
      insertBulk<T extends IModelInsertOptions<EntityAuthProvider,ModelAuthProvider>>(items: TypeModelMutateRelationData<EntityAuthProvider,ModelAuthProvider, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityAuthProvider,ModelAuthProvider, T, true>[]>;
      update<T extends IModelUpdateOptions<EntityAuthProvider,ModelAuthProvider>>(data: TypeModelMutateRelationData<EntityAuthProvider,ModelAuthProvider, T>, options?: T): Promise<TypeModelMutateRelationData<EntityAuthProvider,ModelAuthProvider, T>>;
      updateBulk<T extends IModelUpdateOptions<EntityAuthProvider,ModelAuthProvider>>(items: TypeModelMutateRelationData<EntityAuthProvider,ModelAuthProvider, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityAuthProvider,ModelAuthProvider, T>[]>;
      delete<T extends IModelDeleteOptions<EntityAuthProvider,ModelAuthProvider>>(where?: TypeModelWhere<EntityAuthProvider>, options?: T): Promise<void>;
      deleteBulk<T extends IModelDeleteOptions<EntityAuthProvider,ModelAuthProvider>>(ids: TableIdentity[], options?: T): Promise<void>;
      mutate<T extends IModelMutateOptions<EntityAuthProvider,ModelAuthProvider>>(data?: TypeModelMutateRelationData<EntityAuthProvider,ModelAuthProvider, T>, options?: T): Promise<TypeModelMutateRelationData<EntityAuthProvider,ModelAuthProvider, T>>;
      mutateBulk<T extends IModelMutateOptions<EntityAuthProvider,ModelAuthProvider>>(items: TypeModelMutateRelationData<EntityAuthProvider,ModelAuthProvider, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityAuthProvider,ModelAuthProvider, T>[]>;
      count<T extends IModelSelectCountParams<EntityAuthProvider,ModelAuthProvider,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<string | undefined>;
      increment<T extends IModelIncrementParams<EntityAuthProvider,ModelAuthProvider,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      decrement<T extends IModelIncrementParams<EntityAuthProvider,ModelAuthProvider,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      aggregate<T extends IModelSelectAggrParams<EntityAuthProvider,ModelAuthProvider,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelAggrRelationResult<T>>;
      group<T extends IModelSelectGroupParams<EntityAuthProvider,ModelAuthProvider,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelGroupRelationResult<EntityAuthProvider, T>[]>;
      getById<T extends IModelGetOptions<EntityAuthProvider,ModelAuthProvider>>(id: number, options?: T): Promise<TypeModelRelationResult<EntityAuthProvider, ModelAuthProvider, T> | undefined>;
updateById<T extends IModelUpdateOptions<EntityAuthProvider,ModelAuthProvider>>(id: number, data: TypeModelMutateRelationData<EntityAuthProvider,ModelAuthProvider, T>, options?: T): Promise<TypeModelMutateRelationData<EntityAuthProvider,ModelAuthProvider, T>>;
deleteById<T extends IModelDeleteOptions<EntityAuthProvider,ModelAuthProvider>>(id: number, options?: T): Promise<void>;
getByDisabled<T extends IModelGetOptions<EntityAuthProvider,ModelAuthProvider>>(disabled?: boolean, options?: T): Promise<TypeModelRelationResult<EntityAuthProvider, ModelAuthProvider, T> | undefined>;
selectByDisabled<T extends IModelSelectParams<EntityAuthProvider,ModelAuthProvider,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(disabled?: boolean, params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelRelationResult<EntityAuthProvider, ModelAuthProvider, T>[]>;
    }
}
declare module 'vona-module-a-orm' {
  export interface IModelClassRecord {
    'a-auth:auth': ModelAuth;
'a-auth:authProvider': ModelAuthProvider;
  }
}
/** model: end */
/** bean: begin */
export * from '../bean/bean.auth.ts';
export * from '../bean/bean.authProvider.ts';

import 'vona';
declare module 'vona' {
  
  
}
declare module 'vona-module-a-auth' {
  
        export interface BeanAuth {
          /** @internal */
          get scope(): ScopeModuleAAuth;
        }

        export interface BeanAuthProvider {
          /** @internal */
          get scope(): ScopeModuleAAuth;
        } 
}
/** bean: end */
/** bean: begin */
import type { BeanAuth } from '../bean/bean.auth.ts';
import type { BeanAuthProvider } from '../bean/bean.authProvider.ts';
import 'vona';  
declare module 'vona' {
  export interface IBeanRecordGlobal {
    'auth': BeanAuth;
'authProvider': BeanAuthProvider;
  }
}
/** bean: end */
/** service: begin */
export * from '../service/auth.ts';

import 'vona-module-a-bean';
declare module 'vona-module-a-bean' {
  
    export interface IServiceRecord {
      'a-auth:auth': never;
    }

  
}
declare module 'vona-module-a-auth' {
  
        export interface ServiceAuth {
          /** @internal */
          get scope(): ScopeModuleAAuth;
        }

          export interface ServiceAuth {
            get $beanFullName(): 'a-auth.service.auth';
            get $onionName(): 'a-auth:auth';
            
          } 
}
/** service: end */
/** service: begin */
import type { ServiceAuth } from '../service/auth.ts';
export interface IModuleService {
  'auth': ServiceAuth;
}
/** service: end */
/** service: begin */

import 'vona';
declare module 'vona' {
  export interface IBeanRecordGeneral {
    'a-auth.service.auth': ServiceAuth;
  }
}
/** service: end */
/** event: begin */
export * from '../bean/event.accountMigration.ts';
export * from '../bean/event.issuePassport.ts';

import 'vona';
declare module 'vona' {
  
  
}
declare module 'vona-module-a-auth' {
  
        export interface EventAccountMigration {
          /** @internal */
          get scope(): ScopeModuleAAuth;
        }

          export interface EventAccountMigration {
            get $beanFullName(): 'a-auth.event.accountMigration';
            get $onionName(): 'a-auth:accountMigration';
            
          }

        export interface EventIssuePassport {
          /** @internal */
          get scope(): ScopeModuleAAuth;
        }

          export interface EventIssuePassport {
            get $beanFullName(): 'a-auth.event.issuePassport';
            get $onionName(): 'a-auth:issuePassport';
            
          } 
}
/** event: end */
/** event: begin */
import type { EventAccountMigration } from '../bean/event.accountMigration.ts';
import type { EventIssuePassport } from '../bean/event.issuePassport.ts';
export interface IModuleEvent {
  'accountMigration': EventAccountMigration;
'issuePassport': EventIssuePassport;
}
/** event: end */
/** event: begin */
import type { TypeEventAccountMigrationData, TypeEventAccountMigrationResult } from '../bean/event.accountMigration.ts';
import type { TypeEventIssuePassportData, TypeEventIssuePassportResult } from '../bean/event.issuePassport.ts';
import type { EventOn } from 'vona-module-a-event'; 
declare module 'vona-module-a-event' {
  export interface IEventRecord {
    'a-auth:accountMigration': EventOn<TypeEventAccountMigrationData, TypeEventAccountMigrationResult>;
'a-auth:issuePassport': EventOn<TypeEventIssuePassportData, TypeEventIssuePassportResult>;
  }
}
/** event: end */
/** meta: begin */
export * from '../bean/meta.printTip.ts';
export * from '../bean/meta.redlock.ts';
export * from '../bean/meta.version.ts';

import 'vona-module-a-meta';
declare module 'vona-module-a-meta' {
  
    export interface IMetaRecord {
      'a-auth:printTip': never;
'a-auth:redlock': never;
'a-auth:version': never;
    }

  
}
declare module 'vona-module-a-auth' {
  
        export interface MetaPrintTip {
          /** @internal */
          get scope(): ScopeModuleAAuth;
        }

          export interface MetaPrintTip {
            get $beanFullName(): 'a-auth.meta.printTip';
            get $onionName(): 'a-auth:printTip';
            
          }

        export interface MetaRedlock {
          /** @internal */
          get scope(): ScopeModuleAAuth;
        }

          export interface MetaRedlock {
            get $beanFullName(): 'a-auth.meta.redlock';
            get $onionName(): 'a-auth:redlock';
            
          }

        export interface MetaVersion {
          /** @internal */
          get scope(): ScopeModuleAAuth;
        }

          export interface MetaVersion {
            get $beanFullName(): 'a-auth.meta.version';
            get $onionName(): 'a-auth:version';
            
          } 
}
/** meta: end */
/** meta redlock: begin */
import type { MetaRedlock } from '../bean/meta.redlock.ts';
/** meta redlock: end */
/** dto: begin */
export * from '../dto/auth.ts';
import type { IDtoOptionsAuth } from '../dto/auth.ts';
import 'vona-module-a-web';
declare module 'vona-module-a-web' {
  
    export interface IDtoRecord {
      'a-auth:auth': IDtoOptionsAuth;
    }

  
}
declare module 'vona-module-a-auth' {
   
}
/** dto: end */
/** dto: begin */
import type { DtoAuth } from '../dto/auth.ts';
declare module 'vona-module-a-auth' {
  
    export interface IDtoOptionsAuth {
      fields?: TypeEntityOptionsFields<DtoAuth, IDtoOptionsAuth[TypeSymbolKeyFieldsMore]>;
    }
}
/** dto: end */
/** controller: begin */
export * from '../controller/mock.ts';
export * from '../controller/passport.ts';
import type { IControllerOptionsMock } from '../controller/mock.ts';
import type { IControllerOptionsPassport } from '../controller/passport.ts';
import 'vona-module-a-web';
declare module 'vona-module-a-web' {
  
    export interface IControllerRecord {
      'a-auth:mock': IControllerOptionsMock;
'a-auth:passport': IControllerOptionsPassport;
    }

  
}
declare module 'vona-module-a-auth' {
  
        export interface ControllerMock {
          /** @internal */
          get scope(): ScopeModuleAAuth;
        }

          export interface ControllerMock {
            get $beanFullName(): 'a-auth.controller.mock';
            get $onionName(): 'a-auth:mock';
            get $onionOptions(): IControllerOptionsMock;
          }

        export interface ControllerPassport {
          /** @internal */
          get scope(): ScopeModuleAAuth;
        }

          export interface ControllerPassport {
            get $beanFullName(): 'a-auth.controller.passport';
            get $onionName(): 'a-auth:passport';
            get $onionOptions(): IControllerOptionsPassport;
          } 
}
/** controller: end */
/** controller: begin */
// @ts-ignore ignore
import type { ControllerMock } from '../controller/mock.ts';
// @ts-ignore ignore
import type { ControllerPassport } from '../controller/passport.ts';
declare module 'vona-module-a-auth' {
  
    export interface IControllerOptionsMock {
      actions?: TypeControllerOptionsActions<ControllerMock>;
    }

    export interface IControllerOptionsPassport {
      actions?: TypeControllerOptionsActions<ControllerPassport>;
    }
}
declare module 'vona-module-a-web' {
  export interface IApiPathGetRecord{
        '/auth/mock/authorize': undefined;
'/auth/passport/callback': undefined;
    }
export interface IApiPathPostRecord{
        '/auth/mock/authorize': undefined;
    }

}

/** controller: end */
/** config: begin */
export * from '../config/config.ts';
import type { config } from '../config/config.ts';
/** config: end */
/** locale: begin */
import { locales } from './locales.ts';
/** locale: end */
/** error: begin */
export * from '../config/errors.ts';
import type { errors } from '../config/errors.ts';
/** error: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil, type TypeModuleConfig, type TypeModuleErrors, type TypeModuleLocales, type TypeLocaleBase } from 'vona';
import { Scope } from 'vona-module-a-bean';

@Scope()
export class ScopeModuleAAuth extends BeanScopeBase {}

export interface ScopeModuleAAuth {
  util: BeanScopeUtil;
config: TypeModuleConfig<typeof config>;
error: TypeModuleErrors<typeof errors>;
locale: TypeModuleLocales<(typeof locales)[TypeLocaleBase]>;
entity: IModuleEntity;
model: IModuleModel;
service: IModuleService;
event: IModuleEvent;
redlock: MetaRedlock;
}

import 'vona';
declare module 'vona' {
  export interface IBeanScopeRecord {
    'a-auth': ScopeModuleAAuth;
  }

  export interface IBeanScopeContainer {
    auth: ScopeModuleAAuth;
  }
  
  export interface IBeanScopeConfig {
    'a-auth': ReturnType<typeof config>;
  }

  export interface IBeanScopeLocale {
    'a-auth': (typeof locales)[TypeLocaleBase];
  }

  export interface IBeanScopeErrors {
    'a-auth': typeof errors;
  }
}
/** scope: end */
