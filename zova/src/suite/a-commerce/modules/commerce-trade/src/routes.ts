import { IModuleRoute } from 'zova-module-a-router';

import { ZPageCart } from './.metadata/page/cart.ts';
import { ZPageCheckout } from './.metadata/page/checkout.ts';
import { ZPageOrder } from './.metadata/page/order.ts';
import { ZPageOrders } from './.metadata/page/orders.ts';
import { ZPagePayment } from './.metadata/page/payment.ts';

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
    name: 'payment',
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
    name: 'order',
    component: ZPageOrder,
    meta: { requiresAuth: true, ssrProfile: 'session' },
  },
];
