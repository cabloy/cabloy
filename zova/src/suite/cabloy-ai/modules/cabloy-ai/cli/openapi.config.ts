import type { ZovaOpenapiConfigModule } from 'zova-openapi';

export default function (): ZovaOpenapiConfigModule {
  return {
    operations: {
      match: [/^CabloyAiChat_(create|list|history|status|remove)$/],
    },
  };
}
