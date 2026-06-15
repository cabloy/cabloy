import type { ZovaOpenapiConfigModule } from 'zova-openapi';

export default function (): ZovaOpenapiConfigModule {
  return {
    operations: {
      match: [/^DemoStudent_*/],
    },
  };
}
