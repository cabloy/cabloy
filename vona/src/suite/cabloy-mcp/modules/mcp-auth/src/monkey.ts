import type { IModule } from '@cabloy/module-info';
import type { ConfigJwt } from 'vona-module-a-jwt';

import { BeanSimple } from 'vona';

export class Monkey extends BeanSimple {
  async configLoaded(module: IModule, config: ConfigJwt) {
    if (module.info.relativeName !== 'a-jwt') return;
    // Extend module defaults before project-level configuration is merged.
    config.clients.mcpAccess = {
      signOptions: { expiresIn: 2 * 60 * 60 },
      authTokenAdapter: 'mcp-auth:authTokenAdapter',
    };
    config.clients.mcpRefresh = {
      signOptions: { expiresIn: 7 * 24 * 60 * 60 },
      authTokenAdapter: 'mcp-auth:authTokenAdapter',
    };
  }
}
