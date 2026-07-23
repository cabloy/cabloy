import type { ZovaOpenapiConfigModule } from 'zova-openapi';

export default function (): ZovaOpenapiConfigModule {
  return {
    operations: {
      match: [
        'CommerceTradeCart_current',
        'CommerceTradeCart_addItem',
        'CommerceTradeCart_updateItem',
        'CommerceTradeCart_deleteItem',
        'CommerceTradeCart_clear',
        'CommerceTradeCheckout_create',
      ],
    },
  };
}
