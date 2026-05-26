import type { IModuleMain, VonaContext } from 'vona';

import { BeanSimple } from 'vona';

export class Main extends BeanSimple implements IModuleMain {
  async moduleLoading() {}
  async moduleLoaded() {
    // user
    Object.defineProperty(this.app.context, 'user', {
      enumerable: false,
      get(this: VonaContext) {
        return this.app.bean.passport.currentUser;
      },
    });
    // passport
    Object.defineProperty(this.app.context, 'passport', {
      enumerable: false,
      get(this: VonaContext) {
        return this.app.bean.passport.current;
      },
    });
  }

  async configLoaded(_config: any) {}
}
