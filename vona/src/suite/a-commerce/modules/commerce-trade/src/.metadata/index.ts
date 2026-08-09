// eslint-disable
import type { TypeEntityMeta,TypeModelsClassLikeGeneral,TypeSymbolKeyFieldsMore,IModelRelationHasOne,IModelRelationHasMany } from 'vona-module-a-orm';
import type { TypeEntityOptionsFields,TypeControllerOptionsActions } from 'vona-module-a-openapi';
import type { TableIdentity } from 'table-identity';
/** entity: begin */
export * from '../entity/cart.tsx';
export * from '../entity/cartItem.tsx';
export * from '../entity/order.tsx';
export * from '../entity/orderAudit.tsx';
export * from '../entity/orderLine.tsx';
export * from '../entity/shipment.tsx';
export * from '../entity/stockAudit.tsx';
export * from '../entity/stockBalance.tsx';
export * from '../entity/stockReservation.tsx';
import type { IEntityOptionsCart } from '../entity/cart.tsx';
import type { IEntityOptionsCartItem } from '../entity/cartItem.tsx';
import type { IEntityOptionsOrder } from '../entity/order.tsx';
import type { IEntityOptionsOrderAudit } from '../entity/orderAudit.tsx';
import type { IEntityOptionsOrderLine } from '../entity/orderLine.tsx';
import type { IEntityOptionsShipment } from '../entity/shipment.tsx';
import type { IEntityOptionsStockAudit } from '../entity/stockAudit.tsx';
import type { IEntityOptionsStockBalance } from '../entity/stockBalance.tsx';
import type { IEntityOptionsStockReservation } from '../entity/stockReservation.tsx';
import 'vona-module-a-orm';
declare module 'vona-module-a-orm' {
  
    export interface IEntityRecord {
      'commerce-trade:cart': IEntityOptionsCart;
'commerce-trade:cartItem': IEntityOptionsCartItem;
'commerce-trade:order': IEntityOptionsOrder;
'commerce-trade:orderAudit': IEntityOptionsOrderAudit;
'commerce-trade:orderLine': IEntityOptionsOrderLine;
'commerce-trade:shipment': IEntityOptionsShipment;
'commerce-trade:stockAudit': IEntityOptionsStockAudit;
'commerce-trade:stockBalance': IEntityOptionsStockBalance;
'commerce-trade:stockReservation': IEntityOptionsStockReservation;
    }

  
}
declare module 'vona-module-commerce-trade' {
   
}
/** entity: end */
/** entity: begin */
import type { EntityCart } from '../entity/cart.tsx';
import type { EntityCartItem } from '../entity/cartItem.tsx';
import type { EntityOrder } from '../entity/order.tsx';
import type { EntityOrderAudit } from '../entity/orderAudit.tsx';
import type { EntityOrderLine } from '../entity/orderLine.tsx';
import type { EntityShipment } from '../entity/shipment.tsx';
import type { EntityStockAudit } from '../entity/stockAudit.tsx';
import type { EntityStockBalance } from '../entity/stockBalance.tsx';
import type { EntityStockReservation } from '../entity/stockReservation.tsx';
export interface IModuleEntity {
  'cart': EntityCartMeta;
'cartItem': EntityCartItemMeta;
'order': EntityOrderMeta;
'orderAudit': EntityOrderAuditMeta;
'orderLine': EntityOrderLineMeta;
'shipment': EntityShipmentMeta;
'stockAudit': EntityStockAuditMeta;
'stockBalance': EntityStockBalanceMeta;
'stockReservation': EntityStockReservationMeta;
}
/** entity: end */
/** entity: begin */
export type EntityCartTableName = 'commerceTradeCart';
export type EntityCartItemTableName = 'commerceTradeCartItem';
export type EntityOrderTableName = 'commerceTradeOrder';
export type EntityOrderAuditTableName = 'commerceTradeOrderAudit';
export type EntityOrderLineTableName = 'commerceTradeOrderLine';
export type EntityShipmentTableName = 'commerceTradeShipment';
export type EntityStockAuditTableName = 'commerceTradeStockAudit';
export type EntityStockBalanceTableName = 'commerceTradeStockBalance';
export type EntityStockReservationTableName = 'commerceTradeStockReservation';
export type EntityCartMeta=TypeEntityMeta<EntityCart,EntityCartTableName>;
export type EntityCartItemMeta=TypeEntityMeta<EntityCartItem,EntityCartItemTableName>;
export type EntityOrderMeta=TypeEntityMeta<EntityOrder,EntityOrderTableName>;
export type EntityOrderAuditMeta=TypeEntityMeta<EntityOrderAudit,EntityOrderAuditTableName>;
export type EntityOrderLineMeta=TypeEntityMeta<EntityOrderLine,EntityOrderLineTableName>;
export type EntityShipmentMeta=TypeEntityMeta<EntityShipment,EntityShipmentTableName>;
export type EntityStockAuditMeta=TypeEntityMeta<EntityStockAudit,EntityStockAuditTableName>;
export type EntityStockBalanceMeta=TypeEntityMeta<EntityStockBalance,EntityStockBalanceTableName>;
export type EntityStockReservationMeta=TypeEntityMeta<EntityStockReservation,EntityStockReservationTableName>;
declare module 'vona-module-a-orm' {
  export interface ITableRecord {
    'commerceTradeCart': EntityCartMeta;
'commerceTradeCartItem': EntityCartItemMeta;
'commerceTradeOrder': EntityOrderMeta;
'commerceTradeOrderAudit': EntityOrderAuditMeta;
'commerceTradeOrderLine': EntityOrderLineMeta;
'commerceTradeShipment': EntityShipmentMeta;
'commerceTradeStockAudit': EntityStockAuditMeta;
'commerceTradeStockBalance': EntityStockBalanceMeta;
'commerceTradeStockReservation': EntityStockReservationMeta;
  }
}
declare module 'vona-module-commerce-trade' {
  
    export interface IEntityOptionsCart {
      fields?: TypeEntityOptionsFields<EntityCart, IEntityOptionsCart[TypeSymbolKeyFieldsMore]>;
    }

    export interface IEntityOptionsCartItem {
      fields?: TypeEntityOptionsFields<EntityCartItem, IEntityOptionsCartItem[TypeSymbolKeyFieldsMore]>;
    }

    export interface IEntityOptionsOrder {
      fields?: TypeEntityOptionsFields<EntityOrder, IEntityOptionsOrder[TypeSymbolKeyFieldsMore]>;
    }

    export interface IEntityOptionsOrderAudit {
      fields?: TypeEntityOptionsFields<EntityOrderAudit, IEntityOptionsOrderAudit[TypeSymbolKeyFieldsMore]>;
    }

    export interface IEntityOptionsOrderLine {
      fields?: TypeEntityOptionsFields<EntityOrderLine, IEntityOptionsOrderLine[TypeSymbolKeyFieldsMore]>;
    }

    export interface IEntityOptionsShipment {
      fields?: TypeEntityOptionsFields<EntityShipment, IEntityOptionsShipment[TypeSymbolKeyFieldsMore]>;
    }

    export interface IEntityOptionsStockAudit {
      fields?: TypeEntityOptionsFields<EntityStockAudit, IEntityOptionsStockAudit[TypeSymbolKeyFieldsMore]>;
    }

    export interface IEntityOptionsStockBalance {
      fields?: TypeEntityOptionsFields<EntityStockBalance, IEntityOptionsStockBalance[TypeSymbolKeyFieldsMore]>;
    }

    export interface IEntityOptionsStockReservation {
      fields?: TypeEntityOptionsFields<EntityStockReservation, IEntityOptionsStockReservation[TypeSymbolKeyFieldsMore]>;
    }
}
/** entity: end */
/** model: begin */
export * from '../model/cart.ts';
export * from '../model/cartItem.ts';
export * from '../model/order.ts';
export * from '../model/orderAudit.ts';
export * from '../model/orderLine.ts';
export * from '../model/shipment.ts';
export * from '../model/stockAudit.ts';
export * from '../model/stockBalance.ts';
export * from '../model/stockReservation.ts';
import type { IModelOptionsCart } from '../model/cart.ts';
import type { IModelOptionsCartItem } from '../model/cartItem.ts';
import type { IModelOptionsOrder } from '../model/order.ts';
import type { IModelOptionsOrderAudit } from '../model/orderAudit.ts';
import type { IModelOptionsOrderLine } from '../model/orderLine.ts';
import type { IModelOptionsShipment } from '../model/shipment.ts';
import type { IModelOptionsStockAudit } from '../model/stockAudit.ts';
import type { IModelOptionsStockBalance } from '../model/stockBalance.ts';
import type { IModelOptionsStockReservation } from '../model/stockReservation.ts';
import 'vona-module-a-orm';
declare module 'vona-module-a-orm' {
  
    export interface IModelRecord {
      'commerce-trade:cart': IModelOptionsCart;
'commerce-trade:cartItem': IModelOptionsCartItem;
'commerce-trade:order': IModelOptionsOrder;
'commerce-trade:orderAudit': IModelOptionsOrderAudit;
'commerce-trade:orderLine': IModelOptionsOrderLine;
'commerce-trade:shipment': IModelOptionsShipment;
'commerce-trade:stockAudit': IModelOptionsStockAudit;
'commerce-trade:stockBalance': IModelOptionsStockBalance;
'commerce-trade:stockReservation': IModelOptionsStockReservation;
    }

  
}
declare module 'vona-module-commerce-trade' {
  
        export interface ModelCart {
          /** @internal */
          get scope(): ScopeModuleCommerceTrade;
        }

          export interface ModelCart {
            get $beanFullName(): 'commerce-trade.model.cart';
            get $onionName(): 'commerce-trade:cart';
            get $onionOptions(): IModelOptionsCart;
          }

        export interface ModelCartItem {
          /** @internal */
          get scope(): ScopeModuleCommerceTrade;
        }

          export interface ModelCartItem {
            get $beanFullName(): 'commerce-trade.model.cartItem';
            get $onionName(): 'commerce-trade:cartItem';
            get $onionOptions(): IModelOptionsCartItem;
          }

        export interface ModelOrder {
          /** @internal */
          get scope(): ScopeModuleCommerceTrade;
        }

          export interface ModelOrder {
            get $beanFullName(): 'commerce-trade.model.order';
            get $onionName(): 'commerce-trade:order';
            get $onionOptions(): IModelOptionsOrder;
          }

        export interface ModelOrderAudit {
          /** @internal */
          get scope(): ScopeModuleCommerceTrade;
        }

          export interface ModelOrderAudit {
            get $beanFullName(): 'commerce-trade.model.orderAudit';
            get $onionName(): 'commerce-trade:orderAudit';
            get $onionOptions(): IModelOptionsOrderAudit;
          }

        export interface ModelOrderLine {
          /** @internal */
          get scope(): ScopeModuleCommerceTrade;
        }

          export interface ModelOrderLine {
            get $beanFullName(): 'commerce-trade.model.orderLine';
            get $onionName(): 'commerce-trade:orderLine';
            get $onionOptions(): IModelOptionsOrderLine;
          }

        export interface ModelShipment {
          /** @internal */
          get scope(): ScopeModuleCommerceTrade;
        }

          export interface ModelShipment {
            get $beanFullName(): 'commerce-trade.model.shipment';
            get $onionName(): 'commerce-trade:shipment';
            get $onionOptions(): IModelOptionsShipment;
          }

        export interface ModelStockAudit {
          /** @internal */
          get scope(): ScopeModuleCommerceTrade;
        }

