import type { VonaApplication } from 'vona';
import type { TypeMcpScope } from 'vona-module-mcp-auth';

import { createControllerToolServer } from 'vona-module-cabloy-mcp';

// Only authenticated shared ingress selects the opt-in Controller Action composition.
export async function createSharedBusinessToolServer(app: VonaApplication, scope?: TypeMcpScope) {
  return createControllerToolServer(app, scope, {
    async isToolVisible({ controller, action }) {
      if (
        controller !== 'training-student.controller.student' ||
        !['lookup', 'summary'].includes(action)
      ) {
        return true;
      }
      return app.ctx.bean.permission.checkPermissionActionGuards(
        'training-student:student',
        action,
      );
    },
  });
}
