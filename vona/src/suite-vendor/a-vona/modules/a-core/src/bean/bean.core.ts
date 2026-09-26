import { BeanBase } from 'vona';
import { Bean } from 'vona-module-a-bean';

import type { TypeContextFetch } from '../types/fetch.ts';

@Bean()
export class BeanCore extends BeanBase {
  get fetch(): TypeContextFetch {
    return this.ctx.state.fetch ?? globalThis.fetch;
  }
}
