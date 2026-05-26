import { BeanBase } from 'vona';
import { Service } from 'vona-module-a-bean';

class ClassBeanBase extends BeanBase {
  actionSync({ a, b }: any) {
    return a + b;
  }
}

@Service()
export class ServiceTestClass extends ClassBeanBase {
  async actionAsync({ a, b }: any) {
    return Promise.resolve(a + b);
  }
}
