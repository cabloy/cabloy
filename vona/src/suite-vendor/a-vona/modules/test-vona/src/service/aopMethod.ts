import { BeanBase } from 'vona';
import { Aspect } from 'vona-module-a-aspect';
import { Service } from 'vona-module-a-bean';

class ServiceAopMethodBase extends BeanBase {
  @Aspect.aopMethod('test-vona:test', { wrapper: '+' })
  @Aspect.aopMethod('test-vona:test', { wrapper: '-' })
  testSyncBase() {
    return 'hello';
  }
}

@Service()
export class ServiceAopMethod extends ServiceAopMethodBase {
  private _name: string = '';

  @Aspect.aopMethod('test-vona:test', { wrapper: '+' })
  @Aspect.aopMethod('test-vona:test', { wrapper: '-' })
  testSync() {
    return 'hello';
  }

  @Aspect.aopMethod('test-vona:test', { wrapper: '+' })
  @Aspect.aopMethod('test-vona:test', { wrapper: '-' })
  async testAsync() {
    return 'hello';
  }

  @Aspect.aopMethod('test-vona:test', { wrapper: '+' })
  @Aspect.aopMethod('test-vona:test', { wrapper: '-' })
  get name() {
    return this._name;
  }

  set name(value) {
    this._name = value;
  }
}
