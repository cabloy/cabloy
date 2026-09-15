// eslint-disable
import type { TypeEntityMeta,TypeModelsClassLikeGeneral,TypeSymbolKeyFieldsMore } from 'vona-module-a-orm';
import type { TypeEntityOptionsFields,TypeControllerOptionsActions } from 'vona-module-a-openapi';
import type { TableIdentity } from 'table-identity';
/** entity: begin */
export * from '../entity/layoutprofile.ts';
import type { IEntityOptionsLayoutprofile } from '../entity/layoutprofile.ts';
import 'vona-module-a-orm';
declare module 'vona-module-a-orm' {

    export interface IEntityRecord {
      'a-layoutprofile:layoutprofile': IEntityOptionsLayoutprofile;
    }


}
declare module 'vona-module-a-layoutprofile' {

}
/** entity: end */
/** entity: begin */
import type { EntityLayoutprofile } from '../entity/layoutprofile.ts';
export interface IModuleEntity {
  'layoutprofile': EntityLayoutprofileMeta;
}
/** entity: end */
/** entity: begin */
export type EntityLayoutprofileTableName = 'aLayoutProfile';
export type EntityLayoutprofileMeta=TypeEntityMeta<EntityLayoutprofile,EntityLayoutprofileTableName>;
declare module 'vona-module-a-orm' {
  export interface ITableRecord {
    'aLayoutProfile': EntityLayoutprofileMeta;
  }
}
declare module 'vona-module-a-layoutprofile' {

    export interface IEntityOptionsLayoutprofile {
      fields?: TypeEntityOptionsFields<EntityLayoutprofile, IEntityOptionsLayoutprofile[TypeSymbolKeyFieldsMore]>;
    }
}
/** entity: end */
/** model: begin */
export * from '../model/layoutprofile.ts';
import type { IModelOptionsLayoutprofile } from '../model/layoutprofile.ts';
import 'vona-module-a-orm';
declare module 'vona-module-a-orm' {

    export interface IModelRecord {
      'a-layoutprofile:layoutprofile': IModelOptionsLayoutprofile;
    }


}
declare module 'vona-module-a-layoutprofile' {

        export interface ModelLayoutprofile {
          /** @internal */
          get scope(): ScopeModuleALayoutprofile;
        }

          export interface ModelLayoutprofile {
            get $beanFullName(): 'a-layoutprofile.model.layoutprofile';
            get $onionName(): 'a-layoutprofile:layoutprofile';
            get $onionOptions(): IModelOptionsLayoutprofile;
          }
}
/** model: end */
/** model: begin */
import type { ModelLayoutprofile } from '../model/layoutprofile.ts';
export interface IModuleModel {
  'layoutprofile': ModelLayoutprofile;
}
/** model: end */
/** model: begin */

import 'vona';
declare module 'vona' {
  export interface IBeanRecordGeneral {
    'a-layoutprofile.model.layoutprofile': ModelLayoutprofile;
  }
}
/** model: end */
/** model: begin */
import type { IModelGetOptions, IModelMethodOptions, IModelSelectParams, TypeModelSelectAndCount, TypeModelRelationResult, TypeModelWhere, IModelInsertOptions, TypeModelMutateRelationData, IModelDeleteOptions, IModelUpdateOptions, IModelMutateOptions, IModelSelectCountParams, IModelIncrementParams, IModelSelectAggrParams, TypeModelAggrRelationResult, IModelSelectGroupParams, TypeModelGroupRelationResult } from 'vona-module-a-orm';
import { SymbolKeyEntity, SymbolKeyEntityMeta, SymbolKeyModelOptions } from 'vona-module-a-orm';
declare module 'vona-module-a-layoutprofile' {

