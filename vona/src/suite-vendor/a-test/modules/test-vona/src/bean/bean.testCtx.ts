import { BeanBase } from 'vona';
import { Bean } from 'vona-module-a-bean';

class TestCtx0 extends BeanBase {
  private _name: string;

  protected __init__(moduleName: string) {
    this._name = moduleName;
  }

  protected async __dispose__() {
    this._name = '';
  }

  protected __get__(prop: string) {
    if (prop === 'magicSelf') {
      return this['magic:self'];
    }
  }

  protected __set__(prop: string, value: any): boolean {
    if (prop === 'magicSelf') {
      this['magic:self'] = value;
      return true;
    }
    return false;
  }

  get name() {
    return this._name;
  }

  set name(value) {
    this._name = value;
  }

  actionSync({ a, b }: { a: number; b: number }) {
    return a + b;
  }

  async actionAsync({ a, b }: { a: number; b: number }) {
    return Promise.resolve(a + b);
  }

  async actionAsync2({ a, b }: { a: number; b: number }) {
    const name = this.name;
    const value = await this.actionAsync({ a, b });
    return `${name}:${value}`;
  }
}

class TestCtx1 extends TestCtx0 {
  async actionAsync3({ a, b }: { a: number; b: number }) {
    return await this.actionAsync2({ a, b });
  }
}

@Bean()
export class BeanTestCtx extends TestCtx1 {}