          export interface ModelStockAudit {
            get $beanFullName(): 'commerce-trade.model.stockAudit';
            get $onionName(): 'commerce-trade:stockAudit';
            get $onionOptions(): IModelOptionsStockAudit;
          }

        export interface ModelStockBalance {
          /** @internal */
          get scope(): ScopeModuleCommerceTrade;
        }

          export interface ModelStockBalance {
            get $beanFullName(): 'commerce-trade.model.stockBalance';
            get $onionName(): 'commerce-trade:stockBalance';
            get $onionOptions(): IModelOptionsStockBalance;
          }

        export interface ModelStockReservation {
          /** @internal */
          get scope(): ScopeModuleCommerceTrade;
        }

          export interface ModelStockReservation {
            get $beanFullName(): 'commerce-trade.model.stockReservation';
            get $onionName(): 'commerce-trade:stockReservation';
            get $onionOptions(): IModelOptionsStockReservation;
          } 
}
/** model: end */
/** model: begin */
import type { ModelCart } from '../model/cart.ts';
import type { ModelCartItem } from '../model/cartItem.ts';
import type { ModelOrder } from '../model/order.ts';
import type { ModelOrderAudit } from '../model/orderAudit.ts';
import type { ModelOrderLine } from '../model/orderLine.ts';
import type { ModelShipment } from '../model/shipment.ts';
import type { ModelStockAudit } from '../model/stockAudit.ts';
import type { ModelStockBalance } from '../model/stockBalance.ts';
import type { ModelStockReservation } from '../model/stockReservation.ts';
export interface IModuleModel {
  'cart': ModelCart;
'cartItem': ModelCartItem;
'order': ModelOrder;
'orderAudit': ModelOrderAudit;
'orderLine': ModelOrderLine;
'shipment': ModelShipment;
'stockAudit': ModelStockAudit;
'stockBalance': ModelStockBalance;
'stockReservation': ModelStockReservation;
}
/** model: end */
/** model: begin */

