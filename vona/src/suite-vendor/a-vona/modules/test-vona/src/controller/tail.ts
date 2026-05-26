import type { IDecoratorControllerOptions } from 'vona-module-a-web';

import assert from 'node:assert';
import { BeanBase, cast } from 'vona';
import { Api } from 'vona-module-a-openapiutils';
import { Passport } from 'vona-module-a-user';
import { Controller, Web } from 'vona-module-a-web';

export interface IControllerOptionsTail extends IDecoratorControllerOptions {}

@Controller<IControllerOptionsTail>({ path: 'tail', meta: { mode: 'test' } })
@Api.exclude()
export class ControllerTail extends BeanBase {
  @Web.post()
  @Passport.public()
  tail() {
    // 1
    cast(this.ctx)._tail_test = 1;

    // tail
    this.ctx.commit(() => {
      assert.equal(cast(this.ctx)._tail_test_als_caller, undefined);
      assert.equal(cast(this.ctx)._tail_test, 2);
      this.ctx.commit(() => {
        assert.equal(cast(this.ctx)._tail_test, 3);
      });
      cast(this.ctx)._tail_test = 3;
    });

    // 2
    cast(this.ctx)._tail_test = 2;
  }
}
