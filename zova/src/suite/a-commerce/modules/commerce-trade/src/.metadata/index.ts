// eslint-disable
/** model: begin */
export * from '../model/cart.js';
export * from '../model/order.js';
export * from '../model/orderMine.js';
import { IModelOptionsCart } from '../model/cart.js';
import { IModelOptionsOrder } from '../model/order.js';
import { IModelOptionsOrderMine } from '../model/orderMine.js';
import 'zova-module-a-model';
declare module 'zova-module-a-model' {
  
    export interface IModelRecord {
      'commerce-trade:cart': IModelOptionsCart;
'commerce-trade:order': IModelOptionsOrder;
'commerce-trade:orderMine': IModelOptionsOrderMine;
    }

  
}
declare module 'zova-module-commerce-trade' {
  
        export interface ModelCart {
          /** @internal */
          get scope(): ScopeModuleCommerceTrade;
        }

        export interface ModelCart {
          get $beanFullName(): 'commerce-trade.model.cart';
          get $onionName(): 'commerce-trade:cart';
          get $onionOptions(): IModelOptionsCart;
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

        export interface ModelOrderMine {
          /** @internal */
          get scope(): ScopeModuleCommerceTrade;
        }

        export interface ModelOrderMine {
          get $beanFullName(): 'commerce-trade.model.orderMine';
          get $onionName(): 'commerce-trade:orderMine';
          get $onionOptions(): IModelOptionsOrderMine;
        } 
}
/** model: end */
/** model: begin */
import { ModelCart } from '../model/cart.js';
import { ModelOrder } from '../model/order.js';
import { ModelOrderMine } from '../model/orderMine.js';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'commerce-trade.model.cart': ModelCart;
'commerce-trade.model.order': ModelOrder;
'commerce-trade.model.orderMine': ModelOrderMine;
  }
}
/** model: end */
/** api: begin */
export * from '../api/commerceTradeCart.js';
export * from '../api/commerceTradeCheckout.js';
export * from '../api/commerceTradeOrder.js';

import 'zova';
declare module 'zova' {
  
  
}
declare module 'zova-module-commerce-trade' {
  
        export interface ApiCommerceTradeCart {
          /** @internal */
          get scope(): ScopeModuleCommerceTrade;
        }

        export interface ApiCommerceTradeCart {
          get $beanFullName(): 'commerce-trade.api.commerceTradeCart';
          get $onionName(): 'commerce-trade:commerceTradeCart';
          
        }

        export interface ApiCommerceTradeCheckout {
          /** @internal */
          get scope(): ScopeModuleCommerceTrade;
        }

        export interface ApiCommerceTradeCheckout {
          get $beanFullName(): 'commerce-trade.api.commerceTradeCheckout';
          get $onionName(): 'commerce-trade:commerceTradeCheckout';
          
        }

        export interface ApiCommerceTradeOrder {
          /** @internal */
          get scope(): ScopeModuleCommerceTrade;
        }

        export interface ApiCommerceTradeOrder {
          get $beanFullName(): 'commerce-trade.api.commerceTradeOrder';
          get $onionName(): 'commerce-trade:commerceTradeOrder';
          
        } 
}
/** api: end */
/** api: begin */
import { ApiCommerceTradeCart } from '../api/commerceTradeCart.js';
import { ApiCommerceTradeCheckout } from '../api/commerceTradeCheckout.js';
import { ApiCommerceTradeOrder } from '../api/commerceTradeOrder.js';
export interface IModuleApi {
  'commerceTradeCart': ApiCommerceTradeCart;
'commerceTradeCheckout': ApiCommerceTradeCheckout;
'commerceTradeOrder': ApiCommerceTradeOrder;
}
/** api: end */
/** api: begin */

