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
        'McpAuthCustomScope_mine',
        'McpAuthCustomScope_catalog',
        'McpAuthCustomScope_createMine',
        'McpAuthCustomScope_updateMine',
        'McpAuthCustomScope_deleteMine',
        'McpAuthAccessToken_mine',
        'McpAuthAccessToken_createMine',
        'McpAuthAccessToken_deleteMine',
      ],
    },
  };
}