import 'vona';
declare module 'vona' {
  export interface IBeanRecordGeneral {
    'commerce-trade.model.cart': ModelCart;
'commerce-trade.model.cartItem': ModelCartItem;
'commerce-trade.model.order': ModelOrder;
'commerce-trade.model.orderAudit': ModelOrderAudit;
'commerce-trade.model.orderLine': ModelOrderLine;
'commerce-trade.model.shipment': ModelShipment;
'commerce-trade.model.stockAudit': ModelStockAudit;
'commerce-trade.model.stockBalance': ModelStockBalance;
'commerce-trade.model.stockReservation': ModelStockReservation;
  }
}
/** model: end */
/** model: begin */
import type { IModelGetOptions, IModelMethodOptions, IModelSelectParams, TypeModelSelectAndCount, TypeModelRelationResult, TypeModelWhere, IModelInsertOptions, TypeModelMutateRelationData, IModelDeleteOptions, IModelUpdateOptions, IModelMutateOptions, IModelSelectCountParams, IModelIncrementParams, IModelSelectAggrParams, TypeModelAggrRelationResult, IModelSelectGroupParams, TypeModelGroupRelationResult } from 'vona-module-a-orm';
import { SymbolKeyEntity, SymbolKeyEntityMeta, SymbolKeyModelOptions } from 'vona-module-a-orm';
declare module 'vona-module-commerce-trade' {
  export interface IModelOptionsCart {
        relations: {
          items: IModelRelationHasMany<'commerce-trade:cartItem', 'cartId', false, 'id'|'skuId'|'quantity', undefined, undefined, undefined>;
        };
      }
export interface IModelOptionsOrder {
        relations: {
          lines: IModelRelationHasMany<'commerce-trade:orderLine', 'orderId', false, 'id'|'skuCodeSnapshot'|'titleSnapshot'|'skuAttributesSnapshot'|'unitPriceCents'|'quantity'|'eligibleSubtotalCents'|'lineTotalCents', undefined, undefined, undefined>;
shipment: IModelRelationHasOne<'commerce-trade:shipment', 'orderId', false, 'id'|'carrier'|'trackingNumber'|'shippedAt'>;
        };
      }
  export interface ModelCart {
      [SymbolKeyEntity]: EntityCart;
      [SymbolKeyEntityMeta]: EntityCartMeta;
      [SymbolKeyModelOptions]: IModelOptionsCart;
      get<T extends IModelGetOptions<EntityCart,ModelCart>>(where: TypeModelWhere<EntityCart>, options?: T): Promise<TypeModelRelationResult<EntityCart, ModelCart, T> | undefined>;
      /**
       * Retrieves one matching primary row with a pessimistic FOR UPDATE lock.
       * Requires an active transaction. The lock is released when that transaction completes.
       * Entity and query caches are bypassed.
       */
      getForUpdate<T extends IModelGetOptions<EntityCart,ModelCart>>(where: TypeModelWhere<EntityCart>, options?: T): Promise<TypeModelRelationResult<EntityCart, ModelCart, T> | undefined>;
      /**
       * Retrieves a primary row by ID with the same pessimistic FOR UPDATE lock semantics.
       * Requires an active transaction. The lock is released when that transaction completes.
       * Entity and query caches are bypassed.
       */
      getByIdForUpdate<T extends IModelGetOptions<EntityCart,ModelCart>>(id: TableIdentity, options?: T): Promise<TypeModelRelationResult<EntityCart, ModelCart, T> | undefined>;
      mget<T extends IModelGetOptions<EntityCart,ModelCart>>(ids: TableIdentity[], options?: T): Promise<TypeModelRelationResult<EntityCart, ModelCart, T>[]>;
      selectAndCount<T extends IModelSelectParams<EntityCart,ModelCart,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelSelectAndCount<EntityCart, ModelCart, T>>;
      select<T extends IModelSelectParams<EntityCart,ModelCart,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelRelationResult<EntityCart, ModelCart, T>[]>;
      insert<T extends IModelInsertOptions<EntityCart,ModelCart>>(data?: TypeModelMutateRelationData<EntityCart,ModelCart, T>, options?: T): Promise<TypeModelMutateRelationData<EntityCart,ModelCart, T, true>>;
      insertBulk<T extends IModelInsertOptions<EntityCart,ModelCart>>(items: TypeModelMutateRelationData<EntityCart,ModelCart, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityCart,ModelCart, T, true>[]>;
      update<T extends IModelUpdateOptions<EntityCart,ModelCart>>(data: TypeModelMutateRelationData<EntityCart,ModelCart, T>, options?: T): Promise<TypeModelMutateRelationData<EntityCart,ModelCart, T>>;
      updateBulk<T extends IModelUpdateOptions<EntityCart,ModelCart>>(items: TypeModelMutateRelationData<EntityCart,ModelCart, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityCart,ModelCart, T>[]>;
      delete<T extends IModelDeleteOptions<EntityCart,ModelCart>>(where?: TypeModelWhere<EntityCart>, options?: T): Promise<void>;
      deleteBulk<T extends IModelDeleteOptions<EntityCart,ModelCart>>(ids: TableIdentity[], options?: T): Promise<void>;
      mutate<T extends IModelMutateOptions<EntityCart,ModelCart>>(data?: TypeModelMutateRelationData<EntityCart,ModelCart, T>, options?: T): Promise<TypeModelMutateRelationData<EntityCart,ModelCart, T>>;
      mutateBulk<T extends IModelMutateOptions<EntityCart,ModelCart>>(items: TypeModelMutateRelationData<EntityCart,ModelCart, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityCart,ModelCart, T>[]>;
      count<T extends IModelSelectCountParams<EntityCart,ModelCart,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<string | undefined>;
      increment<T extends IModelIncrementParams<EntityCart,ModelCart,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      decrement<T extends IModelIncrementParams<EntityCart,ModelCart,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      aggregate<T extends IModelSelectAggrParams<EntityCart,ModelCart,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelAggrRelationResult<T>>;
      group<T extends IModelSelectGroupParams<EntityCart,ModelCart,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelGroupRelationResult<EntityCart, T>[]>;
      getById<T extends IModelGetOptions<EntityCart,ModelCart>>(id: TableIdentity, options?: T): Promise<TypeModelRelationResult<EntityCart, ModelCart, T> | undefined>;
updateById<T extends IModelUpdateOptions<EntityCart,ModelCart>>(id: TableIdentity, data: TypeModelMutateRelationData<EntityCart,ModelCart, T>, options?: T): Promise<TypeModelMutateRelationData<EntityCart,ModelCart, T>>;
deleteById<T extends IModelDeleteOptions<EntityCart,ModelCart>>(id: TableIdentity, options?: T): Promise<void>;
    }
export interface ModelCartItem {
      [SymbolKeyEntity]: EntityCartItem;
      [SymbolKeyEntityMeta]: EntityCartItemMeta;
      [SymbolKeyModelOptions]: IModelOptionsCartItem;
      get<T extends IModelGetOptions<EntityCartItem,ModelCartItem>>(where: TypeModelWhere<EntityCartItem>, options?: T): Promise<TypeModelRelationResult<EntityCartItem, ModelCartItem, T> | undefined>;
      /**
       * Retrieves one matching primary row with a pessimistic FOR UPDATE lock.
       * Requires an active transaction. The lock is released when that transaction completes.
       * Entity and query caches are bypassed.
       */
      getForUpdate<T extends IModelGetOptions<EntityCartItem,ModelCartItem>>(where: TypeModelWhere<EntityCartItem>, options?: T): Promise<TypeModelRelationResult<EntityCartItem, ModelCartItem, T> | undefined>;
      /**
       * Retrieves a primary row by ID with the same pessimistic FOR UPDATE lock semantics.
       * Requires an active transaction. The lock is released when that transaction completes.
       * Entity and query caches are bypassed.
       */
      getByIdForUpdate<T extends IModelGetOptions<EntityCartItem,ModelCartItem>>(id: TableIdentity, options?: T): Promise<TypeModelRelationResult<EntityCartItem, ModelCartItem, T> | undefined>;
      mget<T extends IModelGetOptions<EntityCartItem,ModelCartItem>>(ids: TableIdentity[], options?: T): Promise<TypeModelRelationResult<EntityCartItem, ModelCartItem, T>[]>;
      selectAndCount<T extends IModelSelectParams<EntityCartItem,ModelCartItem,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelSelectAndCount<EntityCartItem, ModelCartItem, T>>;
      select<T extends IModelSelectParams<EntityCartItem,ModelCartItem,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelRelationResult<EntityCartItem, ModelCartItem, T>[]>;
      insert<T extends IModelInsertOptions<EntityCartItem,ModelCartItem>>(data?: TypeModelMutateRelationData<EntityCartItem,ModelCartItem, T>, options?: T): Promise<TypeModelMutateRelationData<EntityCartItem,ModelCartItem, T, true>>;
      insertBulk<T extends IModelInsertOptions<EntityCartItem,ModelCartItem>>(items: TypeModelMutateRelationData<EntityCartItem,ModelCartItem, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityCartItem,ModelCartItem, T, true>[]>;
      update<T extends IModelUpdateOptions<EntityCartItem,ModelCartItem>>(data: TypeModelMutateRelationData<EntityCartItem,ModelCartItem, T>, options?: T): Promise<TypeModelMutateRelationData<EntityCartItem,ModelCartItem, T>>;
      updateBulk<T extends IModelUpdateOptions<EntityCartItem,ModelCartItem>>(items: TypeModelMutateRelationData<EntityCartItem,ModelCartItem, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityCartItem,ModelCartItem, T>[]>;
      delete<T extends IModelDeleteOptions<EntityCartItem,ModelCartItem>>(where?: TypeModelWhere<EntityCartItem>, options?: T): Promise<void>;
      deleteBulk<T extends IModelDeleteOptions<EntityCartItem,ModelCartItem>>(ids: TableIdentity[], options?: T): Promise<void>;
      mutate<T extends IModelMutateOptions<EntityCartItem,ModelCartItem>>(data?: TypeModelMutateRelationData<EntityCartItem,ModelCartItem, T>, options?: T): Promise<TypeModelMutateRelationData<EntityCartItem,ModelCartItem, T>>;
      mutateBulk<T extends IModelMutateOptions<EntityCartItem,ModelCartItem>>(items: TypeModelMutateRelationData<EntityCartItem,ModelCartItem, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityCartItem,ModelCartItem, T>[]>;
      count<T extends IModelSelectCountParams<EntityCartItem,ModelCartItem,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<string | undefined>;
      increment<T extends IModelIncrementParams<EntityCartItem,ModelCartItem,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      decrement<T extends IModelIncrementParams<EntityCartItem,ModelCartItem,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      aggregate<T extends IModelSelectAggrParams<EntityCartItem,ModelCartItem,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelAggrRelationResult<T>>;
      group<T extends IModelSelectGroupParams<EntityCartItem,ModelCartItem,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelGroupRelationResult<EntityCartItem, T>[]>;
      getById<T extends IModelGetOptions<EntityCartItem,ModelCartItem>>(id: TableIdentity, options?: T): Promise<TypeModelRelationResult<EntityCartItem, ModelCartItem, T> | undefined>;
updateById<T extends IModelUpdateOptions<EntityCartItem,ModelCartItem>>(id: TableIdentity, data: TypeModelMutateRelationData<EntityCartItem,ModelCartItem, T>, options?: T): Promise<TypeModelMutateRelationData<EntityCartItem,ModelCartItem, T>>;
deleteById<T extends IModelDeleteOptions<EntityCartItem,ModelCartItem>>(id: TableIdentity, options?: T): Promise<void>;
    }
export interface ModelOrder {
      [SymbolKeyEntity]: EntityOrder;
      [SymbolKeyEntityMeta]: EntityOrderMeta;
      [SymbolKeyModelOptions]: IModelOptionsOrder;
      get<T extends IModelGetOptions<EntityOrder,ModelOrder>>(where: TypeModelWhere<EntityOrder>, options?: T): Promise<TypeModelRelationResult<EntityOrder, ModelOrder, T> | undefined>;
      /**
       * Retrieves one matching primary row with a pessimistic FOR UPDATE lock.
       * Requires an active transaction. The lock is released when that transaction completes.
       * Entity and query caches are bypassed.
       */
      getForUpdate<T extends IModelGetOptions<EntityOrder,ModelOrder>>(where: TypeModelWhere<EntityOrder>, options?: T): Promise<TypeModelRelationResult<EntityOrder, ModelOrder, T> | undefined>;
      /**
       * Retrieves a primary row by ID with the same pessimistic FOR UPDATE lock semantics.
       * Requires an active transaction. The lock is released when that transaction completes.
       * Entity and query caches are bypassed.
       */
      getByIdForUpdate<T extends IModelGetOptions<EntityOrder,ModelOrder>>(id: TableIdentity, options?: T): Promise<TypeModelRelationResult<EntityOrder, ModelOrder, T> | undefined>;
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
export interface ModelOrderAudit {
      [SymbolKeyEntity]: EntityOrderAudit;
      [SymbolKeyEntityMeta]: EntityOrderAuditMeta;
      [SymbolKeyModelOptions]: IModelOptionsOrderAudit;
      get<T extends IModelGetOptions<EntityOrderAudit,ModelOrderAudit>>(where: TypeModelWhere<EntityOrderAudit>, options?: T): Promise<TypeModelRelationResult<EntityOrderAudit, ModelOrderAudit, T> | undefined>;
      /**
       * Retrieves one matching primary row with a pessimistic FOR UPDATE lock.
       * Requires an active transaction. The lock is released when that transaction completes.
       * Entity and query caches are bypassed.
       */
      getForUpdate<T extends IModelGetOptions<EntityOrderAudit,ModelOrderAudit>>(where: TypeModelWhere<EntityOrderAudit>, options?: T): Promise<TypeModelRelationResult<EntityOrderAudit, ModelOrderAudit, T> | undefined>;
      /**
       * Retrieves a primary row by ID with the same pessimistic FOR UPDATE lock semantics.
       * Requires an active transaction. The lock is released when that transaction completes.
       * Entity and query caches are bypassed.
       */
      getByIdForUpdate<T extends IModelGetOptions<EntityOrderAudit,ModelOrderAudit>>(id: TableIdentity, options?: T): Promise<TypeModelRelationResult<EntityOrderAudit, ModelOrderAudit, T> | undefined>;
      mget<T extends IModelGetOptions<EntityOrderAudit,ModelOrderAudit>>(ids: TableIdentity[], options?: T): Promise<TypeModelRelationResult<EntityOrderAudit, ModelOrderAudit, T>[]>;
      selectAndCount<T extends IModelSelectParams<EntityOrderAudit,ModelOrderAudit,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelSelectAndCount<EntityOrderAudit, ModelOrderAudit, T>>;
      select<T extends IModelSelectParams<EntityOrderAudit,ModelOrderAudit,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelRelationResult<EntityOrderAudit, ModelOrderAudit, T>[]>;
      insert<T extends IModelInsertOptions<EntityOrderAudit,ModelOrderAudit>>(data?: TypeModelMutateRelationData<EntityOrderAudit,ModelOrderAudit, T>, options?: T): Promise<TypeModelMutateRelationData<EntityOrderAudit,ModelOrderAudit, T, true>>;
      insertBulk<T extends IModelInsertOptions<EntityOrderAudit,ModelOrderAudit>>(items: TypeModelMutateRelationData<EntityOrderAudit,ModelOrderAudit, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityOrderAudit,ModelOrderAudit, T, true>[]>;
      update<T extends IModelUpdateOptions<EntityOrderAudit,ModelOrderAudit>>(data: TypeModelMutateRelationData<EntityOrderAudit,ModelOrderAudit, T>, options?: T): Promise<TypeModelMutateRelationData<EntityOrderAudit,ModelOrderAudit, T>>;
      updateBulk<T extends IModelUpdateOptions<EntityOrderAudit,ModelOrderAudit>>(items: TypeModelMutateRelationData<EntityOrderAudit,ModelOrderAudit, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityOrderAudit,ModelOrderAudit, T>[]>;
      delete<T extends IModelDeleteOptions<EntityOrderAudit,ModelOrderAudit>>(where?: TypeModelWhere<EntityOrderAudit>, options?: T): Promise<void>;
      deleteBulk<T extends IModelDeleteOptions<EntityOrderAudit,ModelOrderAudit>>(ids: TableIdentity[], options?: T): Promise<void>;
      mutate<T extends IModelMutateOptions<EntityOrderAudit,ModelOrderAudit>>(data?: TypeModelMutateRelationData<EntityOrderAudit,ModelOrderAudit, T>, options?: T): Promise<TypeModelMutateRelationData<EntityOrderAudit,ModelOrderAudit, T>>;
      mutateBulk<T extends IModelMutateOptions<EntityOrderAudit,ModelOrderAudit>>(items: TypeModelMutateRelationData<EntityOrderAudit,ModelOrderAudit, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityOrderAudit,ModelOrderAudit, T>[]>;
      count<T extends IModelSelectCountParams<EntityOrderAudit,ModelOrderAudit,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<string | undefined>;
      increment<T extends IModelIncrementParams<EntityOrderAudit,ModelOrderAudit,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      decrement<T extends IModelIncrementParams<EntityOrderAudit,ModelOrderAudit,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      aggregate<T extends IModelSelectAggrParams<EntityOrderAudit,ModelOrderAudit,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelAggrRelationResult<T>>;
      group<T extends IModelSelectGroupParams<EntityOrderAudit,ModelOrderAudit,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelGroupRelationResult<EntityOrderAudit, T>[]>;
      getById<T extends IModelGetOptions<EntityOrderAudit,ModelOrderAudit>>(id: TableIdentity, options?: T): Promise<TypeModelRelationResult<EntityOrderAudit, ModelOrderAudit, T> | undefined>;
updateById<T extends IModelUpdateOptions<EntityOrderAudit,ModelOrderAudit>>(id: TableIdentity, data: TypeModelMutateRelationData<EntityOrderAudit,ModelOrderAudit, T>, options?: T): Promise<TypeModelMutateRelationData<EntityOrderAudit,ModelOrderAudit, T>>;
deleteById<T extends IModelDeleteOptions<EntityOrderAudit,ModelOrderAudit>>(id: TableIdentity, options?: T): Promise<void>;
    }
export interface ModelOrderLine {
      [SymbolKeyEntity]: EntityOrderLine;
      [SymbolKeyEntityMeta]: EntityOrderLineMeta;
      [SymbolKeyModelOptions]: IModelOptionsOrderLine;
      get<T extends IModelGetOptions<EntityOrderLine,ModelOrderLine>>(where: TypeModelWhere<EntityOrderLine>, options?: T): Promise<TypeModelRelationResult<EntityOrderLine, ModelOrderLine, T> | undefined>;
      /**
       * Retrieves one matching primary row with a pessimistic FOR UPDATE lock.
       * Requires an active transaction. The lock is released when that transaction completes.
       * Entity and query caches are bypassed.
       */
      getForUpdate<T extends IModelGetOptions<EntityOrderLine,ModelOrderLine>>(where: TypeModelWhere<EntityOrderLine>, options?: T): Promise<TypeModelRelationResult<EntityOrderLine, ModelOrderLine, T> | undefined>;
      /**
       * Retrieves a primary row by ID with the same pessimistic FOR UPDATE lock semantics.
       * Requires an active transaction. The lock is released when that transaction completes.
       * Entity and query caches are bypassed.
       */
      getByIdForUpdate<T extends IModelGetOptions<EntityOrderLine,ModelOrderLine>>(id: TableIdentity, options?: T): Promise<TypeModelRelationResult<EntityOrderLine, ModelOrderLine, T> | undefined>;
      mget<T extends IModelGetOptions<EntityOrderLine,ModelOrderLine>>(ids: TableIdentity[], options?: T): Promise<TypeModelRelationResult<EntityOrderLine, ModelOrderLine, T>[]>;
      selectAndCount<T extends IModelSelectParams<EntityOrderLine,ModelOrderLine,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelSelectAndCount<EntityOrderLine, ModelOrderLine, T>>;
      select<T extends IModelSelectParams<EntityOrderLine,ModelOrderLine,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelRelationResult<EntityOrderLine, ModelOrderLine, T>[]>;
      insert<T extends IModelInsertOptions<EntityOrderLine,ModelOrderLine>>(data?: TypeModelMutateRelationData<EntityOrderLine,ModelOrderLine, T>, options?: T): Promise<TypeModelMutateRelationData<EntityOrderLine,ModelOrderLine, T, true>>;
      insertBulk<T extends IModelInsertOptions<EntityOrderLine,ModelOrderLine>>(items: TypeModelMutateRelationData<EntityOrderLine,ModelOrderLine, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityOrderLine,ModelOrderLine, T, true>[]>;
      update<T extends IModelUpdateOptions<EntityOrderLine,ModelOrderLine>>(data: TypeModelMutateRelationData<EntityOrderLine,ModelOrderLine, T>, options?: T): Promise<TypeModelMutateRelationData<EntityOrderLine,ModelOrderLine, T>>;
      updateBulk<T extends IModelUpdateOptions<EntityOrderLine,ModelOrderLine>>(items: TypeModelMutateRelationData<EntityOrderLine,ModelOrderLine, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityOrderLine,ModelOrderLine, T>[]>;
      delete<T extends IModelDeleteOptions<EntityOrderLine,ModelOrderLine>>(where?: TypeModelWhere<EntityOrderLine>, options?: T): Promise<void>;
      deleteBulk<T extends IModelDeleteOptions<EntityOrderLine,ModelOrderLine>>(ids: TableIdentity[], options?: T): Promise<void>;
      mutate<T extends IModelMutateOptions<EntityOrderLine,ModelOrderLine>>(data?: TypeModelMutateRelationData<EntityOrderLine,ModelOrderLine, T>, options?: T): Promise<TypeModelMutateRelationData<EntityOrderLine,ModelOrderLine, T>>;
      mutateBulk<T extends IModelMutateOptions<EntityOrderLine,ModelOrderLine>>(items: TypeModelMutateRelationData<EntityOrderLine,ModelOrderLine, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityOrderLine,ModelOrderLine, T>[]>;
      count<T extends IModelSelectCountParams<EntityOrderLine,ModelOrderLine,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<string | undefined>;
      increment<T extends IModelIncrementParams<EntityOrderLine,ModelOrderLine,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      decrement<T extends IModelIncrementParams<EntityOrderLine,ModelOrderLine,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      aggregate<T extends IModelSelectAggrParams<EntityOrderLine,ModelOrderLine,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelAggrRelationResult<T>>;
      group<T extends IModelSelectGroupParams<EntityOrderLine,ModelOrderLine,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelGroupRelationResult<EntityOrderLine, T>[]>;
      getById<T extends IModelGetOptions<EntityOrderLine,ModelOrderLine>>(id: TableIdentity, options?: T): Promise<TypeModelRelationResult<EntityOrderLine, ModelOrderLine, T> | undefined>;
updateById<T extends IModelUpdateOptions<EntityOrderLine,ModelOrderLine>>(id: TableIdentity, data: TypeModelMutateRelationData<EntityOrderLine,ModelOrderLine, T>, options?: T): Promise<TypeModelMutateRelationData<EntityOrderLine,ModelOrderLine, T>>;
deleteById<T extends IModelDeleteOptions<EntityOrderLine,ModelOrderLine>>(id: TableIdentity, options?: T): Promise<void>;
    }
export interface ModelShipment {
      [SymbolKeyEntity]: EntityShipment;
      [SymbolKeyEntityMeta]: EntityShipmentMeta;
      [SymbolKeyModelOptions]: IModelOptionsShipment;
      get<T extends IModelGetOptions<EntityShipment,ModelShipment>>(where: TypeModelWhere<EntityShipment>, options?: T): Promise<TypeModelRelationResult<EntityShipment, ModelShipment, T> | undefined>;
      /**
       * Retrieves one matching primary row with a pessimistic FOR UPDATE lock.
       * Requires an active transaction. The lock is released when that transaction completes.
       * Entity and query caches are bypassed.
       */
      getForUpdate<T extends IModelGetOptions<EntityShipment,ModelShipment>>(where: TypeModelWhere<EntityShipment>, options?: T): Promise<TypeModelRelationResult<EntityShipment, ModelShipment, T> | undefined>;
      /**
       * Retrieves a primary row by ID with the same pessimistic FOR UPDATE lock semantics.
       * Requires an active transaction. The lock is released when that transaction completes.
       * Entity and query caches are bypassed.
       */
      getByIdForUpdate<T extends IModelGetOptions<EntityShipment,ModelShipment>>(id: TableIdentity, options?: T): Promise<TypeModelRelationResult<EntityShipment, ModelShipment, T> | undefined>;
      mget<T extends IModelGetOptions<EntityShipment,ModelShipment>>(ids: TableIdentity[], options?: T): Promise<TypeModelRelationResult<EntityShipment, ModelShipment, T>[]>;
      selectAndCount<T extends IModelSelectParams<EntityShipment,ModelShipment,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelSelectAndCount<EntityShipment, ModelShipment, T>>;
      select<T extends IModelSelectParams<EntityShipment,ModelShipment,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelRelationResult<EntityShipment, ModelShipment, T>[]>;
      insert<T extends IModelInsertOptions<EntityShipment,ModelShipment>>(data?: TypeModelMutateRelationData<EntityShipment,ModelShipment, T>, options?: T): Promise<TypeModelMutateRelationData<EntityShipment,ModelShipment, T, true>>;
      insertBulk<T extends IModelInsertOptions<EntityShipment,ModelShipment>>(items: TypeModelMutateRelationData<EntityShipment,ModelShipment, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityShipment,ModelShipment, T, true>[]>;
      update<T extends IModelUpdateOptions<EntityShipment,ModelShipment>>(data: TypeModelMutateRelationData<EntityShipment,ModelShipment, T>, options?: T): Promise<TypeModelMutateRelationData<EntityShipment,ModelShipment, T>>;
      updateBulk<T extends IModelUpdateOptions<EntityShipment,ModelShipment>>(items: TypeModelMutateRelationData<EntityShipment,ModelShipment, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityShipment,ModelShipment, T>[]>;
      delete<T extends IModelDeleteOptions<EntityShipment,ModelShipment>>(where?: TypeModelWhere<EntityShipment>, options?: T): Promise<void>;
      deleteBulk<T extends IModelDeleteOptions<EntityShipment,ModelShipment>>(ids: TableIdentity[], options?: T): Promise<void>;
      mutate<T extends IModelMutateOptions<EntityShipment,ModelShipment>>(data?: TypeModelMutateRelationData<EntityShipment,ModelShipment, T>, options?: T): Promise<TypeModelMutateRelationData<EntityShipment,ModelShipment, T>>;
      mutateBulk<T extends IModelMutateOptions<EntityShipment,ModelShipment>>(items: TypeModelMutateRelationData<EntityShipment,ModelShipment, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityShipment,ModelShipment, T>[]>;
      count<T extends IModelSelectCountParams<EntityShipment,ModelShipment,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<string | undefined>;
      increment<T extends IModelIncrementParams<EntityShipment,ModelShipment,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      decrement<T extends IModelIncrementParams<EntityShipment,ModelShipment,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      aggregate<T extends IModelSelectAggrParams<EntityShipment,ModelShipment,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelAggrRelationResult<T>>;
      group<T extends IModelSelectGroupParams<EntityShipment,ModelShipment,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelGroupRelationResult<EntityShipment, T>[]>;
      getById<T extends IModelGetOptions<EntityShipment,ModelShipment>>(id: TableIdentity, options?: T): Promise<TypeModelRelationResult<EntityShipment, ModelShipment, T> | undefined>;
updateById<T extends IModelUpdateOptions<EntityShipment,ModelShipment>>(id: TableIdentity, data: TypeModelMutateRelationData<EntityShipment,ModelShipment, T>, options?: T): Promise<TypeModelMutateRelationData<EntityShipment,ModelShipment, T>>;
deleteById<T extends IModelDeleteOptions<EntityShipment,ModelShipment>>(id: TableIdentity, options?: T): Promise<void>;
    }
export interface ModelStockAudit {
      [SymbolKeyEntity]: EntityStockAudit;
      [SymbolKeyEntityMeta]: EntityStockAuditMeta;
      [SymbolKeyModelOptions]: IModelOptionsStockAudit;
      get<T extends IModelGetOptions<EntityStockAudit,ModelStockAudit>>(where: TypeModelWhere<EntityStockAudit>, options?: T): Promise<TypeModelRelationResult<EntityStockAudit, ModelStockAudit, T> | undefined>;
      /**
       * Retrieves one matching primary row with a pessimistic FOR UPDATE lock.
       * Requires an active transaction. The lock is released when that transaction completes.
       * Entity and query caches are bypassed.
       */
      getForUpdate<T extends IModelGetOptions<EntityStockAudit,ModelStockAudit>>(where: TypeModelWhere<EntityStockAudit>, options?: T): Promise<TypeModelRelationResult<EntityStockAudit, ModelStockAudit, T> | undefined>;
      /**
       * Retrieves a primary row by ID with the same pessimistic FOR UPDATE lock semantics.
       * Requires an active transaction. The lock is released when that transaction completes.
       * Entity and query caches are bypassed.
       */
      getByIdForUpdate<T extends IModelGetOptions<EntityStockAudit,ModelStockAudit>>(id: TableIdentity, options?: T): Promise<TypeModelRelationResult<EntityStockAudit, ModelStockAudit, T> | undefined>;
      mget<T extends IModelGetOptions<EntityStockAudit,ModelStockAudit>>(ids: TableIdentity[], options?: T): Promise<TypeModelRelationResult<EntityStockAudit, ModelStockAudit, T>[]>;
      selectAndCount<T extends IModelSelectParams<EntityStockAudit,ModelStockAudit,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelSelectAndCount<EntityStockAudit, ModelStockAudit, T>>;
      select<T extends IModelSelectParams<EntityStockAudit,ModelStockAudit,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelRelationResult<EntityStockAudit, ModelStockAudit, T>[]>;
      insert<T extends IModelInsertOptions<EntityStockAudit,ModelStockAudit>>(data?: TypeModelMutateRelationData<EntityStockAudit,ModelStockAudit, T>, options?: T): Promise<TypeModelMutateRelationData<EntityStockAudit,ModelStockAudit, T, true>>;
      insertBulk<T extends IModelInsertOptions<EntityStockAudit,ModelStockAudit>>(items: TypeModelMutateRelationData<EntityStockAudit,ModelStockAudit, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityStockAudit,ModelStockAudit, T, true>[]>;
      update<T extends IModelUpdateOptions<EntityStockAudit,ModelStockAudit>>(data: TypeModelMutateRelationData<EntityStockAudit,ModelStockAudit, T>, options?: T): Promise<TypeModelMutateRelationData<EntityStockAudit,ModelStockAudit, T>>;
      updateBulk<T extends IModelUpdateOptions<EntityStockAudit,ModelStockAudit>>(items: TypeModelMutateRelationData<EntityStockAudit,ModelStockAudit, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityStockAudit,ModelStockAudit, T>[]>;
      delete<T extends IModelDeleteOptions<EntityStockAudit,ModelStockAudit>>(where?: TypeModelWhere<EntityStockAudit>, options?: T): Promise<void>;
      deleteBulk<T extends IModelDeleteOptions<EntityStockAudit,ModelStockAudit>>(ids: TableIdentity[], options?: T): Promise<void>;
      mutate<T extends IModelMutateOptions<EntityStockAudit,ModelStockAudit>>(data?: TypeModelMutateRelationData<EntityStockAudit,ModelStockAudit, T>, options?: T): Promise<TypeModelMutateRelationData<EntityStockAudit,ModelStockAudit, T>>;
      mutateBulk<T extends IModelMutateOptions<EntityStockAudit,ModelStockAudit>>(items: TypeModelMutateRelationData<EntityStockAudit,ModelStockAudit, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityStockAudit,ModelStockAudit, T>[]>;
      count<T extends IModelSelectCountParams<EntityStockAudit,ModelStockAudit,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<string | undefined>;
      increment<T extends IModelIncrementParams<EntityStockAudit,ModelStockAudit,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      decrement<T extends IModelIncrementParams<EntityStockAudit,ModelStockAudit,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      aggregate<T extends IModelSelectAggrParams<EntityStockAudit,ModelStockAudit,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelAggrRelationResult<T>>;
      group<T extends IModelSelectGroupParams<EntityStockAudit,ModelStockAudit,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelGroupRelationResult<EntityStockAudit, T>[]>;
      getById<T extends IModelGetOptions<EntityStockAudit,ModelStockAudit>>(id: TableIdentity, options?: T): Promise<TypeModelRelationResult<EntityStockAudit, ModelStockAudit, T> | undefined>;
updateById<T extends IModelUpdateOptions<EntityStockAudit,ModelStockAudit>>(id: TableIdentity, data: TypeModelMutateRelationData<EntityStockAudit,ModelStockAudit, T>, options?: T): Promise<TypeModelMutateRelationData<EntityStockAudit,ModelStockAudit, T>>;
deleteById<T extends IModelDeleteOptions<EntityStockAudit,ModelStockAudit>>(id: TableIdentity, options?: T): Promise<void>;
    }
export interface ModelStockBalance {
      [SymbolKeyEntity]: EntityStockBalance;
      [SymbolKeyEntityMeta]: EntityStockBalanceMeta;
      [SymbolKeyModelOptions]: IModelOptionsStockBalance;
      get<T extends IModelGetOptions<EntityStockBalance,ModelStockBalance>>(where: TypeModelWhere<EntityStockBalance>, options?: T): Promise<TypeModelRelationResult<EntityStockBalance, ModelStockBalance, T> | undefined>;
      /**
       * Retrieves one matching primary row with a pessimistic FOR UPDATE lock.
       * Requires an active transaction. The lock is released when that transaction completes.
       * Entity and query caches are bypassed.
       */
      getForUpdate<T extends IModelGetOptions<EntityStockBalance,ModelStockBalance>>(where: TypeModelWhere<EntityStockBalance>, options?: T): Promise<TypeModelRelationResult<EntityStockBalance, ModelStockBalance, T> | undefined>;
      /**
       * Retrieves a primary row by ID with the same pessimistic FOR UPDATE lock semantics.
       * Requires an active transaction. The lock is released when that transaction completes.
       * Entity and query caches are bypassed.
       */
      getByIdForUpdate<T extends IModelGetOptions<EntityStockBalance,ModelStockBalance>>(id: TableIdentity, options?: T): Promise<TypeModelRelationResult<EntityStockBalance, ModelStockBalance, T> | undefined>;
      mget<T extends IModelGetOptions<EntityStockBalance,ModelStockBalance>>(ids: TableIdentity[], options?: T): Promise<TypeModelRelationResult<EntityStockBalance, ModelStockBalance, T>[]>;
      selectAndCount<T extends IModelSelectParams<EntityStockBalance,ModelStockBalance,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelSelectAndCount<EntityStockBalance, ModelStockBalance, T>>;
      select<T extends IModelSelectParams<EntityStockBalance,ModelStockBalance,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelRelationResult<EntityStockBalance, ModelStockBalance, T>[]>;
      insert<T extends IModelInsertOptions<EntityStockBalance,ModelStockBalance>>(data?: TypeModelMutateRelationData<EntityStockBalance,ModelStockBalance, T>, options?: T): Promise<TypeModelMutateRelationData<EntityStockBalance,ModelStockBalance, T, true>>;
      insertBulk<T extends IModelInsertOptions<EntityStockBalance,ModelStockBalance>>(items: TypeModelMutateRelationData<EntityStockBalance,ModelStockBalance, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityStockBalance,ModelStockBalance, T, true>[]>;
      update<T extends IModelUpdateOptions<EntityStockBalance,ModelStockBalance>>(data: TypeModelMutateRelationData<EntityStockBalance,ModelStockBalance, T>, options?: T): Promise<TypeModelMutateRelationData<EntityStockBalance,ModelStockBalance, T>>;
      updateBulk<T extends IModelUpdateOptions<EntityStockBalance,ModelStockBalance>>(items: TypeModelMutateRelationData<EntityStockBalance,ModelStockBalance, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityStockBalance,ModelStockBalance, T>[]>;
      delete<T extends IModelDeleteOptions<EntityStockBalance,ModelStockBalance>>(where?: TypeModelWhere<EntityStockBalance>, options?: T): Promise<void>;
      deleteBulk<T extends IModelDeleteOptions<EntityStockBalance,ModelStockBalance>>(ids: TableIdentity[], options?: T): Promise<void>;
      mutate<T extends IModelMutateOptions<EntityStockBalance,ModelStockBalance>>(data?: TypeModelMutateRelationData<EntityStockBalance,ModelStockBalance, T>, options?: T): Promise<TypeModelMutateRelationData<EntityStockBalance,ModelStockBalance, T>>;
      mutateBulk<T extends IModelMutateOptions<EntityStockBalance,ModelStockBalance>>(items: TypeModelMutateRelationData<EntityStockBalance,ModelStockBalance, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityStockBalance,ModelStockBalance, T>[]>;
      count<T extends IModelSelectCountParams<EntityStockBalance,ModelStockBalance,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<string | undefined>;
      increment<T extends IModelIncrementParams<EntityStockBalance,ModelStockBalance,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      decrement<T extends IModelIncrementParams<EntityStockBalance,ModelStockBalance,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      aggregate<T extends IModelSelectAggrParams<EntityStockBalance,ModelStockBalance,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelAggrRelationResult<T>>;
      group<T extends IModelSelectGroupParams<EntityStockBalance,ModelStockBalance,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelGroupRelationResult<EntityStockBalance, T>[]>;
      getById<T extends IModelGetOptions<EntityStockBalance,ModelStockBalance>>(id: TableIdentity, options?: T): Promise<TypeModelRelationResult<EntityStockBalance, ModelStockBalance, T> | undefined>;
updateById<T extends IModelUpdateOptions<EntityStockBalance,ModelStockBalance>>(id: TableIdentity, data: TypeModelMutateRelationData<EntityStockBalance,ModelStockBalance, T>, options?: T): Promise<TypeModelMutateRelationData<EntityStockBalance,ModelStockBalance, T>>;
deleteById<T extends IModelDeleteOptions<EntityStockBalance,ModelStockBalance>>(id: TableIdentity, options?: T): Promise<void>;
    }
export interface ModelStockReservation {
      [SymbolKeyEntity]: EntityStockReservation;
      [SymbolKeyEntityMeta]: EntityStockReservationMeta;
      [SymbolKeyModelOptions]: IModelOptionsStockReservation;
      get<T extends IModelGetOptions<EntityStockReservation,ModelStockReservation>>(where: TypeModelWhere<EntityStockReservation>, options?: T): Promise<TypeModelRelationResult<EntityStockReservation, ModelStockReservation, T> | undefined>;
      /**
       * Retrieves one matching primary row with a pessimistic FOR UPDATE lock.
       * Requires an active transaction. The lock is released when that transaction completes.
       * Entity and query caches are bypassed.
       */
      getForUpdate<T extends IModelGetOptions<EntityStockReservation,ModelStockReservation>>(where: TypeModelWhere<EntityStockReservation>, options?: T): Promise<TypeModelRelationResult<EntityStockReservation, ModelStockReservation, T> | undefined>;
      /**
       * Retrieves a primary row by ID with the same pessimistic FOR UPDATE lock semantics.
       * Requires an active transaction. The lock is released when that transaction completes.
       * Entity and query caches are bypassed.
       */
      getByIdForUpdate<T extends IModelGetOptions<EntityStockReservation,ModelStockReservation>>(id: TableIdentity, options?: T): Promise<TypeModelRelationResult<EntityStockReservation, ModelStockReservation, T> | undefined>;
      mget<T extends IModelGetOptions<EntityStockReservation,ModelStockReservation>>(ids: TableIdentity[], options?: T): Promise<TypeModelRelationResult<EntityStockReservation, ModelStockReservation, T>[]>;
      selectAndCount<T extends IModelSelectParams<EntityStockReservation,ModelStockReservation,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelSelectAndCount<EntityStockReservation, ModelStockReservation, T>>;
      select<T extends IModelSelectParams<EntityStockReservation,ModelStockReservation,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelRelationResult<EntityStockReservation, ModelStockReservation, T>[]>;
      insert<T extends IModelInsertOptions<EntityStockReservation,ModelStockReservation>>(data?: TypeModelMutateRelationData<EntityStockReservation,ModelStockReservation, T>, options?: T): Promise<TypeModelMutateRelationData<EntityStockReservation,ModelStockReservation, T, true>>;
      insertBulk<T extends IModelInsertOptions<EntityStockReservation,ModelStockReservation>>(items: TypeModelMutateRelationData<EntityStockReservation,ModelStockReservation, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityStockReservation,ModelStockReservation, T, true>[]>;
      update<T extends IModelUpdateOptions<EntityStockReservation,ModelStockReservation>>(data: TypeModelMutateRelationData<EntityStockReservation,ModelStockReservation, T>, options?: T): Promise<TypeModelMutateRelationData<EntityStockReservation,ModelStockReservation, T>>;
      updateBulk<T extends IModelUpdateOptions<EntityStockReservation,ModelStockReservation>>(items: TypeModelMutateRelationData<EntityStockReservation,ModelStockReservation, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityStockReservation,ModelStockReservation, T>[]>;
      delete<T extends IModelDeleteOptions<EntityStockReservation,ModelStockReservation>>(where?: TypeModelWhere<EntityStockReservation>, options?: T): Promise<void>;
      deleteBulk<T extends IModelDeleteOptions<EntityStockReservation,ModelStockReservation>>(ids: TableIdentity[], options?: T): Promise<void>;
      mutate<T extends IModelMutateOptions<EntityStockReservation,ModelStockReservation>>(data?: TypeModelMutateRelationData<EntityStockReservation,ModelStockReservation, T>, options?: T): Promise<TypeModelMutateRelationData<EntityStockReservation,ModelStockReservation, T>>;
      mutateBulk<T extends IModelMutateOptions<EntityStockReservation,ModelStockReservation>>(items: TypeModelMutateRelationData<EntityStockReservation,ModelStockReservation, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityStockReservation,ModelStockReservation, T>[]>;
      count<T extends IModelSelectCountParams<EntityStockReservation,ModelStockReservation,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<string | undefined>;
      increment<T extends IModelIncrementParams<EntityStockReservation,ModelStockReservation,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      decrement<T extends IModelIncrementParams<EntityStockReservation,ModelStockReservation,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      aggregate<T extends IModelSelectAggrParams<EntityStockReservation,ModelStockReservation,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelAggrRelationResult<T>>;
      group<T extends IModelSelectGroupParams<EntityStockReservation,ModelStockReservation,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelGroupRelationResult<EntityStockReservation, T>[]>;
      getById<T extends IModelGetOptions<EntityStockReservation,ModelStockReservation>>(id: TableIdentity, options?: T): Promise<TypeModelRelationResult<EntityStockReservation, ModelStockReservation, T> | undefined>;
updateById<T extends IModelUpdateOptions<EntityStockReservation,ModelStockReservation>>(id: TableIdentity, data: TypeModelMutateRelationData<EntityStockReservation,ModelStockReservation, T>, options?: T): Promise<TypeModelMutateRelationData<EntityStockReservation,ModelStockReservation, T>>;
deleteById<T extends IModelDeleteOptions<EntityStockReservation,ModelStockReservation>>(id: TableIdentity, options?: T): Promise<void>;
    }
}
declare module 'vona-module-a-orm' {
  export interface IModelClassRecord {
    'commerce-trade:cart': ModelCart;
'commerce-trade:cartItem': ModelCartItem;
'commerce-trade:order': ModelOrder;
'commerce-trade:orderAudit': ModelOrderAudit;
'commerce-trade:orderLine': ModelOrderLine;
'commerce-trade:shipment': ModelShipment;
'commerce-trade:stockAudit': ModelStockAudit;
'commerce-trade:stockBalance': ModelStockBalance;
'commerce-trade:stockReservation': ModelStockReservation;
  }
}
/** model: end */
/** bean: begin */
export * from '../bean/bean.scheduleOrderExpiry.ts';

import 'vona';
declare module 'vona' {
  
  
}
declare module 'vona-module-commerce-trade' {
  
        export interface BeanScheduleOrderExpiry {
          /** @internal */
          get scope(): ScopeModuleCommerceTrade;
        } 
}
/** bean: end */
/** bean: begin */
import type { BeanScheduleOrderExpiry } from '../bean/bean.scheduleOrderExpiry.ts';
import 'vona';
declare module 'vona' {
  export interface IBeanRecordGlobal {
    'scheduleOrderExpiry': BeanScheduleOrderExpiry;
  }
}
/** bean: end */
/** service: begin */
export * from '../service/cart.ts';
export * from '../service/order.ts';
export * from '../service/stockAudit.ts';
export * from '../service/stockBalance.ts';

import 'vona-module-a-bean';
declare module 'vona-module-a-bean' {
  
    export interface IServiceRecord {
      'commerce-trade:cart': never;
'commerce-trade:order': never;
'commerce-trade:stockAudit': never;
'commerce-trade:stockBalance': never;
    }

  
}
declare module 'vona-module-commerce-trade' {
  
        export interface ServiceCart {
          /** @internal */
          get scope(): ScopeModuleCommerceTrade;
        }

          export interface ServiceCart {
            get $beanFullName(): 'commerce-trade.service.cart';
            get $onionName(): 'commerce-trade:cart';
            
          }

        export interface ServiceOrder {
          /** @internal */
          get scope(): ScopeModuleCommerceTrade;
        }

          export interface ServiceOrder {
            get $beanFullName(): 'commerce-trade.service.order';
            get $onionName(): 'commerce-trade:order';
            
          }

        export interface ServiceStockAudit {
          /** @internal */
          get scope(): ScopeModuleCommerceTrade;
        }

          export interface ServiceStockAudit {
            get $beanFullName(): 'commerce-trade.service.stockAudit';
            get $onionName(): 'commerce-trade:stockAudit';
            
          }

        export interface ServiceStockBalance {
          /** @internal */
          get scope(): ScopeModuleCommerceTrade;
        }

          export interface ServiceStockBalance {
            get $beanFullName(): 'commerce-trade.service.stockBalance';
            get $onionName(): 'commerce-trade:stockBalance';
            
          } 
}
/** service: end */
/** service: begin */
import type { ServiceCart } from '../service/cart.ts';
import type { ServiceOrder } from '../service/order.ts';
import type { ServiceStockAudit } from '../service/stockAudit.ts';
import type { ServiceStockBalance } from '../service/stockBalance.ts';
export interface IModuleService {
  'cart': ServiceCart;
'order': ServiceOrder;
'stockAudit': ServiceStockAudit;
'stockBalance': ServiceStockBalance;
}
/** service: end */
/** service: begin */

import 'vona';
declare module 'vona' {
  export interface IBeanRecordGeneral {
    'commerce-trade.service.cart': ServiceCart;
'commerce-trade.service.order': ServiceOrder;
'commerce-trade.service.stockAudit': ServiceStockAudit;
'commerce-trade.service.stockBalance': ServiceStockBalance;
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
      'commerce-trade:index': IMetaOptionsIndex;
'commerce-trade:version': never;
    }

  
}
declare module 'vona-module-commerce-trade' {
  
        export interface MetaIndex {
          /** @internal */
          get scope(): ScopeModuleCommerceTrade;
        }

          export interface MetaIndex {
            get $beanFullName(): 'commerce-trade.meta.index';
            get $onionName(): 'commerce-trade:index';
            get $onionOptions(): IMetaOptionsIndex;
          }

        export interface MetaVersion {
          /** @internal */
          get scope(): ScopeModuleCommerceTrade;
        }

          export interface MetaVersion {
            get $beanFullName(): 'commerce-trade.meta.version';
            get $onionName(): 'commerce-trade:version';
            
          } 
}
/** meta: end */
/** dto: begin */
export * from '../dto/cartAddItem.tsx';
export * from '../dto/cartItem.tsx';
export * from '../dto/cartUpdateItem.tsx';
export * from '../dto/cartView.tsx';
export * from '../dto/checkoutCreate.tsx';
export * from '../dto/checkoutPaymentMethod.tsx';
export * from '../dto/checkoutPaymentMethods.tsx';
export * from '../dto/checkoutResult.tsx';
export * from '../dto/orderAddressSnapshot.tsx';
export * from '../dto/orderAdminLineBase.tsx';
export * from '../dto/orderAdminLineResItem.tsx';
export * from '../dto/orderAdminLineView.tsx';
export * from '../dto/orderCouponSnapshot.tsx';
export * from '../dto/orderDetail.tsx';
export * from '../dto/orderLineSkuAttributeSnapshot.tsx';
export * from '../dto/orderMineReq.tsx';
export * from '../dto/orderMineRes.tsx';
export * from '../dto/orderSelectReq.tsx';
export * from '../dto/orderSelectRes.tsx';
export * from '../dto/orderSelectResItem.tsx';
export * from '../dto/orderShip.tsx';
export * from '../dto/orderSummary.tsx';
export * from '../dto/orderView.tsx';
export * from '../dto/paymentOutcomeCreate.tsx';
export * from '../dto/paymentOutcomeResult.tsx';
export * from '../dto/refundOutcomeCreate.tsx';
export * from '../dto/refundRecoveryAction.tsx';
export * from '../dto/refundRecoveryView.tsx';
export * from '../dto/refundRequestCreate.tsx';
export * from '../dto/refundResult.tsx';
export * from '../dto/refundReview.tsx';
export * from '../dto/shipmentView.tsx';
export * from '../dto/stockAdjust.tsx';
export * from '../dto/stockAuditCreate.tsx';
export * from '../dto/stockAuditSelectReq.tsx';
export * from '../dto/stockAuditSelectRes.tsx';
export * from '../dto/stockAuditSelectResItem.tsx';
export * from '../dto/stockAuditUpdate.tsx';
export * from '../dto/stockAuditView.tsx';
export * from '../dto/stockBalanceCreate.tsx';
export * from '../dto/stockBalanceSelectReq.tsx';
export * from '../dto/stockBalanceSelectRes.tsx';
export * from '../dto/stockBalanceSelectResItem.tsx';
export * from '../dto/stockBalanceUpdate.tsx';
export * from '../dto/stockBalanceView.tsx';
import type { IDtoOptionsCartAddItem } from '../dto/cartAddItem.tsx';
import type { IDtoOptionsCartItem } from '../dto/cartItem.tsx';
import type { IDtoOptionsCartUpdateItem } from '../dto/cartUpdateItem.tsx';
import type { IDtoOptionsCartView } from '../dto/cartView.tsx';
import type { IDtoOptionsCheckoutCreate } from '../dto/checkoutCreate.tsx';
import type { IDtoOptionsCheckoutPaymentMethod } from '../dto/checkoutPaymentMethod.tsx';
import type { IDtoOptionsCheckoutPaymentMethods } from '../dto/checkoutPaymentMethods.tsx';
import type { IDtoOptionsCheckoutResult } from '../dto/checkoutResult.tsx';
import type { IDtoOptionsOrderAddressSnapshot } from '../dto/orderAddressSnapshot.tsx';
import type { IDtoOptionsOrderAdminLineBase } from '../dto/orderAdminLineBase.tsx';
import type { IDtoOptionsOrderAdminLineResItem } from '../dto/orderAdminLineResItem.tsx';
import type { IDtoOptionsOrderAdminLineView } from '../dto/orderAdminLineView.tsx';
import type { IDtoOptionsOrderCouponSnapshot } from '../dto/orderCouponSnapshot.tsx';
import type { IDtoOptionsOrderDetail } from '../dto/orderDetail.tsx';
import type { IDtoOptionsOrderLineSkuAttributeSnapshot } from '../dto/orderLineSkuAttributeSnapshot.tsx';
import type { IDtoOptionsOrderMineReq } from '../dto/orderMineReq.tsx';
import type { IDtoOptionsOrderMineRes } from '../dto/orderMineRes.tsx';
import type { IDtoOptionsOrderSelectReq } from '../dto/orderSelectReq.tsx';
import type { IDtoOptionsOrderSelectRes } from '../dto/orderSelectRes.tsx';
import type { IDtoOptionsOrderSelectResItem } from '../dto/orderSelectResItem.tsx';
import type { IDtoOptionsOrderShip } from '../dto/orderShip.tsx';
import type { IDtoOptionsOrderSummary } from '../dto/orderSummary.tsx';
import type { IDtoOptionsOrderView } from '../dto/orderView.tsx';
import type { IDtoOptionsPaymentOutcomeCreate } from '../dto/paymentOutcomeCreate.tsx';
import type { IDtoOptionsPaymentOutcomeResult } from '../dto/paymentOutcomeResult.tsx';
import type { IDtoOptionsRefundOutcomeCreate } from '../dto/refundOutcomeCreate.tsx';
import type { IDtoOptionsRefundRecoveryAction } from '../dto/refundRecoveryAction.tsx';
import type { IDtoOptionsRefundRecoveryView } from '../dto/refundRecoveryView.tsx';
import type { IDtoOptionsRefundRequestCreate } from '../dto/refundRequestCreate.tsx';
import type { IDtoOptionsRefundResult } from '../dto/refundResult.tsx';
import type { IDtoOptionsRefundReview } from '../dto/refundReview.tsx';
import type { IDtoOptionsShipmentView } from '../dto/shipmentView.tsx';
import type { IDtoOptionsStockAdjust } from '../dto/stockAdjust.tsx';
import type { IDtoOptionsStockAuditCreate } from '../dto/stockAuditCreate.tsx';
import type { IDtoOptionsStockAuditSelectReq } from '../dto/stockAuditSelectReq.tsx';
import type { IDtoOptionsStockAuditSelectRes } from '../dto/stockAuditSelectRes.tsx';
import type { IDtoOptionsStockAuditSelectResItem } from '../dto/stockAuditSelectResItem.tsx';
import type { IDtoOptionsStockAuditUpdate } from '../dto/stockAuditUpdate.tsx';
import type { IDtoOptionsStockAuditView } from '../dto/stockAuditView.tsx';
import type { IDtoOptionsStockBalanceCreate } from '../dto/stockBalanceCreate.tsx';
import type { IDtoOptionsStockBalanceSelectReq } from '../dto/stockBalanceSelectReq.tsx';
import type { IDtoOptionsStockBalanceSelectRes } from '../dto/stockBalanceSelectRes.tsx';
import type { IDtoOptionsStockBalanceSelectResItem } from '../dto/stockBalanceSelectResItem.tsx';
import type { IDtoOptionsStockBalanceUpdate } from '../dto/stockBalanceUpdate.tsx';
import type { IDtoOptionsStockBalanceView } from '../dto/stockBalanceView.tsx';
import 'vona-module-a-web';
declare module 'vona-module-a-web' {
  
    export interface IDtoRecord {
      'commerce-trade:cartAddItem': IDtoOptionsCartAddItem;
'commerce-trade:cartItem': IDtoOptionsCartItem;
'commerce-trade:cartUpdateItem': IDtoOptionsCartUpdateItem;
'commerce-trade:cartView': IDtoOptionsCartView;
'commerce-trade:checkoutCreate': IDtoOptionsCheckoutCreate;
'commerce-trade:checkoutPaymentMethod': IDtoOptionsCheckoutPaymentMethod;
'commerce-trade:checkoutPaymentMethods': IDtoOptionsCheckoutPaymentMethods;
'commerce-trade:checkoutResult': IDtoOptionsCheckoutResult;
'commerce-trade:orderAddressSnapshot': IDtoOptionsOrderAddressSnapshot;
'commerce-trade:orderAdminLineBase': IDtoOptionsOrderAdminLineBase;
'commerce-trade:orderAdminLineResItem': IDtoOptionsOrderAdminLineResItem;
'commerce-trade:orderAdminLineView': IDtoOptionsOrderAdminLineView;
'commerce-trade:orderCouponSnapshot': IDtoOptionsOrderCouponSnapshot;
'commerce-trade:orderDetail': IDtoOptionsOrderDetail;
'commerce-trade:orderLineSkuAttributeSnapshot': IDtoOptionsOrderLineSkuAttributeSnapshot;
'commerce-trade:orderMineReq': IDtoOptionsOrderMineReq;
'commerce-trade:orderMineRes': IDtoOptionsOrderMineRes;
'commerce-trade:orderSelectReq': IDtoOptionsOrderSelectReq;
'commerce-trade:orderSelectRes': IDtoOptionsOrderSelectRes;
'commerce-trade:orderSelectResItem': IDtoOptionsOrderSelectResItem;
'commerce-trade:orderShip': IDtoOptionsOrderShip;
'commerce-trade:orderSummary': IDtoOptionsOrderSummary;
'commerce-trade:orderView': IDtoOptionsOrderView;
'commerce-trade:paymentOutcomeCreate': IDtoOptionsPaymentOutcomeCreate;
'commerce-trade:paymentOutcomeResult': IDtoOptionsPaymentOutcomeResult;
'commerce-trade:refundOutcomeCreate': IDtoOptionsRefundOutcomeCreate;
'commerce-trade:refundRecoveryAction': IDtoOptionsRefundRecoveryAction;
'commerce-trade:refundRecoveryView': IDtoOptionsRefundRecoveryView;
'commerce-trade:refundRequestCreate': IDtoOptionsRefundRequestCreate;
'commerce-trade:refundResult': IDtoOptionsRefundResult;
'commerce-trade:refundReview': IDtoOptionsRefundReview;
'commerce-trade:shipmentView': IDtoOptionsShipmentView;
'commerce-trade:stockAdjust': IDtoOptionsStockAdjust;
'commerce-trade:stockAuditCreate': IDtoOptionsStockAuditCreate;
'commerce-trade:stockAuditSelectReq': IDtoOptionsStockAuditSelectReq;
'commerce-trade:stockAuditSelectRes': IDtoOptionsStockAuditSelectRes;
'commerce-trade:stockAuditSelectResItem': IDtoOptionsStockAuditSelectResItem;
'commerce-trade:stockAuditUpdate': IDtoOptionsStockAuditUpdate;
'commerce-trade:stockAuditView': IDtoOptionsStockAuditView;
'commerce-trade:stockBalanceCreate': IDtoOptionsStockBalanceCreate;
'commerce-trade:stockBalanceSelectReq': IDtoOptionsStockBalanceSelectReq;
'commerce-trade:stockBalanceSelectRes': IDtoOptionsStockBalanceSelectRes;
'commerce-trade:stockBalanceSelectResItem': IDtoOptionsStockBalanceSelectResItem;
'commerce-trade:stockBalanceUpdate': IDtoOptionsStockBalanceUpdate;
'commerce-trade:stockBalanceView': IDtoOptionsStockBalanceView;
    }

  
}
declare module 'vona-module-commerce-trade' {
   
}
/** dto: end */
/** dto: begin */
import type { DtoCartAddItem } from '../dto/cartAddItem.tsx';
import type { DtoCartItem } from '../dto/cartItem.tsx';
import type { DtoCartUpdateItem } from '../dto/cartUpdateItem.tsx';
import type { DtoCartView } from '../dto/cartView.tsx';
import type { DtoCheckoutCreate } from '../dto/checkoutCreate.tsx';
import type { DtoCheckoutPaymentMethod } from '../dto/checkoutPaymentMethod.tsx';
import type { DtoCheckoutPaymentMethods } from '../dto/checkoutPaymentMethods.tsx';
import type { DtoCheckoutResult } from '../dto/checkoutResult.tsx';
import type { DtoOrderAddressSnapshot } from '../dto/orderAddressSnapshot.tsx';
import type { DtoOrderAdminLineBase } from '../dto/orderAdminLineBase.tsx';
import type { DtoOrderAdminLineResItem } from '../dto/orderAdminLineResItem.tsx';
import type { DtoOrderAdminLineView } from '../dto/orderAdminLineView.tsx';
import type { DtoOrderCouponSnapshot } from '../dto/orderCouponSnapshot.tsx';
import type { DtoOrderDetail } from '../dto/orderDetail.tsx';
import type { DtoOrderLineSkuAttributeSnapshot } from '../dto/orderLineSkuAttributeSnapshot.tsx';
import type { DtoOrderMineReq } from '../dto/orderMineReq.tsx';
import type { DtoOrderMineRes } from '../dto/orderMineRes.tsx';
import type { DtoOrderSelectReq } from '../dto/orderSelectReq.tsx';
import type { DtoOrderSelectRes } from '../dto/orderSelectRes.tsx';
import type { DtoOrderSelectResItem } from '../dto/orderSelectResItem.tsx';
import type { DtoOrderShip } from '../dto/orderShip.tsx';
import type { DtoOrderSummary } from '../dto/orderSummary.tsx';
import type { DtoOrderView } from '../dto/orderView.tsx';
import type { DtoPaymentOutcomeCreate } from '../dto/paymentOutcomeCreate.tsx';
import type { DtoPaymentOutcomeResult } from '../dto/paymentOutcomeResult.tsx';
import type { DtoRefundOutcomeCreate } from '../dto/refundOutcomeCreate.tsx';
import type { DtoRefundRecoveryAction } from '../dto/refundRecoveryAction.tsx';
import type { DtoRefundRecoveryView } from '../dto/refundRecoveryView.tsx';
import type { DtoRefundRequestCreate } from '../dto/refundRequestCreate.tsx';
import type { DtoRefundResult } from '../dto/refundResult.tsx';
import type { DtoRefundReview } from '../dto/refundReview.tsx';
import type { DtoShipmentView } from '../dto/shipmentView.tsx';
import type { DtoStockAdjust } from '../dto/stockAdjust.tsx';
import type { DtoStockAuditCreate } from '../dto/stockAuditCreate.tsx';
import type { DtoStockAuditSelectReq } from '../dto/stockAuditSelectReq.tsx';
import type { DtoStockAuditSelectRes } from '../dto/stockAuditSelectRes.tsx';
import type { DtoStockAuditSelectResItem } from '../dto/stockAuditSelectResItem.tsx';
import type { DtoStockAuditUpdate } from '../dto/stockAuditUpdate.tsx';
import type { DtoStockAuditView } from '../dto/stockAuditView.tsx';
import type { DtoStockBalanceCreate } from '../dto/stockBalanceCreate.tsx';
import type { DtoStockBalanceSelectReq } from '../dto/stockBalanceSelectReq.tsx';
import type { DtoStockBalanceSelectRes } from '../dto/stockBalanceSelectRes.tsx';
import type { DtoStockBalanceSelectResItem } from '../dto/stockBalanceSelectResItem.tsx';
import type { DtoStockBalanceUpdate } from '../dto/stockBalanceUpdate.tsx';
import type { DtoStockBalanceView } from '../dto/stockBalanceView.tsx';
declare module 'vona-module-commerce-trade' {
  
    export interface IDtoOptionsCartAddItem {
      fields?: TypeEntityOptionsFields<DtoCartAddItem, IDtoOptionsCartAddItem[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsCartItem {
      fields?: TypeEntityOptionsFields<DtoCartItem, IDtoOptionsCartItem[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsCartUpdateItem {
      fields?: TypeEntityOptionsFields<DtoCartUpdateItem, IDtoOptionsCartUpdateItem[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsCartView {
      fields?: TypeEntityOptionsFields<DtoCartView, IDtoOptionsCartView[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsCheckoutCreate {
      fields?: TypeEntityOptionsFields<DtoCheckoutCreate, IDtoOptionsCheckoutCreate[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsCheckoutPaymentMethod {
      fields?: TypeEntityOptionsFields<DtoCheckoutPaymentMethod, IDtoOptionsCheckoutPaymentMethod[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsCheckoutPaymentMethods {
      fields?: TypeEntityOptionsFields<DtoCheckoutPaymentMethods, IDtoOptionsCheckoutPaymentMethods[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsCheckoutResult {
      fields?: TypeEntityOptionsFields<DtoCheckoutResult, IDtoOptionsCheckoutResult[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsOrderAddressSnapshot {
      fields?: TypeEntityOptionsFields<DtoOrderAddressSnapshot, IDtoOptionsOrderAddressSnapshot[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsOrderAdminLineBase {
      fields?: TypeEntityOptionsFields<DtoOrderAdminLineBase, IDtoOptionsOrderAdminLineBase[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsOrderAdminLineResItem {
      fields?: TypeEntityOptionsFields<DtoOrderAdminLineResItem, IDtoOptionsOrderAdminLineResItem[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsOrderAdminLineView {
      fields?: TypeEntityOptionsFields<DtoOrderAdminLineView, IDtoOptionsOrderAdminLineView[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsOrderCouponSnapshot {
      fields?: TypeEntityOptionsFields<DtoOrderCouponSnapshot, IDtoOptionsOrderCouponSnapshot[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsOrderDetail {
      fields?: TypeEntityOptionsFields<DtoOrderDetail, IDtoOptionsOrderDetail[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsOrderLineSkuAttributeSnapshot {
      fields?: TypeEntityOptionsFields<DtoOrderLineSkuAttributeSnapshot, IDtoOptionsOrderLineSkuAttributeSnapshot[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsOrderMineReq {
      fields?: TypeEntityOptionsFields<DtoOrderMineReq, IDtoOptionsOrderMineReq[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsOrderMineRes {
      fields?: TypeEntityOptionsFields<DtoOrderMineRes, IDtoOptionsOrderMineRes[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsOrderSelectReq {
      fields?: TypeEntityOptionsFields<DtoOrderSelectReq, IDtoOptionsOrderSelectReq[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsOrderSelectRes {
      fields?: TypeEntityOptionsFields<DtoOrderSelectRes, IDtoOptionsOrderSelectRes[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsOrderSelectResItem {
      fields?: TypeEntityOptionsFields<DtoOrderSelectResItem, IDtoOptionsOrderSelectResItem[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsOrderShip {
      fields?: TypeEntityOptionsFields<DtoOrderShip, IDtoOptionsOrderShip[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsOrderSummary {
      fields?: TypeEntityOptionsFields<DtoOrderSummary, IDtoOptionsOrderSummary[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsOrderView {
      fields?: TypeEntityOptionsFields<DtoOrderView, IDtoOptionsOrderView[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsPaymentOutcomeCreate {
      fields?: TypeEntityOptionsFields<DtoPaymentOutcomeCreate, IDtoOptionsPaymentOutcomeCreate[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsPaymentOutcomeResult {
      fields?: TypeEntityOptionsFields<DtoPaymentOutcomeResult, IDtoOptionsPaymentOutcomeResult[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsRefundOutcomeCreate {
      fields?: TypeEntityOptionsFields<DtoRefundOutcomeCreate, IDtoOptionsRefundOutcomeCreate[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsRefundRecoveryAction {
      fields?: TypeEntityOptionsFields<DtoRefundRecoveryAction, IDtoOptionsRefundRecoveryAction[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsRefundRecoveryView {
      fields?: TypeEntityOptionsFields<DtoRefundRecoveryView, IDtoOptionsRefundRecoveryView[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsRefundRequestCreate {
      fields?: TypeEntityOptionsFields<DtoRefundRequestCreate, IDtoOptionsRefundRequestCreate[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsRefundResult {
      fields?: TypeEntityOptionsFields<DtoRefundResult, IDtoOptionsRefundResult[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsRefundReview {
      fields?: TypeEntityOptionsFields<DtoRefundReview, IDtoOptionsRefundReview[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsShipmentView {
      fields?: TypeEntityOptionsFields<DtoShipmentView, IDtoOptionsShipmentView[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsStockAdjust {
      fields?: TypeEntityOptionsFields<DtoStockAdjust, IDtoOptionsStockAdjust[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsStockAuditCreate {
      fields?: TypeEntityOptionsFields<DtoStockAuditCreate, IDtoOptionsStockAuditCreate[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsStockAuditSelectReq {
      fields?: TypeEntityOptionsFields<DtoStockAuditSelectReq, IDtoOptionsStockAuditSelectReq[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsStockAuditSelectRes {
      fields?: TypeEntityOptionsFields<DtoStockAuditSelectRes, IDtoOptionsStockAuditSelectRes[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsStockAuditSelectResItem {
      fields?: TypeEntityOptionsFields<DtoStockAuditSelectResItem, IDtoOptionsStockAuditSelectResItem[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsStockAuditUpdate {
      fields?: TypeEntityOptionsFields<DtoStockAuditUpdate, IDtoOptionsStockAuditUpdate[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsStockAuditView {
      fields?: TypeEntityOptionsFields<DtoStockAuditView, IDtoOptionsStockAuditView[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsStockBalanceCreate {
      fields?: TypeEntityOptionsFields<DtoStockBalanceCreate, IDtoOptionsStockBalanceCreate[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsStockBalanceSelectReq {
      fields?: TypeEntityOptionsFields<DtoStockBalanceSelectReq, IDtoOptionsStockBalanceSelectReq[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsStockBalanceSelectRes {
      fields?: TypeEntityOptionsFields<DtoStockBalanceSelectRes, IDtoOptionsStockBalanceSelectRes[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsStockBalanceSelectResItem {
      fields?: TypeEntityOptionsFields<DtoStockBalanceSelectResItem, IDtoOptionsStockBalanceSelectResItem[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsStockBalanceUpdate {
      fields?: TypeEntityOptionsFields<DtoStockBalanceUpdate, IDtoOptionsStockBalanceUpdate[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsStockBalanceView {
      fields?: TypeEntityOptionsFields<DtoStockBalanceView, IDtoOptionsStockBalanceView[TypeSymbolKeyFieldsMore]>;
    }
}
/** dto: end */
/** controller: begin */
export * from '../controller/cart.ts';
export * from '../controller/checkout.ts';
export * from '../controller/order.ts';
export * from '../controller/stockAudit.ts';
export * from '../controller/stockBalance.ts';
import type { IControllerOptionsCart } from '../controller/cart.ts';
import type { IControllerOptionsCheckout } from '../controller/checkout.ts';
import type { IControllerOptionsOrder } from '../controller/order.ts';
import type { IControllerOptionsStockAudit } from '../controller/stockAudit.ts';
import type { IControllerOptionsStockBalance } from '../controller/stockBalance.ts';
import 'vona-module-a-web';
declare module 'vona-module-a-web' {
  
    export interface IControllerRecord {
      'commerce-trade:cart': IControllerOptionsCart;
'commerce-trade:checkout': IControllerOptionsCheckout;
'commerce-trade:order': IControllerOptionsOrder;
'commerce-trade:stockAudit': IControllerOptionsStockAudit;
'commerce-trade:stockBalance': IControllerOptionsStockBalance;
    }

  
}
declare module 'vona-module-commerce-trade' {
  
        export interface ControllerCart {
          /** @internal */
          get scope(): ScopeModuleCommerceTrade;
        }

          export interface ControllerCart {
            get $beanFullName(): 'commerce-trade.controller.cart';
            get $onionName(): 'commerce-trade:cart';
            get $onionOptions(): IControllerOptionsCart;
          }

        export interface ControllerCheckout {
          /** @internal */
          get scope(): ScopeModuleCommerceTrade;
        }

          export interface ControllerCheckout {
            get $beanFullName(): 'commerce-trade.controller.checkout';
            get $onionName(): 'commerce-trade:checkout';
            get $onionOptions(): IControllerOptionsCheckout;
          }

        export interface ControllerOrder {
          /** @internal */
          get scope(): ScopeModuleCommerceTrade;
        }

          export interface ControllerOrder {
            get $beanFullName(): 'commerce-trade.controller.order';
            get $onionName(): 'commerce-trade:order';
            get $onionOptions(): IControllerOptionsOrder;
          }

        export interface ControllerStockAudit {
          /** @internal */
          get scope(): ScopeModuleCommerceTrade;
        }

          export interface ControllerStockAudit {
            get $beanFullName(): 'commerce-trade.controller.stockAudit';
            get $onionName(): 'commerce-trade:stockAudit';
            get $onionOptions(): IControllerOptionsStockAudit;
          }

        export interface ControllerStockBalance {
          /** @internal */
          get scope(): ScopeModuleCommerceTrade;
        }

          export interface ControllerStockBalance {
            get $beanFullName(): 'commerce-trade.controller.stockBalance';
            get $onionName(): 'commerce-trade:stockBalance';
            get $onionOptions(): IControllerOptionsStockBalance;
          } 
}
/** controller: end */
/** controller: begin */
// @ts-ignore ignore
import type { ControllerCart } from '../controller/cart.ts';
// @ts-ignore ignore
import type { ControllerCheckout } from '../controller/checkout.ts';
// @ts-ignore ignore
import type { ControllerOrder } from '../controller/order.ts';
// @ts-ignore ignore
import type { ControllerStockAudit } from '../controller/stockAudit.ts';
// @ts-ignore ignore
import type { ControllerStockBalance } from '../controller/stockBalance.ts';
declare module 'vona-module-commerce-trade' {
  
    export interface IControllerOptionsCart {
      actions?: TypeControllerOptionsActions<ControllerCart>;
    }

    export interface IControllerOptionsCheckout {
      actions?: TypeControllerOptionsActions<ControllerCheckout>;
    }

    export interface IControllerOptionsOrder {
      actions?: TypeControllerOptionsActions<ControllerOrder>;
    }

    export interface IControllerOptionsStockAudit {
      actions?: TypeControllerOptionsActions<ControllerStockAudit>;
    }

    export interface IControllerOptionsStockBalance {
      actions?: TypeControllerOptionsActions<ControllerStockBalance>;
    }
}
declare module 'vona-module-a-web' {
  export interface IApiPathGetRecord{
        '/commerce/trade/cart': undefined;
'/commerce/trade/checkout/payment-methods': undefined;
'/commerce/trade/order/mine': undefined;
'/commerce/trade/order/viewMine/:id': undefined;
'/commerce/trade/order/:id/refundRecovery': undefined;
'/commerce/trade/order': undefined;
'/commerce/trade/order/:id': undefined;
'/commerce/trade/stockAudit': undefined;
'/commerce/trade/stockAudit/:id': undefined;
'/commerce/trade/stockBalance': undefined;
'/commerce/trade/stockBalance/:id': undefined;
    }
export interface IApiPathPostRecord{
        '/commerce/trade/cart/items': undefined;
'/commerce/trade/checkout': undefined;
'/commerce/trade/order/:id/requestRefund': undefined;
'/commerce/trade/order/:id/approveRefund': undefined;
'/commerce/trade/order/:id/rejectRefund': undefined;
'/commerce/trade/order/:id/executeRefund': undefined;
'/commerce/trade/order/:id/reconcileRefund': undefined;
'/commerce/trade/order/:id/retryRefund': undefined;
'/commerce/trade/order/:id/ship': undefined;
'/commerce/trade/stockBalance/adjustStock': undefined;
    }
export interface IApiPathPatchRecord{
        '/commerce/trade/cart/items/:id': undefined;
    }
export interface IApiPathDeleteRecord{
        '/commerce/trade/cart/items/:id': undefined;
'/commerce/trade/cart/items': undefined;
    }

}
import 'vona-module-a-openapi';
  declare module 'vona-module-a-openapi' {
    export interface IResourceRecord {
      'commerce-trade:order': never;
'commerce-trade:stockAudit': never;
'commerce-trade:stockBalance': never;
    }
  }
  
/** controller: end */
/** ssrMenu: begin */
export * from '../bean/ssrMenu.order.ts';
export * from '../bean/ssrMenu.stockAudit.ts';
export * from '../bean/ssrMenu.stockBalance.ts';
import type { ISsrMenuOptionsOrder } from '../bean/ssrMenu.order.ts';
import type { ISsrMenuOptionsStockAudit } from '../bean/ssrMenu.stockAudit.ts';
import type { ISsrMenuOptionsStockBalance } from '../bean/ssrMenu.stockBalance.ts';
import 'vona-module-a-ssr';
declare module 'vona-module-a-ssr' {
  
    export interface ISsrMenuRecord {
      'commerce-trade:order': ISsrMenuOptionsOrder;
'commerce-trade:stockAudit': ISsrMenuOptionsStockAudit;
'commerce-trade:stockBalance': ISsrMenuOptionsStockBalance;
    }

  
}
declare module 'vona-module-commerce-trade' {
  
        export interface SsrMenuOrder {
          /** @internal */
          get scope(): ScopeModuleCommerceTrade;
        }

          export interface SsrMenuOrder {
            get $beanFullName(): 'commerce-trade.ssrMenu.order';
            get $onionName(): 'commerce-trade:order';
            get $onionOptions(): ISsrMenuOptionsOrder;
          }

        export interface SsrMenuStockAudit {
          /** @internal */
          get scope(): ScopeModuleCommerceTrade;
        }

          export interface SsrMenuStockAudit {
            get $beanFullName(): 'commerce-trade.ssrMenu.stockAudit';
            get $onionName(): 'commerce-trade:stockAudit';
            get $onionOptions(): ISsrMenuOptionsStockAudit;
          }

        export interface SsrMenuStockBalance {
          /** @internal */
          get scope(): ScopeModuleCommerceTrade;
        }

          export interface SsrMenuStockBalance {
            get $beanFullName(): 'commerce-trade.ssrMenu.stockBalance';
            get $onionName(): 'commerce-trade:stockBalance';
            get $onionOptions(): ISsrMenuOptionsStockBalance;
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
export class ScopeModuleCommerceTrade extends BeanScopeBase {}

export interface ScopeModuleCommerceTrade {
  util: BeanScopeUtil;
locale: TypeModuleLocales<(typeof locales)[TypeLocaleBase]>;
entity: IModuleEntity;
model: IModuleModel;
service: IModuleService;
}

import 'vona';
declare module 'vona' {
  export interface IBeanScopeRecord {
    'commerce-trade': ScopeModuleCommerceTrade;
  }

  export interface IBeanScopeContainer {
    commerceTrade: ScopeModuleCommerceTrade;
  }
  
  

  export interface IBeanScopeLocale {
    'commerce-trade': (typeof locales)[TypeLocaleBase];
  }

  
}
/** scope: end */