import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'commerce-trade.api.commerceTradeCart': ApiCommerceTradeCart;
'commerce-trade.api.commerceTradeCheckout': ApiCommerceTradeCheckout;
'commerce-trade.api.commerceTradeOrder': ApiCommerceTradeOrder;
  }
}
/** api: end */
/** openapi: begin */
export * from '../api/openapi/index.js';
/** openapi: end */
/** apiSchema: begin */
export * from '../apiSchema/commerceTradeCart.js';
export * from '../apiSchema/commerceTradeCheckout.js';
export * from '../apiSchema/commerceTradeOrder.js';

import 'zova';
declare module 'zova' {
  
  
}
declare module 'zova-module-commerce-trade' {
  
        export interface ApiSchemaCommerceTradeCart {
          /** @internal */
          get scope(): ScopeModuleCommerceTrade;
        }

        export interface ApiSchemaCommerceTradeCart {
          get $beanFullName(): 'commerce-trade.apiSchema.commerceTradeCart';
          get $onionName(): 'commerce-trade:commerceTradeCart';
          
        }

        export interface ApiSchemaCommerceTradeCheckout {
          /** @internal */
          get scope(): ScopeModuleCommerceTrade;
        }

        export interface ApiSchemaCommerceTradeCheckout {
          get $beanFullName(): 'commerce-trade.apiSchema.commerceTradeCheckout';
          get $onionName(): 'commerce-trade:commerceTradeCheckout';
          
        }

        export interface ApiSchemaCommerceTradeOrder {
          /** @internal */
          get scope(): ScopeModuleCommerceTrade;
        }

        export interface ApiSchemaCommerceTradeOrder {
          get $beanFullName(): 'commerce-trade.apiSchema.commerceTradeOrder';
          get $onionName(): 'commerce-trade:commerceTradeOrder';
          
        } 
}
/** apiSchema: end */
/** apiSchema: begin */
import { ApiSchemaCommerceTradeCart } from '../apiSchema/commerceTradeCart.js';
import { ApiSchemaCommerceTradeCheckout } from '../apiSchema/commerceTradeCheckout.js';
import { ApiSchemaCommerceTradeOrder } from '../apiSchema/commerceTradeOrder.js';
export interface IModuleApiSchema {
  'commerceTradeCart': ApiSchemaCommerceTradeCart;
'commerceTradeCheckout': ApiSchemaCommerceTradeCheckout;
'commerceTradeOrder': ApiSchemaCommerceTradeOrder;
}
/** apiSchema: end */
/** apiSchema: begin */

import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'commerce-trade.apiSchema.commerceTradeCart': ApiSchemaCommerceTradeCart;
'commerce-trade.apiSchema.commerceTradeCheckout': ApiSchemaCommerceTradeCheckout;
'commerce-trade.apiSchema.commerceTradeOrder': ApiSchemaCommerceTradeOrder;
  }
}
/** apiSchema: end */
/** controller: begin */
export * from '../component/tableCellActionRefund/controller.jsx';
export * from '../component/tableCellActionShip/controller.jsx';
export * from '../page/cart/controller.jsx';
export * from '../page/checkout/controller.jsx';
export * from '../page/order/controller.jsx';
export * from '../page/orders/controller.jsx';
export * from '../page/payment/controller.jsx';

import 'zova';
declare module 'zova' {
  
  
}
declare module 'zova-module-commerce-trade' {
  
        export interface ControllerTableCellActionRefund {
          /** @internal */
          get scope(): ScopeModuleCommerceTrade;
        }

        export interface ControllerTableCellActionShip {
          /** @internal */
          get scope(): ScopeModuleCommerceTrade;
        }

        export interface ControllerPageCart {
          /** @internal */
          get scope(): ScopeModuleCommerceTrade;
        }

        export interface ControllerPageCheckout {
          /** @internal */
          get scope(): ScopeModuleCommerceTrade;
        }

        export interface ControllerPageOrder {
          /** @internal */
          get scope(): ScopeModuleCommerceTrade;
        }

        export interface ControllerPageOrders {
          /** @internal */
          get scope(): ScopeModuleCommerceTrade;
        }

