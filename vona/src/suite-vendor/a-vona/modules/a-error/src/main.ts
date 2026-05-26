import type { IModuleMain } from 'vona';

import { BeanSimple } from 'vona';

import type { OnerrorOptions } from './lib/onerror.ts';

import { __ThisModule__ } from './.metadata/this.ts';
import { onerror } from './lib/onerror.ts';

export class Main extends BeanSimple implements IModuleMain {
  async moduleLoading() {}
  async moduleLoaded() {
    const config = this.app.scope(__ThisModule__).config;
    const app = this.app;

    const errorOptions: OnerrorOptions = {};

    // support customize error response
    const keys = ['accepts', 'logWithApp', 'log', 'all', 'html', 'json', 'text'];
    for (const type of keys) {
      if (config.onerror[type]) {
        Reflect.set(errorOptions, type, config.onerror[type]);
      }
    }
    onerror(app, errorOptions);
  }

  async configLoaded(_config: any) {}
}
