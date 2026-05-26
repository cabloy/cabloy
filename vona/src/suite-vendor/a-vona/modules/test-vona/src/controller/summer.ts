import type { IDecoratorControllerOptions } from 'vona-module-a-web';

import { sleep } from '@cabloy/utils';
import assert from 'node:assert';
import { BeanBase, retry } from 'vona';
import { Api } from 'vona-module-a-openapiutils';
import { Passport } from 'vona-module-a-user';
import { Controller, Web } from 'vona-module-a-web';

import type { SummerCacheTest, TSummerCacheTestData } from '../bean/summerCache.test.ts';

import { __ThisModule__ } from '../.metadata/this.ts';

export interface IControllerOptionsSummer extends IDecoratorControllerOptions {}

@Controller<IControllerOptionsSummer>({ path: 'summer', meta: { mode: 'test' } })
@Api.exclude()
export class ControllerSummer extends BeanBase {
  @Web.post()
  @Passport.public()
  async test() {
    // name
    const name = 'test';
    const key1 = { id: 1 };
    const key2 = { id: 2 };
    const key3 = { id: 3 };

    // getCache
    const cache = this.scope.summerCache.test;
    assert.equal(!!cache, true);
    let cacheOtherModule = this.$scope.testVona.summerCache.test;
    assert.equal(cache, cacheOtherModule);
    cacheOtherModule = this.bean.summer.cache(
      `${__ThisModule__}.summerCache.${name}`,
    ) as SummerCacheTest;
    assert.equal(cache, cacheOtherModule);

    let value: TSummerCacheTestData | undefined;
    let values: Array<TSummerCacheTestData | undefined>;

    // get: peek
    value = await cache.peek(key1);
    assert.equal(value, undefined);

    // get
    value = await cache.get(key1);
    assert.equal(value?.id, key1.id);

    // get: peek
    value = await cache.peek(key1);
    assert.equal(value?.id, key1.id);
    value = await cache.peek(key1, { mode: 'mem' });
    assert.equal(value?.id, key1.id);
    value = await cache.peek(key1, { mode: 'redis' });
    assert.equal(value?.id, key1.id);

    // get: peek sleep for mem stale
    await sleep(900);

    // get: peek again
    value = await cache.peek(key1, { mode: 'redis' });
    assert.equal(value?.id, key1.id);
    await retry({ retries: 3 }, async () => {
      await sleep(100);
      value = await cache.peek(key1, { mode: 'mem' });
      assert.equal(value, undefined);
    });

    // get: peek sleep for redis stale
    await sleep(1900);

    // get: peek again
    await retry({ retries: 3 }, async () => {
      await sleep(100);
      value = await cache.peek(key1, { mode: 'redis' });
      assert.equal(value, undefined);
    });
    value = await cache.peek(key1, { mode: 'mem' });
    assert.equal(value, undefined);

    // mget
    //   mem cache graph: key1
    value = await cache.get(key1);
    assert.equal(value?.id, key1.id);
    //   mem cache graph: key2 key3
    values = await cache.mget([key1, key2, key3]); // todo: maybe has bug
    assert.equal(values[0]?.id, key1.id); // todo: maybe has bug
    assert.equal(values[1]?.id, key2.id);
    assert.equal(values[2]?.id, key3.id);
    //   mem cache graph: key3 key1
    values = await cache.mget([key1, key2, key3]);
    assert.equal(values[0]?.id, key1.id);
    assert.equal(values[1]?.id, key2.id);
    assert.equal(values[2]?.id, key3.id);

    // mget: peek
    value = await cache.peek(key2, { mode: 'redis' });
    assert.equal(value?.id, key2.id);
    value = await cache.peek(key2, { mode: 'mem' });
    assert.equal(value, undefined);

    // del
    await cache.del(key1);
    await cache.del(key2);

    // mdel
    await cache.mdel([key1, key2, key3]);

    // mdel: peek
    value = await cache.peek(key3, { mode: 'redis' });
    assert.equal(value, undefined);
    value = await cache.peek(key3, { mode: 'mem' });
    assert.equal(value, undefined);

    // clear
    values = await cache.mget([key1, key2, key3]);
    assert.equal(values[2]?.id, key3.id);
    value = await cache.peek(key3, { mode: 'redis' });
    assert.equal(value?.id, key3.id);
    value = await cache.peek(key3, { mode: 'mem' });
    assert.equal(value?.id, key3.id);

    await cache.clear();

    value = await cache.peek(key3, { mode: 'redis' });
    assert.equal(value, undefined);
    value = await cache.peek(key3, { mode: 'mem' });
    assert.equal(value, undefined);
  }
}
