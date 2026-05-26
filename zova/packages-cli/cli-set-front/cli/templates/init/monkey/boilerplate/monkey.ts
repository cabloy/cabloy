import type { IMonkeyAppInitialize } from 'zova';

import { BeanSimple } from 'zova';

export class Monkey extends BeanSimple implements IMonkeyAppInitialize {
  async appInitialize() {}
}
