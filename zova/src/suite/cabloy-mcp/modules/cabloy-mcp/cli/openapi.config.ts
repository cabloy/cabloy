import type { ZovaOpenapiConfigModule } from 'zova-openapi';

export default function (): ZovaOpenapiConfigModule {
  return {
    operations: {
      match: [
        'Authorization_summary',
        'Authorization_decision',
        'McpAuthAuthorizationGrant_mine',
        'McpAuthAuthorizationGrant_revokeMine',
        'McpAuthAuthorizationGrant_deleteMine',
      ],
    },
  };
}
