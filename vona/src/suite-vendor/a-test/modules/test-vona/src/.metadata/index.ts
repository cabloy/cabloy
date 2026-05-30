// eslint-disable
import type { TypeEntityMeta,TypeModelsClassLikeGeneral,TypeSymbolKeyFieldsMore,IModelRelationHasOne,IModelRelationBelongsTo,IModelRelationHasMany,IModelRelationBelongsToMany } from 'vona-module-a-orm';
import type { TypeEntityOptionsFields,TypeControllerOptionsActions } from 'vona-module-a-openapi';
import type { TableIdentity } from 'table-identity';
/** aop: begin */
export * from '../bean/aop.regExp.ts';
export * from '../bean/aop.simple.ts';

import { type IDecoratorAopOptions } from 'vona-module-a-aspect';
declare module 'vona-module-a-aspect' {
  
    export interface IAopRecord {
      'test-vona:regExp': IDecoratorAopOptions;
'test-vona:simple': IDecoratorAopOptions;
    }

  
}
declare module 'vona-module-test-vona' {
  
        export interface AopRegExp {
          /** @internal */
          get scope(): ScopeModuleTestVona;
        }

          export interface AopRegExp {
            get $beanFullName(): 'test-vona.aop.regExp';
            get $onionName(): 'test-vona:regExp';
            get $onionOptions(): IDecoratorAopOptions;
          }

        export interface AopSimple {
          /** @internal */
          get scope(): ScopeModuleTestVona;
        }

          export interface AopSimple {
            get $beanFullName(): 'test-vona.aop.simple';
            get $onionName(): 'test-vona:simple';
            get $onionOptions(): IDecoratorAopOptions;
          } 
}
/** aop: end */
/** aopMethod: begin */
export * from '../bean/aopMethod.test.ts';
import type { IAopMethodOptionsTest } from '../bean/aopMethod.test.ts';
import 'vona-module-a-aspect';
declare module 'vona-module-a-aspect' {
  
    export interface IAopMethodRecord {
      'test-vona:test': IAopMethodOptionsTest;
    }

  
}
declare module 'vona-module-test-vona' {
  
        export interface AopMethodTest {
          /** @internal */
          get scope(): ScopeModuleTestVona;
        }

          export interface AopMethodTest {
            get $beanFullName(): 'test-vona.aopMethod.test';
            get $onionName(): 'test-vona:test';
            get $onionOptions(): IAopMethodOptionsTest;
          } 
}
/** aopMethod: end */
/** entity: begin */
export * from '../entity/category.ts';
export * from '../entity/order.ts';
export * from '../entity/post.ts';
export * from '../entity/postContent.ts';
export * from '../entity/product.ts';
export * from '../entity/role.ts';
export * from '../entity/roleUser.ts';
export * from '../entity/test.ts';
export * from '../entity/user.ts';
import type { IEntityOptionsCategory } from '../entity/category.ts';
import type { IEntityOptionsOrder } from '../entity/order.ts';
import type { IEntityOptionsPost } from '../entity/post.ts';
import type { IEntityOptionsPostContent } from '../entity/postContent.ts';
import type { IEntityOptionsProduct } from '../entity/product.ts';
import type { IEntityOptionsRole } from '../entity/role.ts';
import type { IEntityOptionsRoleUser } from '../entity/roleUser.ts';
import type { IEntityOptionsTest } from '../entity/test.ts';
import type { IEntityOptionsUser } from '../entity/user.ts';
import 'vona-module-a-orm';
declare module 'vona-module-a-orm' {
  
    export interface IEntityRecord {
      'test-vona:category': IEntityOptionsCategory;
'test-vona:order': IEntityOptionsOrder;
'test-vona:post': IEntityOptionsPost;
'test-vona:postContent': IEntityOptionsPostContent;
'test-vona:product': IEntityOptionsProduct;
'test-vona:role': IEntityOptionsRole;
'test-vona:roleUser': IEntityOptionsRoleUser;
'test-vona:test': IEntityOptionsTest;
'test-vona:user': IEntityOptionsUser;
    }

  
}
declare module 'vona-module-test-vona' {
   
}
/** entity: end */
/** entity: begin */
import type { EntityCategory } from '../entity/category.ts';
import type { EntityOrder } from '../entity/order.ts';
import type { EntityPost } from '../entity/post.ts';
import type { EntityPostContent } from '../entity/postContent.ts';
import type { EntityProduct } from '../entity/product.ts';
import type { EntityRole } from '../entity/role.ts';
import type { EntityRoleUser } from '../entity/roleUser.ts';
import type { EntityTest } from '../entity/test.ts';
import type { EntityUser } from '../entity/user.ts';
export interface IModuleEntity {
  'category': EntityCategoryMeta;
'order': EntityOrderMeta;
'post': EntityPostMeta;
'postContent': EntityPostContentMeta;
'product': EntityProductMeta;
'role': EntityRoleMeta;
'roleUser': EntityRoleUserMeta;
'test': EntityTestMeta;
'user': EntityUserMeta;
}
/** entity: end */
/** entity: begin */
export type EntityCategoryTableName = 'testVonaCategory';
export type EntityOrderTableName = 'testVonaOrder';
export type EntityPostTableName = 'testVonaPost';
export type EntityPostContentTableName = 'testVonaPostContent';
export type EntityProductTableName = 'testVonaProduct';
export type EntityRoleTableName = 'testVonaRole';
export type EntityRoleUserTableName = 'testVonaRoleUser';
export type EntityTestTableName = 'testVonaTest';
export type EntityUserTableName = 'testVonaUser';
export type EntityCategoryMeta=TypeEntityMeta<EntityCategory,EntityCategoryTableName>;
export type EntityOrderMeta=TypeEntityMeta<EntityOrder,EntityOrderTableName>;
export type EntityPostMeta=TypeEntityMeta<EntityPost,EntityPostTableName>;
export type EntityPostContentMeta=TypeEntityMeta<EntityPostContent,EntityPostContentTableName>;
export type EntityProductMeta=TypeEntityMeta<EntityProduct,EntityProductTableName>;
export type EntityRoleMeta=TypeEntityMeta<EntityRole,EntityRoleTableName>;
export type EntityRoleUserMeta=TypeEntityMeta<EntityRoleUser,EntityRoleUserTableName>;
export type EntityTestMeta=TypeEntityMeta<EntityTest,EntityTestTableName>;
export type EntityUserMeta=TypeEntityMeta<EntityUser,EntityUserTableName>;
declare module 'vona-module-a-orm' {
  export interface ITableRecord {
    'testVonaCategory': EntityCategoryMeta;
'testVonaOrder': EntityOrderMeta;
'testVonaPost': EntityPostMeta;
'testVonaPostContent': EntityPostContentMeta;
'testVonaProduct': EntityProductMeta;
'testVonaRole': EntityRoleMeta;
'testVonaRoleUser': EntityRoleUserMeta;
'testVonaTest': EntityTestMeta;
'testVonaUser': EntityUserMeta;
  }
}
declare module 'vona-module-test-vona' {
  
    export interface IEntityOptionsCategory {
      fields?: TypeEntityOptionsFields<EntityCategory, IEntityOptionsCategory[TypeSymbolKeyFieldsMore]>;
    }

    export interface IEntityOptionsOrder {
      fields?: TypeEntityOptionsFields<EntityOrder, IEntityOptionsOrder[TypeSymbolKeyFieldsMore]>;
    }

    export interface IEntityOptionsPost {
      fields?: TypeEntityOptionsFields<EntityPost, IEntityOptionsPost[TypeSymbolKeyFieldsMore]>;
    }

    export interface IEntityOptionsPostContent {
      fields?: TypeEntityOptionsFields<EntityPostContent, IEntityOptionsPostContent[TypeSymbolKeyFieldsMore]>;
    }

    export interface IEntityOptionsProduct {
      fields?: TypeEntityOptionsFields<EntityProduct, IEntityOptionsProduct[TypeSymbolKeyFieldsMore]>;
    }

    export interface IEntityOptionsRole {
      fields?: TypeEntityOptionsFields<EntityRole, IEntityOptionsRole[TypeSymbolKeyFieldsMore]>;
    }

    export interface IEntityOptionsRoleUser {
      fields?: TypeEntityOptionsFields<EntityRoleUser, IEntityOptionsRoleUser[TypeSymbolKeyFieldsMore]>;
    }

    export interface IEntityOptionsTest {
      fields?: TypeEntityOptionsFields<EntityTest, IEntityOptionsTest[TypeSymbolKeyFieldsMore]>;
    }

    export interface IEntityOptionsUser {
      fields?: TypeEntityOptionsFields<EntityUser, IEntityOptionsUser[TypeSymbolKeyFieldsMore]>;
    }
}
/** entity: end */
/** model: begin */
export * from '../model/category.ts';
export * from '../model/categoryChain.ts';
export * from '../model/order.ts';
export * from '../model/orderStats.ts';
export * from '../model/post.ts';
export * from '../model/postContent.ts';
export * from '../model/product.ts';
export * from '../model/role.ts';
export * from '../model/roleUser.ts';
export * from '../model/test.ts';
export * from '../model/testDynamicTable.ts';
export * from '../model/user.ts';
export * from '../model/userStats.ts';
export * from '../model/userStatsGroup.ts';
import type { IModelOptionsCategory } from '../model/category.ts';
import type { IModelOptionsCategoryChain } from '../model/categoryChain.ts';
import type { IModelOptionsOrder } from '../model/order.ts';
import type { IModelOptionsOrderStats } from '../model/orderStats.ts';
import type { IModelOptionsPost } from '../model/post.ts';
import type { IModelOptionsPostContent } from '../model/postContent.ts';
import type { IModelOptionsProduct } from '../model/product.ts';
import type { IModelOptionsRole } from '../model/role.ts';
import type { IModelOptionsRoleUser } from '../model/roleUser.ts';
import type { IModelOptionsTest } from '../model/test.ts';
import type { IModelOptionsTestDynamicTable } from '../model/testDynamicTable.ts';
import type { IModelOptionsUser } from '../model/user.ts';
import type { IModelOptionsUserStats } from '../model/userStats.ts';
import type { IModelOptionsUserStatsGroup } from '../model/userStatsGroup.ts';
import 'vona-module-a-orm';
declare module 'vona-module-a-orm' {
  
    export interface IModelRecord {
      'test-vona:category': IModelOptionsCategory;
'test-vona:categoryChain': IModelOptionsCategoryChain;
'test-vona:order': IModelOptionsOrder;
'test-vona:orderStats': IModelOptionsOrderStats;
'test-vona:post': IModelOptionsPost;
'test-vona:postContent': IModelOptionsPostContent;
'test-vona:product': IModelOptionsProduct;
'test-vona:role': IModelOptionsRole;
'test-vona:roleUser': IModelOptionsRoleUser;
'test-vona:test': IModelOptionsTest;
'test-vona:testDynamicTable': IModelOptionsTestDynamicTable;
'test-vona:user': IModelOptionsUser;
'test-vona:userStats': IModelOptionsUserStats;
'test-vona:userStatsGroup': IModelOptionsUserStatsGroup;
    }

  
}
declare module 'vona-module-test-vona' {
  
        export interface ModelCategory {
          /** @internal */
          get scope(): ScopeModuleTestVona;
        }

          export interface ModelCategory {
            get $beanFullName(): 'test-vona.model.category';
            get $onionName(): 'test-vona:category';
            get $onionOptions(): IModelOptionsCategory;
          }

        export interface ModelCategoryChain {
          /** @internal */
          get scope(): ScopeModuleTestVona;
        }

          export interface ModelCategoryChain {
            get $beanFullName(): 'test-vona.model.categoryChain';
            get $onionName(): 'test-vona:categoryChain';
            get $onionOptions(): IModelOptionsCategoryChain;
          }

        export interface ModelOrder {
          /** @internal */
          get scope(): ScopeModuleTestVona;
        }

          export interface ModelOrder {
            get $beanFullName(): 'test-vona.model.order';
            get $onionName(): 'test-vona:order';
            get $onionOptions(): IModelOptionsOrder;
          }

        export interface ModelOrderStats {
          /** @internal */
          get scope(): ScopeModuleTestVona;
        }

          export interface ModelOrderStats {
            get $beanFullName(): 'test-vona.model.orderStats';
            get $onionName(): 'test-vona:orderStats';
            get $onionOptions(): IModelOptionsOrderStats;
          }

        export interface ModelPost {
          /** @internal */
          get scope(): ScopeModuleTestVona;
        }

          export interface ModelPost {
            get $beanFullName(): 'test-vona.model.post';
            get $onionName(): 'test-vona:post';
            get $onionOptions(): IModelOptionsPost;
          }

        export interface ModelPostContent {
          /** @internal */
          get scope(): ScopeModuleTestVona;
        }

          export interface ModelPostContent {
            get $beanFullName(): 'test-vona.model.postContent';
            get $onionName(): 'test-vona:postContent';
            get $onionOptions(): IModelOptionsPostContent;
          }

