import type { ZovaOpenapiConfigModule } from 'zova-openapi';

export default function (): ZovaOpenapiConfigModule {
  return {
    operations: {
      // Specify operations.match or operations.ignore explicitly for this module.
      match: [],
    },
  };
}
