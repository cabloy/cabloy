// eslint-disable
import type { TypeEntityMeta,TypeModelsClassLikeGeneral,TypeSymbolKeyFieldsMore,IModelRelationHasMany } from 'vona-module-a-orm';
import type { TypeEntityOptionsFields,TypeControllerOptionsActions } from 'vona-module-a-openapi';
import type { TableIdentity } from 'table-identity';
/** entity: begin */
export * from '../entity/student.tsx';
import type { IEntityOptionsStudent } from '../entity/student.tsx';
import 'vona-module-a-orm';
declare module 'vona-module-a-orm' {
  
    export interface IEntityRecord {
      'training-student:student': IEntityOptionsStudent;
    }

  
}
declare module 'vona-module-training-student' {
   
}
/** entity: end */
/** entity: begin */
import type { EntityStudent } from '../entity/student.tsx';
export interface IModuleEntity {
  'student': EntityStudentMeta;
}
/** entity: end */
/** entity: begin */
export type EntityStudentTableName = 'trainingStudent';
export type EntityStudentMeta=TypeEntityMeta<EntityStudent,EntityStudentTableName>;
declare module 'vona-module-a-orm' {
  export interface ITableRecord {
    'trainingStudent': EntityStudentMeta;
  }
}
declare module 'vona-module-training-student' {
  
    export interface IEntityOptionsStudent {
      fields?: TypeEntityOptionsFields<EntityStudent, IEntityOptionsStudent[TypeSymbolKeyFieldsMore]>;
    }
}
/** entity: end */
/** model: begin */
export * from '../model/student.ts';
import type { IModelOptionsStudent } from '../model/student.ts';
import 'vona-module-a-orm';
declare module 'vona-module-a-orm' {
  
    export interface IModelRecord {
      'training-student:student': IModelOptionsStudent;
    }

  
}
declare module 'vona-module-training-student' {
  
        export interface ModelStudent {
          /** @internal */
          get scope(): ScopeModuleTrainingStudent;
        }

          export interface ModelStudent {
            get $beanFullName(): 'training-student.model.student';
            get $onionName(): 'training-student:student';
            get $onionOptions(): IModelOptionsStudent;
          } 
}
/** model: end */
/** model: begin */
import type { ModelStudent } from '../model/student.ts';
export interface IModuleModel {
  'student': ModelStudent;
}
/** model: end */
/** model: begin */

