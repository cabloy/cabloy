import type { VonaApplication } from 'vona';
import type { TypeMcpScope } from 'vona-module-mcp-auth';

import { createControllerToolServer } from './controllerTools.ts';

/** Exact admission controls both discovery and known-name calls. */
export async function createSharedBusinessToolServer(app: VonaApplication, scope?: TypeMcpScope) {
  return createControllerToolServer(app, scope, {
    includeTool({ controller, action }) {
      return (
        controller === 'training-student.controller.student' &&
        (action === 'lookup' || action === 'summary')
      );
    },
    async isToolVisible({ action }) {
      return app.ctx.bean.permission.checkPermissionActionGuards(
        'training-student:student',
        action,
      );
    },
  });
}
