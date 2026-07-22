import { BeanBase } from 'vona';
import { Bean } from 'vona-module-a-bean';

import type { TypeContextFetch } from '../types/fetch.ts';

@Bean()
export class BeanCore extends BeanBase {
  get protocol() {
    return this.app.util.protocol;
  }

  get host() {
    return this.app.util.host;
  }

  get fetch(): TypeContextFetch {
    return this.ctx.state.fetch ?? globalThis.fetch;
  }

  getAbsoluteUrl(path?: string) {
    return this.app.util.getAbsoluteUrl(path);
  }

  getAbsoluteUrlByApiPath(path: string) {
    return this.app.util.getAbsoluteUrlByApiPath(path);
  }
}
