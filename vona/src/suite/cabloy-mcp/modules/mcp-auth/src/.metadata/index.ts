// eslint-disable
import type { TypeEntityMeta,TypeModelsClassLikeGeneral,TypeSymbolKeyFieldsMore } from 'vona-module-a-orm';
import type { TypeEntityOptionsFields,TypeControllerOptionsActions } from 'vona-module-a-openapi';
import type { TableIdentity } from 'table-identity';
/** entity: begin */
export * from '../entity/authorization.tsx';
import type { IEntityOptionsAuthorization } from '../entity/authorization.tsx';
import 'vona-module-a-orm';
declare module 'vona-module-a-orm' {

    export interface IEntityRecord {
      'mcp-auth:authorization': IEntityOptionsAuthorization;
    }


}
declare module 'vona-module-mcp-auth' {

}
/** entity: end */
/** entity: begin */
import type { EntityAuthorization } from '../entity/authorization.tsx';
export interface IModuleEntity {
  'authorization': EntityAuthorizationMeta;
}
/** entity: end */
/** entity: begin */
export type EntityAuthorizationTableName = 'mcpAuthAuthorization';
export type EntityAuthorizationMeta=TypeEntityMeta<EntityAuthorization,EntityAuthorizationTableName>;
declare module 'vona-module-a-orm' {
  export interface ITableRecord {
    'mcpAuthAuthorization': EntityAuthorizationMeta;
  }
}
declare module 'vona-module-mcp-auth' {

    export interface IEntityOptionsAuthorization {
      fields?: TypeEntityOptionsFields<EntityAuthorization, IEntityOptionsAuthorization[TypeSymbolKeyFieldsMore]>;
    }
}
/** entity: end */
/** model: begin */
export * from '../model/authorization.ts';
import type { IModelOptionsAuthorization } from '../model/authorization.ts';
import 'vona-module-a-orm';
declare module 'vona-module-a-orm' {

    export interface IModelRecord {
      'mcp-auth:authorization': IModelOptionsAuthorization;
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
}
/** model: end */
/** model: begin */
import type { ModelAuthorization } from '../model/authorization.ts';
export interface IModuleModel {
  'authorization': ModelAuthorization;
}
/** model: end */
/** model: begin */

import 'vona';
declare module 'vona' {
  export interface IBeanRecordGeneral {
    'mcp-auth.model.authorization': ModelAuthorization;
  }
}
/** model: end */
/** model: begin */
import type { IModelGetOptions, IModelMethodOptions, IModelSelectParams, TypeModelSelectAndCount, TypeModelRelationResult, TypeModelWhere, IModelInsertOptions, TypeModelMutateRelationData, IModelDeleteOptions, IModelUpdateOptions, IModelMutateOptions, IModelSelectCountParams, IModelIncrementParams, IModelSelectAggrParams, TypeModelAggrRelationResult, IModelSelectGroupParams, TypeModelGroupRelationResult } from 'vona-module-a-orm';
import { SymbolKeyEntity, SymbolKeyEntityMeta, SymbolKeyModelOptions } from 'vona-module-a-orm';
declare module 'vona-module-mcp-auth' {

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
    }
}
declare module 'vona-module-a-orm' {
  export interface IModelClassRecord {
    'mcp-auth:authorization': ModelAuthorization;
  }
}
/** model: end */
/** dto: begin */
export * from '../dto/authorizationDecision.ts';
export * from '../dto/authorizationRedirect.ts';
export * from '../dto/authorizationSummary.ts';
import type { IDtoOptionsAuthorizationDecision } from '../dto/authorizationDecision.ts';
import type { IDtoOptionsAuthorizationRedirect } from '../dto/authorizationRedirect.ts';
import type { IDtoOptionsAuthorizationSummary } from '../dto/authorizationSummary.ts';
import 'vona-module-a-web';
declare module 'vona-module-a-web' {

