import type { ZovaConfigOptional, ZovaSys } from 'zova';

export default function (_sys: ZovaSys) {
  const config: ZovaConfigOptional = {};

  config.routes = {
    path: {
      '/home/indexadmin/dashboard': undefined,
    },
    name: {
      'commerce-catalog:catalogue': { alias: '/:locale(zh-cn)?' },
      'commerce-catalog:product': { alias: '/:locale(zh-cn)?/product/:id' },
      'commerce-member:address': { alias: '/:locale(zh-cn)?/address' },
      'commerce-trade:cart': { alias: '/:locale(zh-cn)?/cart' },
      'commerce-trade:checkout': { alias: '/:locale(zh-cn)?/checkout' },
      'commerce-trade:payment': { alias: '/:locale(zh-cn)?/payment/:attemptId' },
      'commerce-trade:orders': { alias: '/:locale(zh-cn)?/orders' },
      'commerce-trade:order': { alias: '/:locale(zh-cn)?/order/:id' },
      'home-indexweb:home': undefined,
    },
  };

  return config;
}
