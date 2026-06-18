// eslint-disable
import type { TypeEntityMeta,TypeModelsClassLikeGeneral,TypeSymbolKeyFieldsMore } from 'vona-module-a-orm';
import type { TypeEntityOptionsFields,TypeControllerOptionsActions } from 'vona-module-a-openapi';
import type { TableIdentity } from 'table-identity';
/** entity: begin */
export * from '../entity/student.tsx';
import type { IEntityOptionsStudent } from '../entity/student.tsx';
import 'vona-module-a-orm';
declare module 'vona-module-a-orm' {
  
    export interface IEntityRecord {
      'demo-student:student': IEntityOptionsStudent;
    }

  
}
declare module 'vona-module-demo-student' {
   
}
/** entity: end */
/** entity: begin */
import type { EntityStudent } from '../entity/student.tsx';
export interface IModuleEntity {
  'student': EntityStudentMeta;
}
/** entity: end */
/** entity: begin */
export type EntityStudentTableName = 'demoStudent';
export type EntityStudentMeta=TypeEntityMeta<EntityStudent,EntityStudentTableName>;
declare module 'vona-module-a-orm' {
  export interface ITableRecord {
    'demoStudent': EntityStudentMeta;
  }
}
declare module 'vona-module-demo-student' {
  
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
      'demo-student:student': IModelOptionsStudent;
    }

  
}
declare module 'vona-module-demo-student' {
  
        export interface ModelStudent {
          /** @internal */
          get scope(): ScopeModuleDemoStudent;
        }

          export interface ModelStudent {
            get $beanFullName(): 'demo-student.model.student';
            get $onionName(): 'demo-student:student';
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
    'demo-student.model.student': ModelStudent;
  }
}
/** model: end */
/** model: begin */
import type { IModelGetOptions, IModelMethodOptions, IModelSelectParams, TypeModelSelectAndCount, TypeModelRelationResult, TypeModelWhere, IModelInsertOptions, TypeModelMutateRelationData, IModelDeleteOptions, IModelUpdateOptions, IModelMutateOptions, IModelSelectCountParams, IModelIncrementParams, IModelSelectAggrParams, TypeModelAggrRelationResult, IModelSelectGroupParams, TypeModelGroupRelationResult } from 'vona-module-a-orm';
import { SymbolKeyEntity, SymbolKeyEntityMeta, SymbolKeyModelOptions } from 'vona-module-a-orm';
declare module 'vona-module-demo-student' {
  
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
    'demo-student:student': ModelStudent;
  }
}
/** model: end */
/** service: begin */
export * from '../service/student.ts';

import 'vona-module-a-bean';
declare module 'vona-module-a-bean' {
  
    export interface IServiceRecord {
      'demo-student:student': never;
    }

  
}
declare module 'vona-module-demo-student' {
  
        export interface ServiceStudent {
          /** @internal */
          get scope(): ScopeModuleDemoStudent;
        }

          export interface ServiceStudent {
            get $beanFullName(): 'demo-student.service.student';
            get $onionName(): 'demo-student:student';
            
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
    'demo-student.service.student': ServiceStudent;
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
      'demo-student:index': IMetaOptionsIndex;
'demo-student:version': never;
    }

  
}
declare module 'vona-module-demo-student' {
  
        export interface MetaIndex {
          /** @internal */
          get scope(): ScopeModuleDemoStudent;
        }

          export interface MetaIndex {
            get $beanFullName(): 'demo-student.meta.index';
            get $onionName(): 'demo-student:index';
            get $onionOptions(): IMetaOptionsIndex;
          }

        export interface MetaVersion {
          /** @internal */
          get scope(): ScopeModuleDemoStudent;
        }

          export interface MetaVersion {
            get $beanFullName(): 'demo-student.meta.version';
            get $onionName(): 'demo-student:version';
            
          } 
}
/** meta: end */
/** dto: begin */
export * from '../dto/studentCreate.tsx';
export * from '../dto/studentSelectReq.tsx';
export * from '../dto/studentSelectRes.tsx';
export * from '../dto/studentSelectResItem.tsx';
export * from '../dto/studentUpdate.tsx';
export * from '../dto/studentView.tsx';
import type { IDtoOptionsStudentCreate } from '../dto/studentCreate.tsx';
import type { IDtoOptionsStudentSelectReq } from '../dto/studentSelectReq.tsx';
import type { IDtoOptionsStudentSelectRes } from '../dto/studentSelectRes.tsx';
import type { IDtoOptionsStudentSelectResItem } from '../dto/studentSelectResItem.tsx';
import type { IDtoOptionsStudentUpdate } from '../dto/studentUpdate.tsx';
import type { IDtoOptionsStudentView } from '../dto/studentView.tsx';
import 'vona-module-a-web';
declare module 'vona-module-a-web' {
  
