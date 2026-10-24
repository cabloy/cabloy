import type { ZovaOpenapiConfigModule } from 'zova-openapi';

export default function (): ZovaOpenapiConfigModule {
  return {
    operations: {
      match: ['Authorization_summary', 'Authorization_decision'],
    },
  };
}
