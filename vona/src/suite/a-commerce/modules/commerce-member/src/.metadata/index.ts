// eslint-disable
import type { TypeEntityMeta,TypeModelsClassLikeGeneral,TypeSymbolKeyFieldsMore } from 'vona-module-a-orm';
import type { TypeEntityOptionsFields,TypeControllerOptionsActions } from 'vona-module-a-openapi';
import type { TableIdentity } from 'table-identity';
/** entity: begin */
export * from '../entity/address.tsx';
import type { IEntityOptionsAddress } from '../entity/address.tsx';
import 'vona-module-a-orm';
declare module 'vona-module-a-orm' {

    export interface IEntityRecord {
      'commerce-member:address': IEntityOptionsAddress;
    }


}
declare module 'vona-module-commerce-member' {

}
/** entity: end */
/** entity: begin */
import type { EntityAddress } from '../entity/address.tsx';
export interface IModuleEntity {
  'address': EntityAddressMeta;
}
/** entity: end */
/** entity: begin */
export type EntityAddressTableName = 'commerceMemberAddress';
export type EntityAddressMeta=TypeEntityMeta<EntityAddress,EntityAddressTableName>;
declare module 'vona-module-a-orm' {
  export interface ITableRecord {
    'commerceMemberAddress': EntityAddressMeta;
  }
}
declare module 'vona-module-commerce-member' {

    export interface IEntityOptionsAddress {
      fields?: TypeEntityOptionsFields<EntityAddress, IEntityOptionsAddress[TypeSymbolKeyFieldsMore]>;
    }
}
/** entity: end */
/** model: begin */
export * from '../model/address.ts';
import type { IModelOptionsAddress } from '../model/address.ts';
import 'vona-module-a-orm';
declare module 'vona-module-a-orm' {

    export interface IModelRecord {
      'commerce-member:address': IModelOptionsAddress;
    }


}
declare module 'vona-module-commerce-member' {

        export interface ModelAddress {
          /** @internal */
          get scope(): ScopeModuleCommerceMember;
        }

          export interface ModelAddress {
            get $beanFullName(): 'commerce-member.model.address';
            get $onionName(): 'commerce-member:address';
            get $onionOptions(): IModelOptionsAddress;
          }
}
/** model: end */
/** model: begin */
import type { ModelAddress } from '../model/address.ts';
export interface IModuleModel {
  'address': ModelAddress;
}
/** model: end */
/** model: begin */

import 'vona';
declare module 'vona' {
  export interface IBeanRecordGeneral {
    'commerce-member.model.address': ModelAddress;
  }
}
/** model: end */
/** model: begin */
import type { IModelGetOptions, IModelMethodOptions, IModelSelectParams, TypeModelSelectAndCount, TypeModelRelationResult, TypeModelWhere, IModelInsertOptions, TypeModelMutateRelationData, IModelDeleteOptions, IModelUpdateOptions, IModelMutateOptions, IModelSelectCountParams, IModelIncrementParams, IModelSelectAggrParams, TypeModelAggrRelationResult, IModelSelectGroupParams, TypeModelGroupRelationResult } from 'vona-module-a-orm';
import { SymbolKeyEntity, SymbolKeyEntityMeta, SymbolKeyModelOptions } from 'vona-module-a-orm';
declare module 'vona-module-commerce-member' {

