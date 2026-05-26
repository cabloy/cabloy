import type { ConfigLogger, IModuleMain, PowerPartial, VonaApplication } from 'vona';

import { BeanSimple, combineConfigDefault, deepExtend } from 'vona';

export class Main extends BeanSimple implements IModuleMain {
  async moduleLoading() {
    // config
    const _configDefault = await combineConfigDefault<ConfigLogger>(this.app, configDefault);
    this.app.config.logger = deepExtend({}, _configDefault, this.app.config.logger);
  }

  async moduleLoaded() {}
  async configLoaded(_config: any) {}
}

export async function configDefault(_app: VonaApplication): Promise<PowerPartial<ConfigLogger>> {
  return {};
}
