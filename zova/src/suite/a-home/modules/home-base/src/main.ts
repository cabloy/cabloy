import type { IModuleMain } from 'zova';

import { en, ja, zhCN, zhTW } from 'zod/locales';
import { BeanSimple } from 'zova';

export class Main extends BeanSimple implements IModuleMain {
  async moduleLoading() {}
  async moduleLoaded() {
    // only support client
    if (process.env.CLIENT) {
      const localeErrors = {
        'en-us': en,
        'zh-cn': zhCN,
        'ja-jp': ja,
        'zh-tw': zhTW,
      };
      this.app.util.setLocaleErrors(localeErrors, this.sys.config.locale.default);
    }
  }
}
