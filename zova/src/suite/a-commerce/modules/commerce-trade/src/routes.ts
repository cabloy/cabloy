import { IModuleRoute } from 'zova-module-a-router';

import { ZPageCart } from './.metadata/page/cart.js';
import { ZPageCheckout } from './.metadata/page/checkout.js';
import { ZPageOrder } from './.metadata/page/order.js';
import { ZPageOrders } from './.metadata/page/orders.js';
import { ZPagePayment } from './.metadata/page/payment.js';

export const routes: IModuleRoute[] = [
  {
    name: 'cart',
    path: 'cart/:locale?',
    component: ZPageCart,
    meta: { locale: true, requiresAuth: true, ssrProfile: 'session' },
  },
  {
    name: 'checkout',
    path: 'checkout/:locale?',
    component: ZPageCheckout,
    meta: { locale: true, requiresAuth: true, ssrProfile: 'session' },
  },
  {
    name: 'payment',
    path: 'payment/:paymentSessionId/:orderId/:locale?',
    component: ZPagePayment,
    meta: { locale: true, requiresAuth: true, ssrProfile: 'session' },
  },
  {
    name: 'orders',
    path: 'orders/:locale?',
    component: ZPageOrders,
    meta: { locale: true, requiresAuth: true, ssrProfile: 'session' },
  },
  {
    name: 'order',
    path: 'order/:id/:locale?',
    component: ZPageOrder,
    meta: { locale: true, requiresAuth: true, ssrProfile: 'session' },
  },
];