        export interface ControllerPagePayment {
          /** @internal */
          get scope(): ScopeModuleCommerceTrade;
        } 
}
/** controller: end */
/** controller: begin */
import { ControllerTableCellActionRefund } from '../component/tableCellActionRefund/controller.jsx';
import { ControllerTableCellActionShip } from '../component/tableCellActionShip/controller.jsx';
import { ControllerPageCart } from '../page/cart/controller.jsx';
import { ControllerPageCheckout } from '../page/checkout/controller.jsx';
import { ControllerPageOrder } from '../page/order/controller.jsx';
import { ControllerPageOrders } from '../page/orders/controller.jsx';
import { ControllerPagePayment } from '../page/payment/controller.jsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordLocal {
    'commerce-trade.controller.tableCellActionRefund': ControllerTableCellActionRefund;
'commerce-trade.controller.tableCellActionShip': ControllerTableCellActionShip;
'commerce-trade.controller.pageCart': ControllerPageCart;
'commerce-trade.controller.pageCheckout': ControllerPageCheckout;
'commerce-trade.controller.pageOrder': ControllerPageOrder;
'commerce-trade.controller.pageOrders': ControllerPageOrders;
'commerce-trade.controller.pagePayment': ControllerPagePayment;
  }
}
/** controller: end */
/** pages: begin */
export * from './page/cart.js';
import { NSControllerPageCart } from './page/cart.js';
export * from './page/checkout.js';
import { NSControllerPageCheckout } from './page/checkout.js';
export * from './page/order.js';
import { NSControllerPageOrder } from './page/order.js';
export * from './page/orders.js';
import { NSControllerPageOrders } from './page/orders.js';
export * from './page/payment.js';
import { NSControllerPagePayment } from './page/payment.js';
export * from '../routes.js';
import { TypePagePathSchema } from 'zova-module-a-router';
import 'zova';
declare module 'zova-module-a-router' {
export interface IPagePathRecord {
  '/commerce/trade/cart': TypePagePathSchema<NSControllerPageCart.ParamsInput,NSControllerPageCart.QueryInput>;
'/commerce/trade/checkout': TypePagePathSchema<NSControllerPageCheckout.ParamsInput,NSControllerPageCheckout.QueryInput>;
'/commerce/trade/order/:id': TypePagePathSchema<NSControllerPageOrder.ParamsInput,NSControllerPageOrder.QueryInput>;
'/commerce/trade/orders': TypePagePathSchema<NSControllerPageOrders.ParamsInput,NSControllerPageOrders.QueryInput>;
'/commerce/trade/payment/:paymentSessionId/:orderId': TypePagePathSchema<NSControllerPagePayment.ParamsInput,NSControllerPagePayment.QueryInput>;
}
export interface IPageNameRecord {
  
}
}
export const pagePathSchemas = {
'/commerce/trade/cart': {
          query: NSControllerPageCart.querySchema,
        },
'/commerce/trade/checkout': {
          query: NSControllerPageCheckout.querySchema,
        },
'/commerce/trade/order/:id': {
          query: NSControllerPageOrder.querySchema,
        },
'/commerce/trade/orders': {
          query: NSControllerPageOrders.querySchema,
        },
'/commerce/trade/payment/:paymentSessionId/:orderId': {
          query: NSControllerPagePayment.querySchema,
        },
};
export const pageNameSchemas = {

};
declare module 'zova-module-commerce-trade' {
  export interface ControllerPageCart {
        $params: NSControllerPageCart.ParamsOutput;
$query: NSControllerPageCart.QueryOutput;
      }
export interface ControllerPageCheckout {
        $params: NSControllerPageCheckout.ParamsOutput;
$query: NSControllerPageCheckout.QueryOutput;
      }
export interface ControllerPageOrder {
        $params: NSControllerPageOrder.ParamsOutput;
$query: NSControllerPageOrder.QueryOutput;
      }
export interface ControllerPageOrders {
        $params: NSControllerPageOrders.ParamsOutput;
$query: NSControllerPageOrders.QueryOutput;
      }
export interface ControllerPagePayment {
        $params: NSControllerPagePayment.ParamsOutput;
$query: NSControllerPagePayment.QueryOutput;
      }
}
/** pages: end */

