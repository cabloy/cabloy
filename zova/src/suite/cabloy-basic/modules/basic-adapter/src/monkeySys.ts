import type { IMonkeySysInitialize } from 'zova';

import { BeanSimple, deepExtend } from 'zova';

import { __ThisModule__ } from './.metadata/this.js';

export class MonkeySys extends BeanSimple implements IMonkeySysInitialize {
  async sysInitialize() {
    const configSelf = this.sys.util.getModuleConfigSafe(__ThisModule__);
    const configOpenapi = this.sys.util.getModuleConfigSafe('a-openapi');
    configOpenapi.formProvider = deepExtend(
      {},
      configOpenapi.formProvider,
      configSelf.formProvider,
    );
  }
}