        export interface ModelProduct {
          /** @internal */
          get scope(): ScopeModuleTestVona;
        }

          export interface ModelProduct {
            get $beanFullName(): 'test-vona.model.product';
            get $onionName(): 'test-vona:product';
            get $onionOptions(): IModelOptionsProduct;
          }

        export interface ModelRole {
          /** @internal */
          get scope(): ScopeModuleTestVona;
        }

          export interface ModelRole {
            get $beanFullName(): 'test-vona.model.role';
            get $onionName(): 'test-vona:role';
            get $onionOptions(): IModelOptionsRole;
          }

        export interface ModelRoleUser {
          /** @internal */
          get scope(): ScopeModuleTestVona;
        }

          export interface ModelRoleUser {
            get $beanFullName(): 'test-vona.model.roleUser';
            get $onionName(): 'test-vona:roleUser';
            get $onionOptions(): IModelOptionsRoleUser;
          }

        export interface ModelTest {
          /** @internal */
          get scope(): ScopeModuleTestVona;
        }

          export interface ModelTest {
            get $beanFullName(): 'test-vona.model.test';
            get $onionName(): 'test-vona:test';
            get $onionOptions(): IModelOptionsTest;
          }

        export interface ModelTestDynamicTable {
          /** @internal */
          get scope(): ScopeModuleTestVona;
        }

          export interface ModelTestDynamicTable {
            get $beanFullName(): 'test-vona.model.testDynamicTable';
            get $onionName(): 'test-vona:testDynamicTable';
            get $onionOptions(): IModelOptionsTestDynamicTable;
          }

        export interface ModelUser {
          /** @internal */
          get scope(): ScopeModuleTestVona;
        }

          export interface ModelUser {
            get $beanFullName(): 'test-vona.model.user';
            get $onionName(): 'test-vona:user';
            get $onionOptions(): IModelOptionsUser;
          }

        export interface ModelUserStats {
          /** @internal */
          get scope(): ScopeModuleTestVona;
        }

          export interface ModelUserStats {
            get $beanFullName(): 'test-vona.model.userStats';
            get $onionName(): 'test-vona:userStats';
            get $onionOptions(): IModelOptionsUserStats;
          }

        export interface ModelUserStatsGroup {
          /** @internal */
          get scope(): ScopeModuleTestVona;
        }

          export interface ModelUserStatsGroup {
            get $beanFullName(): 'test-vona.model.userStatsGroup';
            get $onionName(): 'test-vona:userStatsGroup';
            get $onionOptions(): IModelOptionsUserStatsGroup;
          } 
}
/** model: end */
/** model: begin */
import type { ModelCategory } from '../model/category.ts';
import type { ModelCategoryChain } from '../model/categoryChain.ts';
import type { ModelOrder } from '../model/order.ts';
import type { ModelOrderStats } from '../model/orderStats.ts';
import type { ModelPost } from '../model/post.ts';
import type { ModelPostContent } from '../model/postContent.ts';
import type { ModelProduct } from '../model/product.ts';
import type { ModelRole } from '../model/role.ts';
import type { ModelRoleUser } from '../model/roleUser.ts';
import type { ModelTest } from '../model/test.ts';
import type { ModelTestDynamicTable } from '../model/testDynamicTable.ts';
import type { ModelUser } from '../model/user.ts';
import type { ModelUserStats } from '../model/userStats.ts';
import type { ModelUserStatsGroup } from '../model/userStatsGroup.ts';
export interface IModuleModel {
  'category': ModelCategory;
'categoryChain': ModelCategoryChain;
'order': ModelOrder;
'orderStats': ModelOrderStats;
'post': ModelPost;
'postContent': ModelPostContent;
'product': ModelProduct;
'role': ModelRole;
'roleUser': ModelRoleUser;
'test': ModelTest;
'testDynamicTable': ModelTestDynamicTable;
'user': ModelUser;
'userStats': ModelUserStats;
'userStatsGroup': ModelUserStatsGroup;
}
/** model: end */
/** model: begin */

