import { BeanBase } from 'vona';
import { Bean } from 'vona-module-a-bean';

@Bean()
export class BeanSsrHmr extends BeanBase {
  reload() {
    this.scope.socketNamespace.ssrHmr.broadcast('reload');
  }
}
