// eslint-disable
import type { TypeEntityMeta,TypeModelsClassLikeGeneral,TypeSymbolKeyFieldsMore,IModelRelationBelongsTo,IModelRelationHasMany } from 'vona-module-a-orm';
import type { TypeEntityOptionsFields,TypeControllerOptionsActions } from 'vona-module-a-openapi';
import type { TableIdentity } from 'table-identity';
/** entity: begin */
export * from '../entity/category.tsx';
export * from '../entity/product.tsx';
export * from '../entity/sku.tsx';
import type { IEntityOptionsCategory } from '../entity/category.tsx';
import type { IEntityOptionsProduct } from '../entity/product.tsx';
import type { IEntityOptionsSku } from '../entity/sku.tsx';
import 'vona-module-a-orm';
declare module 'vona-module-a-orm' {
  
    export interface IEntityRecord {
      'commerce-catalog:category': IEntityOptionsCategory;
'commerce-catalog:product': IEntityOptionsProduct;
'commerce-catalog:sku': IEntityOptionsSku;
    }

  
}
declare module 'vona-module-commerce-catalog' {
   
}
/** entity: end */
/** entity: begin */
import type { EntityCategory } from '../entity/category.tsx';
import type { EntityProduct } from '../entity/product.tsx';
import type { EntitySku } from '../entity/sku.tsx';
export interface IModuleEntity {
  'category': EntityCategoryMeta;
'product': EntityProductMeta;
'sku': EntitySkuMeta;
}
/** entity: end */
/** entity: begin */
export type EntityCategoryTableName = 'commerceCatalogCategory';
export type EntityProductTableName = 'commerceCatalogProduct';
export type EntitySkuTableName = 'commerceCatalogSku';
export type EntityCategoryMeta=TypeEntityMeta<EntityCategory,EntityCategoryTableName>;
export type EntityProductMeta=TypeEntityMeta<EntityProduct,EntityProductTableName>;
export type EntitySkuMeta=TypeEntityMeta<EntitySku,EntitySkuTableName>;
declare module 'vona-module-a-orm' {
  export interface ITableRecord {
    'commerceCatalogCategory': EntityCategoryMeta;
'commerceCatalogProduct': EntityProductMeta;
'commerceCatalogSku': EntitySkuMeta;
  }
}
declare module 'vona-module-commerce-catalog' {
  
    export interface IEntityOptionsCategory {
      fields?: TypeEntityOptionsFields<EntityCategory, IEntityOptionsCategory[TypeSymbolKeyFieldsMore]>;
    }

    export interface IEntityOptionsProduct {
      fields?: TypeEntityOptionsFields<EntityProduct, IEntityOptionsProduct[TypeSymbolKeyFieldsMore]>;
    }

    export interface IEntityOptionsSku {
      fields?: TypeEntityOptionsFields<EntitySku, IEntityOptionsSku[TypeSymbolKeyFieldsMore]>;
    }
}
/** entity: end */
/** model: begin */
export * from '../model/category.ts';
export * from '../model/product.ts';
export * from '../model/sku.ts';
import type { IModelOptionsCategory } from '../model/category.ts';
import type { IModelOptionsProduct } from '../model/product.ts';
import type { IModelOptionsSku } from '../model/sku.ts';
import 'vona-module-a-orm';
declare module 'vona-module-a-orm' {
  
    export interface IModelRecord {
      'commerce-catalog:category': IModelOptionsCategory;
'commerce-catalog:product': IModelOptionsProduct;
'commerce-catalog:sku': IModelOptionsSku;
    }

  
}
declare module 'vona-module-commerce-catalog' {
  
        export interface ModelCategory {
          /** @internal */
          get scope(): ScopeModuleCommerceCatalog;
        }

          export interface ModelCategory {
            get $beanFullName(): 'commerce-catalog.model.category';
            get $onionName(): 'commerce-catalog:category';
            get $onionOptions(): IModelOptionsCategory;
          }

        export interface ModelProduct {
          /** @internal */
          get scope(): ScopeModuleCommerceCatalog;
        }

          export interface ModelProduct {
            get $beanFullName(): 'commerce-catalog.model.product';
            get $onionName(): 'commerce-catalog:product';
            get $onionOptions(): IModelOptionsProduct;
          }

        export interface ModelSku {
          /** @internal */
          get scope(): ScopeModuleCommerceCatalog;
        }

