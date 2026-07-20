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
      getForUpdate<T extends IModelGetOptions<EntityAddress,ModelAddress>>(where: TypeModelWhere<EntityAddress>, options?: T): Promise<TypeModelRelationResult<EntityAddress, ModelAddress, T> | undefined>;
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
getByName<T extends IModelGetOptions<EntityAddress,ModelAddress>>(name?: string, options?: T): Promise<TypeModelRelationResult<EntityAddress, ModelAddress, T> | undefined>;
getByNameEqI<T extends IModelGetOptions<EntityAddress,ModelAddress>>(name?: string, options?: T): Promise<TypeModelRelationResult<EntityAddress, ModelAddress, T> | undefined>;
selectByName<T extends IModelSelectParams<EntityAddress,ModelAddress,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(name?: string, params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelRelationResult<EntityAddress, ModelAddress, T>[]>;
selectByNameEqI<T extends IModelSelectParams<EntityAddress,ModelAddress,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(name?: string, params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelRelationResult<EntityAddress, ModelAddress, T>[]>;
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
export * from '../dto/addressCreate.tsx';
export * from '../dto/addressSelectReq.tsx';
export * from '../dto/addressSelectRes.tsx';
export * from '../dto/addressSelectResItem.tsx';
export * from '../dto/addressUpdate.tsx';
export * from '../dto/addressView.tsx';
import type { IDtoOptionsAddressCreate } from '../dto/addressCreate.tsx';
import type { IDtoOptionsAddressSelectReq } from '../dto/addressSelectReq.tsx';
import type { IDtoOptionsAddressSelectRes } from '../dto/addressSelectRes.tsx';
import type { IDtoOptionsAddressSelectResItem } from '../dto/addressSelectResItem.tsx';
import type { IDtoOptionsAddressUpdate } from '../dto/addressUpdate.tsx';
import type { IDtoOptionsAddressView } from '../dto/addressView.tsx';
import 'vona-module-a-web';
declare module 'vona-module-a-web' {

    export interface IDtoRecord {
      'commerce-member:addressCreate': IDtoOptionsAddressCreate;
'commerce-member:addressSelectReq': IDtoOptionsAddressSelectReq;
'commerce-member:addressSelectRes': IDtoOptionsAddressSelectRes;
'commerce-member:addressSelectResItem': IDtoOptionsAddressSelectResItem;
'commerce-member:addressUpdate': IDtoOptionsAddressUpdate;
'commerce-member:addressView': IDtoOptionsAddressView;
    }


}
declare module 'vona-module-commerce-member' {

}
/** dto: end */
/** dto: begin */
import type { DtoAddressCreate } from '../dto/addressCreate.tsx';
import type { DtoAddressSelectReq } from '../dto/addressSelectReq.tsx';
import type { DtoAddressSelectRes } from '../dto/addressSelectRes.tsx';
import type { DtoAddressSelectResItem } from '../dto/addressSelectResItem.tsx';
import type { DtoAddressUpdate } from '../dto/addressUpdate.tsx';
import type { DtoAddressView } from '../dto/addressView.tsx';
declare module 'vona-module-commerce-member' {

    export interface IDtoOptionsAddressCreate {
      fields?: TypeEntityOptionsFields<DtoAddressCreate, IDtoOptionsAddressCreate[TypeSymbolKeyFieldsMore]>;
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

    export interface IDtoOptionsAddressUpdate {
      fields?: TypeEntityOptionsFields<DtoAddressUpdate, IDtoOptionsAddressUpdate[TypeSymbolKeyFieldsMore]>;
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
  export interface IApiPathPostRecord{
        '/commerce/member/address': undefined;
    }
export interface IApiPathGetRecord{
        '/commerce/member/address': undefined;
'/commerce/member/address/:id': undefined;
    }
export interface IApiPathPatchRecord{
        '/commerce/member/address/:id': undefined;
    }
export interface IApiPathDeleteRecord{
        '/commerce/member/address/:id': undefined;
    }

}
import 'vona-module-a-openapi';
  declare module 'vona-module-a-openapi' {
    export interface IResourceRecord {
      'commerce-member:address': never;
    }
  }

/** controller: end */
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
