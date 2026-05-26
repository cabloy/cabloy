import type { IModuleMain, PowerPartial, VonaApplication } from 'vona';

import { BeanSimple, combineConfigDefault, deepExtend } from 'vona';

import type { ConfigRedis } from './types/redis.ts';

export class Main extends BeanSimple implements IModuleMain {
  async moduleLoading() {
    const _configDefault = await combineConfigDefault<ConfigRedis>(this.app, configDefault);
    this.app.config.redis = deepExtend({}, _configDefault, this.app.config.redis);
  }

  async moduleLoaded() {}

  async configLoaded(_config: any) {}
}

export async function configDefault(_app: VonaApplication): Promise<PowerPartial<ConfigRedis>> {
  return {};
}
