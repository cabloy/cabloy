import type { VonaApplication } from 'vona';

import assert from 'node:assert';
import { PassThrough } from 'node:stream';
import { describe, it } from 'node:test';

import { onerror } from '../src/lib/onerror.ts';

function createFixture(aborted: boolean, writable: boolean) {
  const logged: Error[] = [];
  const responses: unknown[] = [];
  const app = { context: {} } as VonaApplication;
  const options = {
    all(_err: Error, ctx: any) {
      ctx.body = 'error response';
    },
    log(err: Error) {
      logged.push(err);
    },
  };
  onerror(app, options);
  const req = Object.assign(new PassThrough(), { aborted });
  req.destroy();
  const ctx = Object.assign(Object.create(app.context), {
    req,
    writable,
    headerSent: false,
    res: {
      end(body: unknown) {
        responses.push(body);
      },
    },
    set() {},
    accepts() {
      return 'text';
    },
  });
  return { ctx, logged, responses };
}

function createBodyError(type: string, status: number) {
  return Object.assign(new Error(type), { type, status });
}

describe('onerror.test.ts', () => {
  for (const [type, status] of [
    ['stream.not.readable', 500],
    ['request.aborted', 400],
  ] as const) {
    it(`ignores ${type} only for an aborted, unwritable request`, async () => {
      const { ctx, logged, responses } = createFixture(true, false);
      await ctx.onerror(createBodyError(type, status));
      assert.deepEqual(logged, []);
      assert.deepEqual(responses, []);
    });

    it(`keeps ${type} visible without confirmed request abortion`, async () => {
      const { ctx, logged, responses } = createFixture(false, false);
      const error = createBodyError(type, status);
      await ctx.onerror(error);
      assert.deepEqual(logged, [error]);
      assert.equal(Reflect.get(error, 'headerSent'), true);
      assert.deepEqual(responses, []);
    });

    it(`preserves ${type} handling while the response is writable`, async () => {
      const { ctx, logged, responses } = createFixture(true, true);
      const error = createBodyError(type, status);
      await ctx.onerror(error);
      assert.deepEqual(logged, [error]);
      assert.equal(ctx.status, status);
      assert.deepEqual(responses, ['error response']);
    });
  }

  it('does not hide unrelated application errors on aborted requests', async () => {
    const { ctx, logged, responses } = createFixture(true, false);
    const error = new Error('application failure');
    await ctx.onerror(error);
    assert.deepEqual(logged, [error]);
    assert.deepEqual(responses, []);
  });

  it('preserves body parsing errors on a writable request', async () => {
    const { ctx, logged, responses } = createFixture(false, true);
    const error = createBodyError('entity.parse.failed', 400);
    await ctx.onerror(error);
    assert.deepEqual(logged, [error]);
    assert.equal(ctx.status, 400);
    assert.deepEqual(responses, ['error response']);
  });
});
