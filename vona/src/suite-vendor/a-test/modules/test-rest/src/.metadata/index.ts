// eslint-disable
import type { TypeEntityMeta,TypeModelsClassLikeGeneral,TypeSymbolKeyFieldsMore } from 'vona-module-a-orm';
import type { TypeEntityOptionsFields,TypeControllerOptionsActions } from 'vona-module-a-openapi';
import type { TableIdentity } from 'table-identity';
/** entity: begin */
export * from '../entity/product.tsx';
import type { IEntityOptionsProduct } from '../entity/product.tsx';
import 'vona-module-a-orm';
declare module 'vona-module-a-orm' {
  
    export interface IEntityRecord {
      'test-rest:product': IEntityOptionsProduct;
    }

  
}
declare module 'vona-module-test-rest' {
   
}
/** entity: end */
/** entity: begin */
import type { EntityProduct } from '../entity/product.tsx';
export interface IModuleEntity {
  'product': EntityProductMeta;
}
/** entity: end */
/** entity: begin */
export type EntityProductTableName = 'testRestProduct';
export type EntityProductMeta=TypeEntityMeta<EntityProduct,EntityProductTableName>;
declare module 'vona-module-a-orm' {
  export interface ITableRecord {
    'testRestProduct': EntityProductMeta;
  }
}
declare module 'vona-module-test-rest' {
  
    export interface IEntityOptionsProduct {
      fields?: TypeEntityOptionsFields<EntityProduct, IEntityOptionsProduct[TypeSymbolKeyFieldsMore]>;
    }
}
/** entity: end */
/** model: begin */
export * from '../model/product.ts';
import type { IModelOptionsProduct } from '../model/product.ts';
import 'vona-module-a-orm';
declare module 'vona-module-a-orm' {
  
    export interface IModelRecord {
      'test-rest:product': IModelOptionsProduct;
    }

  
}
declare module 'vona-module-test-rest' {
  
        export interface ModelProduct {
          /** @internal */
          get scope(): ScopeModuleTestRest;
        }

          export interface ModelProduct {
            get $beanFullName(): 'test-rest.model.product';
            get $onionName(): 'test-rest:product';
            get $onionOptions(): IModelOptionsProduct;
          } 
}
/** model: end */
/** model: begin */
import type { ModelProduct } from '../model/product.ts';
export interface IModuleModel {
  'product': ModelProduct;
}
/** model: end */
/** model: begin */

import 'vona';
declare module 'vona' {
  export interface IBeanRecordGeneral {
    'test-rest.model.product': ModelProduct;
  }
}
/** model: end */
/** model: begin */
import type { IModelGetOptions, IModelMethodOptions, IModelSelectParams, TypeModelSelectAndCount, TypeModelRelationResult, TypeModelWhere, IModelInsertOptions, TypeModelMutateRelationData, IModelDeleteOptions, IModelUpdateOptions, IModelMutateOptions, IModelSelectCountParams, IModelIncrementParams, IModelSelectAggrParams, TypeModelAggrRelationResult, IModelSelectGroupParams, TypeModelGroupRelationResult } from 'vona-module-a-orm';
import { SymbolKeyEntity, SymbolKeyEntityMeta, SymbolKeyModelOptions } from 'vona-module-a-orm';
declare module 'vona-module-test-rest' {
  