  export interface ModelAddress {
      [SymbolKeyEntity]: EntityAddress;
      [SymbolKeyEntityMeta]: EntityAddressMeta;
      [SymbolKeyModelOptions]: IModelOptionsAddress;
      get<T extends IModelGetOptions<EntityAddress,ModelAddress>>(where: TypeModelWhere<EntityAddress>, options?: T): Promise<TypeModelRelationResult<EntityAddress, ModelAddress, T> | undefined>;
      /**
       * Retrieves one matching primary row with a pessimistic FOR UPDATE lock.
       * Requires an active transaction. The lock is released when that transaction completes.
       * Entity and query caches are bypassed.
       */
      getForUpdate<T extends IModelGetOptions<EntityAddress,ModelAddress>>(where: TypeModelWhere<EntityAddress>, options?: T): Promise<TypeModelRelationResult<EntityAddress, ModelAddress, T> | undefined>;
      /**
       * Retrieves a primary row by ID with the same pessimistic FOR UPDATE lock semantics.
       * Requires an active transaction. The lock is released when that transaction completes.
       * Entity and query caches are bypassed.
       */
      getByIdForUpdate<T extends IModelGetOptions<EntityAddress,ModelAddress>>(id: TableIdentity, options?: T): Promise<TypeModelRelationResult<EntityAddress, ModelAddress, T> | undefined>;
      mget<T extends IModelGetOptions<EntityAddress,ModelAddress>>(ids: TableIdentity[], options?: T): Promise<TypeModelRelationResult<EntityAddress, ModelAddress, T>[]>;
      selectAndCount<T extends IModelSelectParams<EntityAddress,ModelAddress,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelSelectAndCount<EntityAddress, ModelAddress, T>>;
      select<T extends IModelSelectParams<EntityAddress,ModelAddress,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelRelationResult<EntityAddress, ModelAddress, T>[]>;
      insert<T extends IModelInsertOptions<EntityAddress,ModelAddress>>(data?: TypeModelMutateRelationData<EntityAddress,ModelAddress, T>, options?: T): Promise<TypeModelMutateRelationData<EntityAddress,ModelAddress, T, true>>;
      insertBulk<T extends IModelInsertOptions<EntityAddress,ModelAddress>>(items: TypeModelMutateRelationData<EntityAddress,ModelAddress, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityAddress,ModelAddress, T, true>[]>;
      update<T extends IModelUpdateOptions<EntityAddress,ModelAddress>>(data: TypeModelMutateRelationData<EntityAddress,ModelAddress, T>, options?: T): Promise<TypeModelMutateRelationData<EntityAddress,ModelAddress, T>>;
      updateBulk<T extends IModelUpdateOptions<EntityAddress,ModelAddress>>(items: TypeModelMutateRelationData<EntityAddress,ModelAddress, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityAddress,ModelAddress, T>[]>;
      delete<T extends IModelDeleteOptions<EntityAddress,ModelAddress>>(where?: TypeModelWhere<EntityAddress>, options?: T): Promise<void>;
      deleteBulk<T extends IModelDeleteOptions<EntityAddress,ModelAddress>>(ids: TableIdentity[], options?: T): Promise<void>;
      mutate<T extends IModelMutateOptions<EntityAddress,ModelAddress>>(data?: TypeModelMutateRelationData<EntityAddress,ModelAddress, T>, options?: T): Promise<TypeModelMutateRelationData<EntityAddress,ModelAddress, T>>;
      mutateBulk<T extends IModelMutateOptions<EntityAddress,ModelAddress>>(items: TypeModelMutateRelationData<EntityAddress,ModelAddress, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityAddress,ModelAddress, T>[]>;
      count<T extends IModelSelectCountParams<EntityAddress,ModelAddress,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<string | undefined>;
      increment<T extends IModelIncrementParams<EntityAddress,ModelAddress,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      decrement<T extends IModelIncrementParams<EntityAddress,ModelAddress,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      aggregate<T extends IModelSelectAggrParams<EntityAddress,ModelAddress,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelAggrRelationResult<T>>;
      group<T extends IModelSelectGroupParams<EntityAddress,ModelAddress,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelGroupRelationResult<EntityAddress, T>[]>;
      getById<T extends IModelGetOptions<EntityAddress,ModelAddress>>(id: TableIdentity, options?: T): Promise<TypeModelRelationResult<EntityAddress, ModelAddress, T> | undefined>;
updateById<T extends IModelUpdateOptions<EntityAddress,ModelAddress>>(id: TableIdentity, data: TypeModelMutateRelationData<EntityAddress,ModelAddress, T>, options?: T): Promise<TypeModelMutateRelationData<EntityAddress,ModelAddress, T>>;
deleteById<T extends IModelDeleteOptions<EntityAddress,ModelAddress>>(id: TableIdentity, options?: T): Promise<void>;
    }
}
declare module 'vona-module-a-orm' {
  export interface IModelClassRecord {
    'commerce-member:address': ModelAddress;
  }
}
/** model: end */
/** service: begin */
export * from '../service/address.ts';

import 'vona-module-a-bean';
declare module 'vona-module-a-bean' {

    export interface IServiceRecord {
      'commerce-member:address': never;
    }


}
declare module 'vona-module-commerce-member' {

        export interface ServiceAddress {
          /** @internal */
          get scope(): ScopeModuleCommerceMember;
        }

          export interface ServiceAddress {
            get $beanFullName(): 'commerce-member.service.address';
            get $onionName(): 'commerce-member:address';
          }
}
/** service: end */
/** service: begin */
import type { ServiceAddress } from '../service/address.ts';
export interface IModuleService {
  'address': ServiceAddress;
}
/** service: end */
/** service: begin */

import 'vona';
declare module 'vona' {
  export interface IBeanRecordGeneral {
    'commerce-member.service.address': ServiceAddress;
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
      'commerce-member:index': IMetaOptionsIndex;
'commerce-member:version': never;
    }


}
declare module 'vona-module-commerce-member' {

        export interface MetaIndex {
          /** @internal */
          get scope(): ScopeModuleCommerceMember;
        }

          export interface MetaIndex {
            get $beanFullName(): 'commerce-member.meta.index';
            get $onionName(): 'commerce-member:index';
            get $onionOptions(): IMetaOptionsIndex;
          }

        export interface MetaVersion {
          /** @internal */
          get scope(): ScopeModuleCommerceMember;
        }

          export interface MetaVersion {
            get $beanFullName(): 'commerce-member.meta.version';
            get $onionName(): 'commerce-member:version';
          }
}
/** meta: end */
/** dto: begin */
export * from '../dto/addressMineCreate.tsx';
export * from '../dto/addressMineItem.tsx';
export * from '../dto/addressMineReq.tsx';
export * from '../dto/addressMineRes.tsx';
export * from '../dto/addressMineUpdate.tsx';
export * from '../dto/addressMineView.tsx';
export * from '../dto/addressSelectReq.tsx';
export * from '../dto/addressSelectRes.tsx';
export * from '../dto/addressSelectResItem.tsx';
export * from '../dto/addressView.tsx';
import type { IDtoOptionsAddressMineCreate } from '../dto/addressMineCreate.tsx';
import type { IDtoOptionsAddressMineItem } from '../dto/addressMineItem.tsx';
import type { IDtoOptionsAddressMineReq } from '../dto/addressMineReq.tsx';
import type { IDtoOptionsAddressMineRes } from '../dto/addressMineRes.tsx';
import type { IDtoOptionsAddressMineUpdate } from '../dto/addressMineUpdate.tsx';
import type { IDtoOptionsAddressMineView } from '../dto/addressMineView.tsx';
import type { IDtoOptionsAddressSelectReq } from '../dto/addressSelectReq.tsx';
import type { IDtoOptionsAddressSelectRes } from '../dto/addressSelectRes.tsx';
import type { IDtoOptionsAddressSelectResItem } from '../dto/addressSelectResItem.tsx';
import type { IDtoOptionsAddressView } from '../dto/addressView.tsx';
import 'vona-module-a-web';
declare module 'vona-module-a-web' {

    export interface IDtoRecord {
      'commerce-member:addressMineCreate': IDtoOptionsAddressMineCreate;
'commerce-member:addressMineItem': IDtoOptionsAddressMineItem;
'commerce-member:addressMineReq': IDtoOptionsAddressMineReq;
'commerce-member:addressMineRes': IDtoOptionsAddressMineRes;
'commerce-member:addressMineUpdate': IDtoOptionsAddressMineUpdate;
'commerce-member:addressMineView': IDtoOptionsAddressMineView;
'commerce-member:addressSelectReq': IDtoOptionsAddressSelectReq;
'commerce-member:addressSelectRes': IDtoOptionsAddressSelectRes;
'commerce-member:addressSelectResItem': IDtoOptionsAddressSelectResItem;
'commerce-member:addressView': IDtoOptionsAddressView;
    }


}
declare module 'vona-module-commerce-member' {

}
/** dto: end */
/** dto: begin */
import type { DtoAddressMineCreate } from '../dto/addressMineCreate.tsx';
import type { DtoAddressMineItem } from '../dto/addressMineItem.tsx';
import type { DtoAddressMineReq } from '../dto/addressMineReq.tsx';
import type { DtoAddressMineRes } from '../dto/addressMineRes.tsx';
import type { DtoAddressMineUpdate } from '../dto/addressMineUpdate.tsx';
import type { DtoAddressMineView } from '../dto/addressMineView.tsx';
import type { DtoAddressSelectReq } from '../dto/addressSelectReq.tsx';
import type { DtoAddressSelectRes } from '../dto/addressSelectRes.tsx';
import type { DtoAddressSelectResItem } from '../dto/addressSelectResItem.tsx';
import type { DtoAddressView } from '../dto/addressView.tsx';
declare module 'vona-module-commerce-member' {

    export interface IDtoOptionsAddressMineCreate {
      fields?: TypeEntityOptionsFields<DtoAddressMineCreate, IDtoOptionsAddressMineCreate[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsAddressMineItem {
      fields?: TypeEntityOptionsFields<DtoAddressMineItem, IDtoOptionsAddressMineItem[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsAddressMineReq {
      fields?: TypeEntityOptionsFields<DtoAddressMineReq, IDtoOptionsAddressMineReq[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsAddressMineRes {
      fields?: TypeEntityOptionsFields<DtoAddressMineRes, IDtoOptionsAddressMineRes[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsAddressMineUpdate {
      fields?: TypeEntityOptionsFields<DtoAddressMineUpdate, IDtoOptionsAddressMineUpdate[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsAddressMineView {
      fields?: TypeEntityOptionsFields<DtoAddressMineView, IDtoOptionsAddressMineView[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsAddressSelectReq {
      fields?: TypeEntityOptionsFields<DtoAddressSelectReq, IDtoOptionsAddressSelectReq[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsAddressSelectRes {
      fields?: TypeEntityOptionsFields<DtoAddressSelectRes, IDtoOptionsAddressSelectRes[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsAddressSelectResItem {
      fields?: TypeEntityOptionsFields<DtoAddressSelectResItem, IDtoOptionsAddressSelectResItem[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsAddressView {
      fields?: TypeEntityOptionsFields<DtoAddressView, IDtoOptionsAddressView[TypeSymbolKeyFieldsMore]>;
    }
}
/** dto: end */
/** controller: begin */
export * from '../controller/address.ts';
import type { IControllerOptionsAddress } from '../controller/address.ts';
import 'vona-module-a-web';
declare module 'vona-module-a-web' {

    export interface IControllerRecord {
      'commerce-member:address': IControllerOptionsAddress;
    }


}
declare module 'vona-module-commerce-member' {

        export interface ControllerAddress {
          /** @internal */
          get scope(): ScopeModuleCommerceMember;
        }

          export interface ControllerAddress {
            get $beanFullName(): 'commerce-member.controller.address';
            get $onionName(): 'commerce-member:address';
            get $onionOptions(): IControllerOptionsAddress;
          }
}
/** controller: end */
/** controller: begin */
// @ts-ignore ignore
import type { ControllerAddress } from '../controller/address.ts';
declare module 'vona-module-commerce-member' {

    export interface IControllerOptionsAddress {
      actions?: TypeControllerOptionsActions<ControllerAddress>;
    }
}
declare module 'vona-module-a-web' {
  export interface IApiPathGetRecord{
        '/commerce/member/address/mine': undefined;
'/commerce/member/address/viewMine/:id': undefined;
'/commerce/member/address': undefined;
'/commerce/member/address/:id': undefined;
    }
export interface IApiPathPostRecord{
        '/commerce/member/address/createMine': undefined;
    }
export interface IApiPathPatchRecord{
        '/commerce/member/address/updateMine/:id': undefined;
    }
export interface IApiPathDeleteRecord{
        '/commerce/member/address/deleteMine/:id': undefined;
    }

}
import 'vona-module-a-openapi';
  declare module 'vona-module-a-openapi' {
    export interface IResourceRecord {
      'commerce-member:address': never;
    }
  }

/** controller: end */
/** ssrMenu: begin */
export * from '../bean/ssrMenu.address.ts';
import type { ISsrMenuOptionsAddress } from '../bean/ssrMenu.address.ts';
import 'vona-module-a-ssr';
declare module 'vona-module-a-ssr' {

    export interface ISsrMenuRecord {
      'commerce-member:address': ISsrMenuOptionsAddress;
    }


}
declare module 'vona-module-commerce-member' {

        export interface SsrMenuAddress {
          /** @internal */
          get scope(): ScopeModuleCommerceMember;
        }

          export interface SsrMenuAddress {
            get $beanFullName(): 'commerce-member.ssrMenu.address';
            get $onionName(): 'commerce-member:address';
            get $onionOptions(): ISsrMenuOptionsAddress;
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
export class ScopeModuleCommerceMember extends BeanScopeBase {}

export interface ScopeModuleCommerceMember {
  util: BeanScopeUtil;
locale: TypeModuleLocales<(typeof locales)[TypeLocaleBase]>;
entity: IModuleEntity;
model: IModuleModel;
service: IModuleService;
}

import 'vona';
declare module 'vona' {
  export interface IBeanScopeRecord {
    'commerce-member': ScopeModuleCommerceMember;
  }

  export interface IBeanScopeContainer {
    commerceMember: ScopeModuleCommerceMember;
  }



  export interface IBeanScopeLocale {
    'commerce-member': (typeof locales)[TypeLocaleBase];
  }


}
/** scope: end */
