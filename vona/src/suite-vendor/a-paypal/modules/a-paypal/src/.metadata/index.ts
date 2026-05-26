// eslint-disable
import type { TypeEntityMeta,TypeModelsClassLikeGeneral,TypeSymbolKeyFieldsMore } from 'vona-module-a-orm';
import type { TypeEntityOptionsFields,TypeControllerOptionsActions } from 'vona-module-a-openapi';
import type { TableIdentity } from 'table-identity';
/** entity: begin */
export * from '../entity/paypalRecord.tsx';
import type { IEntityOptionsPaypalRecord } from '../entity/paypalRecord.tsx';
import 'vona-module-a-orm';
declare module 'vona-module-a-orm' {
  
    export interface IEntityRecord {
      'a-paypal:paypalRecord': IEntityOptionsPaypalRecord;
    }

  
}
declare module 'vona-module-a-paypal' {
   
}
/** entity: end */
/** entity: begin */
import type { EntityPaypalRecord } from '../entity/paypalRecord.tsx';
export interface IModuleEntity {
  'paypalRecord': EntityPaypalRecordMeta;
}
/** entity: end */
/** entity: begin */
export type EntityPaypalRecordTableName = 'paypalRecord';
export type EntityPaypalRecordMeta=TypeEntityMeta<EntityPaypalRecord,EntityPaypalRecordTableName>;
declare module 'vona-module-a-orm' {
  export interface ITableRecord {
    'paypalRecord': EntityPaypalRecordMeta;
  }
}
declare module 'vona-module-a-paypal' {
  
    export interface IEntityOptionsPaypalRecord {
      fields?: TypeEntityOptionsFields<EntityPaypalRecord, IEntityOptionsPaypalRecord[TypeSymbolKeyFieldsMore]>;
    }
}
/** entity: end */
/** model: begin */
export * from '../model/paypalRecord.ts';
import type { IModelOptionsPaypalRecord } from '../model/paypalRecord.ts';
import 'vona-module-a-orm';
declare module 'vona-module-a-orm' {
  
    export interface IModelRecord {
      'a-paypal:paypalRecord': IModelOptionsPaypalRecord;
    }

  
}
declare module 'vona-module-a-paypal' {
  
        export interface ModelPaypalRecord {
          /** @internal */
          get scope(): ScopeModuleAPaypal;
        }

          export interface ModelPaypalRecord {
            get $beanFullName(): 'a-paypal.model.paypalRecord';
            get $onionName(): 'a-paypal:paypalRecord';
            get $onionOptions(): IModelOptionsPaypalRecord;
          } 
}
/** model: end */
/** model: begin */
import type { ModelPaypalRecord } from '../model/paypalRecord.ts';
export interface IModuleModel {
  'paypalRecord': ModelPaypalRecord;
}
/** model: end */
/** model: begin */

import 'vona';
declare module 'vona' {
  export interface IBeanRecordGeneral {
    'a-paypal.model.paypalRecord': ModelPaypalRecord;
  }
}
/** model: end */
/** model: begin */
import type { IModelGetOptions, IModelMethodOptions, IModelSelectParams, TypeModelSelectAndCount, TypeModelRelationResult, TypeModelWhere, IModelInsertOptions, TypeModelMutateRelationData, IModelDeleteOptions, IModelUpdateOptions, IModelMutateOptions, IModelSelectCountParams, IModelIncrementParams, IModelSelectAggrParams, TypeModelAggrRelationResult, IModelSelectGroupParams, TypeModelGroupRelationResult } from 'vona-module-a-orm';
import { SymbolKeyEntity, SymbolKeyEntityMeta, SymbolKeyModelOptions } from 'vona-module-a-orm';
declare module 'vona-module-a-paypal' {
  
