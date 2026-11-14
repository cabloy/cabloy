import type { VonaApplication } from 'vona';
import type { TypeMcpScope } from 'vona-module-mcp-auth';

export async function createSharedBusinessToolServer(
  app: VonaApplication,
  resource: string | undefined,
  scope?: TypeMcpScope,
) {
  if (!resource) throw new Error('MCP Site resource required');
  return app.scope('cabloy-mcp').service.sharedBusinessTools.createServer(resource, scope);
}
