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
  /** Resource-backed opt-in tools use fresh discovery guards and ordinary call authorization. */
  async createServer(scope?: TypeMcpScope) {
    return createControllerToolServer(this.app, scope, {
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
