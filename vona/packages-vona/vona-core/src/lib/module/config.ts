import type { IModule } from '@cabloy/module-info';

import type { VonaApplication } from '../core/application.ts';

import { deepExtend } from '../utils/util.ts';

export default async function (app: VonaApplication, modules: Record<string, IModule>) {
  app.meta.hmrCacheConfigModules = deepExtend({}, app.config.modules);
  // load configs
  await loadConfigs();

  async function loadConfigs() {
    for (const key in modules) {
      const module = modules[key];
      // module config
      if (module.resource.config) {
        const configModule = await module.resource.config(app);
        // configNew is not used by now
        await app.util.monkeyModule(
          app.meta.appMonkey,
          app.meta.modulesMonkey,
          true,
          'configLoaded',
          module,
          configModule,
        );
        app.config.modules[module.info.relativeName] = deepExtend(
          {},
          configModule,
          app.config.modules[module.info.relativeName],
        );
      }
    }
  }
}
