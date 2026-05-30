import type { IDecoratorControllerOptions } from 'vona-module-a-web';

import assert from 'node:assert';
import { BeanBase, cast } from 'vona';
import { Api } from 'vona-module-a-openapiutils';
import { Passport } from 'vona-module-a-user';
import { Controller, Web } from 'vona-module-a-web';

import { __ThisModule__ } from '../.metadata/this.ts';
import { ServiceTest } from '../service/test.ts';

export interface IControllerOptionsBean extends IDecoratorControllerOptions {}

@Controller<IControllerOptionsBean>({ path: 'bean', meta: { mode: 'test' } })
@Api.exclude()
@Passport.public()
export class ControllerBean extends BeanBase {
  @Web.get('test')
  async test() {
    const a = 3;
    const b = 4;
    let res;

    // app.bean
    assert.equal(
      this.bean._getBean('test-vona.service.testApp'),
      this.bean['test-vona.service.testApp'],
    );

    res = this.bean['test-vona.service.testApp'].actionSync({ a, b });
    assert.equal(res, `${a + b}:regexpaop`);

    res = await this.bean['test-vona.service.testApp'].actionAsync({ a, b });
    assert.equal(res, `${a + b}:regexpaop`);

    // ctx.bean: global
    assert.equal(this.bean.testCtx, this.bean.testCtx);

    // magic
    res = cast(this.bean.testCtx).magic;
    assert.equal(res, 'magic:simpleaop');

    // name
    this.bean.testCtx.name = 'test-vona:simpleaop:regexpaop';
    res = this.bean.testCtx.name;
    assert.equal(res, 'test-vona:simpleaop:regexpaop');

    res = this.bean.testCtx.actionSync({ a, b });
    assert.equal(res, `${a + b}:simpleaop:regexpaop`);

    res = await this.bean.testCtx.actionAsync({ a, b });
    assert.equal(res, `${a + b}:simpleaop:regexpaop`);

    res = await this.bean.testCtx.actionAsync2({ a, b });
    assert.equal(res, `test-vona:simpleaop:regexpaop:${a + b}:simpleaop:regexpaop`);

    res = await this.bean.testCtx.actionAsync3({ a, b });
    assert.equal(res, `test-vona:simpleaop:regexpaop:${a + b}:simpleaop:regexpaop`);

    // ctx.bean: class
    assert.equal(
      this.bean['test-vona.service.testClass'],
      this.app.bean['test-vona.service.testClass'],
    );

    res = this.bean['test-vona.service.testClass'].actionSync({ a, b });
    assert.equal(res, `${a + b}:regexpaop`);

    res = await this.bean['test-vona.service.testClass'].actionAsync({ a, b });
    assert.equal(res, `${a + b}:regexpaop`);

    // magic of self
    cast(this.bean.testCtx).magicSelf = '__magicSelf__';
    res = cast(this.bean.testCtx).magicSelf;
    assert.equal(res, '__magicSelf__');
    res = cast(this.bean.testCtx)['magic:self'];
    assert.equal(res, '__magicSelf__');
  }

  @Web.get('service')
  @Passport.public()
  async service() {
    let res;

    // general way
    res = this.bean._getBean(ServiceTest).name;
    assert.equal(res, 'serviceTest');

    res = this.bean._getBean('test-vona.service.test').name;
    assert.equal(res, 'serviceTest');

    // this scope
    res = this.scope.service.test.name;
    assert.equal(res, 'serviceTest');

    // general scope
    res = this.app.scope(__ThisModule__).service.test.name;
    assert.equal(res, 'serviceTest');

    res = this.$scope.testVona.service.test.name;
    assert.equal(res, 'serviceTest');
  }
}
