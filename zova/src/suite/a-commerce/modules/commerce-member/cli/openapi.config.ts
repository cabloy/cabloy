import type { ZovaOpenapiConfigModule } from 'zova-openapi';

export default function (): ZovaOpenapiConfigModule {
  return {
    operations: {
      match: [/^CommerceMemberAddress_(create|select|view|update|delete)$/],
    },
  };
}