/** components: begin */
export * from './component/tableCellActionRefund.js';
import { ZTableCellActionRefund } from './component/tableCellActionRefund.js';
export * from './component/tableCellActionShip.js';
import { ZTableCellActionShip } from './component/tableCellActionShip.js';
export const components = {
  'tableCellActionRefund': ZTableCellActionRefund,
'tableCellActionShip': ZTableCellActionShip,
};
import 'zova';
declare module 'zova' {
export interface IComponentRecord {
  'commerce-trade:tableCellActionRefund': ControllerTableCellActionRefund;
'commerce-trade:tableCellActionShip': ControllerTableCellActionShip;
}
export interface IZovaComponentRecord {
  'commerce-trade:tableCellActionRefund': typeof ZTableCellActionRefund;
'commerce-trade:tableCellActionShip': typeof ZTableCellActionShip;
}
}
/** components: end */
/** tableCell: begin */
export * from '../bean/tableCell.actionRefund.jsx';
export * from '../bean/tableCell.actionShip.jsx';
import { ITableCellOptionsActionRefund } from '../bean/tableCell.actionRefund.jsx';
import { ITableCellOptionsActionShip } from '../bean/tableCell.actionShip.jsx';
import 'zova-module-a-table';
declare module 'zova-module-a-table' {
  
    export interface ITableCellRecord {
      'commerce-trade:actionRefund': ITableCellOptionsActionRefund;
'commerce-trade:actionShip': ITableCellOptionsActionShip;
    }

  
}
declare module 'zova-module-commerce-trade' {
  
        export interface TableCellActionRefund {
          /** @internal */
          get scope(): ScopeModuleCommerceTrade;
        }

        export interface TableCellActionRefund {
          get $beanFullName(): 'commerce-trade.tableCell.actionRefund';
          get $onionName(): 'commerce-trade:actionRefund';
          get $onionOptions(): ITableCellOptionsActionRefund;
        }

        export interface TableCellActionShip {
          /** @internal */
          get scope(): ScopeModuleCommerceTrade;
        }

        export interface TableCellActionShip {
          get $beanFullName(): 'commerce-trade.tableCell.actionShip';
          get $onionName(): 'commerce-trade:actionShip';
          get $onionOptions(): ITableCellOptionsActionShip;
        } 
}
/** tableCell: end */
/** tableCell: begin */
import { TableCellActionRefund } from '../bean/tableCell.actionRefund.jsx';
import { TableCellActionShip } from '../bean/tableCell.actionShip.jsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'commerce-trade.tableCell.actionRefund': TableCellActionRefund;
'commerce-trade.tableCell.actionShip': TableCellActionShip;
  }
}
/** tableCell: end */
/** locale: begin */
import { locales } from './locales.js';
/** locale: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil, TypeModuleLocales, TypeLocaleBase } from 'zova';
import { Scope } from 'zova-module-a-bean';

@Scope()
export class ScopeModuleCommerceTrade extends BeanScopeBase {}

export interface ScopeModuleCommerceTrade {
  util: BeanScopeUtil;
locale: TypeModuleLocales<(typeof locales)[TypeLocaleBase]>;
api: IModuleApi;
apiSchema: IModuleApiSchema;
}

import 'zova';
declare module 'zova' {
  export interface IBeanScopeRecord {
    'commerce-trade': ScopeModuleCommerceTrade;
  }
  
  

  export interface IBeanScopeLocale {
    'commerce-trade': (typeof locales)[TypeLocaleBase];
  }

  
}

export function locale<K extends keyof (typeof locales)[TypeLocaleBase]>(key: K): `commerce-trade::${K}` {
  return `commerce-trade::${key}`;
}
/** scope: end */