  export interface ModelPaypalRecord {
      [SymbolKeyEntity]: EntityPaypalRecord;
      [SymbolKeyEntityMeta]: EntityPaypalRecordMeta;
      [SymbolKeyModelOptions]: IModelOptionsPaypalRecord;
      get<T extends IModelGetOptions<EntityPaypalRecord,ModelPaypalRecord>>(where: TypeModelWhere<EntityPaypalRecord>, options?: T): Promise<TypeModelRelationResult<EntityPaypalRecord, ModelPaypalRecord, T> | undefined>;
      mget<T extends IModelGetOptions<EntityPaypalRecord,ModelPaypalRecord>>(ids: TableIdentity[], options?: T): Promise<TypeModelRelationResult<EntityPaypalRecord, ModelPaypalRecord, T>[]>;
      selectAndCount<T extends IModelSelectParams<EntityPaypalRecord,ModelPaypalRecord,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelSelectAndCount<EntityPaypalRecord, ModelPaypalRecord, T>>;
      select<T extends IModelSelectParams<EntityPaypalRecord,ModelPaypalRecord,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelRelationResult<EntityPaypalRecord, ModelPaypalRecord, T>[]>;
      insert<T extends IModelInsertOptions<EntityPaypalRecord,ModelPaypalRecord>>(data?: TypeModelMutateRelationData<EntityPaypalRecord,ModelPaypalRecord, T>, options?: T): Promise<TypeModelMutateRelationData<EntityPaypalRecord,ModelPaypalRecord, T, true>>;
      insertBulk<T extends IModelInsertOptions<EntityPaypalRecord,ModelPaypalRecord>>(items: TypeModelMutateRelationData<EntityPaypalRecord,ModelPaypalRecord, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityPaypalRecord,ModelPaypalRecord, T, true>[]>;
      update<T extends IModelUpdateOptions<EntityPaypalRecord,ModelPaypalRecord>>(data: TypeModelMutateRelationData<EntityPaypalRecord,ModelPaypalRecord, T>, options?: T): Promise<TypeModelMutateRelationData<EntityPaypalRecord,ModelPaypalRecord, T>>;
      updateBulk<T extends IModelUpdateOptions<EntityPaypalRecord,ModelPaypalRecord>>(items: TypeModelMutateRelationData<EntityPaypalRecord,ModelPaypalRecord, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityPaypalRecord,ModelPaypalRecord, T>[]>;
      delete<T extends IModelDeleteOptions<EntityPaypalRecord,ModelPaypalRecord>>(where?: TypeModelWhere<EntityPaypalRecord>, options?: T): Promise<void>;
      deleteBulk<T extends IModelDeleteOptions<EntityPaypalRecord,ModelPaypalRecord>>(ids: TableIdentity[], options?: T): Promise<void>;
      mutate<T extends IModelMutateOptions<EntityPaypalRecord,ModelPaypalRecord>>(data?: TypeModelMutateRelationData<EntityPaypalRecord,ModelPaypalRecord, T>, options?: T): Promise<TypeModelMutateRelationData<EntityPaypalRecord,ModelPaypalRecord, T>>;
      mutateBulk<T extends IModelMutateOptions<EntityPaypalRecord,ModelPaypalRecord>>(items: TypeModelMutateRelationData<EntityPaypalRecord,ModelPaypalRecord, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityPaypalRecord,ModelPaypalRecord, T>[]>;
      count<T extends IModelSelectCountParams<EntityPaypalRecord,ModelPaypalRecord,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<string | undefined>;
      increment<T extends IModelIncrementParams<EntityPaypalRecord,ModelPaypalRecord,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      decrement<T extends IModelIncrementParams<EntityPaypalRecord,ModelPaypalRecord,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      aggregate<T extends IModelSelectAggrParams<EntityPaypalRecord,ModelPaypalRecord,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelAggrRelationResult<T>>;
      group<T extends IModelSelectGroupParams<EntityPaypalRecord,ModelPaypalRecord,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelGroupRelationResult<EntityPaypalRecord, T>[]>;
      getById<T extends IModelGetOptions<EntityPaypalRecord,ModelPaypalRecord>>(id: TableIdentity, options?: T): Promise<TypeModelRelationResult<EntityPaypalRecord, ModelPaypalRecord, T> | undefined>;
updateById<T extends IModelUpdateOptions<EntityPaypalRecord,ModelPaypalRecord>>(id: TableIdentity, data: TypeModelMutateRelationData<EntityPaypalRecord,ModelPaypalRecord, T>, options?: T): Promise<TypeModelMutateRelationData<EntityPaypalRecord,ModelPaypalRecord, T>>;
deleteById<T extends IModelDeleteOptions<EntityPaypalRecord,ModelPaypalRecord>>(id: TableIdentity, options?: T): Promise<void>;
    }
}
declare module 'vona-module-a-orm' {
  export interface IModelClassRecord {
    'a-paypal:paypalRecord': ModelPaypalRecord;
  }
}
/** model: end */
/** bean: begin */
export * from '../bean/bean.paypal.ts';

import 'vona';
declare module 'vona' {
  
  
}
declare module 'vona-module-a-paypal' {
  
        export interface BeanPaypal {
          /** @internal */
          get scope(): ScopeModuleAPaypal;
        } 
}
/** bean: end */
/** bean: begin */
import type { BeanPaypal } from '../bean/bean.paypal.ts';
import 'vona';  
declare module 'vona' {
  export interface IBeanRecordGlobal {
    'paypal': BeanPaypal;
  }
}
/** bean: end */
/** service: begin */
export * from '../service/paypal.ts';

import 'vona-module-a-bean';
declare module 'vona-module-a-bean' {
  
    export interface IServiceRecord {
      'a-paypal:paypal': never;
    }

  
}
declare module 'vona-module-a-paypal' {
  
        export interface ServicePaypal {
          /** @internal */
          get scope(): ScopeModuleAPaypal;
        }

          export interface ServicePaypal {
            get $beanFullName(): 'a-paypal.service.paypal';
            get $onionName(): 'a-paypal:paypal';
            
          } 
}
/** service: end */
/** service: begin */
import type { ServicePaypal } from '../service/paypal.ts';
export interface IModuleService {
  'paypal': ServicePaypal;
}
/** service: end */
/** service: begin */

import 'vona';
declare module 'vona' {
  export interface IBeanRecordGeneral {
    'a-paypal.service.paypal': ServicePaypal;
  }
}
/** service: end */
/** event: begin */
export * from '../bean/event.paypalCancelOrder.ts';
export * from '../bean/event.paypalCaptureOrder.ts';

import 'vona';
declare module 'vona' {
  
  
}
declare module 'vona-module-a-paypal' {
  
        export interface EventPaypalCancelOrder {
          /** @internal */
          get scope(): ScopeModuleAPaypal;
        }

          export interface EventPaypalCancelOrder {
            get $beanFullName(): 'a-paypal.event.paypalCancelOrder';
            get $onionName(): 'a-paypal:paypalCancelOrder';
            
          }

        export interface EventPaypalCaptureOrder {
          /** @internal */
          get scope(): ScopeModuleAPaypal;
        }

          export interface EventPaypalCaptureOrder {
            get $beanFullName(): 'a-paypal.event.paypalCaptureOrder';
            get $onionName(): 'a-paypal:paypalCaptureOrder';
            
          } 
}
/** event: end */
/** event: begin */
import type { EventPaypalCancelOrder } from '../bean/event.paypalCancelOrder.ts';
import type { EventPaypalCaptureOrder } from '../bean/event.paypalCaptureOrder.ts';
export interface IModuleEvent {
  'paypalCancelOrder': EventPaypalCancelOrder;
'paypalCaptureOrder': EventPaypalCaptureOrder;
}
/** event: end */
/** event: begin */
import type { TypeEventPaypalCancelOrderData, TypeEventPaypalCancelOrderResult } from '../bean/event.paypalCancelOrder.ts';
import type { TypeEventPaypalCaptureOrderData, TypeEventPaypalCaptureOrderResult } from '../bean/event.paypalCaptureOrder.ts';
import type { EventOn } from 'vona-module-a-event'; 
declare module 'vona-module-a-event' {
  export interface IEventRecord {
    'a-paypal:paypalCancelOrder': EventOn<TypeEventPaypalCancelOrderData, TypeEventPaypalCancelOrderResult>;
'a-paypal:paypalCaptureOrder': EventOn<TypeEventPaypalCaptureOrderData, TypeEventPaypalCaptureOrderResult>;
  }
}
/** event: end */
/** meta: begin */
export * from '../bean/meta.version.ts';

import 'vona-module-a-meta';
declare module 'vona-module-a-meta' {
  
    export interface IMetaRecord {
      'a-paypal:version': never;
    }

  
}
declare module 'vona-module-a-paypal' {
  
        export interface MetaVersion {
          /** @internal */
          get scope(): ScopeModuleAPaypal;
        }

          export interface MetaVersion {
            get $beanFullName(): 'a-paypal.meta.version';
            get $onionName(): 'a-paypal:version';
            
          } 
}
/** meta: end */
/** dto: begin */
export * from '../dto/paypalOrderRecordOptions.tsx';
export * from '../dto/paypalOrderRecordPayload.tsx';
import type { IDtoOptionsPaypalOrderRecordOptions } from '../dto/paypalOrderRecordOptions.tsx';
import type { IDtoOptionsPaypalOrderRecordPayload } from '../dto/paypalOrderRecordPayload.tsx';
import 'vona-module-a-web';
declare module 'vona-module-a-web' {
  
    export interface IDtoRecord {
      'a-paypal:paypalOrderRecordOptions': IDtoOptionsPaypalOrderRecordOptions;
'a-paypal:paypalOrderRecordPayload': IDtoOptionsPaypalOrderRecordPayload;
    }

  
}
declare module 'vona-module-a-paypal' {
   
}
/** dto: end */
/** dto: begin */
import type { DtoPaypalOrderRecordOptions } from '../dto/paypalOrderRecordOptions.tsx';
import type { DtoPaypalOrderRecordPayload } from '../dto/paypalOrderRecordPayload.tsx';
declare module 'vona-module-a-paypal' {
  
    export interface IDtoOptionsPaypalOrderRecordOptions {
      fields?: TypeEntityOptionsFields<DtoPaypalOrderRecordOptions, IDtoOptionsPaypalOrderRecordOptions[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsPaypalOrderRecordPayload {
      fields?: TypeEntityOptionsFields<DtoPaypalOrderRecordPayload, IDtoOptionsPaypalOrderRecordPayload[TypeSymbolKeyFieldsMore]>;
    }
}
/** dto: end */
/** controller: begin */
export * from '../controller/paypal.ts';
import type { IControllerOptionsPaypal } from '../controller/paypal.ts';
import 'vona-module-a-web';
declare module 'vona-module-a-web' {
  
    export interface IControllerRecord {
      'a-paypal:paypal': IControllerOptionsPaypal;
    }

  
}
declare module 'vona-module-a-paypal' {
  
        export interface ControllerPaypal {
          /** @internal */
          get scope(): ScopeModuleAPaypal;
        }

          export interface ControllerPaypal {
            get $beanFullName(): 'a-paypal.controller.paypal';
            get $onionName(): 'a-paypal:paypal';
            get $onionOptions(): IControllerOptionsPaypal;
          } 
}
/** controller: end */
/** controller: begin */
// @ts-ignore ignore
import type { ControllerPaypal } from '../controller/paypal.ts';
declare module 'vona-module-a-paypal' {
  
    export interface IControllerOptionsPaypal {
      actions?: TypeControllerOptionsActions<ControllerPaypal>;
    }
}
declare module 'vona-module-a-web' {
  export interface IApiPathGetRecord{
        '/paypal/getRecord/:recordId': undefined;
    }
export interface IApiPathPostRecord{
        '/paypal/captureOrder/:recordId': undefined;
'/paypal/cancelOrder/:recordId': undefined;
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
/** error: begin */
export * from '../config/errors.ts';
import type { errors } from '../config/errors.ts';
/** error: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil, type TypeModuleConfig, type TypeModuleErrors, type TypeModuleLocales, type TypeLocaleBase } from 'vona';
import { Scope } from 'vona-module-a-bean';

@Scope()
export class ScopeModuleAPaypal extends BeanScopeBase {}

export interface ScopeModuleAPaypal {
  util: BeanScopeUtil;
config: TypeModuleConfig<typeof config>;
error: TypeModuleErrors<typeof errors>;
locale: TypeModuleLocales<(typeof locales)[TypeLocaleBase]>;
entity: IModuleEntity;
model: IModuleModel;
service: IModuleService;
event: IModuleEvent;
}

import 'vona';
declare module 'vona' {
  export interface IBeanScopeRecord {
    'a-paypal': ScopeModuleAPaypal;
  }

  export interface IBeanScopeContainer {
    paypal: ScopeModuleAPaypal;
  }
  
  export interface IBeanScopeConfig {
    'a-paypal': ReturnType<typeof config>;
  }

  export interface IBeanScopeLocale {
    'a-paypal': (typeof locales)[TypeLocaleBase];
  }

  export interface IBeanScopeErrors {
    'a-paypal': typeof errors;
  }
}
/** scope: end */