    export interface IDtoRecord {
      'demo-student:studentCreate': IDtoOptionsStudentCreate;
'demo-student:studentSelectReq': IDtoOptionsStudentSelectReq;
'demo-student:studentSelectRes': IDtoOptionsStudentSelectRes;
'demo-student:studentSelectResItem': IDtoOptionsStudentSelectResItem;
'demo-student:studentUpdate': IDtoOptionsStudentUpdate;
'demo-student:studentView': IDtoOptionsStudentView;
    }

  
}
declare module 'vona-module-demo-student' {
   
}
/** dto: end */
/** dto: begin */
import type { DtoStudentCreate } from '../dto/studentCreate.tsx';
import type { DtoStudentSelectReq } from '../dto/studentSelectReq.tsx';
import type { DtoStudentSelectRes } from '../dto/studentSelectRes.tsx';
import type { DtoStudentSelectResItem } from '../dto/studentSelectResItem.tsx';
import type { DtoStudentUpdate } from '../dto/studentUpdate.tsx';
import type { DtoStudentView } from '../dto/studentView.tsx';
declare module 'vona-module-demo-student' {
  
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
      'demo-student:student': IControllerOptionsStudent;
    }

  
}
declare module 'vona-module-demo-student' {
  
        export interface ControllerStudent {
          /** @internal */
          get scope(): ScopeModuleDemoStudent;
        }

          export interface ControllerStudent {
            get $beanFullName(): 'demo-student.controller.student';
            get $onionName(): 'demo-student:student';
            get $onionOptions(): IControllerOptionsStudent;
          } 
}
/** controller: end */
/** controller: begin */
// @ts-ignore ignore
import type { ControllerStudent } from '../controller/student.ts';
declare module 'vona-module-demo-student' {
  
    export interface IControllerOptionsStudent {
      actions?: TypeControllerOptionsActions<ControllerStudent>;
    }
}
declare module 'vona-module-a-web' {
  export interface IApiPathPostRecord{
        '/demo/student': undefined;
    }
export interface IApiPathGetRecord{
        '/demo/student': undefined;
'/demo/student/:id': undefined;
    }
export interface IApiPathPatchRecord{
        '/demo/student/:id': undefined;
    }
export interface IApiPathDeleteRecord{
        '/demo/student/:id': undefined;
    }

}
import 'vona-module-a-openapi';
  declare module 'vona-module-a-openapi' {
    export interface IResourceRecord {
      'demo-student:student': never;
    }
  }
  
/** controller: end */
/** ssrMenu: begin */
export * from '../bean/ssrMenu.student.ts';
import type { ISsrMenuOptionsStudent } from '../bean/ssrMenu.student.ts';
import 'vona-module-a-ssr';
declare module 'vona-module-a-ssr' {
  
    export interface ISsrMenuRecord {
      'demo-student:student': ISsrMenuOptionsStudent;
    }

  
}
declare module 'vona-module-demo-student' {
  
        export interface SsrMenuStudent {
          /** @internal */
          get scope(): ScopeModuleDemoStudent;
        }

          export interface SsrMenuStudent {
            get $beanFullName(): 'demo-student.ssrMenu.student';
            get $onionName(): 'demo-student:student';
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
export class ScopeModuleDemoStudent extends BeanScopeBase {}

export interface ScopeModuleDemoStudent {
  util: BeanScopeUtil;
locale: TypeModuleLocales<(typeof locales)[TypeLocaleBase]>;
entity: IModuleEntity;
model: IModuleModel;
service: IModuleService;
}

import 'vona';
declare module 'vona' {
  export interface IBeanScopeRecord {
    'demo-student': ScopeModuleDemoStudent;
  }

  export interface IBeanScopeContainer {
    demoStudent: ScopeModuleDemoStudent;
  }
  
  

  export interface IBeanScopeLocale {
    'demo-student': (typeof locales)[TypeLocaleBase];
  }

  
}
/** scope: end */