    export interface IDtoRecord {
      'mcp-auth:authorizationDecision': IDtoOptionsAuthorizationDecision;
'mcp-auth:authorizationRedirect': IDtoOptionsAuthorizationRedirect;
'mcp-auth:authorizationSummary': IDtoOptionsAuthorizationSummary;
    }


}
declare module 'vona-module-mcp-auth' {

}
/** dto: end */
/** dto: begin */
import type { DtoAuthorizationDecision } from '../dto/authorizationDecision.ts';
import type { DtoAuthorizationRedirect } from '../dto/authorizationRedirect.ts';
import type { DtoAuthorizationSummary } from '../dto/authorizationSummary.ts';
declare module 'vona-module-mcp-auth' {

    export interface IDtoOptionsAuthorizationDecision {
      fields?: TypeEntityOptionsFields<DtoAuthorizationDecision, IDtoOptionsAuthorizationDecision[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsAuthorizationRedirect {
      fields?: TypeEntityOptionsFields<DtoAuthorizationRedirect, IDtoOptionsAuthorizationRedirect[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsAuthorizationSummary {
      fields?: TypeEntityOptionsFields<DtoAuthorizationSummary, IDtoOptionsAuthorizationSummary[TypeSymbolKeyFieldsMore]>;
    }
}
/** dto: end */
/** controller: begin */
export * from '../controller/authorization.ts';
import type { IControllerOptionsAuthorization } from '../controller/authorization.ts';
import 'vona-module-a-web';
declare module 'vona-module-a-web' {

    export interface IControllerRecord {
      'mcp-auth:authorization': IControllerOptionsAuthorization;
    }


}
declare module 'vona-module-mcp-auth' {

        export interface ControllerAuthorization {
          /** @internal */
          get scope(): ScopeModuleMcpAuth;
        }

          export interface ControllerAuthorization {
            get $beanFullName(): 'mcp-auth.controller.authorization';
            get $onionName(): 'mcp-auth:authorization';
            get $onionOptions(): IControllerOptionsAuthorization;
          }
}
/** controller: end */
/** controller: begin */
// @ts-ignore ignore
import type { ControllerAuthorization } from '../controller/authorization.ts';
declare module 'vona-module-mcp-auth' {

    export interface IControllerOptionsAuthorization {
      actions?: TypeControllerOptionsActions<ControllerAuthorization>;
    }
}
declare module 'vona-module-a-web' {
  export interface IApiPathGetRecord{
        '/mcp/auth/summary': undefined;
    }
export interface IApiPathPostRecord{
        '/mcp/auth/decision': undefined;
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
export * from '../service/authorization.ts';

import 'vona-module-a-bean';
declare module 'vona-module-a-bean' {

    export interface IServiceRecord {
      'mcp-auth:authorization': never;
    }


}
declare module 'vona-module-mcp-auth' {

        export interface ServiceAuthorization {
          /** @internal */
          get scope(): ScopeModuleMcpAuth;
        }

          export interface ServiceAuthorization {
            get $beanFullName(): 'mcp-auth.service.authorization';
            get $onionName(): 'mcp-auth:authorization';
          }
}
/** service: end */
/** service: begin */
import type { ServiceAuthorization } from '../service/authorization.ts';
export interface IModuleService {
  'authorization': ServiceAuthorization;
}
/** service: end */
/** service: begin */

import 'vona';
declare module 'vona' {
  export interface IBeanRecordGeneral {
    'mcp-auth.service.authorization': ServiceAuthorization;
  }
}
/** service: end */
/** meta: begin */
export * from '../bean/meta.version.ts';

import 'vona-module-a-meta';
declare module 'vona-module-a-meta' {

    export interface IMetaRecord {
      'mcp-auth:version': never;
    }


}
declare module 'vona-module-mcp-auth' {

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
/** config: begin */
export * from '../config/config.ts';
import type { config } from '../config/config.ts';
/** config: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil, type TypeModuleConfig } from 'vona';
import { Scope } from 'vona-module-a-bean';

@Scope()
export class ScopeModuleMcpAuth extends BeanScopeBase {}

export interface ScopeModuleMcpAuth {
  util: BeanScopeUtil;
config: TypeModuleConfig<typeof config>;
entity: IModuleEntity;
model: IModuleModel;
service: IModuleService;
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




}
/** scope: end */