          export interface ModelSku {
            get $beanFullName(): 'commerce-catalog.model.sku';
            get $onionName(): 'commerce-catalog:sku';
            get $onionOptions(): IModelOptionsSku;
          } 
}
/** model: end */
/** model: begin */
import type { ModelCategory } from '../model/category.ts';
import type { ModelProduct } from '../model/product.ts';
import type { ModelSku } from '../model/sku.ts';
export interface IModuleModel {
  'category': ModelCategory;
'product': ModelProduct;
'sku': ModelSku;
}
/** model: end */
/** model: begin */

import 'vona';
declare module 'vona' {
  export interface IBeanRecordGeneral {
    'commerce-catalog.model.category': ModelCategory;
'commerce-catalog.model.product': ModelProduct;
'commerce-catalog.model.sku': ModelSku;
  }
}
/** model: end */
/** model: begin */
import type { IModelGetOptions, IModelMethodOptions, IModelSelectParams, TypeModelSelectAndCount, TypeModelRelationResult, TypeModelWhere, IModelInsertOptions, TypeModelMutateRelationData, IModelDeleteOptions, IModelUpdateOptions, IModelMutateOptions, IModelSelectCountParams, IModelIncrementParams, IModelSelectAggrParams, TypeModelAggrRelationResult, IModelSelectGroupParams, TypeModelGroupRelationResult } from 'vona-module-a-orm';
import { SymbolKeyEntity, SymbolKeyEntityMeta, SymbolKeyModelOptions } from 'vona-module-a-orm';
declare module 'vona-module-commerce-catalog' {
  export interface IModelOptionsProduct {
        relations: {
          category: IModelRelationBelongsTo<'commerce-catalog:product', 'commerce-catalog:category', false, '*'>;
skus: IModelRelationHasMany<'commerce-catalog:sku', 'productId', false, '*', undefined, undefined, undefined>;
skuAvailables: IModelRelationHasMany<'commerce-catalog:sku', 'productId', false, 'id'|'code'|'productId'|'priceCents', ['commerce-trade:stockBalance'], undefined, undefined>;
        };
      }
export interface IModelOptionsSku {
        relations: {
          product: IModelRelationBelongsTo<'commerce-catalog:sku', 'commerce-catalog:product', false, '*'>;
        };
      }
  export interface ModelCategory {
      [SymbolKeyEntity]: EntityCategory;
      [SymbolKeyEntityMeta]: EntityCategoryMeta;
      [SymbolKeyModelOptions]: IModelOptionsCategory;
      get<T extends IModelGetOptions<EntityCategory,ModelCategory>>(where: TypeModelWhere<EntityCategory>, options?: T): Promise<TypeModelRelationResult<EntityCategory, ModelCategory, T> | undefined>;
      getForUpdate<T extends IModelGetOptions<EntityCategory,ModelCategory>>(where: TypeModelWhere<EntityCategory>, options?: T): Promise<TypeModelRelationResult<EntityCategory, ModelCategory, T> | undefined>;
      getByIdForUpdate<T extends IModelGetOptions<EntityCategory,ModelCategory>>(id: TableIdentity, options?: T): Promise<TypeModelRelationResult<EntityCategory, ModelCategory, T> | undefined>;
      mget<T extends IModelGetOptions<EntityCategory,ModelCategory>>(ids: TableIdentity[], options?: T): Promise<TypeModelRelationResult<EntityCategory, ModelCategory, T>[]>;
      selectAndCount<T extends IModelSelectParams<EntityCategory,ModelCategory,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelSelectAndCount<EntityCategory, ModelCategory, T>>;
      select<T extends IModelSelectParams<EntityCategory,ModelCategory,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelRelationResult<EntityCategory, ModelCategory, T>[]>;
      insert<T extends IModelInsertOptions<EntityCategory,ModelCategory>>(data?: TypeModelMutateRelationData<EntityCategory,ModelCategory, T>, options?: T): Promise<TypeModelMutateRelationData<EntityCategory,ModelCategory, T, true>>;
      insertBulk<T extends IModelInsertOptions<EntityCategory,ModelCategory>>(items: TypeModelMutateRelationData<EntityCategory,ModelCategory, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityCategory,ModelCategory, T, true>[]>;
      update<T extends IModelUpdateOptions<EntityCategory,ModelCategory>>(data: TypeModelMutateRelationData<EntityCategory,ModelCategory, T>, options?: T): Promise<TypeModelMutateRelationData<EntityCategory,ModelCategory, T>>;
      updateBulk<T extends IModelUpdateOptions<EntityCategory,ModelCategory>>(items: TypeModelMutateRelationData<EntityCategory,ModelCategory, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityCategory,ModelCategory, T>[]>;
      delete<T extends IModelDeleteOptions<EntityCategory,ModelCategory>>(where?: TypeModelWhere<EntityCategory>, options?: T): Promise<void>;
      deleteBulk<T extends IModelDeleteOptions<EntityCategory,ModelCategory>>(ids: TableIdentity[], options?: T): Promise<void>;
      mutate<T extends IModelMutateOptions<EntityCategory,ModelCategory>>(data?: TypeModelMutateRelationData<EntityCategory,ModelCategory, T>, options?: T): Promise<TypeModelMutateRelationData<EntityCategory,ModelCategory, T>>;
      mutateBulk<T extends IModelMutateOptions<EntityCategory,ModelCategory>>(items: TypeModelMutateRelationData<EntityCategory,ModelCategory, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityCategory,ModelCategory, T>[]>;
      count<T extends IModelSelectCountParams<EntityCategory,ModelCategory,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<string | undefined>;
      increment<T extends IModelIncrementParams<EntityCategory,ModelCategory,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      decrement<T extends IModelIncrementParams<EntityCategory,ModelCategory,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      aggregate<T extends IModelSelectAggrParams<EntityCategory,ModelCategory,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelAggrRelationResult<T>>;
      group<T extends IModelSelectGroupParams<EntityCategory,ModelCategory,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelGroupRelationResult<EntityCategory, T>[]>;
      getById<T extends IModelGetOptions<EntityCategory,ModelCategory>>(id: TableIdentity, options?: T): Promise<TypeModelRelationResult<EntityCategory, ModelCategory, T> | undefined>;
updateById<T extends IModelUpdateOptions<EntityCategory,ModelCategory>>(id: TableIdentity, data: TypeModelMutateRelationData<EntityCategory,ModelCategory, T>, options?: T): Promise<TypeModelMutateRelationData<EntityCategory,ModelCategory, T>>;
deleteById<T extends IModelDeleteOptions<EntityCategory,ModelCategory>>(id: TableIdentity, options?: T): Promise<void>;
getByName<T extends IModelGetOptions<EntityCategory,ModelCategory>>(name?: string, options?: T): Promise<TypeModelRelationResult<EntityCategory, ModelCategory, T> | undefined>;
getByNameEqI<T extends IModelGetOptions<EntityCategory,ModelCategory>>(name?: string, options?: T): Promise<TypeModelRelationResult<EntityCategory, ModelCategory, T> | undefined>;
selectByName<T extends IModelSelectParams<EntityCategory,ModelCategory,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(name?: string, params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelRelationResult<EntityCategory, ModelCategory, T>[]>;
selectByNameEqI<T extends IModelSelectParams<EntityCategory,ModelCategory,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(name?: string, params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelRelationResult<EntityCategory, ModelCategory, T>[]>;
    }
export interface ModelProduct {
      [SymbolKeyEntity]: EntityProduct;
      [SymbolKeyEntityMeta]: EntityProductMeta;
      [SymbolKeyModelOptions]: IModelOptionsProduct;
      get<T extends IModelGetOptions<EntityProduct,ModelProduct>>(where: TypeModelWhere<EntityProduct>, options?: T): Promise<TypeModelRelationResult<EntityProduct, ModelProduct, T> | undefined>;
      getForUpdate<T extends IModelGetOptions<EntityProduct,ModelProduct>>(where: TypeModelWhere<EntityProduct>, options?: T): Promise<TypeModelRelationResult<EntityProduct, ModelProduct, T> | undefined>;
      getByIdForUpdate<T extends IModelGetOptions<EntityProduct,ModelProduct>>(id: TableIdentity, options?: T): Promise<TypeModelRelationResult<EntityProduct, ModelProduct, T> | undefined>;
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
    }
export interface ModelSku {
      [SymbolKeyEntity]: EntitySku;
      [SymbolKeyEntityMeta]: EntitySkuMeta;
      [SymbolKeyModelOptions]: IModelOptionsSku;
      get<T extends IModelGetOptions<EntitySku,ModelSku>>(where: TypeModelWhere<EntitySku>, options?: T): Promise<TypeModelRelationResult<EntitySku, ModelSku, T> | undefined>;
      getForUpdate<T extends IModelGetOptions<EntitySku,ModelSku>>(where: TypeModelWhere<EntitySku>, options?: T): Promise<TypeModelRelationResult<EntitySku, ModelSku, T> | undefined>;
      getByIdForUpdate<T extends IModelGetOptions<EntitySku,ModelSku>>(id: TableIdentity, options?: T): Promise<TypeModelRelationResult<EntitySku, ModelSku, T> | undefined>;
      mget<T extends IModelGetOptions<EntitySku,ModelSku>>(ids: TableIdentity[], options?: T): Promise<TypeModelRelationResult<EntitySku, ModelSku, T>[]>;
      selectAndCount<T extends IModelSelectParams<EntitySku,ModelSku,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelSelectAndCount<EntitySku, ModelSku, T>>;
      select<T extends IModelSelectParams<EntitySku,ModelSku,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelRelationResult<EntitySku, ModelSku, T>[]>;
      insert<T extends IModelInsertOptions<EntitySku,ModelSku>>(data?: TypeModelMutateRelationData<EntitySku,ModelSku, T>, options?: T): Promise<TypeModelMutateRelationData<EntitySku,ModelSku, T, true>>;
      insertBulk<T extends IModelInsertOptions<EntitySku,ModelSku>>(items: TypeModelMutateRelationData<EntitySku,ModelSku, T>[], options?: T): Promise<TypeModelMutateRelationData<EntitySku,ModelSku, T, true>[]>;
      update<T extends IModelUpdateOptions<EntitySku,ModelSku>>(data: TypeModelMutateRelationData<EntitySku,ModelSku, T>, options?: T): Promise<TypeModelMutateRelationData<EntitySku,ModelSku, T>>;
      updateBulk<T extends IModelUpdateOptions<EntitySku,ModelSku>>(items: TypeModelMutateRelationData<EntitySku,ModelSku, T>[], options?: T): Promise<TypeModelMutateRelationData<EntitySku,ModelSku, T>[]>;
      delete<T extends IModelDeleteOptions<EntitySku,ModelSku>>(where?: TypeModelWhere<EntitySku>, options?: T): Promise<void>;
      deleteBulk<T extends IModelDeleteOptions<EntitySku,ModelSku>>(ids: TableIdentity[], options?: T): Promise<void>;
      mutate<T extends IModelMutateOptions<EntitySku,ModelSku>>(data?: TypeModelMutateRelationData<EntitySku,ModelSku, T>, options?: T): Promise<TypeModelMutateRelationData<EntitySku,ModelSku, T>>;
      mutateBulk<T extends IModelMutateOptions<EntitySku,ModelSku>>(items: TypeModelMutateRelationData<EntitySku,ModelSku, T>[], options?: T): Promise<TypeModelMutateRelationData<EntitySku,ModelSku, T>[]>;
      count<T extends IModelSelectCountParams<EntitySku,ModelSku,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<string | undefined>;
      increment<T extends IModelIncrementParams<EntitySku,ModelSku,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      decrement<T extends IModelIncrementParams<EntitySku,ModelSku,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      aggregate<T extends IModelSelectAggrParams<EntitySku,ModelSku,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelAggrRelationResult<T>>;
      group<T extends IModelSelectGroupParams<EntitySku,ModelSku,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelGroupRelationResult<EntitySku, T>[]>;
      getById<T extends IModelGetOptions<EntitySku,ModelSku>>(id: TableIdentity, options?: T): Promise<TypeModelRelationResult<EntitySku, ModelSku, T> | undefined>;
updateById<T extends IModelUpdateOptions<EntitySku,ModelSku>>(id: TableIdentity, data: TypeModelMutateRelationData<EntitySku,ModelSku, T>, options?: T): Promise<TypeModelMutateRelationData<EntitySku,ModelSku, T>>;
deleteById<T extends IModelDeleteOptions<EntitySku,ModelSku>>(id: TableIdentity, options?: T): Promise<void>;
    }
}
declare module 'vona-module-a-orm' {
  export interface IModelClassRecord {
    'commerce-catalog:category': ModelCategory;
'commerce-catalog:product': ModelProduct;
'commerce-catalog:sku': ModelSku;
  }
}
/** model: end */
/** service: begin */
export * from '../service/category.ts';
export * from '../service/product.ts';
export * from '../service/sku.ts';

import 'vona-module-a-bean';
declare module 'vona-module-a-bean' {
  
    export interface IServiceRecord {
      'commerce-catalog:category': never;
'commerce-catalog:product': never;
'commerce-catalog:sku': never;
    }

  
}
declare module 'vona-module-commerce-catalog' {
  
        export interface ServiceCategory {
          /** @internal */
          get scope(): ScopeModuleCommerceCatalog;
        }

          export interface ServiceCategory {
            get $beanFullName(): 'commerce-catalog.service.category';
            get $onionName(): 'commerce-catalog:category';
            
          }

        export interface ServiceProduct {
          /** @internal */
          get scope(): ScopeModuleCommerceCatalog;
        }

          export interface ServiceProduct {
            get $beanFullName(): 'commerce-catalog.service.product';
            get $onionName(): 'commerce-catalog:product';
            
          }

        export interface ServiceSku {
          /** @internal */
          get scope(): ScopeModuleCommerceCatalog;
        }

          export interface ServiceSku {
            get $beanFullName(): 'commerce-catalog.service.sku';
            get $onionName(): 'commerce-catalog:sku';
            
          } 
}
/** service: end */
/** service: begin */
import type { ServiceCategory } from '../service/category.ts';
import type { ServiceProduct } from '../service/product.ts';
import type { ServiceSku } from '../service/sku.ts';
export interface IModuleService {
  'category': ServiceCategory;
'product': ServiceProduct;
'sku': ServiceSku;
}
/** service: end */
/** service: begin */

import 'vona';
declare module 'vona' {
  export interface IBeanRecordGeneral {
    'commerce-catalog.service.category': ServiceCategory;
'commerce-catalog.service.product': ServiceProduct;
'commerce-catalog.service.sku': ServiceSku;
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
      'commerce-catalog:index': IMetaOptionsIndex;
'commerce-catalog:version': never;
    }

  
}
declare module 'vona-module-commerce-catalog' {
  
        export interface MetaIndex {
          /** @internal */
          get scope(): ScopeModuleCommerceCatalog;
        }

          export interface MetaIndex {
            get $beanFullName(): 'commerce-catalog.meta.index';
            get $onionName(): 'commerce-catalog:index';
            get $onionOptions(): IMetaOptionsIndex;
          }

        export interface MetaVersion {
          /** @internal */
          get scope(): ScopeModuleCommerceCatalog;
        }

          export interface MetaVersion {
            get $beanFullName(): 'commerce-catalog.meta.version';
            get $onionName(): 'commerce-catalog:version';
            
          } 
}
/** meta: end */
/** dto: begin */
export * from '../dto/categoryCreate.tsx';
export * from '../dto/categorySelectReq.tsx';
export * from '../dto/categorySelectRes.tsx';
export * from '../dto/categorySelectResItem.tsx';
export * from '../dto/categoryUpdate.tsx';
export * from '../dto/categoryView.tsx';
export * from '../dto/productCreate.tsx';
export * from '../dto/productPublic.tsx';
export * from '../dto/productPublicSelectReq.tsx';
export * from '../dto/productPublicSelectRes.tsx';
export * from '../dto/productPublicSku.tsx';
export * from '../dto/productSelectReq.tsx';
export * from '../dto/productSelectRes.tsx';
export * from '../dto/productSelectResItem.tsx';
export * from '../dto/productUpdate.tsx';
export * from '../dto/productView.tsx';
export * from '../dto/skuAttribute.tsx';
export * from '../dto/skuCreate.tsx';
export * from '../dto/skuSelectReq.tsx';
export * from '../dto/skuSelectRes.tsx';
export * from '../dto/skuSelectResItem.tsx';
export * from '../dto/skuUpdate.tsx';
export * from '../dto/skuView.tsx';
import type { IDtoOptionsCategoryCreate } from '../dto/categoryCreate.tsx';
import type { IDtoOptionsCategorySelectReq } from '../dto/categorySelectReq.tsx';
import type { IDtoOptionsCategorySelectRes } from '../dto/categorySelectRes.tsx';
import type { IDtoOptionsCategorySelectResItem } from '../dto/categorySelectResItem.tsx';
import type { IDtoOptionsCategoryUpdate } from '../dto/categoryUpdate.tsx';
import type { IDtoOptionsCategoryView } from '../dto/categoryView.tsx';
import type { IDtoOptionsProductCreate } from '../dto/productCreate.tsx';
import type { IDtoOptionsProductPublic } from '../dto/productPublic.tsx';
import type { IDtoOptionsProductPublicSelectReq } from '../dto/productPublicSelectReq.tsx';
import type { IDtoOptionsProductPublicSelectRes } from '../dto/productPublicSelectRes.tsx';
import type { IDtoOptionsProductPublicSku } from '../dto/productPublicSku.tsx';
import type { IDtoOptionsProductSelectReq } from '../dto/productSelectReq.tsx';
import type { IDtoOptionsProductSelectRes } from '../dto/productSelectRes.tsx';
import type { IDtoOptionsProductSelectResItem } from '../dto/productSelectResItem.tsx';
import type { IDtoOptionsProductUpdate } from '../dto/productUpdate.tsx';
import type { IDtoOptionsProductView } from '../dto/productView.tsx';
import type { IDtoOptionsSkuAttribute } from '../dto/skuAttribute.tsx';
import type { IDtoOptionsSkuCreate } from '../dto/skuCreate.tsx';
import type { IDtoOptionsSkuSelectReq } from '../dto/skuSelectReq.tsx';
import type { IDtoOptionsSkuSelectRes } from '../dto/skuSelectRes.tsx';
import type { IDtoOptionsSkuSelectResItem } from '../dto/skuSelectResItem.tsx';
import type { IDtoOptionsSkuUpdate } from '../dto/skuUpdate.tsx';
import type { IDtoOptionsSkuView } from '../dto/skuView.tsx';
import 'vona-module-a-web';
declare module 'vona-module-a-web' {
  
    export interface IDtoRecord {
      'commerce-catalog:categoryCreate': IDtoOptionsCategoryCreate;
'commerce-catalog:categorySelectReq': IDtoOptionsCategorySelectReq;
'commerce-catalog:categorySelectRes': IDtoOptionsCategorySelectRes;
'commerce-catalog:categorySelectResItem': IDtoOptionsCategorySelectResItem;
'commerce-catalog:categoryUpdate': IDtoOptionsCategoryUpdate;
'commerce-catalog:categoryView': IDtoOptionsCategoryView;
'commerce-catalog:productCreate': IDtoOptionsProductCreate;
'commerce-catalog:productPublic': IDtoOptionsProductPublic;
'commerce-catalog:productPublicSelectReq': IDtoOptionsProductPublicSelectReq;
'commerce-catalog:productPublicSelectRes': IDtoOptionsProductPublicSelectRes;
'commerce-catalog:productPublicSku': IDtoOptionsProductPublicSku;
'commerce-catalog:productSelectReq': IDtoOptionsProductSelectReq;
'commerce-catalog:productSelectRes': IDtoOptionsProductSelectRes;
'commerce-catalog:productSelectResItem': IDtoOptionsProductSelectResItem;
'commerce-catalog:productUpdate': IDtoOptionsProductUpdate;
'commerce-catalog:productView': IDtoOptionsProductView;
'commerce-catalog:skuAttribute': IDtoOptionsSkuAttribute;
'commerce-catalog:skuCreate': IDtoOptionsSkuCreate;
'commerce-catalog:skuSelectReq': IDtoOptionsSkuSelectReq;
'commerce-catalog:skuSelectRes': IDtoOptionsSkuSelectRes;
'commerce-catalog:skuSelectResItem': IDtoOptionsSkuSelectResItem;
'commerce-catalog:skuUpdate': IDtoOptionsSkuUpdate;
'commerce-catalog:skuView': IDtoOptionsSkuView;
    }

  
}
declare module 'vona-module-commerce-catalog' {
   
}
/** dto: end */
/** dto: begin */
import type { DtoCategoryCreate } from '../dto/categoryCreate.tsx';
import type { DtoCategorySelectReq } from '../dto/categorySelectReq.tsx';
import type { DtoCategorySelectRes } from '../dto/categorySelectRes.tsx';
import type { DtoCategorySelectResItem } from '../dto/categorySelectResItem.tsx';
import type { DtoCategoryUpdate } from '../dto/categoryUpdate.tsx';
import type { DtoCategoryView } from '../dto/categoryView.tsx';
import type { DtoProductCreate } from '../dto/productCreate.tsx';
import type { DtoProductPublic } from '../dto/productPublic.tsx';
import type { DtoProductPublicSelectReq } from '../dto/productPublicSelectReq.tsx';
import type { DtoProductPublicSelectRes } from '../dto/productPublicSelectRes.tsx';
import type { DtoProductPublicSku } from '../dto/productPublicSku.tsx';
import type { DtoProductSelectReq } from '../dto/productSelectReq.tsx';
import type { DtoProductSelectRes } from '../dto/productSelectRes.tsx';
import type { DtoProductSelectResItem } from '../dto/productSelectResItem.tsx';
import type { DtoProductUpdate } from '../dto/productUpdate.tsx';
import type { DtoProductView } from '../dto/productView.tsx';
import type { DtoSkuAttribute } from '../dto/skuAttribute.tsx';
import type { DtoSkuCreate } from '../dto/skuCreate.tsx';
import type { DtoSkuSelectReq } from '../dto/skuSelectReq.tsx';
import type { DtoSkuSelectRes } from '../dto/skuSelectRes.tsx';
import type { DtoSkuSelectResItem } from '../dto/skuSelectResItem.tsx';
import type { DtoSkuUpdate } from '../dto/skuUpdate.tsx';
import type { DtoSkuView } from '../dto/skuView.tsx';
declare module 'vona-module-commerce-catalog' {
  
    export interface IDtoOptionsCategoryCreate {
      fields?: TypeEntityOptionsFields<DtoCategoryCreate, IDtoOptionsCategoryCreate[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsCategorySelectReq {
      fields?: TypeEntityOptionsFields<DtoCategorySelectReq, IDtoOptionsCategorySelectReq[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsCategorySelectRes {
      fields?: TypeEntityOptionsFields<DtoCategorySelectRes, IDtoOptionsCategorySelectRes[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsCategorySelectResItem {
      fields?: TypeEntityOptionsFields<DtoCategorySelectResItem, IDtoOptionsCategorySelectResItem[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsCategoryUpdate {
      fields?: TypeEntityOptionsFields<DtoCategoryUpdate, IDtoOptionsCategoryUpdate[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsCategoryView {
      fields?: TypeEntityOptionsFields<DtoCategoryView, IDtoOptionsCategoryView[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsProductCreate {
      fields?: TypeEntityOptionsFields<DtoProductCreate, IDtoOptionsProductCreate[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsProductPublic {
      fields?: TypeEntityOptionsFields<DtoProductPublic, IDtoOptionsProductPublic[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsProductPublicSelectReq {
      fields?: TypeEntityOptionsFields<DtoProductPublicSelectReq, IDtoOptionsProductPublicSelectReq[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsProductPublicSelectRes {
      fields?: TypeEntityOptionsFields<DtoProductPublicSelectRes, IDtoOptionsProductPublicSelectRes[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsProductPublicSku {
      fields?: TypeEntityOptionsFields<DtoProductPublicSku, IDtoOptionsProductPublicSku[TypeSymbolKeyFieldsMore]>;
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

    export interface IDtoOptionsSkuAttribute {
      fields?: TypeEntityOptionsFields<DtoSkuAttribute, IDtoOptionsSkuAttribute[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsSkuCreate {
      fields?: TypeEntityOptionsFields<DtoSkuCreate, IDtoOptionsSkuCreate[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsSkuSelectReq {
      fields?: TypeEntityOptionsFields<DtoSkuSelectReq, IDtoOptionsSkuSelectReq[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsSkuSelectRes {
      fields?: TypeEntityOptionsFields<DtoSkuSelectRes, IDtoOptionsSkuSelectRes[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsSkuSelectResItem {
      fields?: TypeEntityOptionsFields<DtoSkuSelectResItem, IDtoOptionsSkuSelectResItem[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsSkuUpdate {
      fields?: TypeEntityOptionsFields<DtoSkuUpdate, IDtoOptionsSkuUpdate[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsSkuView {
      fields?: TypeEntityOptionsFields<DtoSkuView, IDtoOptionsSkuView[TypeSymbolKeyFieldsMore]>;
    }
}
/** dto: end */
/** controller: begin */
export * from '../controller/category.ts';
export * from '../controller/product.ts';
export * from '../controller/sku.ts';
import type { IControllerOptionsCategory } from '../controller/category.ts';
import type { IControllerOptionsProduct } from '../controller/product.ts';
import type { IControllerOptionsSku } from '../controller/sku.ts';
import 'vona-module-a-web';
declare module 'vona-module-a-web' {
  
    export interface IControllerRecord {
      'commerce-catalog:category': IControllerOptionsCategory;
'commerce-catalog:product': IControllerOptionsProduct;
'commerce-catalog:sku': IControllerOptionsSku;
    }

  
}
declare module 'vona-module-commerce-catalog' {
  
        export interface ControllerCategory {
          /** @internal */
          get scope(): ScopeModuleCommerceCatalog;
        }

          export interface ControllerCategory {
            get $beanFullName(): 'commerce-catalog.controller.category';
            get $onionName(): 'commerce-catalog:category';
            get $onionOptions(): IControllerOptionsCategory;
          }

        export interface ControllerProduct {
          /** @internal */
          get scope(): ScopeModuleCommerceCatalog;
        }

          export interface ControllerProduct {
            get $beanFullName(): 'commerce-catalog.controller.product';
            get $onionName(): 'commerce-catalog:product';
            get $onionOptions(): IControllerOptionsProduct;
          }

        export interface ControllerSku {
          /** @internal */
          get scope(): ScopeModuleCommerceCatalog;
        }

          export interface ControllerSku {
            get $beanFullName(): 'commerce-catalog.controller.sku';
            get $onionName(): 'commerce-catalog:sku';
            get $onionOptions(): IControllerOptionsSku;
          } 
}
/** controller: end */
/** controller: begin */
// @ts-ignore ignore
import type { ControllerCategory } from '../controller/category.ts';
// @ts-ignore ignore
import type { ControllerProduct } from '../controller/product.ts';
// @ts-ignore ignore
import type { ControllerSku } from '../controller/sku.ts';
declare module 'vona-module-commerce-catalog' {
  
    export interface IControllerOptionsCategory {
      actions?: TypeControllerOptionsActions<ControllerCategory>;
    }

    export interface IControllerOptionsProduct {
      actions?: TypeControllerOptionsActions<ControllerProduct>;
    }

    export interface IControllerOptionsSku {
      actions?: TypeControllerOptionsActions<ControllerSku>;
    }
}
declare module 'vona-module-a-web' {
  export interface IApiPathPostRecord{
        '/commerce/catalog/category': undefined;
'/commerce/catalog/product': undefined;
'/commerce/catalog/sku': undefined;
    }
export interface IApiPathGetRecord{
        '/commerce/catalog/category': undefined;
'/commerce/catalog/category/:id': undefined;
'/commerce/catalog/product': undefined;
'/commerce/catalog/product/public': undefined;
'/commerce/catalog/product/public/:id': undefined;
'/commerce/catalog/product/:id': undefined;
'/commerce/catalog/sku': undefined;
'/commerce/catalog/sku/:id': undefined;
    }
export interface IApiPathPatchRecord{
        '/commerce/catalog/category/:id': undefined;
'/commerce/catalog/product/:id': undefined;
'/commerce/catalog/sku/:id': undefined;
    }
export interface IApiPathDeleteRecord{
        '/commerce/catalog/category/:id': undefined;
'/commerce/catalog/product/:id': undefined;
'/commerce/catalog/sku/:id': undefined;
    }

}
import 'vona-module-a-openapi';
  declare module 'vona-module-a-openapi' {
    export interface IResourceRecord {
      'commerce-catalog:category': never;
'commerce-catalog:product': never;
'commerce-catalog:sku': never;
    }
  }
  
/** controller: end */
/** ssrMenu: begin */
export * from '../bean/ssrMenu.category.ts';
export * from '../bean/ssrMenu.product.ts';
export * from '../bean/ssrMenu.sku.ts';
import type { ISsrMenuOptionsCategory } from '../bean/ssrMenu.category.ts';
import type { ISsrMenuOptionsProduct } from '../bean/ssrMenu.product.ts';
import type { ISsrMenuOptionsSku } from '../bean/ssrMenu.sku.ts';
import 'vona-module-a-ssr';
declare module 'vona-module-a-ssr' {
  
    export interface ISsrMenuRecord {
      'commerce-catalog:category': ISsrMenuOptionsCategory;
'commerce-catalog:product': ISsrMenuOptionsProduct;
'commerce-catalog:sku': ISsrMenuOptionsSku;
    }

  
}
declare module 'vona-module-commerce-catalog' {
  
        export interface SsrMenuCategory {
          /** @internal */
          get scope(): ScopeModuleCommerceCatalog;
        }

          export interface SsrMenuCategory {
            get $beanFullName(): 'commerce-catalog.ssrMenu.category';
            get $onionName(): 'commerce-catalog:category';
            get $onionOptions(): ISsrMenuOptionsCategory;
          }

        export interface SsrMenuProduct {
          /** @internal */
          get scope(): ScopeModuleCommerceCatalog;
        }

          export interface SsrMenuProduct {
            get $beanFullName(): 'commerce-catalog.ssrMenu.product';
            get $onionName(): 'commerce-catalog:product';
            get $onionOptions(): ISsrMenuOptionsProduct;
          }

        export interface SsrMenuSku {
          /** @internal */
          get scope(): ScopeModuleCommerceCatalog;
        }

          export interface SsrMenuSku {
            get $beanFullName(): 'commerce-catalog.ssrMenu.sku';
            get $onionName(): 'commerce-catalog:sku';
            get $onionOptions(): ISsrMenuOptionsSku;
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
export class ScopeModuleCommerceCatalog extends BeanScopeBase {}

export interface ScopeModuleCommerceCatalog {
  util: BeanScopeUtil;
locale: TypeModuleLocales<(typeof locales)[TypeLocaleBase]>;
entity: IModuleEntity;
model: IModuleModel;
service: IModuleService;
}

import 'vona';
declare module 'vona' {
  export interface IBeanScopeRecord {
    'commerce-catalog': ScopeModuleCommerceCatalog;
  }

  export interface IBeanScopeContainer {
    commerceCatalog: ScopeModuleCommerceCatalog;
  }
  
  

  export interface IBeanScopeLocale {
    'commerce-catalog': (typeof locales)[TypeLocaleBase];
  }

  
}
/** scope: end */
