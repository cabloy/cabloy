import type { VonaApplication } from 'vona';
import type { TypeMcpScope } from 'vona-module-mcp-auth';

export async function createSharedBusinessToolServer(app: VonaApplication, scope?: TypeMcpScope) {
  return app.scope('cabloy-mcp').service.sharedBusinessTools.createServer(scope);
}