  export interface ModelProduct {
      [SymbolKeyEntity]: EntityProduct;
      [SymbolKeyEntityMeta]: EntityProductMeta;
      [SymbolKeyModelOptions]: IModelOptionsProduct;
      get<T extends IModelGetOptions<EntityProduct,ModelProduct>>(where: TypeModelWhere<EntityProduct>, options?: T): Promise<TypeModelRelationResult<EntityProduct, ModelProduct, T> | undefined>;
      mget<T extends IModelGetOptions<EntityProduct,ModelProduct>>(ids: TableIdentity[], options?: T): Promise<TypeModelRelationResult<EntityProduct, ModelProduct, T>[]>;
      selectAndCount<T extends IModelSelectParams<EntityProduct,ModelProduct,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelSelectAndCount<EntityProduct, ModelProduct, T>>;
      select<T extends IModelSelectParams<EntityProduct,ModelProduct,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelRelationResult<EntityProduct, ModelProduct, T>[]>;
      insert<T extends IModelInsertOptions<EntityProduct,ModelProduct>>(data?: TypeModelMutateRelationData<EntityProduct,ModelProduct, T>, options?: T): Promise<TypeModelMutateRelationData<EntityProduct,ModelProduct, T, true>>;
      insertBulk<T extends IModelInsertOptions<EntityProduct,ModelProduct>>(items: TypeModelMutateRelationData<EntityProduct,ModelProduct, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityProduct,ModelProduct, T, true>[]>;
      update<T extends IModelUpdateOptions<EntityProduct,ModelProduct>>(data: TypeModelMutateRelationData<EntityProduct,ModelProduct, T>, options?: T): Promise<TypeModelMutateRelationData<EntityProduct,ModelProduct, T>>;
      updateBulk<T extends IModelUpdateOptions<EntityProduct,ModelProduct>>(items: TypeModelMutateRelationData<EntityProduct,ModelProduct, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityProduct,ModelProduct, T>[]>;
      delete<T extends IModelDeleteOptions<EntityProduct,ModelProduct>>(where?: TypeModelWhere<EntityProduct>, options?: T): Promise<void>;
      deleteBulk<T extends IModelDeleteOptions<EntityProduct,ModelProduct>>(ids: TableIdentity[], options?: T): Promise<void>;
      mutate<T extends IModelMutateOptions<EntityProduct,ModelProduct>>(data?: TypeModelMutateRelationData<EntityProduct,ModelProduct, T>, options?: T): Promise<TypeModelMutateRelationData<EntityProduct,ModelProduct, T>>;
      mutateBulk<T extends IModelMutateOptions<EntityProduct,ModelProduct>>(items: TypeModelMutateRelationData<EntityProduct,ModelProduct, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityProduct,ModelProduct, T>[]>;
      count<T extends IModelSelectCountParams<EntityProduct,ModelProduct,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<string | undefined>;
      increment<T extends IModelIncrementParams<EntityProduct,ModelProduct,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      decrement<T extends IModelIncrementParams<EntityProduct,ModelProduct,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      aggregate<T extends IModelSelectAggrParams<EntityProduct,ModelProduct,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelAggrRelationResult<T>>;
      group<T extends IModelSelectGroupParams<EntityProduct,ModelProduct,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelGroupRelationResult<EntityProduct, T>[]>;
      getById<T extends IModelGetOptions<EntityProduct,ModelProduct>>(id: TableIdentity, options?: T): Promise<TypeModelRelationResult<EntityProduct, ModelProduct, T> | undefined>;
updateById<T extends IModelUpdateOptions<EntityProduct,ModelProduct>>(id: TableIdentity, data: TypeModelMutateRelationData<EntityProduct,ModelProduct, T>, options?: T): Promise<TypeModelMutateRelationData<EntityProduct,ModelProduct, T>>;
deleteById<T extends IModelDeleteOptions<EntityProduct,ModelProduct>>(id: TableIdentity, options?: T): Promise<void>;
getByName<T extends IModelGetOptions<EntityProduct,ModelProduct>>(name?: string, options?: T): Promise<TypeModelRelationResult<EntityProduct, ModelProduct, T> | undefined>;
getByNameEqI<T extends IModelGetOptions<EntityProduct,ModelProduct>>(name?: string, options?: T): Promise<TypeModelRelationResult<EntityProduct, ModelProduct, T> | undefined>;
selectByName<T extends IModelSelectParams<EntityProduct,ModelProduct,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(name?: string, params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelRelationResult<EntityProduct, ModelProduct, T>[]>;
selectByNameEqI<T extends IModelSelectParams<EntityProduct,ModelProduct,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(name?: string, params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelRelationResult<EntityProduct, ModelProduct, T>[]>;
    }
}
declare module 'vona-module-a-orm' {
  export interface IModelClassRecord {
    'test-rest:product': ModelProduct;
  }
}
/** model: end */
/** service: begin */
export * from '../service/product.ts';

import 'vona-module-a-bean';
declare module 'vona-module-a-bean' {
  
    export interface IServiceRecord {
      'test-rest:product': never;
    }

  
}
declare module 'vona-module-test-rest' {
  
        export interface ServiceProduct {
          /** @internal */
          get scope(): ScopeModuleTestRest;
        }

          export interface ServiceProduct {
            get $beanFullName(): 'test-rest.service.product';
            get $onionName(): 'test-rest:product';
            
          } 
}
/** service: end */
/** service: begin */
import type { ServiceProduct } from '../service/product.ts';
export interface IModuleService {
  'product': ServiceProduct;
}
/** service: end */
/** service: begin */

import 'vona';
declare module 'vona' {
  export interface IBeanRecordGeneral {
    'test-rest.service.product': ServiceProduct;
  }
}
/** service: end */
/** meta: begin */
export * from '../bean/meta.version.ts';

import 'vona-module-a-meta';
declare module 'vona-module-a-meta' {
  
    export interface IMetaRecord {
      'test-rest:version': never;
    }

  
}
declare module 'vona-module-test-rest' {
  
        export interface MetaVersion {
          /** @internal */
          get scope(): ScopeModuleTestRest;
        }

          export interface MetaVersion {
            get $beanFullName(): 'test-rest.meta.version';
            get $onionName(): 'test-rest:version';
            
          } 
}
/** meta: end */
/** dto: begin */
export * from '../dto/productCreate.tsx';
export * from '../dto/productSelectReq.tsx';
export * from '../dto/productSelectRes.tsx';
export * from '../dto/productSelectResItem.tsx';
export * from '../dto/productUpdate.tsx';
export * from '../dto/productView.tsx';
import type { IDtoOptionsProductCreate } from '../dto/productCreate.tsx';
import type { IDtoOptionsProductSelectReq } from '../dto/productSelectReq.tsx';
import type { IDtoOptionsProductSelectRes } from '../dto/productSelectRes.tsx';
import type { IDtoOptionsProductSelectResItem } from '../dto/productSelectResItem.tsx';
import type { IDtoOptionsProductUpdate } from '../dto/productUpdate.tsx';
import type { IDtoOptionsProductView } from '../dto/productView.tsx';
import 'vona-module-a-web';
declare module 'vona-module-a-web' {
  
    export interface IDtoRecord {
      'test-rest:productCreate': IDtoOptionsProductCreate;
'test-rest:productSelectReq': IDtoOptionsProductSelectReq;
'test-rest:productSelectRes': IDtoOptionsProductSelectRes;
'test-rest:productSelectResItem': IDtoOptionsProductSelectResItem;
'test-rest:productUpdate': IDtoOptionsProductUpdate;
'test-rest:productView': IDtoOptionsProductView;
    }

  
}
declare module 'vona-module-test-rest' {
   
}
/** dto: end */
/** dto: begin */
import type { DtoProductCreate } from '../dto/productCreate.tsx';
import type { DtoProductSelectReq } from '../dto/productSelectReq.tsx';
import type { DtoProductSelectRes } from '../dto/productSelectRes.tsx';
import type { DtoProductSelectResItem } from '../dto/productSelectResItem.tsx';
import type { DtoProductUpdate } from '../dto/productUpdate.tsx';
import type { DtoProductView } from '../dto/productView.tsx';
declare module 'vona-module-test-rest' {
  
    export interface IDtoOptionsProductCreate {
      fields?: TypeEntityOptionsFields<DtoProductCreate, IDtoOptionsProductCreate[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsProductSelectReq {
      fields?: TypeEntityOptionsFields<DtoProductSelectReq, IDtoOptionsProductSelectReq[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsProductSelectRes {
      fields?: TypeEntityOptionsFields<DtoProductSelectRes, IDtoOptionsProductSelectRes[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsProductSelectResItem {
      fields?: TypeEntityOptionsFields<DtoProductSelectResItem, IDtoOptionsProductSelectResItem[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsProductUpdate {
      fields?: TypeEntityOptionsFields<DtoProductUpdate, IDtoOptionsProductUpdate[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsProductView {
      fields?: TypeEntityOptionsFields<DtoProductView, IDtoOptionsProductView[TypeSymbolKeyFieldsMore]>;
    }
}
/** dto: end */
/** controller: begin */
export * from '../controller/product.tsx';
import type { IControllerOptionsProduct } from '../controller/product.tsx';
import 'vona-module-a-web';
declare module 'vona-module-a-web' {
  
    export interface IControllerRecord {
      'test-rest:product': IControllerOptionsProduct;
    }

  
}
declare module 'vona-module-test-rest' {
  
        export interface ControllerProduct {
          /** @internal */
          get scope(): ScopeModuleTestRest;
        }

          export interface ControllerProduct {
            get $beanFullName(): 'test-rest.controller.product';
            get $onionName(): 'test-rest:product';
            get $onionOptions(): IControllerOptionsProduct;
          } 
}
/** controller: end */
/** controller: begin */
// @ts-ignore ignore
import type { ControllerProduct } from '../controller/product.tsx';
declare module 'vona-module-test-rest' {
  
    export interface IControllerOptionsProduct {
      actions?: TypeControllerOptionsActions<ControllerProduct>;
    }
}
declare module 'vona-module-a-web' {
  export interface IApiPathPostRecord{
        '/test/rest/product': undefined;
    }
export interface IApiPathGetRecord{
        '/test/rest/product': undefined;
'/test/rest/product/:id': undefined;
    }
export interface IApiPathPatchRecord{
        '/test/rest/product/:id': undefined;
    }
export interface IApiPathDeleteRecord{
        '/test/rest/product/:id': undefined;
    }

}
import 'vona-module-a-openapi';
  declare module 'vona-module-a-openapi' {
    export interface IResourceRecord {
      'test-rest:product': never;
    }
  }
  
/** controller: end */
/** ssrMenu: begin */
export * from '../bean/ssrMenu.product.ts';
import type { ISsrMenuOptionsProduct } from '../bean/ssrMenu.product.ts';
import 'vona-module-a-ssr';
declare module 'vona-module-a-ssr' {
  
    export interface ISsrMenuRecord {
      'test-rest:product': ISsrMenuOptionsProduct;
    }

  
}
declare module 'vona-module-test-rest' {
  
        export interface SsrMenuProduct {
          /** @internal */
          get scope(): ScopeModuleTestRest;
        }

          export interface SsrMenuProduct {
            get $beanFullName(): 'test-rest.ssrMenu.product';
            get $onionName(): 'test-rest:product';
            get $onionOptions(): ISsrMenuOptionsProduct;
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
export class ScopeModuleTestRest extends BeanScopeBase {}

export interface ScopeModuleTestRest {
  util: BeanScopeUtil;
locale: TypeModuleLocales<(typeof locales)[TypeLocaleBase]>;
entity: IModuleEntity;
model: IModuleModel;
service: IModuleService;
}

import 'vona';
declare module 'vona' {
  export interface IBeanScopeRecord {
    'test-rest': ScopeModuleTestRest;
  }

  export interface IBeanScopeContainer {
    testRest: ScopeModuleTestRest;
  }
  
  

  export interface IBeanScopeLocale {
    'test-rest': (typeof locales)[TypeLocaleBase];
  }

  
}
/** scope: end */