import 'vona';
declare module 'vona' {
  export interface IBeanRecordGeneral {
    'test-vona.model.category': ModelCategory;
'test-vona.model.categoryChain': ModelCategoryChain;
'test-vona.model.order': ModelOrder;
'test-vona.model.orderStats': ModelOrderStats;
'test-vona.model.post': ModelPost;
'test-vona.model.postContent': ModelPostContent;
'test-vona.model.product': ModelProduct;
'test-vona.model.role': ModelRole;
'test-vona.model.roleUser': ModelRoleUser;
'test-vona.model.test': ModelTest;
'test-vona.model.testDynamicTable': ModelTestDynamicTable;
'test-vona.model.user': ModelUser;
'test-vona.model.userStats': ModelUserStats;
'test-vona.model.userStatsGroup': ModelUserStatsGroup;
  }
}
/** model: end */
/** model: begin */
import type { IModelGetOptions, IModelMethodOptions, IModelSelectParams, TypeModelSelectAndCount, TypeModelRelationResult, TypeModelWhere, IModelInsertOptions, TypeModelMutateRelationData, IModelDeleteOptions, IModelUpdateOptions, IModelMutateOptions, IModelSelectCountParams, IModelIncrementParams, IModelSelectAggrParams, TypeModelAggrRelationResult, IModelSelectGroupParams, TypeModelGroupRelationResult } from 'vona-module-a-orm';
import { SymbolKeyEntity, SymbolKeyEntityMeta, SymbolKeyModelOptions } from 'vona-module-a-orm';
declare module 'vona-module-test-vona' {
  export interface IModelOptionsCategory {
        relations: {
          children: IModelRelationHasMany<ModelCategory, 'categoryIdParent', true, 'id'|'name', undefined, undefined, undefined>;
        };
      }
export interface IModelOptionsCategoryChain {
        relations: {
          parent: IModelRelationBelongsTo<ModelCategoryChain, ModelCategoryChain, true, 'id'|'name'|'categoryIdParent'>;
        };
      }
export interface IModelOptionsOrder {
        relations: {
          user: IModelRelationBelongsTo<ModelOrder, ModelUser, true, 'id'|'name'>;
products: IModelRelationHasMany<ModelProduct, 'orderId', true, 'id'|'name'|'price'|'quantity'|'amount', undefined, undefined, undefined>;
        };
      }
export interface IModelOptionsOrderStats {
        relations: {
          productStats: IModelRelationHasMany<ModelProduct, 'orderId', true, undefined, undefined, { count?: '*' | Array<'*'>;sum?: 'amount' | Array<'amount'> }, undefined>;
productsGroups: IModelRelationHasMany<ModelProduct, 'orderId', false, undefined, undefined, { count?: '*' | Array<'*'>;sum?: 'amount' | Array<'amount'> }, 'id' | Array<'id'>>;
        };
      }
export interface IModelOptionsPost {
        relations: {
          postContent: IModelRelationHasOne<ModelPostContent, 'postId', false, 'id'|'content'>;
user: IModelRelationBelongsTo<ModelPost, ModelUser, true, 'id'|'name'>;
        };
      }
export interface IModelOptionsPostContent {
        relations: {
          post: IModelRelationBelongsTo<ModelPostContent, ModelPost, false, undefined>;
        };
      }
export interface IModelOptionsRole {
        relations: {
          users: IModelRelationBelongsToMany<ModelRoleUser, ModelUser, false, 'id'|'name',undefined,undefined,undefined>;
        };
      }
export interface IModelOptionsUser {
        relations: {
          posts: IModelRelationHasMany<ModelPost, 'userId', false, 'id'|'title', ['test-vona:user',ModelPostContent], undefined, undefined>;
roles: IModelRelationBelongsToMany<'test-vona:roleUser', 'test-vona:role', false, 'id'|'name',undefined,undefined,undefined>;
orders: IModelRelationHasMany<ModelOrder, 'userId', false, undefined, undefined, undefined, undefined>;
        };
      }
export interface IModelOptionsUserStats {
        relations: {
          posts: IModelRelationHasMany<ModelPost, 'userId', true, undefined, undefined, { count?: '*'|'title' | Array<'*'|'title'>;sum?: 'stars' | Array<'stars'> }, undefined>;
roles: IModelRelationBelongsToMany<'test-vona:roleUser', 'test-vona:role', false, undefined,undefined,{ count?: '*' | Array<'*'> },undefined>;
        };
      }
export interface IModelOptionsUserStatsGroup {
        relations: {
          posts: IModelRelationHasMany<ModelPost, 'userId', true, undefined, undefined, { count?: '*'|'title' | Array<'*'|'title'>;sum?: 'stars' | Array<'stars'> }, 'title' | Array<'title'>>;
roles: IModelRelationBelongsToMany<'test-vona:roleUser', 'test-vona:role', false, undefined,undefined,{ count?: '*' | Array<'*'> },'name' | Array<'name'>>;
        };
      }
  export interface ModelCategory {
      [SymbolKeyEntity]: EntityCategory;
      [SymbolKeyEntityMeta]: EntityCategoryMeta;
      [SymbolKeyModelOptions]: IModelOptionsCategory;
      get<T extends IModelGetOptions<EntityCategory,ModelCategory>>(where: TypeModelWhere<EntityCategory>, options?: T): Promise<TypeModelRelationResult<EntityCategory, ModelCategory, T> | undefined>;
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
export interface ModelCategoryChain {
      [SymbolKeyEntity]: EntityCategory;
      [SymbolKeyEntityMeta]: EntityCategoryMeta;
      [SymbolKeyModelOptions]: IModelOptionsCategoryChain;
      get<T extends IModelGetOptions<EntityCategory,ModelCategoryChain>>(where: TypeModelWhere<EntityCategory>, options?: T): Promise<TypeModelRelationResult<EntityCategory, ModelCategoryChain, T> | undefined>;
      mget<T extends IModelGetOptions<EntityCategory,ModelCategoryChain>>(ids: TableIdentity[], options?: T): Promise<TypeModelRelationResult<EntityCategory, ModelCategoryChain, T>[]>;
      selectAndCount<T extends IModelSelectParams<EntityCategory,ModelCategoryChain,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelSelectAndCount<EntityCategory, ModelCategoryChain, T>>;
      select<T extends IModelSelectParams<EntityCategory,ModelCategoryChain,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelRelationResult<EntityCategory, ModelCategoryChain, T>[]>;
      insert<T extends IModelInsertOptions<EntityCategory,ModelCategoryChain>>(data?: TypeModelMutateRelationData<EntityCategory,ModelCategoryChain, T>, options?: T): Promise<TypeModelMutateRelationData<EntityCategory,ModelCategoryChain, T, true>>;
      insertBulk<T extends IModelInsertOptions<EntityCategory,ModelCategoryChain>>(items: TypeModelMutateRelationData<EntityCategory,ModelCategoryChain, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityCategory,ModelCategoryChain, T, true>[]>;
      update<T extends IModelUpdateOptions<EntityCategory,ModelCategoryChain>>(data: TypeModelMutateRelationData<EntityCategory,ModelCategoryChain, T>, options?: T): Promise<TypeModelMutateRelationData<EntityCategory,ModelCategoryChain, T>>;
      updateBulk<T extends IModelUpdateOptions<EntityCategory,ModelCategoryChain>>(items: TypeModelMutateRelationData<EntityCategory,ModelCategoryChain, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityCategory,ModelCategoryChain, T>[]>;
      delete<T extends IModelDeleteOptions<EntityCategory,ModelCategoryChain>>(where?: TypeModelWhere<EntityCategory>, options?: T): Promise<void>;
      deleteBulk<T extends IModelDeleteOptions<EntityCategory,ModelCategoryChain>>(ids: TableIdentity[], options?: T): Promise<void>;
      mutate<T extends IModelMutateOptions<EntityCategory,ModelCategoryChain>>(data?: TypeModelMutateRelationData<EntityCategory,ModelCategoryChain, T>, options?: T): Promise<TypeModelMutateRelationData<EntityCategory,ModelCategoryChain, T>>;
      mutateBulk<T extends IModelMutateOptions<EntityCategory,ModelCategoryChain>>(items: TypeModelMutateRelationData<EntityCategory,ModelCategoryChain, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityCategory,ModelCategoryChain, T>[]>;
      count<T extends IModelSelectCountParams<EntityCategory,ModelCategoryChain,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<string | undefined>;
      increment<T extends IModelIncrementParams<EntityCategory,ModelCategoryChain,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      decrement<T extends IModelIncrementParams<EntityCategory,ModelCategoryChain,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      aggregate<T extends IModelSelectAggrParams<EntityCategory,ModelCategoryChain,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelAggrRelationResult<T>>;
      group<T extends IModelSelectGroupParams<EntityCategory,ModelCategoryChain,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelGroupRelationResult<EntityCategory, T>[]>;
      getById<T extends IModelGetOptions<EntityCategory,ModelCategoryChain>>(id: TableIdentity, options?: T): Promise<TypeModelRelationResult<EntityCategory, ModelCategoryChain, T> | undefined>;
updateById<T extends IModelUpdateOptions<EntityCategory,ModelCategoryChain>>(id: TableIdentity, data: TypeModelMutateRelationData<EntityCategory,ModelCategoryChain, T>, options?: T): Promise<TypeModelMutateRelationData<EntityCategory,ModelCategoryChain, T>>;
deleteById<T extends IModelDeleteOptions<EntityCategory,ModelCategoryChain>>(id: TableIdentity, options?: T): Promise<void>;
getByName<T extends IModelGetOptions<EntityCategory,ModelCategoryChain>>(name?: string, options?: T): Promise<TypeModelRelationResult<EntityCategory, ModelCategoryChain, T> | undefined>;
getByNameEqI<T extends IModelGetOptions<EntityCategory,ModelCategoryChain>>(name?: string, options?: T): Promise<TypeModelRelationResult<EntityCategory, ModelCategoryChain, T> | undefined>;
selectByName<T extends IModelSelectParams<EntityCategory,ModelCategoryChain,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(name?: string, params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelRelationResult<EntityCategory, ModelCategoryChain, T>[]>;
selectByNameEqI<T extends IModelSelectParams<EntityCategory,ModelCategoryChain,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(name?: string, params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelRelationResult<EntityCategory, ModelCategoryChain, T>[]>;
    }
export interface ModelOrder {
      [SymbolKeyEntity]: EntityOrder;
      [SymbolKeyEntityMeta]: EntityOrderMeta;
      [SymbolKeyModelOptions]: IModelOptionsOrder;
      get<T extends IModelGetOptions<EntityOrder,ModelOrder>>(where: TypeModelWhere<EntityOrder>, options?: T): Promise<TypeModelRelationResult<EntityOrder, ModelOrder, T> | undefined>;
      mget<T extends IModelGetOptions<EntityOrder,ModelOrder>>(ids: TableIdentity[], options?: T): Promise<TypeModelRelationResult<EntityOrder, ModelOrder, T>[]>;
      selectAndCount<T extends IModelSelectParams<EntityOrder,ModelOrder,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelSelectAndCount<EntityOrder, ModelOrder, T>>;
      select<T extends IModelSelectParams<EntityOrder,ModelOrder,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelRelationResult<EntityOrder, ModelOrder, T>[]>;
      insert<T extends IModelInsertOptions<EntityOrder,ModelOrder>>(data?: TypeModelMutateRelationData<EntityOrder,ModelOrder, T>, options?: T): Promise<TypeModelMutateRelationData<EntityOrder,ModelOrder, T, true>>;
      insertBulk<T extends IModelInsertOptions<EntityOrder,ModelOrder>>(items: TypeModelMutateRelationData<EntityOrder,ModelOrder, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityOrder,ModelOrder, T, true>[]>;
      update<T extends IModelUpdateOptions<EntityOrder,ModelOrder>>(data: TypeModelMutateRelationData<EntityOrder,ModelOrder, T>, options?: T): Promise<TypeModelMutateRelationData<EntityOrder,ModelOrder, T>>;
      updateBulk<T extends IModelUpdateOptions<EntityOrder,ModelOrder>>(items: TypeModelMutateRelationData<EntityOrder,ModelOrder, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityOrder,ModelOrder, T>[]>;
      delete<T extends IModelDeleteOptions<EntityOrder,ModelOrder>>(where?: TypeModelWhere<EntityOrder>, options?: T): Promise<void>;
      deleteBulk<T extends IModelDeleteOptions<EntityOrder,ModelOrder>>(ids: TableIdentity[], options?: T): Promise<void>;
      mutate<T extends IModelMutateOptions<EntityOrder,ModelOrder>>(data?: TypeModelMutateRelationData<EntityOrder,ModelOrder, T>, options?: T): Promise<TypeModelMutateRelationData<EntityOrder,ModelOrder, T>>;
      mutateBulk<T extends IModelMutateOptions<EntityOrder,ModelOrder>>(items: TypeModelMutateRelationData<EntityOrder,ModelOrder, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityOrder,ModelOrder, T>[]>;
      count<T extends IModelSelectCountParams<EntityOrder,ModelOrder,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<string | undefined>;
      increment<T extends IModelIncrementParams<EntityOrder,ModelOrder,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      decrement<T extends IModelIncrementParams<EntityOrder,ModelOrder,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      aggregate<T extends IModelSelectAggrParams<EntityOrder,ModelOrder,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelAggrRelationResult<T>>;
      group<T extends IModelSelectGroupParams<EntityOrder,ModelOrder,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelGroupRelationResult<EntityOrder, T>[]>;
      getById<T extends IModelGetOptions<EntityOrder,ModelOrder>>(id: TableIdentity, options?: T): Promise<TypeModelRelationResult<EntityOrder, ModelOrder, T> | undefined>;
updateById<T extends IModelUpdateOptions<EntityOrder,ModelOrder>>(id: TableIdentity, data: TypeModelMutateRelationData<EntityOrder,ModelOrder, T>, options?: T): Promise<TypeModelMutateRelationData<EntityOrder,ModelOrder, T>>;
deleteById<T extends IModelDeleteOptions<EntityOrder,ModelOrder>>(id: TableIdentity, options?: T): Promise<void>;
    }
export interface ModelOrderStats {
      [SymbolKeyEntity]: EntityOrder;
      [SymbolKeyEntityMeta]: EntityOrderMeta;
      [SymbolKeyModelOptions]: IModelOptionsOrderStats;
      get<T extends IModelGetOptions<EntityOrder,ModelOrderStats>>(where: TypeModelWhere<EntityOrder>, options?: T): Promise<TypeModelRelationResult<EntityOrder, ModelOrderStats, T> | undefined>;
      mget<T extends IModelGetOptions<EntityOrder,ModelOrderStats>>(ids: TableIdentity[], options?: T): Promise<TypeModelRelationResult<EntityOrder, ModelOrderStats, T>[]>;
      selectAndCount<T extends IModelSelectParams<EntityOrder,ModelOrderStats,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelSelectAndCount<EntityOrder, ModelOrderStats, T>>;
      select<T extends IModelSelectParams<EntityOrder,ModelOrderStats,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelRelationResult<EntityOrder, ModelOrderStats, T>[]>;
      insert<T extends IModelInsertOptions<EntityOrder,ModelOrderStats>>(data?: TypeModelMutateRelationData<EntityOrder,ModelOrderStats, T>, options?: T): Promise<TypeModelMutateRelationData<EntityOrder,ModelOrderStats, T, true>>;
      insertBulk<T extends IModelInsertOptions<EntityOrder,ModelOrderStats>>(items: TypeModelMutateRelationData<EntityOrder,ModelOrderStats, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityOrder,ModelOrderStats, T, true>[]>;
      update<T extends IModelUpdateOptions<EntityOrder,ModelOrderStats>>(data: TypeModelMutateRelationData<EntityOrder,ModelOrderStats, T>, options?: T): Promise<TypeModelMutateRelationData<EntityOrder,ModelOrderStats, T>>;
      updateBulk<T extends IModelUpdateOptions<EntityOrder,ModelOrderStats>>(items: TypeModelMutateRelationData<EntityOrder,ModelOrderStats, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityOrder,ModelOrderStats, T>[]>;
      delete<T extends IModelDeleteOptions<EntityOrder,ModelOrderStats>>(where?: TypeModelWhere<EntityOrder>, options?: T): Promise<void>;
      deleteBulk<T extends IModelDeleteOptions<EntityOrder,ModelOrderStats>>(ids: TableIdentity[], options?: T): Promise<void>;
      mutate<T extends IModelMutateOptions<EntityOrder,ModelOrderStats>>(data?: TypeModelMutateRelationData<EntityOrder,ModelOrderStats, T>, options?: T): Promise<TypeModelMutateRelationData<EntityOrder,ModelOrderStats, T>>;
      mutateBulk<T extends IModelMutateOptions<EntityOrder,ModelOrderStats>>(items: TypeModelMutateRelationData<EntityOrder,ModelOrderStats, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityOrder,ModelOrderStats, T>[]>;
      count<T extends IModelSelectCountParams<EntityOrder,ModelOrderStats,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<string | undefined>;
      increment<T extends IModelIncrementParams<EntityOrder,ModelOrderStats,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      decrement<T extends IModelIncrementParams<EntityOrder,ModelOrderStats,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      aggregate<T extends IModelSelectAggrParams<EntityOrder,ModelOrderStats,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelAggrRelationResult<T>>;
      group<T extends IModelSelectGroupParams<EntityOrder,ModelOrderStats,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelGroupRelationResult<EntityOrder, T>[]>;
      getById<T extends IModelGetOptions<EntityOrder,ModelOrderStats>>(id: TableIdentity, options?: T): Promise<TypeModelRelationResult<EntityOrder, ModelOrderStats, T> | undefined>;
updateById<T extends IModelUpdateOptions<EntityOrder,ModelOrderStats>>(id: TableIdentity, data: TypeModelMutateRelationData<EntityOrder,ModelOrderStats, T>, options?: T): Promise<TypeModelMutateRelationData<EntityOrder,ModelOrderStats, T>>;
deleteById<T extends IModelDeleteOptions<EntityOrder,ModelOrderStats>>(id: TableIdentity, options?: T): Promise<void>;
    }
export interface ModelPost {
      [SymbolKeyEntity]: EntityPost;
      [SymbolKeyEntityMeta]: EntityPostMeta;
      [SymbolKeyModelOptions]: IModelOptionsPost;
      get<T extends IModelGetOptions<EntityPost,ModelPost>>(where: TypeModelWhere<EntityPost>, options?: T): Promise<TypeModelRelationResult<EntityPost, ModelPost, T> | undefined>;
      mget<T extends IModelGetOptions<EntityPost,ModelPost>>(ids: TableIdentity[], options?: T): Promise<TypeModelRelationResult<EntityPost, ModelPost, T>[]>;
      selectAndCount<T extends IModelSelectParams<EntityPost,ModelPost,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelSelectAndCount<EntityPost, ModelPost, T>>;
      select<T extends IModelSelectParams<EntityPost,ModelPost,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelRelationResult<EntityPost, ModelPost, T>[]>;
      insert<T extends IModelInsertOptions<EntityPost,ModelPost>>(data?: TypeModelMutateRelationData<EntityPost,ModelPost, T>, options?: T): Promise<TypeModelMutateRelationData<EntityPost,ModelPost, T, true>>;
      insertBulk<T extends IModelInsertOptions<EntityPost,ModelPost>>(items: TypeModelMutateRelationData<EntityPost,ModelPost, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityPost,ModelPost, T, true>[]>;
      update<T extends IModelUpdateOptions<EntityPost,ModelPost>>(data: TypeModelMutateRelationData<EntityPost,ModelPost, T>, options?: T): Promise<TypeModelMutateRelationData<EntityPost,ModelPost, T>>;
      updateBulk<T extends IModelUpdateOptions<EntityPost,ModelPost>>(items: TypeModelMutateRelationData<EntityPost,ModelPost, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityPost,ModelPost, T>[]>;
      delete<T extends IModelDeleteOptions<EntityPost,ModelPost>>(where?: TypeModelWhere<EntityPost>, options?: T): Promise<void>;
      deleteBulk<T extends IModelDeleteOptions<EntityPost,ModelPost>>(ids: TableIdentity[], options?: T): Promise<void>;
      mutate<T extends IModelMutateOptions<EntityPost,ModelPost>>(data?: TypeModelMutateRelationData<EntityPost,ModelPost, T>, options?: T): Promise<TypeModelMutateRelationData<EntityPost,ModelPost, T>>;
      mutateBulk<T extends IModelMutateOptions<EntityPost,ModelPost>>(items: TypeModelMutateRelationData<EntityPost,ModelPost, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityPost,ModelPost, T>[]>;
      count<T extends IModelSelectCountParams<EntityPost,ModelPost,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<string | undefined>;
      increment<T extends IModelIncrementParams<EntityPost,ModelPost,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      decrement<T extends IModelIncrementParams<EntityPost,ModelPost,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      aggregate<T extends IModelSelectAggrParams<EntityPost,ModelPost,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelAggrRelationResult<T>>;
      group<T extends IModelSelectGroupParams<EntityPost,ModelPost,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelGroupRelationResult<EntityPost, T>[]>;
      getById<T extends IModelGetOptions<EntityPost,ModelPost>>(id: TableIdentity, options?: T): Promise<TypeModelRelationResult<EntityPost, ModelPost, T> | undefined>;
updateById<T extends IModelUpdateOptions<EntityPost,ModelPost>>(id: TableIdentity, data: TypeModelMutateRelationData<EntityPost,ModelPost, T>, options?: T): Promise<TypeModelMutateRelationData<EntityPost,ModelPost, T>>;
deleteById<T extends IModelDeleteOptions<EntityPost,ModelPost>>(id: TableIdentity, options?: T): Promise<void>;
    }
export interface ModelPostContent {
      [SymbolKeyEntity]: EntityPostContent;
      [SymbolKeyEntityMeta]: EntityPostContentMeta;
      [SymbolKeyModelOptions]: IModelOptionsPostContent;
      get<T extends IModelGetOptions<EntityPostContent,ModelPostContent>>(where: TypeModelWhere<EntityPostContent>, options?: T): Promise<TypeModelRelationResult<EntityPostContent, ModelPostContent, T> | undefined>;
      mget<T extends IModelGetOptions<EntityPostContent,ModelPostContent>>(ids: TableIdentity[], options?: T): Promise<TypeModelRelationResult<EntityPostContent, ModelPostContent, T>[]>;
      selectAndCount<T extends IModelSelectParams<EntityPostContent,ModelPostContent,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelSelectAndCount<EntityPostContent, ModelPostContent, T>>;
      select<T extends IModelSelectParams<EntityPostContent,ModelPostContent,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelRelationResult<EntityPostContent, ModelPostContent, T>[]>;
      insert<T extends IModelInsertOptions<EntityPostContent,ModelPostContent>>(data?: TypeModelMutateRelationData<EntityPostContent,ModelPostContent, T>, options?: T): Promise<TypeModelMutateRelationData<EntityPostContent,ModelPostContent, T, true>>;
      insertBulk<T extends IModelInsertOptions<EntityPostContent,ModelPostContent>>(items: TypeModelMutateRelationData<EntityPostContent,ModelPostContent, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityPostContent,ModelPostContent, T, true>[]>;
      update<T extends IModelUpdateOptions<EntityPostContent,ModelPostContent>>(data: TypeModelMutateRelationData<EntityPostContent,ModelPostContent, T>, options?: T): Promise<TypeModelMutateRelationData<EntityPostContent,ModelPostContent, T>>;
      updateBulk<T extends IModelUpdateOptions<EntityPostContent,ModelPostContent>>(items: TypeModelMutateRelationData<EntityPostContent,ModelPostContent, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityPostContent,ModelPostContent, T>[]>;
      delete<T extends IModelDeleteOptions<EntityPostContent,ModelPostContent>>(where?: TypeModelWhere<EntityPostContent>, options?: T): Promise<void>;
      deleteBulk<T extends IModelDeleteOptions<EntityPostContent,ModelPostContent>>(ids: TableIdentity[], options?: T): Promise<void>;
      mutate<T extends IModelMutateOptions<EntityPostContent,ModelPostContent>>(data?: TypeModelMutateRelationData<EntityPostContent,ModelPostContent, T>, options?: T): Promise<TypeModelMutateRelationData<EntityPostContent,ModelPostContent, T>>;
      mutateBulk<T extends IModelMutateOptions<EntityPostContent,ModelPostContent>>(items: TypeModelMutateRelationData<EntityPostContent,ModelPostContent, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityPostContent,ModelPostContent, T>[]>;
      count<T extends IModelSelectCountParams<EntityPostContent,ModelPostContent,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<string | undefined>;
      increment<T extends IModelIncrementParams<EntityPostContent,ModelPostContent,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      decrement<T extends IModelIncrementParams<EntityPostContent,ModelPostContent,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      aggregate<T extends IModelSelectAggrParams<EntityPostContent,ModelPostContent,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelAggrRelationResult<T>>;
      group<T extends IModelSelectGroupParams<EntityPostContent,ModelPostContent,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelGroupRelationResult<EntityPostContent, T>[]>;
      getById<T extends IModelGetOptions<EntityPostContent,ModelPostContent>>(id: TableIdentity, options?: T): Promise<TypeModelRelationResult<EntityPostContent, ModelPostContent, T> | undefined>;
updateById<T extends IModelUpdateOptions<EntityPostContent,ModelPostContent>>(id: TableIdentity, data: TypeModelMutateRelationData<EntityPostContent,ModelPostContent, T>, options?: T): Promise<TypeModelMutateRelationData<EntityPostContent,ModelPostContent, T>>;
deleteById<T extends IModelDeleteOptions<EntityPostContent,ModelPostContent>>(id: TableIdentity, options?: T): Promise<void>;
    }
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
export interface ModelRole {
      [SymbolKeyEntity]: EntityRole;
      [SymbolKeyEntityMeta]: EntityRoleMeta;
      [SymbolKeyModelOptions]: IModelOptionsRole;
      get<T extends IModelGetOptions<EntityRole,ModelRole>>(where: TypeModelWhere<EntityRole>, options?: T): Promise<TypeModelRelationResult<EntityRole, ModelRole, T> | undefined>;
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
export interface ModelTest {
      [SymbolKeyEntity]: EntityTest;
      [SymbolKeyEntityMeta]: EntityTestMeta;
      [SymbolKeyModelOptions]: IModelOptionsTest;
      get<T extends IModelGetOptions<EntityTest,ModelTest>>(where: TypeModelWhere<EntityTest>, options?: T): Promise<TypeModelRelationResult<EntityTest, ModelTest, T> | undefined>;
      mget<T extends IModelGetOptions<EntityTest,ModelTest>>(ids: TableIdentity[], options?: T): Promise<TypeModelRelationResult<EntityTest, ModelTest, T>[]>;
      selectAndCount<T extends IModelSelectParams<EntityTest,ModelTest,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelSelectAndCount<EntityTest, ModelTest, T>>;
      select<T extends IModelSelectParams<EntityTest,ModelTest,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelRelationResult<EntityTest, ModelTest, T>[]>;
      insert<T extends IModelInsertOptions<EntityTest,ModelTest>>(data?: TypeModelMutateRelationData<EntityTest,ModelTest, T>, options?: T): Promise<TypeModelMutateRelationData<EntityTest,ModelTest, T, true>>;
      insertBulk<T extends IModelInsertOptions<EntityTest,ModelTest>>(items: TypeModelMutateRelationData<EntityTest,ModelTest, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityTest,ModelTest, T, true>[]>;
      update<T extends IModelUpdateOptions<EntityTest,ModelTest>>(data: TypeModelMutateRelationData<EntityTest,ModelTest, T>, options?: T): Promise<TypeModelMutateRelationData<EntityTest,ModelTest, T>>;
      updateBulk<T extends IModelUpdateOptions<EntityTest,ModelTest>>(items: TypeModelMutateRelationData<EntityTest,ModelTest, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityTest,ModelTest, T>[]>;
      delete<T extends IModelDeleteOptions<EntityTest,ModelTest>>(where?: TypeModelWhere<EntityTest>, options?: T): Promise<void>;
      deleteBulk<T extends IModelDeleteOptions<EntityTest,ModelTest>>(ids: TableIdentity[], options?: T): Promise<void>;
      mutate<T extends IModelMutateOptions<EntityTest,ModelTest>>(data?: TypeModelMutateRelationData<EntityTest,ModelTest, T>, options?: T): Promise<TypeModelMutateRelationData<EntityTest,ModelTest, T>>;
      mutateBulk<T extends IModelMutateOptions<EntityTest,ModelTest>>(items: TypeModelMutateRelationData<EntityTest,ModelTest, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityTest,ModelTest, T>[]>;
      count<T extends IModelSelectCountParams<EntityTest,ModelTest,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<string | undefined>;
      increment<T extends IModelIncrementParams<EntityTest,ModelTest,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      decrement<T extends IModelIncrementParams<EntityTest,ModelTest,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      aggregate<T extends IModelSelectAggrParams<EntityTest,ModelTest,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelAggrRelationResult<T>>;
      group<T extends IModelSelectGroupParams<EntityTest,ModelTest,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelGroupRelationResult<EntityTest, T>[]>;
      getById<T extends IModelGetOptions<EntityTest,ModelTest>>(id: TableIdentity, options?: T): Promise<TypeModelRelationResult<EntityTest, ModelTest, T> | undefined>;
updateById<T extends IModelUpdateOptions<EntityTest,ModelTest>>(id: TableIdentity, data: TypeModelMutateRelationData<EntityTest,ModelTest, T>, options?: T): Promise<TypeModelMutateRelationData<EntityTest,ModelTest, T>>;
deleteById<T extends IModelDeleteOptions<EntityTest,ModelTest>>(id: TableIdentity, options?: T): Promise<void>;
    }
export interface ModelTestDynamicTable {
      [SymbolKeyEntity]: EntityTest;
      [SymbolKeyEntityMeta]: EntityTestMeta;
      [SymbolKeyModelOptions]: IModelOptionsTestDynamicTable;
      get<T extends IModelGetOptions<EntityTest,ModelTestDynamicTable>>(where: TypeModelWhere<EntityTest>, options?: T): Promise<TypeModelRelationResult<EntityTest, ModelTestDynamicTable, T> | undefined>;
      mget<T extends IModelGetOptions<EntityTest,ModelTestDynamicTable>>(ids: TableIdentity[], options?: T): Promise<TypeModelRelationResult<EntityTest, ModelTestDynamicTable, T>[]>;
      selectAndCount<T extends IModelSelectParams<EntityTest,ModelTestDynamicTable,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelSelectAndCount<EntityTest, ModelTestDynamicTable, T>>;
      select<T extends IModelSelectParams<EntityTest,ModelTestDynamicTable,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelRelationResult<EntityTest, ModelTestDynamicTable, T>[]>;
      insert<T extends IModelInsertOptions<EntityTest,ModelTestDynamicTable>>(data?: TypeModelMutateRelationData<EntityTest,ModelTestDynamicTable, T>, options?: T): Promise<TypeModelMutateRelationData<EntityTest,ModelTestDynamicTable, T, true>>;
      insertBulk<T extends IModelInsertOptions<EntityTest,ModelTestDynamicTable>>(items: TypeModelMutateRelationData<EntityTest,ModelTestDynamicTable, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityTest,ModelTestDynamicTable, T, true>[]>;
      update<T extends IModelUpdateOptions<EntityTest,ModelTestDynamicTable>>(data: TypeModelMutateRelationData<EntityTest,ModelTestDynamicTable, T>, options?: T): Promise<TypeModelMutateRelationData<EntityTest,ModelTestDynamicTable, T>>;
      updateBulk<T extends IModelUpdateOptions<EntityTest,ModelTestDynamicTable>>(items: TypeModelMutateRelationData<EntityTest,ModelTestDynamicTable, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityTest,ModelTestDynamicTable, T>[]>;
      delete<T extends IModelDeleteOptions<EntityTest,ModelTestDynamicTable>>(where?: TypeModelWhere<EntityTest>, options?: T): Promise<void>;
      deleteBulk<T extends IModelDeleteOptions<EntityTest,ModelTestDynamicTable>>(ids: TableIdentity[], options?: T): Promise<void>;
      mutate<T extends IModelMutateOptions<EntityTest,ModelTestDynamicTable>>(data?: TypeModelMutateRelationData<EntityTest,ModelTestDynamicTable, T>, options?: T): Promise<TypeModelMutateRelationData<EntityTest,ModelTestDynamicTable, T>>;
      mutateBulk<T extends IModelMutateOptions<EntityTest,ModelTestDynamicTable>>(items: TypeModelMutateRelationData<EntityTest,ModelTestDynamicTable, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityTest,ModelTestDynamicTable, T>[]>;
      count<T extends IModelSelectCountParams<EntityTest,ModelTestDynamicTable,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<string | undefined>;
      increment<T extends IModelIncrementParams<EntityTest,ModelTestDynamicTable,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      decrement<T extends IModelIncrementParams<EntityTest,ModelTestDynamicTable,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      aggregate<T extends IModelSelectAggrParams<EntityTest,ModelTestDynamicTable,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelAggrRelationResult<T>>;
      group<T extends IModelSelectGroupParams<EntityTest,ModelTestDynamicTable,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelGroupRelationResult<EntityTest, T>[]>;
      getById<T extends IModelGetOptions<EntityTest,ModelTestDynamicTable>>(id: TableIdentity, options?: T): Promise<TypeModelRelationResult<EntityTest, ModelTestDynamicTable, T> | undefined>;
updateById<T extends IModelUpdateOptions<EntityTest,ModelTestDynamicTable>>(id: TableIdentity, data: TypeModelMutateRelationData<EntityTest,ModelTestDynamicTable, T>, options?: T): Promise<TypeModelMutateRelationData<EntityTest,ModelTestDynamicTable, T>>;
deleteById<T extends IModelDeleteOptions<EntityTest,ModelTestDynamicTable>>(id: TableIdentity, options?: T): Promise<void>;
    }
export interface ModelUser {
      [SymbolKeyEntity]: EntityUser;
      [SymbolKeyEntityMeta]: EntityUserMeta;
      [SymbolKeyModelOptions]: IModelOptionsUser;
      get<T extends IModelGetOptions<EntityUser,ModelUser>>(where: TypeModelWhere<EntityUser>, options?: T): Promise<TypeModelRelationResult<EntityUser, ModelUser, T> | undefined>;
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
export interface ModelUserStats {
      [SymbolKeyEntity]: EntityUser;
      [SymbolKeyEntityMeta]: EntityUserMeta;
      [SymbolKeyModelOptions]: IModelOptionsUserStats;
      get<T extends IModelGetOptions<EntityUser,ModelUserStats>>(where: TypeModelWhere<EntityUser>, options?: T): Promise<TypeModelRelationResult<EntityUser, ModelUserStats, T> | undefined>;
      mget<T extends IModelGetOptions<EntityUser,ModelUserStats>>(ids: TableIdentity[], options?: T): Promise<TypeModelRelationResult<EntityUser, ModelUserStats, T>[]>;
      selectAndCount<T extends IModelSelectParams<EntityUser,ModelUserStats,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelSelectAndCount<EntityUser, ModelUserStats, T>>;
      select<T extends IModelSelectParams<EntityUser,ModelUserStats,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelRelationResult<EntityUser, ModelUserStats, T>[]>;
      insert<T extends IModelInsertOptions<EntityUser,ModelUserStats>>(data?: TypeModelMutateRelationData<EntityUser,ModelUserStats, T>, options?: T): Promise<TypeModelMutateRelationData<EntityUser,ModelUserStats, T, true>>;
      insertBulk<T extends IModelInsertOptions<EntityUser,ModelUserStats>>(items: TypeModelMutateRelationData<EntityUser,ModelUserStats, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityUser,ModelUserStats, T, true>[]>;
      update<T extends IModelUpdateOptions<EntityUser,ModelUserStats>>(data: TypeModelMutateRelationData<EntityUser,ModelUserStats, T>, options?: T): Promise<TypeModelMutateRelationData<EntityUser,ModelUserStats, T>>;
      updateBulk<T extends IModelUpdateOptions<EntityUser,ModelUserStats>>(items: TypeModelMutateRelationData<EntityUser,ModelUserStats, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityUser,ModelUserStats, T>[]>;
      delete<T extends IModelDeleteOptions<EntityUser,ModelUserStats>>(where?: TypeModelWhere<EntityUser>, options?: T): Promise<void>;
      deleteBulk<T extends IModelDeleteOptions<EntityUser,ModelUserStats>>(ids: TableIdentity[], options?: T): Promise<void>;
      mutate<T extends IModelMutateOptions<EntityUser,ModelUserStats>>(data?: TypeModelMutateRelationData<EntityUser,ModelUserStats, T>, options?: T): Promise<TypeModelMutateRelationData<EntityUser,ModelUserStats, T>>;
      mutateBulk<T extends IModelMutateOptions<EntityUser,ModelUserStats>>(items: TypeModelMutateRelationData<EntityUser,ModelUserStats, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityUser,ModelUserStats, T>[]>;
      count<T extends IModelSelectCountParams<EntityUser,ModelUserStats,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<string | undefined>;
      increment<T extends IModelIncrementParams<EntityUser,ModelUserStats,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      decrement<T extends IModelIncrementParams<EntityUser,ModelUserStats,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      aggregate<T extends IModelSelectAggrParams<EntityUser,ModelUserStats,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelAggrRelationResult<T>>;
      group<T extends IModelSelectGroupParams<EntityUser,ModelUserStats,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelGroupRelationResult<EntityUser, T>[]>;
      getById<T extends IModelGetOptions<EntityUser,ModelUserStats>>(id: TableIdentity, options?: T): Promise<TypeModelRelationResult<EntityUser, ModelUserStats, T> | undefined>;
updateById<T extends IModelUpdateOptions<EntityUser,ModelUserStats>>(id: TableIdentity, data: TypeModelMutateRelationData<EntityUser,ModelUserStats, T>, options?: T): Promise<TypeModelMutateRelationData<EntityUser,ModelUserStats, T>>;
deleteById<T extends IModelDeleteOptions<EntityUser,ModelUserStats>>(id: TableIdentity, options?: T): Promise<void>;
getByName<T extends IModelGetOptions<EntityUser,ModelUserStats>>(name?: string, options?: T): Promise<TypeModelRelationResult<EntityUser, ModelUserStats, T> | undefined>;
getByNameEqI<T extends IModelGetOptions<EntityUser,ModelUserStats>>(name?: string, options?: T): Promise<TypeModelRelationResult<EntityUser, ModelUserStats, T> | undefined>;
selectByName<T extends IModelSelectParams<EntityUser,ModelUserStats,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(name?: string, params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelRelationResult<EntityUser, ModelUserStats, T>[]>;
selectByNameEqI<T extends IModelSelectParams<EntityUser,ModelUserStats,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(name?: string, params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelRelationResult<EntityUser, ModelUserStats, T>[]>;
    }
export interface ModelUserStatsGroup {
      [SymbolKeyEntity]: EntityUser;
      [SymbolKeyEntityMeta]: EntityUserMeta;
      [SymbolKeyModelOptions]: IModelOptionsUserStatsGroup;
      get<T extends IModelGetOptions<EntityUser,ModelUserStatsGroup>>(where: TypeModelWhere<EntityUser>, options?: T): Promise<TypeModelRelationResult<EntityUser, ModelUserStatsGroup, T> | undefined>;
      mget<T extends IModelGetOptions<EntityUser,ModelUserStatsGroup>>(ids: TableIdentity[], options?: T): Promise<TypeModelRelationResult<EntityUser, ModelUserStatsGroup, T>[]>;
      selectAndCount<T extends IModelSelectParams<EntityUser,ModelUserStatsGroup,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelSelectAndCount<EntityUser, ModelUserStatsGroup, T>>;
      select<T extends IModelSelectParams<EntityUser,ModelUserStatsGroup,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelRelationResult<EntityUser, ModelUserStatsGroup, T>[]>;
      insert<T extends IModelInsertOptions<EntityUser,ModelUserStatsGroup>>(data?: TypeModelMutateRelationData<EntityUser,ModelUserStatsGroup, T>, options?: T): Promise<TypeModelMutateRelationData<EntityUser,ModelUserStatsGroup, T, true>>;
      insertBulk<T extends IModelInsertOptions<EntityUser,ModelUserStatsGroup>>(items: TypeModelMutateRelationData<EntityUser,ModelUserStatsGroup, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityUser,ModelUserStatsGroup, T, true>[]>;
      update<T extends IModelUpdateOptions<EntityUser,ModelUserStatsGroup>>(data: TypeModelMutateRelationData<EntityUser,ModelUserStatsGroup, T>, options?: T): Promise<TypeModelMutateRelationData<EntityUser,ModelUserStatsGroup, T>>;
      updateBulk<T extends IModelUpdateOptions<EntityUser,ModelUserStatsGroup>>(items: TypeModelMutateRelationData<EntityUser,ModelUserStatsGroup, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityUser,ModelUserStatsGroup, T>[]>;
      delete<T extends IModelDeleteOptions<EntityUser,ModelUserStatsGroup>>(where?: TypeModelWhere<EntityUser>, options?: T): Promise<void>;
      deleteBulk<T extends IModelDeleteOptions<EntityUser,ModelUserStatsGroup>>(ids: TableIdentity[], options?: T): Promise<void>;
      mutate<T extends IModelMutateOptions<EntityUser,ModelUserStatsGroup>>(data?: TypeModelMutateRelationData<EntityUser,ModelUserStatsGroup, T>, options?: T): Promise<TypeModelMutateRelationData<EntityUser,ModelUserStatsGroup, T>>;
      mutateBulk<T extends IModelMutateOptions<EntityUser,ModelUserStatsGroup>>(items: TypeModelMutateRelationData<EntityUser,ModelUserStatsGroup, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityUser,ModelUserStatsGroup, T>[]>;
      count<T extends IModelSelectCountParams<EntityUser,ModelUserStatsGroup,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<string | undefined>;
      increment<T extends IModelIncrementParams<EntityUser,ModelUserStatsGroup,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      decrement<T extends IModelIncrementParams<EntityUser,ModelUserStatsGroup,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      aggregate<T extends IModelSelectAggrParams<EntityUser,ModelUserStatsGroup,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelAggrRelationResult<T>>;
      group<T extends IModelSelectGroupParams<EntityUser,ModelUserStatsGroup,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelGroupRelationResult<EntityUser, T>[]>;
      getById<T extends IModelGetOptions<EntityUser,ModelUserStatsGroup>>(id: TableIdentity, options?: T): Promise<TypeModelRelationResult<EntityUser, ModelUserStatsGroup, T> | undefined>;
updateById<T extends IModelUpdateOptions<EntityUser,ModelUserStatsGroup>>(id: TableIdentity, data: TypeModelMutateRelationData<EntityUser,ModelUserStatsGroup, T>, options?: T): Promise<TypeModelMutateRelationData<EntityUser,ModelUserStatsGroup, T>>;
deleteById<T extends IModelDeleteOptions<EntityUser,ModelUserStatsGroup>>(id: TableIdentity, options?: T): Promise<void>;
getByName<T extends IModelGetOptions<EntityUser,ModelUserStatsGroup>>(name?: string, options?: T): Promise<TypeModelRelationResult<EntityUser, ModelUserStatsGroup, T> | undefined>;
getByNameEqI<T extends IModelGetOptions<EntityUser,ModelUserStatsGroup>>(name?: string, options?: T): Promise<TypeModelRelationResult<EntityUser, ModelUserStatsGroup, T> | undefined>;
selectByName<T extends IModelSelectParams<EntityUser,ModelUserStatsGroup,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(name?: string, params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelRelationResult<EntityUser, ModelUserStatsGroup, T>[]>;
selectByNameEqI<T extends IModelSelectParams<EntityUser,ModelUserStatsGroup,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(name?: string, params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelRelationResult<EntityUser, ModelUserStatsGroup, T>[]>;
    }
}
declare module 'vona-module-a-orm' {
  export interface IModelClassRecord {
    'test-vona:category': ModelCategory;
'test-vona:categoryChain': ModelCategoryChain;
'test-vona:order': ModelOrder;
'test-vona:orderStats': ModelOrderStats;
'test-vona:post': ModelPost;
'test-vona:postContent': ModelPostContent;
'test-vona:product': ModelProduct;
'test-vona:role': ModelRole;
'test-vona:roleUser': ModelRoleUser;
'test-vona:test': ModelTest;
'test-vona:testDynamicTable': ModelTestDynamicTable;
'test-vona:user': ModelUser;
'test-vona:userStats': ModelUserStats;
'test-vona:userStatsGroup': ModelUserStatsGroup;
  }
}
/** model: end */
/** bean: begin */
export * from '../bean/bean.testCtx.ts';

import 'vona';
declare module 'vona' {
  
  
}
declare module 'vona-module-test-vona' {
  
        export interface BeanTestCtx {
          /** @internal */
          get scope(): ScopeModuleTestVona;
        } 
}
/** bean: end */
/** bean: begin */
import type { BeanTestCtx } from '../bean/bean.testCtx.ts';
import 'vona';  
declare module 'vona' {
  export interface IBeanRecordGlobal {
    'testCtx': BeanTestCtx;
  }
}
/** bean: end */
/** service: begin */
export * from '../service/aopMethod.ts';
export * from '../service/caching.ts';
export * from '../service/category.ts';
export * from '../service/order.ts';
export * from '../service/post.ts';
export * from '../service/product.ts';
export * from '../service/test.ts';
export * from '../service/testApp.ts';
export * from '../service/testClass.ts';
export * from '../service/testData.ts';
export * from '../service/transaction.ts';
export * from '../service/user.ts';

import 'vona-module-a-bean';
declare module 'vona-module-a-bean' {
  
    export interface IServiceRecord {
      'test-vona:aopMethod': never;
'test-vona:caching': never;
'test-vona:category': never;
'test-vona:order': never;
'test-vona:post': never;
'test-vona:product': never;
'test-vona:test': never;
'test-vona:testApp': never;
'test-vona:testClass': never;
'test-vona:testData': never;
'test-vona:transaction': never;
'test-vona:user': never;
    }

  
}
declare module 'vona-module-test-vona' {
  
        export interface ServiceAopMethod {
          /** @internal */
          get scope(): ScopeModuleTestVona;
        }

          export interface ServiceAopMethod {
            get $beanFullName(): 'test-vona.service.aopMethod';
            get $onionName(): 'test-vona:aopMethod';
            
          }

        export interface ServiceCaching {
          /** @internal */
          get scope(): ScopeModuleTestVona;
        }

          export interface ServiceCaching {
            get $beanFullName(): 'test-vona.service.caching';
            get $onionName(): 'test-vona:caching';
            
          }

        export interface ServiceCategory {
          /** @internal */
          get scope(): ScopeModuleTestVona;
        }

          export interface ServiceCategory {
            get $beanFullName(): 'test-vona.service.category';
            get $onionName(): 'test-vona:category';
            
          }

        export interface ServiceOrder {
          /** @internal */
          get scope(): ScopeModuleTestVona;
        }

          export interface ServiceOrder {
            get $beanFullName(): 'test-vona.service.order';
            get $onionName(): 'test-vona:order';
            
          }

        export interface ServicePost {
          /** @internal */
          get scope(): ScopeModuleTestVona;
        }

          export interface ServicePost {
            get $beanFullName(): 'test-vona.service.post';
            get $onionName(): 'test-vona:post';
            
          }

        export interface ServiceProduct {
          /** @internal */
          get scope(): ScopeModuleTestVona;
        }

          export interface ServiceProduct {
            get $beanFullName(): 'test-vona.service.product';
            get $onionName(): 'test-vona:product';
            
          }

        export interface ServiceTest {
          /** @internal */
          get scope(): ScopeModuleTestVona;
        }

          export interface ServiceTest {
            get $beanFullName(): 'test-vona.service.test';
            get $onionName(): 'test-vona:test';
            
          }

        export interface ServiceTestApp {
          /** @internal */
          get scope(): ScopeModuleTestVona;
        }

          export interface ServiceTestApp {
            get $beanFullName(): 'test-vona.service.testApp';
            get $onionName(): 'test-vona:testApp';
            
          }

        export interface ServiceTestClass {
          /** @internal */
          get scope(): ScopeModuleTestVona;
        }

          export interface ServiceTestClass {
            get $beanFullName(): 'test-vona.service.testClass';
            get $onionName(): 'test-vona:testClass';
            
          }

        export interface ServiceTestData {
          /** @internal */
          get scope(): ScopeModuleTestVona;
        }

          export interface ServiceTestData {
            get $beanFullName(): 'test-vona.service.testData';
            get $onionName(): 'test-vona:testData';
            
          }

        export interface ServiceTransaction {
          /** @internal */
          get scope(): ScopeModuleTestVona;
        }

          export interface ServiceTransaction {
            get $beanFullName(): 'test-vona.service.transaction';
            get $onionName(): 'test-vona:transaction';
            
          }

        export interface ServiceUser {
          /** @internal */
          get scope(): ScopeModuleTestVona;
        }

          export interface ServiceUser {
            get $beanFullName(): 'test-vona.service.user';
            get $onionName(): 'test-vona:user';
            
          } 
}
/** service: end */
/** service: begin */
import type { ServiceAopMethod } from '../service/aopMethod.ts';
import type { ServiceCaching } from '../service/caching.ts';
import type { ServiceCategory } from '../service/category.ts';
import type { ServiceOrder } from '../service/order.ts';
import type { ServicePost } from '../service/post.ts';
import type { ServiceProduct } from '../service/product.ts';
import type { ServiceTest } from '../service/test.ts';
import type { ServiceTestApp } from '../service/testApp.ts';
import type { ServiceTestClass } from '../service/testClass.ts';
import type { ServiceTestData } from '../service/testData.ts';
import type { ServiceTransaction } from '../service/transaction.ts';
import type { ServiceUser } from '../service/user.ts';
export interface IModuleService {
  'aopMethod': ServiceAopMethod;
'caching': ServiceCaching;
'category': ServiceCategory;
'order': ServiceOrder;
'post': ServicePost;
'product': ServiceProduct;
'test': ServiceTest;
'testApp': ServiceTestApp;
'testClass': ServiceTestClass;
'testData': ServiceTestData;
'transaction': ServiceTransaction;
'user': ServiceUser;
}
/** service: end */
/** service: begin */

import 'vona';
declare module 'vona' {
  export interface IBeanRecordGeneral {
    'test-vona.service.aopMethod': ServiceAopMethod;
'test-vona.service.caching': ServiceCaching;
'test-vona.service.category': ServiceCategory;
'test-vona.service.order': ServiceOrder;
'test-vona.service.post': ServicePost;
'test-vona.service.product': ServiceProduct;
'test-vona.service.test': ServiceTest;
'test-vona.service.testApp': ServiceTestApp;
'test-vona.service.testClass': ServiceTestClass;
'test-vona.service.testData': ServiceTestData;
'test-vona.service.transaction': ServiceTransaction;
'test-vona.service.user': ServiceUser;
  }
}
/** service: end */
/** broadcast: begin */
export * from '../bean/broadcast.test.ts';

import { type IDecoratorBroadcastOptions } from 'vona-module-a-broadcast';
declare module 'vona-module-a-broadcast' {
  
    export interface IBroadcastRecord {
      'test-vona:test': IDecoratorBroadcastOptions;
    }

  
}
declare module 'vona-module-test-vona' {
  
        export interface BroadcastTest {
          /** @internal */
          get scope(): ScopeModuleTestVona;
        }

          export interface BroadcastTest {
            get $beanFullName(): 'test-vona.broadcast.test';
            get $onionName(): 'test-vona:test';
            get $onionOptions(): IDecoratorBroadcastOptions;
          } 
}
/** broadcast: end */
/** broadcast: begin */
import type { BroadcastTest } from '../bean/broadcast.test.ts';
export interface IModuleBroadcast {
  'test': BroadcastTest;
}
/** broadcast: end */
/** cacheMem: begin */
export * from '../bean/cacheMem.test.ts';

import { type IDecoratorCacheMemOptions } from 'vona-module-a-cache';
declare module 'vona-module-a-cache' {
  
    export interface ICacheMemRecord {
      'test-vona:test': IDecoratorCacheMemOptions;
    }

  
}
declare module 'vona-module-test-vona' {
  
        export interface CacheMemTest {
          /** @internal */
          get scope(): ScopeModuleTestVona;
        }

          export interface CacheMemTest {
            get $beanFullName(): 'test-vona.cacheMem.test';
            get $onionName(): 'test-vona:test';
            get $onionOptions(): IDecoratorCacheMemOptions;
          } 
}
/** cacheMem: end */
/** cacheMem: begin */
import type { CacheMemTest } from '../bean/cacheMem.test.ts';
export interface IModuleCacheMem {
  'test': CacheMemTest;
}
/** cacheMem: end */
/** cacheRedis: begin */
export * from '../bean/cacheRedis.post.ts';
export * from '../bean/cacheRedis.test.ts';

import { type IDecoratorCacheRedisOptions } from 'vona-module-a-cache';
declare module 'vona-module-a-cache' {
  
    export interface ICacheRedisRecord {
      'test-vona:post': IDecoratorCacheRedisOptions;
'test-vona:test': IDecoratorCacheRedisOptions;
    }

  
}
declare module 'vona-module-test-vona' {
  
        export interface CacheRedisPost {
          /** @internal */
          get scope(): ScopeModuleTestVona;
        }

          export interface CacheRedisPost {
            get $beanFullName(): 'test-vona.cacheRedis.post';
            get $onionName(): 'test-vona:post';
            get $onionOptions(): IDecoratorCacheRedisOptions;
          }

        export interface CacheRedisTest {
          /** @internal */
          get scope(): ScopeModuleTestVona;
        }

          export interface CacheRedisTest {
            get $beanFullName(): 'test-vona.cacheRedis.test';
            get $onionName(): 'test-vona:test';
            get $onionOptions(): IDecoratorCacheRedisOptions;
          } 
}
/** cacheRedis: end */
/** cacheRedis: begin */
import type { CacheRedisPost } from '../bean/cacheRedis.post.ts';
import type { CacheRedisTest } from '../bean/cacheRedis.test.ts';
export interface IModuleCacheRedis {
  'post': CacheRedisPost;
'test': CacheRedisTest;
}
/** cacheRedis: end */
/** event: begin */
export * from '../bean/event.helloEcho.ts';

import 'vona';
declare module 'vona' {
  
  
}
declare module 'vona-module-test-vona' {
  
        export interface EventHelloEcho {
          /** @internal */
          get scope(): ScopeModuleTestVona;
        }

          export interface EventHelloEcho {
            get $beanFullName(): 'test-vona.event.helloEcho';
            get $onionName(): 'test-vona:helloEcho';
            
          } 
}
/** event: end */
/** event: begin */
import type { EventHelloEcho } from '../bean/event.helloEcho.ts';
export interface IModuleEvent {
  'helloEcho': EventHelloEcho;
}
/** event: end */
/** event: begin */
import type { TypeEventHelloEchoData, TypeEventHelloEchoResult } from '../bean/event.helloEcho.ts';
import type { EventOn } from 'vona-module-a-event'; 
declare module 'vona-module-a-event' {
  export interface IEventRecord {
    'test-vona:helloEcho': EventOn<TypeEventHelloEchoData, TypeEventHelloEchoResult>;
  }
}
/** event: end */
/** eventListener: begin */
export * from '../bean/eventListener.helloEcho.ts';

import { type IDecoratorEventListenerOptions } from 'vona-module-a-event';
declare module 'vona-module-a-event' {
  
    export interface IEventListenerRecord {
      'test-vona:helloEcho': IDecoratorEventListenerOptions;
    }

  
}
declare module 'vona-module-test-vona' {
  
        export interface EventListenerHelloEcho {
          /** @internal */
          get scope(): ScopeModuleTestVona;
        }

          export interface EventListenerHelloEcho {
            get $beanFullName(): 'test-vona.eventListener.helloEcho';
            get $onionName(): 'test-vona:helloEcho';
            get $onionOptions(): IDecoratorEventListenerOptions;
          } 
}
/** eventListener: end */
/** meta: begin */
export * from '../bean/meta.asset.ts';
export * from '../bean/meta.static.ts';
export * from '../bean/meta.version.ts';

import 'vona-module-a-meta';
declare module 'vona-module-a-meta' {
  
    export interface IMetaRecord {
      'test-vona:asset': never;
'test-vona:static': never;
'test-vona:version': never;
    }

  
}
declare module 'vona-module-test-vona' {
  
        export interface MetaAsset {
          /** @internal */
          get scope(): ScopeModuleTestVona;
        }

          export interface MetaAsset {
            get $beanFullName(): 'test-vona.meta.asset';
            get $onionName(): 'test-vona:asset';
            
          }

        export interface MetaStatic {
          /** @internal */
          get scope(): ScopeModuleTestVona;
        }

          export interface MetaStatic {
            get $beanFullName(): 'test-vona.meta.static';
            get $onionName(): 'test-vona:static';
            
          }

        export interface MetaVersion {
          /** @internal */
          get scope(): ScopeModuleTestVona;
        }

          export interface MetaVersion {
            get $beanFullName(): 'test-vona.meta.version';
            get $onionName(): 'test-vona:version';
            
          } 
}
/** meta: end */
/** meta static: begin */
import type { MetaStatic } from '../bean/meta.static.ts';
/** meta static: end */
/** meta asset: begin */
import type { MetaAsset } from '../bean/meta.asset.ts';
/** meta asset: end */
/** queue: begin */
export * from '../bean/queue.test.ts';

import { type IDecoratorQueueOptions } from 'vona-module-a-queue';
declare module 'vona-module-a-queue' {
  
    export interface IQueueRecord {
      'test-vona:test': IDecoratorQueueOptions;
    }

  
}
declare module 'vona-module-test-vona' {
  
        export interface QueueTest {
          /** @internal */
          get scope(): ScopeModuleTestVona;
        }

          export interface QueueTest {
            get $beanFullName(): 'test-vona.queue.test';
            get $onionName(): 'test-vona:test';
            get $onionOptions(): IDecoratorQueueOptions;
          } 
}
/** queue: end */
/** queue: begin */
import type { QueueTest } from '../bean/queue.test.ts';
export interface IModuleQueue {
  'test': QueueTest;
}
/** queue: end */
/** schedule: begin */
export * from '../bean/schedule.test.ts';
export * from '../bean/schedule.test3.ts';

import { type IDecoratorScheduleOptions } from 'vona-module-a-schedule';
declare module 'vona-module-a-schedule' {
  
    export interface IScheduleRecord {
      'test-vona:test': IDecoratorScheduleOptions;
'test-vona:test3': IDecoratorScheduleOptions;
    }

  
}
declare module 'vona-module-test-vona' {
  
        export interface ScheduleTest {
          /** @internal */
          get scope(): ScopeModuleTestVona;
        }

          export interface ScheduleTest {
            get $beanFullName(): 'test-vona.schedule.test';
            get $onionName(): 'test-vona:test';
            get $onionOptions(): IDecoratorScheduleOptions;
          }

        export interface ScheduleTest3 {
          /** @internal */
          get scope(): ScopeModuleTestVona;
        }

          export interface ScheduleTest3 {
            get $beanFullName(): 'test-vona.schedule.test3';
            get $onionName(): 'test-vona:test3';
            get $onionOptions(): IDecoratorScheduleOptions;
          } 
}
/** schedule: end */
/** serializerTransform: begin */
export * from '../bean/serializerTransform.email.ts';
import type { ISerializerTransformOptionsEmail } from '../bean/serializerTransform.email.ts';
import 'vona-module-a-serialization';
declare module 'vona-module-a-serialization' {
  
    export interface ISerializerTransformRecord {
      'test-vona:email': ISerializerTransformOptionsEmail;
    }

  
}
declare module 'vona-module-test-vona' {
  
        export interface SerializerTransformEmail {
          /** @internal */
          get scope(): ScopeModuleTestVona;
        }

          export interface SerializerTransformEmail {
            get $beanFullName(): 'test-vona.serializerTransform.email';
            get $onionName(): 'test-vona:email';
            get $onionOptions(): ISerializerTransformOptionsEmail;
          } 
}
/** serializerTransform: end */
/** summerCache: begin */
export * from '../bean/summerCache.caching.ts';
export * from '../bean/summerCache.test.ts';

import { type IDecoratorSummerCacheOptions } from 'vona-module-a-summer';
declare module 'vona-module-a-summer' {
  
    export interface ISummerCacheRecord {
      'test-vona:caching': IDecoratorSummerCacheOptions;
'test-vona:test': IDecoratorSummerCacheOptions;
    }

  
}
declare module 'vona-module-test-vona' {
  
        export interface SummerCacheCaching {
          /** @internal */
          get scope(): ScopeModuleTestVona;
        }

          export interface SummerCacheCaching {
            get $beanFullName(): 'test-vona.summerCache.caching';
            get $onionName(): 'test-vona:caching';
            get $onionOptions(): IDecoratorSummerCacheOptions;
          }

        export interface SummerCacheTest {
          /** @internal */
          get scope(): ScopeModuleTestVona;
        }

          export interface SummerCacheTest {
            get $beanFullName(): 'test-vona.summerCache.test';
            get $onionName(): 'test-vona:test';
            get $onionOptions(): IDecoratorSummerCacheOptions;
          } 
}
/** summerCache: end */
/** summerCache: begin */
import type { SummerCacheCaching } from '../bean/summerCache.caching.ts';
import type { SummerCacheTest } from '../bean/summerCache.test.ts';
export interface IModuleSummerCache {
  'caching': SummerCacheCaching;
'test': SummerCacheTest;
}
/** summerCache: end */
/** dto: begin */
export * from '../dto/categoryTree.ts';
export * from '../dto/orderCreate.ts';
export * from '../dto/orderQuery.ts';
export * from '../dto/orderQueryPage.ts';
export * from '../dto/orderSelectRes.ts';
export * from '../dto/orderSelectResItem.ts';
export * from '../dto/orderUpdate.ts';
export * from '../dto/postAggregate.ts';
export * from '../dto/postCreate.ts';
export * from '../dto/postGroup.ts';
export * from '../dto/postSelectReq.ts';
export * from '../dto/postSelectRes.ts';
export * from '../dto/postSelectResItem.tsx';
export * from '../dto/profile.ts';
export * from '../dto/roleLazy.ts';
export * from '../dto/serializerArray.ts';
export * from '../dto/serializerLazy.ts';
export * from '../dto/serializerSimple.ts';
export * from '../dto/user.ts';
export * from '../dto/userCreate.ts';
export * from '../dto/userLazy.ts';
export * from '../dto/userUpdate.ts';
import type { IDtoOptionsCategoryTree } from '../dto/categoryTree.ts';
import type { IDtoOptionsOrderCreate } from '../dto/orderCreate.ts';
import type { IDtoOptionsOrderQuery } from '../dto/orderQuery.ts';
import type { IDtoOptionsOrderQueryPage } from '../dto/orderQueryPage.ts';
import type { IDtoOptionsOrderSelectRes } from '../dto/orderSelectRes.ts';
import type { IDtoOptionsOrderSelectResItem } from '../dto/orderSelectResItem.ts';
import type { IDtoOptionsOrderUpdate } from '../dto/orderUpdate.ts';
import type { IDtoOptionsPostAggregate } from '../dto/postAggregate.ts';
import type { IDtoOptionsPostCreate } from '../dto/postCreate.ts';
import type { IDtoOptionsPostGroup } from '../dto/postGroup.ts';
import type { IDtoOptionsPostSelectReq } from '../dto/postSelectReq.ts';
import type { IDtoOptionsPostSelectRes } from '../dto/postSelectRes.ts';
import type { IDtoOptionsPostSelectResItem } from '../dto/postSelectResItem.tsx';
import type { IDtoOptionsProfile } from '../dto/profile.ts';
import type { IDtoOptionsRoleLazy } from '../dto/roleLazy.ts';
import type { IDtoOptionsSerializerArray } from '../dto/serializerArray.ts';
import type { IDtoOptionsSerializerLazy } from '../dto/serializerLazy.ts';
import type { IDtoOptionsSerializerSimple } from '../dto/serializerSimple.ts';
import type { IDtoOptionsUser } from '../dto/user.ts';
import type { IDtoOptionsUserCreate } from '../dto/userCreate.ts';
import type { IDtoOptionsUserLazy } from '../dto/userLazy.ts';
import type { IDtoOptionsUserUpdate } from '../dto/userUpdate.ts';
import 'vona-module-a-web';
declare module 'vona-module-a-web' {
  
    export interface IDtoRecord {
      'test-vona:categoryTree': IDtoOptionsCategoryTree;
'test-vona:orderCreate': IDtoOptionsOrderCreate;
'test-vona:orderQuery': IDtoOptionsOrderQuery;
'test-vona:orderQueryPage': IDtoOptionsOrderQueryPage;
'test-vona:orderSelectRes': IDtoOptionsOrderSelectRes;
'test-vona:orderSelectResItem': IDtoOptionsOrderSelectResItem;
'test-vona:orderUpdate': IDtoOptionsOrderUpdate;
'test-vona:postAggregate': IDtoOptionsPostAggregate;
'test-vona:postCreate': IDtoOptionsPostCreate;
'test-vona:postGroup': IDtoOptionsPostGroup;
'test-vona:postSelectReq': IDtoOptionsPostSelectReq;
'test-vona:postSelectRes': IDtoOptionsPostSelectRes;
'test-vona:postSelectResItem': IDtoOptionsPostSelectResItem;
'test-vona:profile': IDtoOptionsProfile;
'test-vona:roleLazy': IDtoOptionsRoleLazy;
'test-vona:serializerArray': IDtoOptionsSerializerArray;
'test-vona:serializerLazy': IDtoOptionsSerializerLazy;
'test-vona:serializerSimple': IDtoOptionsSerializerSimple;
'test-vona:user': IDtoOptionsUser;
'test-vona:userCreate': IDtoOptionsUserCreate;
'test-vona:userLazy': IDtoOptionsUserLazy;
'test-vona:userUpdate': IDtoOptionsUserUpdate;
    }

  
}
declare module 'vona-module-test-vona' {
   
}
/** dto: end */
/** dto: begin */
import type { DtoCategoryTree } from '../dto/categoryTree.ts';
import type { DtoOrderCreate } from '../dto/orderCreate.ts';
import type { DtoOrderQuery } from '../dto/orderQuery.ts';
import type { DtoOrderQueryPage } from '../dto/orderQueryPage.ts';
import type { DtoOrderSelectRes } from '../dto/orderSelectRes.ts';
import type { DtoOrderSelectResItem } from '../dto/orderSelectResItem.ts';
import type { DtoOrderUpdate } from '../dto/orderUpdate.ts';
import type { DtoPostAggregate } from '../dto/postAggregate.ts';
import type { DtoPostCreate } from '../dto/postCreate.ts';
import type { DtoPostGroup } from '../dto/postGroup.ts';
import type { DtoPostSelectReq } from '../dto/postSelectReq.ts';
import type { DtoPostSelectRes } from '../dto/postSelectRes.ts';
import type { DtoPostSelectResItem } from '../dto/postSelectResItem.tsx';
import type { DtoProfile } from '../dto/profile.ts';
import type { DtoRoleLazy } from '../dto/roleLazy.ts';
import type { DtoSerializerArray } from '../dto/serializerArray.ts';
import type { DtoSerializerLazy } from '../dto/serializerLazy.ts';
import type { DtoSerializerSimple } from '../dto/serializerSimple.ts';
import type { DtoUser } from '../dto/user.ts';
import type { DtoUserCreate } from '../dto/userCreate.ts';
import type { DtoUserLazy } from '../dto/userLazy.ts';
import type { DtoUserUpdate } from '../dto/userUpdate.ts';
declare module 'vona-module-test-vona' {
  
    export interface IDtoOptionsCategoryTree {
      fields?: TypeEntityOptionsFields<DtoCategoryTree, IDtoOptionsCategoryTree[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsOrderCreate {
      fields?: TypeEntityOptionsFields<DtoOrderCreate, IDtoOptionsOrderCreate[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsOrderQuery {
      fields?: TypeEntityOptionsFields<DtoOrderQuery, IDtoOptionsOrderQuery[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsOrderQueryPage {
      fields?: TypeEntityOptionsFields<DtoOrderQueryPage, IDtoOptionsOrderQueryPage[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsOrderSelectRes {
      fields?: TypeEntityOptionsFields<DtoOrderSelectRes, IDtoOptionsOrderSelectRes[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsOrderSelectResItem {
      fields?: TypeEntityOptionsFields<DtoOrderSelectResItem, IDtoOptionsOrderSelectResItem[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsOrderUpdate {
      fields?: TypeEntityOptionsFields<DtoOrderUpdate, IDtoOptionsOrderUpdate[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsPostAggregate {
      fields?: TypeEntityOptionsFields<DtoPostAggregate, IDtoOptionsPostAggregate[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsPostCreate {
      fields?: TypeEntityOptionsFields<DtoPostCreate, IDtoOptionsPostCreate[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsPostGroup {
      fields?: TypeEntityOptionsFields<DtoPostGroup, IDtoOptionsPostGroup[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsPostSelectReq {
      fields?: TypeEntityOptionsFields<DtoPostSelectReq, IDtoOptionsPostSelectReq[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsPostSelectRes {
      fields?: TypeEntityOptionsFields<DtoPostSelectRes, IDtoOptionsPostSelectRes[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsPostSelectResItem {
      fields?: TypeEntityOptionsFields<DtoPostSelectResItem, IDtoOptionsPostSelectResItem[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsProfile {
      fields?: TypeEntityOptionsFields<DtoProfile, IDtoOptionsProfile[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsRoleLazy {
      fields?: TypeEntityOptionsFields<DtoRoleLazy, IDtoOptionsRoleLazy[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsSerializerArray {
      fields?: TypeEntityOptionsFields<DtoSerializerArray, IDtoOptionsSerializerArray[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsSerializerLazy {
      fields?: TypeEntityOptionsFields<DtoSerializerLazy, IDtoOptionsSerializerLazy[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsSerializerSimple {
      fields?: TypeEntityOptionsFields<DtoSerializerSimple, IDtoOptionsSerializerSimple[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsUser {
      fields?: TypeEntityOptionsFields<DtoUser, IDtoOptionsUser[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsUserCreate {
      fields?: TypeEntityOptionsFields<DtoUserCreate, IDtoOptionsUserCreate[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsUserLazy {
      fields?: TypeEntityOptionsFields<DtoUserLazy, IDtoOptionsUserLazy[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsUserUpdate {
      fields?: TypeEntityOptionsFields<DtoUserUpdate, IDtoOptionsUserUpdate[TypeSymbolKeyFieldsMore]>;
    }
}
/** dto: end */
/** controller: begin */
export * from '../controller/bean.ts';
export * from '../controller/cacheMem.ts';
export * from '../controller/cacheRedis.ts';
export * from '../controller/dtoTest.ts';
export * from '../controller/guardPassport.ts';
export * from '../controller/onion.ts';
export * from '../controller/order.ts';
export * from '../controller/passport.ts';
export * from '../controller/performAction.ts';
export * from '../controller/post.ts';
export * from '../controller/queue.ts';
export * from '../controller/serializer.ts';
export * from '../controller/summer.ts';
export * from '../controller/tail.ts';
export * from '../controller/transaction.ts';
export * from '../controller/upload.ts';
import type { IControllerOptionsBean } from '../controller/bean.ts';
import type { IControllerOptionsCacheMem } from '../controller/cacheMem.ts';
import type { IControllerOptionsCacheRedis } from '../controller/cacheRedis.ts';
import type { IControllerOptionsDtoTest } from '../controller/dtoTest.ts';
import type { IControllerOptionsGuardPassport } from '../controller/guardPassport.ts';
import type { IControllerOptionsOnion } from '../controller/onion.ts';
import type { IControllerOptionsOrder } from '../controller/order.ts';
import type { IControllerOptionsPassport } from '../controller/passport.ts';
import type { IControllerOptionsPerformAction } from '../controller/performAction.ts';
import type { IControllerOptionsPost } from '../controller/post.ts';
import type { IControllerOptionsQueue } from '../controller/queue.ts';
import type { IControllerOptionsSerializer } from '../controller/serializer.ts';
import type { IControllerOptionsSummer } from '../controller/summer.ts';
import type { IControllerOptionsTail } from '../controller/tail.ts';
import type { IControllerOptionsTransaction } from '../controller/transaction.ts';
import type { IControllerOptionsUpload } from '../controller/upload.ts';
import 'vona-module-a-web';
declare module 'vona-module-a-web' {
  
    export interface IControllerRecord {
      'test-vona:bean': IControllerOptionsBean;
'test-vona:cacheMem': IControllerOptionsCacheMem;
'test-vona:cacheRedis': IControllerOptionsCacheRedis;
'test-vona:dtoTest': IControllerOptionsDtoTest;
'test-vona:guardPassport': IControllerOptionsGuardPassport;
'test-vona:onion': IControllerOptionsOnion;
'test-vona:order': IControllerOptionsOrder;
'test-vona:passport': IControllerOptionsPassport;
'test-vona:performAction': IControllerOptionsPerformAction;
'test-vona:post': IControllerOptionsPost;
'test-vona:queue': IControllerOptionsQueue;
'test-vona:serializer': IControllerOptionsSerializer;
'test-vona:summer': IControllerOptionsSummer;
'test-vona:tail': IControllerOptionsTail;
'test-vona:transaction': IControllerOptionsTransaction;
'test-vona:upload': IControllerOptionsUpload;
    }

  
}
declare module 'vona-module-test-vona' {
  
        export interface ControllerBean {
          /** @internal */
          get scope(): ScopeModuleTestVona;
        }

          export interface ControllerBean {
            get $beanFullName(): 'test-vona.controller.bean';
            get $onionName(): 'test-vona:bean';
            get $onionOptions(): IControllerOptionsBean;
          }

        export interface ControllerCacheMem {
          /** @internal */
          get scope(): ScopeModuleTestVona;
        }

          export interface ControllerCacheMem {
            get $beanFullName(): 'test-vona.controller.cacheMem';
            get $onionName(): 'test-vona:cacheMem';
            get $onionOptions(): IControllerOptionsCacheMem;
          }

        export interface ControllerCacheRedis {
          /** @internal */
          get scope(): ScopeModuleTestVona;
        }

          export interface ControllerCacheRedis {
            get $beanFullName(): 'test-vona.controller.cacheRedis';
            get $onionName(): 'test-vona:cacheRedis';
            get $onionOptions(): IControllerOptionsCacheRedis;
          }

        export interface ControllerDtoTest {
          /** @internal */
          get scope(): ScopeModuleTestVona;
        }

          export interface ControllerDtoTest {
            get $beanFullName(): 'test-vona.controller.dtoTest';
            get $onionName(): 'test-vona:dtoTest';
            get $onionOptions(): IControllerOptionsDtoTest;
          }

        export interface ControllerGuardPassport {
          /** @internal */
          get scope(): ScopeModuleTestVona;
        }

          export interface ControllerGuardPassport {
            get $beanFullName(): 'test-vona.controller.guardPassport';
            get $onionName(): 'test-vona:guardPassport';
            get $onionOptions(): IControllerOptionsGuardPassport;
          }

        export interface ControllerOnion {
          /** @internal */
          get scope(): ScopeModuleTestVona;
        }

          export interface ControllerOnion {
            get $beanFullName(): 'test-vona.controller.onion';
            get $onionName(): 'test-vona:onion';
            get $onionOptions(): IControllerOptionsOnion;
          }

        export interface ControllerOrder {
          /** @internal */
          get scope(): ScopeModuleTestVona;
        }

          export interface ControllerOrder {
            get $beanFullName(): 'test-vona.controller.order';
            get $onionName(): 'test-vona:order';
            get $onionOptions(): IControllerOptionsOrder;
          }

        export interface ControllerPassport {
          /** @internal */
          get scope(): ScopeModuleTestVona;
        }

          export interface ControllerPassport {
            get $beanFullName(): 'test-vona.controller.passport';
            get $onionName(): 'test-vona:passport';
            get $onionOptions(): IControllerOptionsPassport;
          }

        export interface ControllerPerformAction {
          /** @internal */
          get scope(): ScopeModuleTestVona;
        }

          export interface ControllerPerformAction {
            get $beanFullName(): 'test-vona.controller.performAction';
            get $onionName(): 'test-vona:performAction';
            get $onionOptions(): IControllerOptionsPerformAction;
          }

        export interface ControllerPost {
          /** @internal */
          get scope(): ScopeModuleTestVona;
        }

          export interface ControllerPost {
            get $beanFullName(): 'test-vona.controller.post';
            get $onionName(): 'test-vona:post';
            get $onionOptions(): IControllerOptionsPost;
          }

        export interface ControllerQueue {
          /** @internal */
          get scope(): ScopeModuleTestVona;
        }

          export interface ControllerQueue {
            get $beanFullName(): 'test-vona.controller.queue';
            get $onionName(): 'test-vona:queue';
            get $onionOptions(): IControllerOptionsQueue;
          }

        export interface ControllerSerializer {
          /** @internal */
          get scope(): ScopeModuleTestVona;
        }

          export interface ControllerSerializer {
            get $beanFullName(): 'test-vona.controller.serializer';
            get $onionName(): 'test-vona:serializer';
            get $onionOptions(): IControllerOptionsSerializer;
          }

        export interface ControllerSummer {
          /** @internal */
          get scope(): ScopeModuleTestVona;
        }

          export interface ControllerSummer {
            get $beanFullName(): 'test-vona.controller.summer';
            get $onionName(): 'test-vona:summer';
            get $onionOptions(): IControllerOptionsSummer;
          }

        export interface ControllerTail {
          /** @internal */
          get scope(): ScopeModuleTestVona;
        }

          export interface ControllerTail {
            get $beanFullName(): 'test-vona.controller.tail';
            get $onionName(): 'test-vona:tail';
            get $onionOptions(): IControllerOptionsTail;
          }

        export interface ControllerTransaction {
          /** @internal */
          get scope(): ScopeModuleTestVona;
        }

          export interface ControllerTransaction {
            get $beanFullName(): 'test-vona.controller.transaction';
            get $onionName(): 'test-vona:transaction';
            get $onionOptions(): IControllerOptionsTransaction;
          }

        export interface ControllerUpload {
          /** @internal */
          get scope(): ScopeModuleTestVona;
        }

          export interface ControllerUpload {
            get $beanFullName(): 'test-vona.controller.upload';
            get $onionName(): 'test-vona:upload';
            get $onionOptions(): IControllerOptionsUpload;
          } 
}
/** controller: end */
/** controller: begin */
// @ts-ignore ignore
import type { ControllerBean } from '../controller/bean.ts';
// @ts-ignore ignore
import type { ControllerCacheMem } from '../controller/cacheMem.ts';
// @ts-ignore ignore
import type { ControllerCacheRedis } from '../controller/cacheRedis.ts';
// @ts-ignore ignore
import type { ControllerDtoTest } from '../controller/dtoTest.ts';
// @ts-ignore ignore
import type { ControllerGuardPassport } from '../controller/guardPassport.ts';
// @ts-ignore ignore
import type { ControllerOnion } from '../controller/onion.ts';
// @ts-ignore ignore
import type { ControllerOrder } from '../controller/order.ts';
// @ts-ignore ignore
import type { ControllerPassport } from '../controller/passport.ts';
// @ts-ignore ignore
import type { ControllerPerformAction } from '../controller/performAction.ts';
// @ts-ignore ignore
import type { ControllerPost } from '../controller/post.ts';
// @ts-ignore ignore
import type { ControllerQueue } from '../controller/queue.ts';
// @ts-ignore ignore
import type { ControllerSerializer } from '../controller/serializer.ts';
// @ts-ignore ignore
import type { ControllerSummer } from '../controller/summer.ts';
// @ts-ignore ignore
import type { ControllerTail } from '../controller/tail.ts';
// @ts-ignore ignore
import type { ControllerTransaction } from '../controller/transaction.ts';
// @ts-ignore ignore
import type { ControllerUpload } from '../controller/upload.ts';
declare module 'vona-module-test-vona' {
  
    export interface IControllerOptionsBean {
      actions?: TypeControllerOptionsActions<ControllerBean>;
    }

    export interface IControllerOptionsCacheMem {
      actions?: TypeControllerOptionsActions<ControllerCacheMem>;
    }

    export interface IControllerOptionsCacheRedis {
      actions?: TypeControllerOptionsActions<ControllerCacheRedis>;
    }

    export interface IControllerOptionsDtoTest {
      actions?: TypeControllerOptionsActions<ControllerDtoTest>;
    }

    export interface IControllerOptionsGuardPassport {
      actions?: TypeControllerOptionsActions<ControllerGuardPassport>;
    }

    export interface IControllerOptionsOnion {
      actions?: TypeControllerOptionsActions<ControllerOnion>;
    }

    export interface IControllerOptionsOrder {
      actions?: TypeControllerOptionsActions<ControllerOrder>;
    }

    export interface IControllerOptionsPassport {
      actions?: TypeControllerOptionsActions<ControllerPassport>;
    }

    export interface IControllerOptionsPerformAction {
      actions?: TypeControllerOptionsActions<ControllerPerformAction>;
    }

    export interface IControllerOptionsPost {
      actions?: TypeControllerOptionsActions<ControllerPost>;
    }

    export interface IControllerOptionsQueue {
      actions?: TypeControllerOptionsActions<ControllerQueue>;
    }

    export interface IControllerOptionsSerializer {
      actions?: TypeControllerOptionsActions<ControllerSerializer>;
    }

    export interface IControllerOptionsSummer {
      actions?: TypeControllerOptionsActions<ControllerSummer>;
    }

    export interface IControllerOptionsTail {
      actions?: TypeControllerOptionsActions<ControllerTail>;
    }

    export interface IControllerOptionsTransaction {
      actions?: TypeControllerOptionsActions<ControllerTransaction>;
    }

    export interface IControllerOptionsUpload {
      actions?: TypeControllerOptionsActions<ControllerUpload>;
    }
}
declare module 'vona-module-a-web' {
  export interface IApiPathGetRecord{
        '/test/vona/bean/test': undefined;
'/test/vona/bean/service': undefined;
'/test/vona/dtoTest/getUserLazy': undefined;
'/test/vona/dtoTest/getUserDynamic': undefined;
'/test/vona/dtoTest/getUserStats': undefined;
'/test/vona/dtoTest/getUserStatsGroup': undefined;
'/test/vona/dtoTest/getCategoryTree': undefined;
'/test/vona/dtoTest/getCategoryTree2': undefined;
'/test/vona/guardPassport/testUserName': undefined;
'/test/vona/guardPassport/testUserNameFail': undefined;
'/test/vona/guardPassport/testRoleName': undefined;
'/test/vona/guardPassport/testRoleNameFail': undefined;
'/': undefined;
'/test/vona/onion/echo3/:userId': undefined;
'/test/vona/onion/echo5': undefined;
'/test/vona/onion/echo6': undefined;
'/test/vona/order/findAll': undefined;
'/test/vona/order/findMany': undefined;
'/test/vona/passport/echo/:name': undefined;
'/test/vona/passport/isAuthenticated': undefined;
'/test/vona/post/group': undefined;
'/test/vona/post/aggregate': undefined;
'/test/vona/post/findManyEcho': undefined;
'/test/vona/post/findMany': undefined;
    }
export interface IApiPathPostRecord{
        '/test/vona/cacheMem': undefined;
'/test/vona/cacheRedis': undefined;
'/test/vona/dtoTest/createUser': undefined;
'//echo': undefined;
'/test/vona/onion/echo2/:userId/:userName': undefined;
'/test/vona/onion/echo4': undefined;
'/test/vona/order/create': undefined;
'/test/vona/order/update/:id': undefined;
'/test/vona/passport/login': undefined;
'/test/vona/passport/refresh': undefined;
'/test/vona/passport/logout': undefined;
'/test/vona/performAction/echo': undefined;
'/test/vona/queue/pushAsync': undefined;
'/test/vona/queue/push': undefined;
'/test/vona/serializer/echoSimple': undefined;
'/test/vona/serializer/echoArray': undefined;
'/test/vona/serializer/echoLazy': undefined;
'/test/vona/summer': undefined;
'/test/vona/tail': undefined;
'/test/vona/transaction/fail': undefined;
'/test/vona/transaction/success': undefined;
'/test/vona/upload/fields': undefined;
'/test/vona/upload/file': undefined;
'/test/vona/upload/files': undefined;
    }
export interface IApiPathPatchRecord{
        '/test/vona/dtoTest/updateUser/:id': undefined;
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
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil, type TypeModuleConfig, type TypeModuleLocales, type TypeLocaleBase } from 'vona';
import { Scope } from 'vona-module-a-bean';

@Scope()
export class ScopeModuleTestVona extends BeanScopeBase {}

export interface ScopeModuleTestVona {
  util: BeanScopeUtil;
config: TypeModuleConfig<typeof config>;
locale: TypeModuleLocales<(typeof locales)[TypeLocaleBase]>;
entity: IModuleEntity;
model: IModuleModel;
service: IModuleService;
broadcast: IModuleBroadcast;
cacheMem: IModuleCacheMem;
cacheRedis: IModuleCacheRedis;
event: IModuleEvent;
static: MetaStatic;
asset: MetaAsset;
queue: IModuleQueue;
summerCache: IModuleSummerCache;
}

import 'vona';
declare module 'vona' {
  export interface IBeanScopeRecord {
    'test-vona': ScopeModuleTestVona;
  }

  export interface IBeanScopeContainer {
    testVona: ScopeModuleTestVona;
  }
  
  export interface IBeanScopeConfig {
    'test-vona': ReturnType<typeof config>;
  }

  export interface IBeanScopeLocale {
    'test-vona': (typeof locales)[TypeLocaleBase];
  }

  
}
/** scope: end */
