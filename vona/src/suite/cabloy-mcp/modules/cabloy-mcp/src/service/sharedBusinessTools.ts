import type { IResourceRecord } from 'vona-module-a-openapi';
import type { TypeMcpScope } from 'vona-module-mcp-auth';

import { BeanBase, onionNameFromBeanFullName } from 'vona';
import { Service } from 'vona-module-a-bean';
import { recordResourceNameToRoutePath } from 'vona-module-a-web';

import { createControllerToolServer } from '../lib/controllerTools.ts';

function resourceFromController(controller: string): keyof IResourceRecord | undefined {
  const resource = onionNameFromBeanFullName(controller);
  return Object.hasOwn(recordResourceNameToRoutePath, resource)
    ? (resource as keyof IResourceRecord)
    : undefined;
}

@Service()
export class ServiceSharedBusinessTools extends BeanBase {
  /** The picker projects the same compiled tools and fresh guards as MCP discovery. */
  async catalog() {
    const server = await this.createServer('mcp:all');
    try {
      return await server.catalog();
    } finally {
      await server.close();
    }
  }

  /** Resource-backed opt-in tools use fresh discovery guards and ordinary call authorization. */
  async createServer(scope?: TypeMcpScope) {
    let access;
    if (scope?.startsWith('mcp:custom:')) {
      const userId = this.bean.passport.currentUser?.id;
      if (userId === undefined) throw new Error('MCP authorization user required');
      access = await this.$scope.mcpAuth.service.authorization.resolveToolAccess(scope, userId);
    }
    return createControllerToolServer(this.app, scope, {
      toolAccess: access?.tools,
      toolAccessReadOnly: access?.readOnly,
      includeTool: ({ controller }) => resourceFromController(controller) !== undefined,
      isToolVisible: async ({ controller, action }) => {
        const resource = resourceFromController(controller);
        return (
          resource !== undefined &&
          (await this.ctx.bean.permission.checkPermissionActionGuards(resource, action))
        );
      },
    });
  }
}
