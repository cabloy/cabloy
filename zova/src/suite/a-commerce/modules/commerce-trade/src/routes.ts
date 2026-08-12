import { IModuleRoute } from 'zova-module-a-router';

import { ZPageCart } from './.metadata/page/cart.js';
import { ZPageCheckout } from './.metadata/page/checkout.js';
import { ZPageOrder } from './.metadata/page/order.js';
import { ZPageOrders } from './.metadata/page/orders.js';
import { ZPagePayment } from './.metadata/page/payment.js';

export const routes: IModuleRoute[] = [
  {
    path: 'cart',
    component: ZPageCart,
    meta: { requiresAuth: true, ssrProfile: 'session' },
  },
  {
    path: 'checkout',
    component: ZPageCheckout,
    meta: { requiresAuth: true, ssrProfile: 'session' },
  },
  {
    path: 'payment/:paymentSessionId/:orderId',
    component: ZPagePayment,
    meta: { requiresAuth: true, ssrProfile: 'session' },
  },
  {
    path: 'orders',
    component: ZPageOrders,
    meta: { requiresAuth: true, ssrProfile: 'session' },
  },
  {
    path: 'order/:id',
    component: ZPageOrder,
    meta: { requiresAuth: true, ssrProfile: 'session' },
  },
];
