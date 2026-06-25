// eslint-disable
import type { TypeEntityMeta,TypeModelsClassLikeGeneral,TypeSymbolKeyFieldsMore } from 'vona-module-a-orm';
import type { TypeEntityOptionsFields } from 'vona-module-a-openapi';
import type { TableIdentity } from 'table-identity';
/** entity: begin */
export * from '../entity/subject.tsx';
import type { IEntityOptionsSubject } from '../entity/subject.tsx';
import 'vona-module-a-orm';
declare module 'vona-module-a-orm' {

    export interface IEntityRecord {
      'training-recordsubject:subject': IEntityOptionsSubject;
    }


}
declare module 'vona-module-training-recordsubject' {

}
/** entity: end */
/** entity: begin */
import type { EntitySubject } from '../entity/subject.tsx';
export interface IModuleEntity {
  'subject': EntitySubjectMeta;
}
/** entity: end */
/** entity: begin */
export type EntitySubjectTableName = 'trainingRecordSubject';
export type EntitySubjectMeta=TypeEntityMeta<EntitySubject,EntitySubjectTableName>;
declare module 'vona-module-a-orm' {
  export interface ITableRecord {
    'trainingRecordSubject': EntitySubjectMeta;
  }
}
declare module 'vona-module-training-recordsubject' {

    export interface IEntityOptionsSubject {
      fields?: TypeEntityOptionsFields<EntitySubject, IEntityOptionsSubject[TypeSymbolKeyFieldsMore]>;
    }
}
/** entity: end */
/** model: begin */
export * from '../model/subject.ts';
import type { IModelOptionsSubject } from '../model/subject.ts';
import 'vona-module-a-orm';
declare module 'vona-module-a-orm' {

    export interface IModelRecord {
      'training-recordsubject:subject': IModelOptionsSubject;
    }


}
declare module 'vona-module-training-recordsubject' {

        export interface ModelSubject {
          /** @internal */
          get scope(): ScopeModuleTrainingRecordsubject;
        }

          export interface ModelSubject {
            get $beanFullName(): 'training-recordsubject.model.subject';
            get $onionName(): 'training-recordsubject:subject';
            get $onionOptions(): IModelOptionsSubject;
          }
}
/** model: end */
/** model: begin */
import type { ModelSubject } from '../model/subject.ts';
export interface IModuleModel {
  'subject': ModelSubject;
}
/** model: end */
/** model: begin */

import 'vona';
declare module 'vona' {
  export interface IBeanRecordGeneral {
    'training-recordsubject.model.subject': ModelSubject;
  }
}
/** model: end */
/** model: begin */
import type { IModelGetOptions, IModelMethodOptions, IModelSelectParams, TypeModelSelectAndCount, TypeModelRelationResult, TypeModelWhere, IModelInsertOptions, TypeModelMutateRelationData, IModelDeleteOptions, IModelUpdateOptions, IModelMutateOptions, IModelSelectCountParams, IModelIncrementParams, IModelSelectAggrParams, TypeModelAggrRelationResult, IModelSelectGroupParams, TypeModelGroupRelationResult } from 'vona-module-a-orm';
import { SymbolKeyEntity, SymbolKeyEntityMeta, SymbolKeyModelOptions } from 'vona-module-a-orm';
declare module 'vona-module-training-recordsubject' {

