import type { IModuleMain } from 'vona';

import { BeanSimple } from 'vona';
import { en, zhCN } from 'zod/locales';

export class Main extends BeanSimple implements IModuleMain {
  async moduleLoading() {}
  async moduleLoaded() {
    const localeErrors = {
      'en-us': en,
      'zh-cn': zhCN,
    };
    this.app.util.setLocaleErrors(
      localeErrors,
      this.app.scope('a-locale').config.locale.defaultLocale,
    );
  }

  async configLoaded(_config: any) {}
}