  export interface ModelLayoutprofile {
      [SymbolKeyEntity]: EntityLayoutprofile;
      [SymbolKeyEntityMeta]: EntityLayoutprofileMeta;
      [SymbolKeyModelOptions]: IModelOptionsLayoutprofile;
      get<T extends IModelGetOptions<EntityLayoutprofile,ModelLayoutprofile>>(where: TypeModelWhere<EntityLayoutprofile>, options?: T): Promise<TypeModelRelationResult<EntityLayoutprofile, ModelLayoutprofile, T> | undefined>;
      /**
       * Retrieves one matching primary row with a pessimistic FOR UPDATE lock.
       * Requires an active transaction. The lock is released when that transaction completes.
       * Entity and query caches are bypassed.
       */
      getForUpdate<T extends IModelGetOptions<EntityLayoutprofile,ModelLayoutprofile>>(where: TypeModelWhere<EntityLayoutprofile>, options?: T): Promise<TypeModelRelationResult<EntityLayoutprofile, ModelLayoutprofile, T> | undefined>;
      /**
       * Retrieves a primary row by ID with the same pessimistic FOR UPDATE lock semantics.
       * Requires an active transaction. The lock is released when that transaction completes.
       * Entity and query caches are bypassed.
       */
      getByIdForUpdate<T extends IModelGetOptions<EntityLayoutprofile,ModelLayoutprofile>>(id: TableIdentity, options?: T): Promise<TypeModelRelationResult<EntityLayoutprofile, ModelLayoutprofile, T> | undefined>;
      mget<T extends IModelGetOptions<EntityLayoutprofile,ModelLayoutprofile>>(ids: TableIdentity[], options?: T): Promise<TypeModelRelationResult<EntityLayoutprofile, ModelLayoutprofile, T>[]>;
      selectAndCount<T extends IModelSelectParams<EntityLayoutprofile,ModelLayoutprofile,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelSelectAndCount<EntityLayoutprofile, ModelLayoutprofile, T>>;
      select<T extends IModelSelectParams<EntityLayoutprofile,ModelLayoutprofile,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelRelationResult<EntityLayoutprofile, ModelLayoutprofile, T>[]>;
      insert<T extends IModelInsertOptions<EntityLayoutprofile,ModelLayoutprofile>>(data?: TypeModelMutateRelationData<EntityLayoutprofile,ModelLayoutprofile, T>, options?: T): Promise<TypeModelMutateRelationData<EntityLayoutprofile,ModelLayoutprofile, T, true>>;
      insertBulk<T extends IModelInsertOptions<EntityLayoutprofile,ModelLayoutprofile>>(items: TypeModelMutateRelationData<EntityLayoutprofile,ModelLayoutprofile, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityLayoutprofile,ModelLayoutprofile, T, true>[]>;
      update<T extends IModelUpdateOptions<EntityLayoutprofile,ModelLayoutprofile>>(data: TypeModelMutateRelationData<EntityLayoutprofile,ModelLayoutprofile, T>, options?: T): Promise<TypeModelMutateRelationData<EntityLayoutprofile,ModelLayoutprofile, T>>;
      updateBulk<T extends IModelUpdateOptions<EntityLayoutprofile,ModelLayoutprofile>>(items: TypeModelMutateRelationData<EntityLayoutprofile,ModelLayoutprofile, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityLayoutprofile,ModelLayoutprofile, T>[]>;
      delete<T extends IModelDeleteOptions<EntityLayoutprofile,ModelLayoutprofile>>(where?: TypeModelWhere<EntityLayoutprofile>, options?: T): Promise<void>;
      deleteBulk<T extends IModelDeleteOptions<EntityLayoutprofile,ModelLayoutprofile>>(ids: TableIdentity[], options?: T): Promise<void>;
      mutate<T extends IModelMutateOptions<EntityLayoutprofile,ModelLayoutprofile>>(data?: TypeModelMutateRelationData<EntityLayoutprofile,ModelLayoutprofile, T>, options?: T): Promise<TypeModelMutateRelationData<EntityLayoutprofile,ModelLayoutprofile, T>>;
      mutateBulk<T extends IModelMutateOptions<EntityLayoutprofile,ModelLayoutprofile>>(items: TypeModelMutateRelationData<EntityLayoutprofile,ModelLayoutprofile, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityLayoutprofile,ModelLayoutprofile, T>[]>;
      count<T extends IModelSelectCountParams<EntityLayoutprofile,ModelLayoutprofile,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<string | undefined>;
      increment<T extends IModelIncrementParams<EntityLayoutprofile,ModelLayoutprofile,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      decrement<T extends IModelIncrementParams<EntityLayoutprofile,ModelLayoutprofile,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      aggregate<T extends IModelSelectAggrParams<EntityLayoutprofile,ModelLayoutprofile,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelAggrRelationResult<T>>;
      group<T extends IModelSelectGroupParams<EntityLayoutprofile,ModelLayoutprofile,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelGroupRelationResult<EntityLayoutprofile, T>[]>;
      getById<T extends IModelGetOptions<EntityLayoutprofile,ModelLayoutprofile>>(id: TableIdentity, options?: T): Promise<TypeModelRelationResult<EntityLayoutprofile, ModelLayoutprofile, T> | undefined>;
updateById<T extends IModelUpdateOptions<EntityLayoutprofile,ModelLayoutprofile>>(id: TableIdentity, data: TypeModelMutateRelationData<EntityLayoutprofile,ModelLayoutprofile, T>, options?: T): Promise<TypeModelMutateRelationData<EntityLayoutprofile,ModelLayoutprofile, T>>;
deleteById<T extends IModelDeleteOptions<EntityLayoutprofile,ModelLayoutprofile>>(id: TableIdentity, options?: T): Promise<void>;
    }
}
declare module 'vona-module-a-orm' {
  export interface IModelClassRecord {
    'a-layoutprofile:layoutprofile': ModelLayoutprofile;
  }
}
/** model: end */
/** dto: begin */
export * from '../dto/layoutProfile.tsx';
export * from '../dto/layoutProfileLoad.tsx';
export * from '../dto/layoutProfileSave.tsx';
import type { IDtoOptionsLayoutProfile } from '../dto/layoutProfile.tsx';
import type { IDtoOptionsLayoutProfileLoad } from '../dto/layoutProfileLoad.tsx';
import type { IDtoOptionsLayoutProfileSave } from '../dto/layoutProfileSave.tsx';
import 'vona-module-a-web';
declare module 'vona-module-a-web' {

    export interface IDtoRecord {
      'a-layoutprofile:layoutProfile': IDtoOptionsLayoutProfile;
'a-layoutprofile:layoutProfileLoad': IDtoOptionsLayoutProfileLoad;
'a-layoutprofile:layoutProfileSave': IDtoOptionsLayoutProfileSave;
    }


}
declare module 'vona-module-a-layoutprofile' {

}
/** dto: end */
/** dto: begin */
import type { DtoLayoutProfile } from '../dto/layoutProfile.tsx';
import type { DtoLayoutProfileLoad } from '../dto/layoutProfileLoad.tsx';
import type { DtoLayoutProfileSave } from '../dto/layoutProfileSave.tsx';
declare module 'vona-module-a-layoutprofile' {

    export interface IDtoOptionsLayoutProfile {
      fields?: TypeEntityOptionsFields<DtoLayoutProfile, IDtoOptionsLayoutProfile[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsLayoutProfileLoad {
      fields?: TypeEntityOptionsFields<DtoLayoutProfileLoad, IDtoOptionsLayoutProfileLoad[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsLayoutProfileSave {
      fields?: TypeEntityOptionsFields<DtoLayoutProfileSave, IDtoOptionsLayoutProfileSave[TypeSymbolKeyFieldsMore]>;
    }
}
/** dto: end */
/** controller: begin */
export * from '../controller/layoutprofile.ts';
import type { IControllerOptionsLayoutprofile } from '../controller/layoutprofile.ts';
import 'vona-module-a-web';
declare module 'vona-module-a-web' {

    export interface IControllerRecord {
      'a-layoutprofile:layoutprofile': IControllerOptionsLayoutprofile;
    }


}
declare module 'vona-module-a-layoutprofile' {

        export interface ControllerLayoutprofile {
          /** @internal */
          get scope(): ScopeModuleALayoutprofile;
        }

          export interface ControllerLayoutprofile {
            get $beanFullName(): 'a-layoutprofile.controller.layoutprofile';
            get $onionName(): 'a-layoutprofile:layoutprofile';
            get $onionOptions(): IControllerOptionsLayoutprofile;
          }
}
/** controller: end */
/** controller: begin */
// @ts-ignore ignore
import type { ControllerLayoutprofile } from '../controller/layoutprofile.ts';
declare module 'vona-module-a-layoutprofile' {

    export interface IControllerOptionsLayoutprofile {
      actions?: TypeControllerOptionsActions<ControllerLayoutprofile>;
    }
}
declare module 'vona-module-a-web' {
  export interface IApiPathGetRecord{
        '/layoutprofile/load': undefined;
    }
export interface IApiPathPostRecord{
        '/layoutprofile/save': undefined;
    }
export interface IApiPathDeleteRecord{
        '/layoutprofile/reset': undefined;
    }

}

/** controller: end */
/** service: begin */
export * from '../service/layoutprofile.ts';

import 'vona-module-a-bean';
declare module 'vona-module-a-bean' {

    export interface IServiceRecord {
      'a-layoutprofile:layoutprofile': never;
    }


}
declare module 'vona-module-a-layoutprofile' {

        export interface ServiceLayoutprofile {
          /** @internal */
          get scope(): ScopeModuleALayoutprofile;
        }

          export interface ServiceLayoutprofile {
            get $beanFullName(): 'a-layoutprofile.service.layoutprofile';
            get $onionName(): 'a-layoutprofile:layoutprofile';
          }
}
/** service: end */
/** service: begin */
import type { ServiceLayoutprofile } from '../service/layoutprofile.ts';
export interface IModuleService {
  'layoutprofile': ServiceLayoutprofile;
}
/** service: end */
/** service: begin */

import 'vona';
declare module 'vona' {
  export interface IBeanRecordGeneral {
    'a-layoutprofile.service.layoutprofile': ServiceLayoutprofile;
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
      'a-layoutprofile:index': IMetaOptionsIndex;
'a-layoutprofile:redlock': never;
'a-layoutprofile:version': never;
    }


}
declare module 'vona-module-a-layoutprofile' {

        export interface MetaIndex {
          /** @internal */
          get scope(): ScopeModuleALayoutprofile;
        }

          export interface MetaIndex {
            get $beanFullName(): 'a-layoutprofile.meta.index';
            get $onionName(): 'a-layoutprofile:index';
            get $onionOptions(): IMetaOptionsIndex;
          }

        export interface MetaRedlock {
          /** @internal */
          get scope(): ScopeModuleALayoutprofile;
        }

          export interface MetaRedlock {
            get $beanFullName(): 'a-layoutprofile.meta.redlock';
            get $onionName(): 'a-layoutprofile:redlock';
          }

        export interface MetaVersion {
          /** @internal */
          get scope(): ScopeModuleALayoutprofile;
        }

          export interface MetaVersion {
            get $beanFullName(): 'a-layoutprofile.meta.version';
            get $onionName(): 'a-layoutprofile:version';
          }
}
/** meta: end */
/** meta redlock: begin */
import type { MetaRedlock } from '../bean/meta.redlock.ts';
/** meta redlock: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil } from 'vona';
import { Scope } from 'vona-module-a-bean';

@Scope()
export class ScopeModuleALayoutprofile extends BeanScopeBase {}

export interface ScopeModuleALayoutprofile {
  util: BeanScopeUtil;
entity: IModuleEntity;
model: IModuleModel;
service: IModuleService;
redlock: MetaRedlock;
}

import 'vona';
declare module 'vona' {
  export interface IBeanScopeRecord {
    'a-layoutprofile': ScopeModuleALayoutprofile;
  }

  export interface IBeanScopeContainer {
    layoutprofile: ScopeModuleALayoutprofile;
  }






}
/** scope: end */
