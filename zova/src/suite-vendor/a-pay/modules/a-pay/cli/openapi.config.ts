import type { ZovaOpenapiConfigModule } from 'zova-openapi';

export default function (): ZovaOpenapiConfigModule {
  return {
    operations: {
      match: ['PaymentSession_start', 'PaymentSession_reconcile', 'PaymentSession_view'],
    },
  };
}
