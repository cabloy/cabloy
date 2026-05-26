import { BeanBase } from 'vona';
import { Service } from 'vona-module-a-bean';

@Service()
export class ServiceTestApp extends BeanBase {
  actionSync({ a, b }: any) {
    return a + b;
  }

  async actionAsync({ a, b }: any) {
    return Promise.resolve(a + b);
  }
}