import 'vona';
declare module 'vona' {
  export interface IBeanRecordGeneral {
    'training-student.model.student': ModelStudent;
  }
}
/** model: end */
/** model: begin */
import type { IModelGetOptions, IModelMethodOptions, IModelSelectParams, TypeModelSelectAndCount, TypeModelRelationResult, TypeModelWhere, IModelInsertOptions, TypeModelMutateRelationData, IModelDeleteOptions, IModelUpdateOptions, IModelMutateOptions, IModelSelectCountParams, IModelIncrementParams, IModelSelectAggrParams, TypeModelAggrRelationResult, IModelSelectGroupParams, TypeModelGroupRelationResult } from 'vona-module-a-orm';
import { SymbolKeyEntity, SymbolKeyEntityMeta, SymbolKeyModelOptions } from 'vona-module-a-orm';
declare module 'vona-module-training-student' {
  export interface IModelOptionsStudent {
        relations: {
          trainingRecords: IModelRelationHasMany<'training-record:record', 'studentId', false, 'id'|'name'|'score'|'description', undefined, undefined, undefined>;
        };
      }
  export interface ModelStudent {
      [SymbolKeyEntity]: EntityStudent;
      [SymbolKeyEntityMeta]: EntityStudentMeta;
      [SymbolKeyModelOptions]: IModelOptionsStudent;
      get<T extends IModelGetOptions<EntityStudent,ModelStudent>>(where: TypeModelWhere<EntityStudent>, options?: T): Promise<TypeModelRelationResult<EntityStudent, ModelStudent, T> | undefined>;
      mget<T extends IModelGetOptions<EntityStudent,ModelStudent>>(ids: TableIdentity[], options?: T): Promise<TypeModelRelationResult<EntityStudent, ModelStudent, T>[]>;
      selectAndCount<T extends IModelSelectParams<EntityStudent,ModelStudent,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelSelectAndCount<EntityStudent, ModelStudent, T>>;
      select<T extends IModelSelectParams<EntityStudent,ModelStudent,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelRelationResult<EntityStudent, ModelStudent, T>[]>;
      insert<T extends IModelInsertOptions<EntityStudent,ModelStudent>>(data?: TypeModelMutateRelationData<EntityStudent,ModelStudent, T>, options?: T): Promise<TypeModelMutateRelationData<EntityStudent,ModelStudent, T, true>>;
      insertBulk<T extends IModelInsertOptions<EntityStudent,ModelStudent>>(items: TypeModelMutateRelationData<EntityStudent,ModelStudent, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityStudent,ModelStudent, T, true>[]>;
      update<T extends IModelUpdateOptions<EntityStudent,ModelStudent>>(data: TypeModelMutateRelationData<EntityStudent,ModelStudent, T>, options?: T): Promise<TypeModelMutateRelationData<EntityStudent,ModelStudent, T>>;
      updateBulk<T extends IModelUpdateOptions<EntityStudent,ModelStudent>>(items: TypeModelMutateRelationData<EntityStudent,ModelStudent, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityStudent,ModelStudent, T>[]>;
      delete<T extends IModelDeleteOptions<EntityStudent,ModelStudent>>(where?: TypeModelWhere<EntityStudent>, options?: T): Promise<void>;
      deleteBulk<T extends IModelDeleteOptions<EntityStudent,ModelStudent>>(ids: TableIdentity[], options?: T): Promise<void>;
      mutate<T extends IModelMutateOptions<EntityStudent,ModelStudent>>(data?: TypeModelMutateRelationData<EntityStudent,ModelStudent, T>, options?: T): Promise<TypeModelMutateRelationData<EntityStudent,ModelStudent, T>>;
      mutateBulk<T extends IModelMutateOptions<EntityStudent,ModelStudent>>(items: TypeModelMutateRelationData<EntityStudent,ModelStudent, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityStudent,ModelStudent, T>[]>;
      count<T extends IModelSelectCountParams<EntityStudent,ModelStudent,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<string | undefined>;
      increment<T extends IModelIncrementParams<EntityStudent,ModelStudent,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      decrement<T extends IModelIncrementParams<EntityStudent,ModelStudent,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      aggregate<T extends IModelSelectAggrParams<EntityStudent,ModelStudent,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelAggrRelationResult<T>>;
      group<T extends IModelSelectGroupParams<EntityStudent,ModelStudent,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelGroupRelationResult<EntityStudent, T>[]>;
      getById<T extends IModelGetOptions<EntityStudent,ModelStudent>>(id: TableIdentity, options?: T): Promise<TypeModelRelationResult<EntityStudent, ModelStudent, T> | undefined>;
updateById<T extends IModelUpdateOptions<EntityStudent,ModelStudent>>(id: TableIdentity, data: TypeModelMutateRelationData<EntityStudent,ModelStudent, T>, options?: T): Promise<TypeModelMutateRelationData<EntityStudent,ModelStudent, T>>;
deleteById<T extends IModelDeleteOptions<EntityStudent,ModelStudent>>(id: TableIdentity, options?: T): Promise<void>;
getByName<T extends IModelGetOptions<EntityStudent,ModelStudent>>(name?: string, options?: T): Promise<TypeModelRelationResult<EntityStudent, ModelStudent, T> | undefined>;
getByNameEqI<T extends IModelGetOptions<EntityStudent,ModelStudent>>(name?: string, options?: T): Promise<TypeModelRelationResult<EntityStudent, ModelStudent, T> | undefined>;
selectByName<T extends IModelSelectParams<EntityStudent,ModelStudent,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(name?: string, params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelRelationResult<EntityStudent, ModelStudent, T>[]>;
selectByNameEqI<T extends IModelSelectParams<EntityStudent,ModelStudent,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(name?: string, params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelRelationResult<EntityStudent, ModelStudent, T>[]>;
    }
}
declare module 'vona-module-a-orm' {
  export interface IModelClassRecord {
    'training-student:student': ModelStudent;
  }
}
/** model: end */
/** service: begin */
export * from '../service/student.ts';

import 'vona-module-a-bean';
declare module 'vona-module-a-bean' {
  
    export interface IServiceRecord {
      'training-student:student': never;
    }

  
}
declare module 'vona-module-training-student' {
  
        export interface ServiceStudent {
          /** @internal */
          get scope(): ScopeModuleTrainingStudent;
        }

          export interface ServiceStudent {
            get $beanFullName(): 'training-student.service.student';
            get $onionName(): 'training-student:student';
            
          } 
}
/** service: end */
/** service: begin */
import type { ServiceStudent } from '../service/student.ts';
export interface IModuleService {
  'student': ServiceStudent;
}
/** service: end */
/** service: begin */

import 'vona';
declare module 'vona' {
  export interface IBeanRecordGeneral {
    'training-student.service.student': ServiceStudent;
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
      'training-student:index': IMetaOptionsIndex;
'training-student:version': never;
    }

  
}
declare module 'vona-module-training-student' {
  
        export interface MetaIndex {
          /** @internal */
          get scope(): ScopeModuleTrainingStudent;
        }

          export interface MetaIndex {
            get $beanFullName(): 'training-student.meta.index';
            get $onionName(): 'training-student:index';
            get $onionOptions(): IMetaOptionsIndex;
          }

        export interface MetaVersion {
          /** @internal */
          get scope(): ScopeModuleTrainingStudent;
        }

          export interface MetaVersion {
            get $beanFullName(): 'training-student.meta.version';
            get $onionName(): 'training-student:version';
            
          } 
}
/** meta: end */
/** dto: begin */
export * from '../dto/detailRecordMutate.tsx';
export * from '../dto/studentCreate.tsx';
export * from '../dto/studentSelectReq.tsx';
export * from '../dto/studentSelectRes.tsx';
export * from '../dto/studentSelectResItem.tsx';
export * from '../dto/studentSummary.tsx';
export * from '../dto/studentUpdate.tsx';
export * from '../dto/studentView.tsx';
import type { IDtoOptionsDetailRecordMutate } from '../dto/detailRecordMutate.tsx';
import type { IDtoOptionsStudentCreate } from '../dto/studentCreate.tsx';
import type { IDtoOptionsStudentSelectReq } from '../dto/studentSelectReq.tsx';
import type { IDtoOptionsStudentSelectRes } from '../dto/studentSelectRes.tsx';
import type { IDtoOptionsStudentSelectResItem } from '../dto/studentSelectResItem.tsx';
import type { IDtoOptionsStudentSummary } from '../dto/studentSummary.tsx';
import type { IDtoOptionsStudentUpdate } from '../dto/studentUpdate.tsx';
import type { IDtoOptionsStudentView } from '../dto/studentView.tsx';
import 'vona-module-a-web';
declare module 'vona-module-a-web' {
  
    export interface IDtoRecord {
      'training-student:detailRecordMutate': IDtoOptionsDetailRecordMutate;
'training-student:studentCreate': IDtoOptionsStudentCreate;
'training-student:studentSelectReq': IDtoOptionsStudentSelectReq;
'training-student:studentSelectRes': IDtoOptionsStudentSelectRes;
'training-student:studentSelectResItem': IDtoOptionsStudentSelectResItem;
'training-student:studentSummary': IDtoOptionsStudentSummary;
'training-student:studentUpdate': IDtoOptionsStudentUpdate;
'training-student:studentView': IDtoOptionsStudentView;
    }

  
}
declare module 'vona-module-training-student' {
   
}
/** dto: end */
/** dto: begin */
import type { DtoDetailRecordMutate } from '../dto/detailRecordMutate.tsx';
import type { DtoStudentCreate } from '../dto/studentCreate.tsx';
import type { DtoStudentSelectReq } from '../dto/studentSelectReq.tsx';
import type { DtoStudentSelectRes } from '../dto/studentSelectRes.tsx';
import type { DtoStudentSelectResItem } from '../dto/studentSelectResItem.tsx';
import type { DtoStudentSummary } from '../dto/studentSummary.tsx';
import type { DtoStudentUpdate } from '../dto/studentUpdate.tsx';
import type { DtoStudentView } from '../dto/studentView.tsx';
declare module 'vona-module-training-student' {
  
    export interface IDtoOptionsDetailRecordMutate {
      fields?: TypeEntityOptionsFields<DtoDetailRecordMutate, IDtoOptionsDetailRecordMutate[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsStudentCreate {
      fields?: TypeEntityOptionsFields<DtoStudentCreate, IDtoOptionsStudentCreate[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsStudentSelectReq {
      fields?: TypeEntityOptionsFields<DtoStudentSelectReq, IDtoOptionsStudentSelectReq[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsStudentSelectRes {
      fields?: TypeEntityOptionsFields<DtoStudentSelectRes, IDtoOptionsStudentSelectRes[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsStudentSelectResItem {
      fields?: TypeEntityOptionsFields<DtoStudentSelectResItem, IDtoOptionsStudentSelectResItem[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsStudentSummary {
      fields?: TypeEntityOptionsFields<DtoStudentSummary, IDtoOptionsStudentSummary[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsStudentUpdate {
      fields?: TypeEntityOptionsFields<DtoStudentUpdate, IDtoOptionsStudentUpdate[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsStudentView {
      fields?: TypeEntityOptionsFields<DtoStudentView, IDtoOptionsStudentView[TypeSymbolKeyFieldsMore]>;
    }
}
/** dto: end */
/** controller: begin */
export * from '../controller/student.ts';
import type { IControllerOptionsStudent } from '../controller/student.ts';
import 'vona-module-a-web';
declare module 'vona-module-a-web' {
  
    export interface IControllerRecord {
      'training-student:student': IControllerOptionsStudent;
    }

  
}
declare module 'vona-module-training-student' {
  
        export interface ControllerStudent {
          /** @internal */
          get scope(): ScopeModuleTrainingStudent;
        }

          export interface ControllerStudent {
            get $beanFullName(): 'training-student.controller.student';
            get $onionName(): 'training-student:student';
            get $onionOptions(): IControllerOptionsStudent;
          } 
}
/** controller: end */
/** controller: begin */
// @ts-ignore ignore
import type { ControllerStudent } from '../controller/student.ts';
declare module 'vona-module-training-student' {
  
    export interface IControllerOptionsStudent {
      actions?: TypeControllerOptionsActions<ControllerStudent>;
    }
}
declare module 'vona-module-a-web' {
  export interface IApiPathPostRecord{
        '/training/student': undefined;
    }
export interface IApiPathGetRecord{
        '/training/student': undefined;
'/training/student/:id': undefined;
'/training/student/summary/:id': undefined;
    }
export interface IApiPathPatchRecord{
        '/training/student/:id': undefined;
    }
export interface IApiPathDeleteRecord{
        '/training/student/:id': undefined;
'/training/student/deleteForce/:id': undefined;
    }

}
import 'vona-module-a-openapi';
  declare module 'vona-module-a-openapi' {
    export interface IResourceRecord {
      'training-student:student': never;
    }
  }
  
/** controller: end */
/** ssrMenu: begin */
export * from '../bean/ssrMenu.student.ts';
import type { ISsrMenuOptionsStudent } from '../bean/ssrMenu.student.ts';
import 'vona-module-a-ssr';
declare module 'vona-module-a-ssr' {
  
    export interface ISsrMenuRecord {
      'training-student:student': ISsrMenuOptionsStudent;
    }

  
}
declare module 'vona-module-training-student' {
  
        export interface SsrMenuStudent {
          /** @internal */
          get scope(): ScopeModuleTrainingStudent;
        }

          export interface SsrMenuStudent {
            get $beanFullName(): 'training-student.ssrMenu.student';
            get $onionName(): 'training-student:student';
            get $onionOptions(): ISsrMenuOptionsStudent;
          } 
}
/** ssrMenu: end */
/** locale: begin */
import { locales } from './locales.ts';
/** locale: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil, type TypeModuleLocales, type TypeLocaleBase } from 'vona';
import { Scope } from 'vona-module-a-bean';

@Scope()
export class ScopeModuleTrainingStudent extends BeanScopeBase {}

export interface ScopeModuleTrainingStudent {
  util: BeanScopeUtil;
locale: TypeModuleLocales<(typeof locales)[TypeLocaleBase]>;
entity: IModuleEntity;
model: IModuleModel;
service: IModuleService;
}

import 'vona';
declare module 'vona' {
  export interface IBeanScopeRecord {
    'training-student': ScopeModuleTrainingStudent;
  }

  export interface IBeanScopeContainer {
    trainingStudent: ScopeModuleTrainingStudent;
  }
  
  

  export interface IBeanScopeLocale {
    'training-student': (typeof locales)[TypeLocaleBase];
  }

  
}
/** scope: end */
