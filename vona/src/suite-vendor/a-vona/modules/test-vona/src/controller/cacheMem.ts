import type { IDecoratorControllerOptions } from 'vona-module-a-web';

import { sleep } from '@cabloy/utils';
import assert from 'node:assert';
import { BeanBase, retry } from 'vona';
import { Api } from 'vona-module-a-openapiutils';
import { Passport } from 'vona-module-a-user';
import { Controller, Web } from 'vona-module-a-web';

export interface IControllerOptionsCacheMem extends IDecoratorControllerOptions {}

@Controller<IControllerOptionsCacheMem>({ path: 'cacheMem', meta: { mode: 'test' } })
@Api.exclude()
@Passport.public()
export class ControllerCacheMem extends BeanBase {
  @Web.post()
  async mem() {
    let res;
    let value;

    // set/get
    this.scope.cacheMem.test.set({ name: 'zhen.nann' }, '__immutable__');
    value = this.scope.cacheMem.test.get('__immutable__');
    assert.deepEqual(value, { name: 'zhen.nann' });
    value.name = 'zhennann';
    value = this.scope.cacheMem.test.get('__immutable__');
    assert.deepEqual(value, { name: 'zhen.nann' });

    // set
    value = this.scope.cacheMem.test.getset('zhen.nann');
    assert.equal(value, undefined);

    value = this.scope.cacheMem.test.getset('zhennann');
    assert.equal(value, 'zhen.nann');

    // has
    res = this.scope.cacheMem.test.has();
    assert.equal(!!res, true);

    // get
    value = this.scope.cacheMem.test.get();
    assert.equal(value, 'zhennann');

    // del
    this.scope.cacheMem.test.del();
    res = this.scope.cacheMem.test.has();
    assert.equal(res, false);

    // set again
    this.scope.cacheMem.test.set('zhennann'); // will be expired after 1s

    // get
    value = this.scope.cacheMem.test.get();
    assert.equal(value, 'zhennann');

    // peek after timeout
    await sleep(900);
    await retry({ retries: 3 }, async () => {
      await sleep(100);
      value = this.scope.cacheMem.test.peek();
      assert.equal(value, undefined);
    });
  }
}
