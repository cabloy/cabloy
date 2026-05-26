import type { IMonkeySysInitialize } from 'zova';

import { BeanSimple } from 'zova';

export class MonkeySys extends BeanSimple implements IMonkeySysInitialize {
  async sysInitialize() {}
}
