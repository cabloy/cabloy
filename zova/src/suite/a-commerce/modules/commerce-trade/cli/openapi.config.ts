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
        'CommerceTradePayment_outcome',
        'CommerceTradeOrder_select',
        'CommerceTradeOrder_view',
        'CommerceTradeOrder_ship',
        'CommerceTradeOrder_requestRefund',
        'CommerceTradeOrder_approveRefund',
        'CommerceTradeOrder_rejectRefund',
        'CommerceTradeOrder_refundOutcome',
        'CommerceTradeOrder_mine',
        'CommerceTradeOrder_viewMine',
      ],
    },
  };
}
