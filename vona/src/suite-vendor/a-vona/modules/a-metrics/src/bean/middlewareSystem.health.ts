import type { Next } from 'vona';
import type {
  IDecoratorMiddlewareSystemOptions,
  IMiddlewareSystemExecute,
} from 'vona-module-a-aspect';

import { createHmac, timingSafeEqual } from 'node:crypto';
import { assertTestAppIdentity, BeanBase, closeProcessWorker } from 'vona';
import { MiddlewareSystem } from 'vona-module-a-aspect';

// An accepted shutdown consumes this app's authorization before yielding. This also
// rejects concurrent/replayed requests across request-scoped middleware instances.
const stoppingApps = new WeakSet<object>();
const STOP_PATH = '/health/test-stop';

export interface IMiddlewareSystemOptionsHealth extends IDecoratorMiddlewareSystemOptions {}

@MiddlewareSystem<IMiddlewareSystemOptionsHealth>({
  dependents: 'a-instance:app',
})
export class MiddlewareSystemHealth extends BeanBase implements IMiddlewareSystemExecute {
  async execute(_options: IMiddlewareSystemOptionsHealth, next: Next) {
    const path = this.ctx.path;
    if (path === STOP_PATH) {
      this._testStop();
      return;
    }
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

  private _testStop() {
    const ctx = this.ctx;
    // Never trust forwarded IP headers, even when the app trusts a proxy.
    const address = ctx.req.socket.remoteAddress;
    const env = this.app.meta.env;
    const key = process.env.VONA_TEST_READY_KEY;
    let runId: string | undefined;
    try {
      runId = assertTestAppIdentity(env.META_MODE, env.VONA_TEST_RUN_ID ?? '', this.app.name);
    } catch {
      // Invalid or ordinary app identities must not expose this operation.
    }
    if (
      !runId ||
      process.env.META_MODE !== 'test' ||
      process.env.VONA_TEST_RUN_ID !== runId ||
      this.app.config.server.workers !== 1 ||
      !key ||
      !/^[a-f0-9]{64}$/.test(key) ||
      !['127.0.0.1', '::1', '::ffff:127.0.0.1'].includes(address ?? '')
    ) {
      ctx.status = 404;
      return;
    }
    const nonce = ctx.get('x-vona-test-stop-nonce');
    const authorization = ctx.get('x-vona-test-stop-authorization');
    if (
      ctx.method !== 'POST' ||
      ctx.req.url !== STOP_PATH ||
      !/^[a-f0-9]{32}$/.test(nonce) ||
      !/^[a-f0-9]{64}$/.test(authorization)
    ) {
      ctx.status = 403;
      return;
    }
    // Readiness signs only a hex challenge. Neither that signing oracle nor the
    // acknowledgment domain can produce a shutdown request authorization.
    const payload = `${runId}\nPOST\n${STOP_PATH}\n${nonce}`;
    const expected = createHmac('sha256', key)
      .update(`vona-test-stop-request-v1\n${payload}`)
      .digest();
    if (!timingSafeEqual(expected, Buffer.from(authorization, 'hex'))) {
      ctx.status = 403;
      return;
    }
    if (stoppingApps.has(this.app)) {
      ctx.status = 409;
      return;
    }
    stoppingApps.add(this.app);
    ctx.status = 200;
    ctx.type = 'application/json';
    ctx.set(
      'x-vona-test-stop-proof',
      createHmac('sha256', key).update(`vona-test-stop-ack-v1\n${payload}`).digest('hex'),
    );
    ctx.body = { status: 'stopping' };
    // closeApp may close this listener, so flush the authenticated acknowledgment
    // first. A disconnected response is not permission to start closing.
    ctx.res.once('finish', () => void closeProcessWorker());
  }
}
