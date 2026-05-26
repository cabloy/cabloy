import { BeanBase } from 'vona';
import { Bean } from 'vona-module-a-bean';

@Bean()
export class BeanCore extends BeanBase {
  get protocol() {
    return this.app.util.protocol;
  }

  get host() {
    return this.app.util.host;
  }

  getAbsoluteUrl(path?: string) {
    return this.app.util.getAbsoluteUrl(path);
  }

  getAbsoluteUrlByApiPath(path: string) {
    return this.app.util.getAbsoluteUrlByApiPath(path);
  }
}
