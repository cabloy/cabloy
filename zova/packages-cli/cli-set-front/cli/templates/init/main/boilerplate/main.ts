import type { IModuleMain } from 'zova';

import { BeanSimple } from 'zova';

export class Main extends BeanSimple implements IModuleMain {
  async moduleLoading() {}
  async moduleLoaded() {}
}
