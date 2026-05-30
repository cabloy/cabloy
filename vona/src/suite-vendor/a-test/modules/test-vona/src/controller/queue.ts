import type { IDecoratorControllerOptions } from 'vona-module-a-web';

import assert from 'node:assert';
import { BeanBase } from 'vona';
import { Api } from 'vona-module-a-openapiutils';
import { Passport } from 'vona-module-a-user';
import { Controller, Web } from 'vona-module-a-web';

export interface IControllerOptionsQueue extends IDecoratorControllerOptions {}

@Controller<IControllerOptionsQueue>({ path: 'queue', meta: { mode: 'test' } })
@Api.exclude()
export class ControllerQueue extends BeanBase {
  @Web.post('pushAsync')
  @Passport.public()
  async pushAsync() {
    const res = await this.scope.queue.test.pushAsync({ a: 1, b: 2 });
    this.$logger.silly(`queue test await done: 1 + 2 = ${res}`);
    assert.equal(res, 3);
  }

  @Web.post('push')
  @Passport.public()
  push() {
    this.scope.queue.test.push({ a: 2, b: 3 });
  }
}
