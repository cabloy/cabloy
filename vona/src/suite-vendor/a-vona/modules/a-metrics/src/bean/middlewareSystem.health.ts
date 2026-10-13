import type { Next } from 'vona';
import type {
  IDecoratorMiddlewareSystemOptions,
  IMiddlewareSystemExecute,
} from 'vona-module-a-aspect';

import { createHmac } from 'node:crypto';
import { BeanBase } from 'vona';
import { MiddlewareSystem } from 'vona-module-a-aspect';

export interface IMiddlewareSystemOptionsHealth extends IDecoratorMiddlewareSystemOptions {}

@MiddlewareSystem<IMiddlewareSystemOptionsHealth>({
  dependents: 'a-instance:app',
})
export class MiddlewareSystemHealth extends BeanBase implements IMiddlewareSystemExecute {
  async execute(_options: IMiddlewareSystemOptionsHealth, next: Next) {
    const path = this.ctx.path;
    if (!['/health/live', '/health/ready', '/health/startup'].includes(path)) return next();
    const health = await this.$scope.metrics.service.health.status(path);
    this.ctx.status = health.code;
    this.ctx.type = 'application/json';
    if (
      path === '/health/ready' &&
      this.app.meta.env.META_MODE === 'test' &&
      this.app.meta.env.VONA_TEST_RUN_ID &&
      process.env.VONA_TEST_READY_KEY
    ) {
      const challenge = this.ctx.get('x-vona-test-challenge');
      if (/^[a-f0-9]{32}$/.test(challenge)) {
        this.ctx.set(
          'x-vona-test-proof',
          createHmac('sha256', process.env.VONA_TEST_READY_KEY).update(challenge).digest('hex'),
        );
      }
    }
    this.ctx.body = { status: health.status };
  }
}
