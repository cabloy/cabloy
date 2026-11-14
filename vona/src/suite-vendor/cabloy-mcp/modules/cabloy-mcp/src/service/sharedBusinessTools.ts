import type { TypeMcpScope } from 'vona-module-mcp-auth';

import { BeanBase } from 'vona';
import { Service } from 'vona-module-a-bean';
import { resolveMcpResourceUrl } from 'vona-module-mcp-auth';

import { createControllerToolServer } from '../lib/controllerTools.ts';

@Service()
export class ServiceSharedBusinessTools extends BeanBase {
  /** The picker projects the same compiled tools and fresh guards as MCP discovery. */
  async catalog(resource: string) {
    const server = await this.createServer(resource, 'mcp:all');
    try {
      return await server.catalog();
    } finally {
      await server.close();
    }
  }

  /** Opt-in tools use fresh discovery guards and ordinary call authorization. */
  async createServer(resource: string, scope?: TypeMcpScope) {
    const binding = resolveMcpResourceUrl(this.app, resource);
    if (binding.instanceName !== this.ctx.instanceName) {
      throw new Error('MCP Site resource instance mismatch');
    }
    let access;
    if (scope?.startsWith('mcp:custom:')) {
      const userId = this.bean.passport.currentUser?.id;
      if (userId === undefined) throw new Error('MCP authorization user required');
      access = await this.$scope.mcpAuth.service.authorization.resolveToolAccess(
        userId,
        resource,
        scope,
      );
    }
    const canLogout = () =>
      this.ctx.state.passportAuthTokenClient === 'mcpAccess' &&
      Boolean(this.ctx.state.passportPayloadData) &&
      Boolean(this.bean.passport.current);
    return createControllerToolServer(this.app, scope, {
      ssrSiteId: binding.ssrSiteId,
      logout: canLogout()
        ? async () => {
            if (!canLogout()) throw new Error('MCP authorization required');
            await this.bean.passport.signout();
          }
        : undefined,
      toolAccess: access?.tools,
      toolAccessReadOnly: access?.readOnly,
      isToolVisible: async ({ action }, controller) =>
        this.ctx.bean.permission.checkPermissionControllerActionGuards(controller, action),
    });
  }
}
