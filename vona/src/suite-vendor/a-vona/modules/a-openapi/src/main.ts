import type { IModuleMain } from 'vona';

import { BeanSimple } from 'vona';

import { schemaRefCustomAdapter } from './lib/zod/schemaRefCustomAdapter.ts';

export class Main extends BeanSimple implements IModuleMain {
  async moduleLoading() {}
  async moduleLoaded() {
    schemaRefCustomAdapter(this.app);
  }

  async configLoaded(_config: any) {}
}
