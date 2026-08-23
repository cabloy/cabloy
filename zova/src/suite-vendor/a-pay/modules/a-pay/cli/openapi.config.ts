import type { ZovaOpenapiConfigModule } from 'zova-openapi';

export default function (): ZovaOpenapiConfigModule {
  return {
    operations: {
      match: ['PayPaymentSession_start', 'PayPaymentSession_reconcile', 'PayPaymentSession_view'],
    },
  };
}