  export interface ModelSubject {
      [SymbolKeyEntity]: EntitySubject;
      [SymbolKeyEntityMeta]: EntitySubjectMeta;
      [SymbolKeyModelOptions]: IModelOptionsSubject;
      get<T extends IModelGetOptions<EntitySubject,ModelSubject>>(where: TypeModelWhere<EntitySubject>, options?: T): Promise<TypeModelRelationResult<EntitySubject, ModelSubject, T> | undefined>;
      mget<T extends IModelGetOptions<EntitySubject,ModelSubject>>(ids: TableIdentity[], options?: T): Promise<TypeModelRelationResult<EntitySubject, ModelSubject, T>[]>;
      selectAndCount<T extends IModelSelectParams<EntitySubject,ModelSubject,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelSelectAndCount<EntitySubject, ModelSubject, T>>;
      select<T extends IModelSelectParams<EntitySubject,ModelSubject,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelRelationResult<EntitySubject, ModelSubject, T>[]>;
      insert<T extends IModelInsertOptions<EntitySubject,ModelSubject>>(data?: TypeModelMutateRelationData<EntitySubject,ModelSubject, T>, options?: T): Promise<TypeModelMutateRelationData<EntitySubject,ModelSubject, T, true>>;
      insertBulk<T extends IModelInsertOptions<EntitySubject,ModelSubject>>(items: TypeModelMutateRelationData<EntitySubject,ModelSubject, T>[], options?: T): Promise<TypeModelMutateRelationData<EntitySubject,ModelSubject, T, true>[]>;
      update<T extends IModelUpdateOptions<EntitySubject,ModelSubject>>(data: TypeModelMutateRelationData<EntitySubject,ModelSubject, T>, options?: T): Promise<TypeModelMutateRelationData<EntitySubject,ModelSubject, T>>;
      updateBulk<T extends IModelUpdateOptions<EntitySubject,ModelSubject>>(items: TypeModelMutateRelationData<EntitySubject,ModelSubject, T>[], options?: T): Promise<TypeModelMutateRelationData<EntitySubject,ModelSubject, T>[]>;
      delete<T extends IModelDeleteOptions<EntitySubject,ModelSubject>>(where?: TypeModelWhere<EntitySubject>, options?: T): Promise<void>;
      deleteBulk<T extends IModelDeleteOptions<EntitySubject,ModelSubject>>(ids: TableIdentity[], options?: T): Promise<void>;
      mutate<T extends IModelMutateOptions<EntitySubject,ModelSubject>>(data?: TypeModelMutateRelationData<EntitySubject,ModelSubject, T>, options?: T): Promise<TypeModelMutateRelationData<EntitySubject,ModelSubject, T>>;
      mutateBulk<T extends IModelMutateOptions<EntitySubject,ModelSubject>>(items: TypeModelMutateRelationData<EntitySubject,ModelSubject, T>[], options?: T): Promise<TypeModelMutateRelationData<EntitySubject,ModelSubject, T>[]>;
      count<T extends IModelSelectCountParams<EntitySubject,ModelSubject,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<string | undefined>;
      increment<T extends IModelIncrementParams<EntitySubject,ModelSubject,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      decrement<T extends IModelIncrementParams<EntitySubject,ModelSubject,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      aggregate<T extends IModelSelectAggrParams<EntitySubject,ModelSubject,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelAggrRelationResult<T>>;
      group<T extends IModelSelectGroupParams<EntitySubject,ModelSubject,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelGroupRelationResult<EntitySubject, T>[]>;
      getById<T extends IModelGetOptions<EntitySubject,ModelSubject>>(id: TableIdentity, options?: T): Promise<TypeModelRelationResult<EntitySubject, ModelSubject, T> | undefined>;
	updateById<T extends IModelUpdateOptions<EntitySubject,ModelSubject>>(id: TableIdentity, data: TypeModelMutateRelationData<EntitySubject,ModelSubject, T>, options?: T): Promise<TypeModelMutateRelationData<EntitySubject,ModelSubject, T>>;
	deleteById<T extends IModelDeleteOptions<EntitySubject,ModelSubject>>(id: TableIdentity, options?: T): Promise<void>;
	getByName<T extends IModelGetOptions<EntitySubject,ModelSubject>>(name?: string, options?: T): Promise<TypeModelRelationResult<EntitySubject, ModelSubject, T> | undefined>;
	getByNameEqI<T extends IModelGetOptions<EntitySubject,ModelSubject>>(name?: string, options?: T): Promise<TypeModelRelationResult<EntitySubject, ModelSubject, T> | undefined>;
	selectByName<T extends IModelSelectParams<EntitySubject,ModelSubject,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(name?: string, params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelRelationResult<EntitySubject, ModelSubject, T>[]>;
	selectByNameEqI<T extends IModelSelectParams<EntitySubject,ModelSubject,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(name?: string, params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelRelationResult<EntitySubject, ModelSubject, T>[]>;
    }
}
declare module 'vona-module-a-orm' {
  export interface IModelClassRecord {
    'training-recordsubject:subject': ModelSubject;
  }
}
/** model: end */
/** meta: begin */
export * from '../bean/meta.index.ts';
export * from '../bean/meta.version.ts';
import type { IMetaOptionsIndex } from 'vona-module-a-index';
import 'vona-module-a-meta';
declare module 'vona-module-a-meta' {

    export interface IMetaRecord {
      'training-recordsubject:index': IMetaOptionsIndex;
'training-recordsubject:version': never;
    }


}
declare module 'vona-module-training-recordsubject' {

        export interface MetaIndex {
          /** @internal */
          get scope(): ScopeModuleTrainingRecordsubject;
        }

          export interface MetaIndex {
            get $beanFullName(): 'training-recordsubject.meta.index';
            get $onionName(): 'training-recordsubject:index';
            get $onionOptions(): IMetaOptionsIndex;
          }

        export interface MetaVersion {
          /** @internal */
          get scope(): ScopeModuleTrainingRecordsubject;
        }

          export interface MetaVersion {
            get $beanFullName(): 'training-recordsubject.meta.version';
            get $onionName(): 'training-recordsubject:version';

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
export class ScopeModuleTrainingRecordsubject extends BeanScopeBase {}

export interface ScopeModuleTrainingRecordsubject {
  util: BeanScopeUtil;
locale: TypeModuleLocales<(typeof locales)[TypeLocaleBase]>;
entity: IModuleEntity;
model: IModuleModel;
}

import 'vona';
declare module 'vona' {
  export interface IBeanScopeRecord {
    'training-recordsubject': ScopeModuleTrainingRecordsubject;
  }

  export interface IBeanScopeContainer {
    trainingRecordsubject: ScopeModuleTrainingRecordsubject;
  }



  export interface IBeanScopeLocale {
    'training-recordsubject': (typeof locales)[TypeLocaleBase];
  }


}
/** scope: end */
