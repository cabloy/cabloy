import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { runWithZodQueryCoercion } from 'vona';
import { app } from 'vona-mock';
import { z } from 'zod';

const query = z.object({ count: z.number(), title: z.string().optional() });

function assertQuery() {
  assert.deepEqual(query.parse({ count: '2', title: '' }), { count: 2, title: undefined });
}

function assertNative() {
  assert.equal(query.safeParse({ count: '2' }).success, false);
  assert.deepEqual(query.parse({ count: 2, title: '' }), { count: 2, title: '' });
}

describe('zodQueryScope.test.ts', () => {
  it('keeps native JSON values and checked nested/lazy schemas', async () => {
    await app.bean.executor.mockCtx(async () => {
      assertQuery();
      await runWithZodQueryCoercion(false, async () => {
        const schema = z.object({
          id: z.union([z.string(), z.number()]),
          nested: z.lazy(() => z.object({ title: z.string(), enabled: z.boolean() })),
        });
        const input = { id: 0, nested: { title: '', enabled: false } };
        assert.deepEqual(await schema.parseAsync(input), input);
        assert.equal(
          schema.safeParse({ ...input, nested: { title: '', enabled: 'false' } }).success,
          false,
        );
        assert.equal(z.string().min(2).safeParse('x').success, false);
        assert.equal(
          z
            .string()
            .refine(value => value === 'ok')
            .safeParse('no').success,
          false,
        );
        assertNative();
        await runWithZodQueryCoercion(true, async () => {
          await Promise.resolve();
          assertQuery();
        });
        assertNative();
      });
      assertQuery();
    });
  });

  it('restores the surrounding policy after throws and rejections', async () => {
    await app.bean.executor.mockCtx(async () => {
      const failure = new Error('scope failure');
      assert.throws(
        () =>
          runWithZodQueryCoercion(false, () => {
            throw failure;
          }),
        error => error === failure,
      );
      assertQuery();
      await assert.rejects(
        runWithZodQueryCoercion(false, async () => {
          assertNative();
          await Promise.resolve();
          throw failure;
        }),
        error => error === failure,
      );
      assertQuery();
      await runWithZodQueryCoercion(false, async () => {
        await assert.rejects(
          runWithZodQueryCoercion(true, async () => {
            throw failure;
          }),
          error => error === failure,
        );
        assertNative();
      });
      assertQuery();
    });
  });

  it('isolates competing async contexts without timing assumptions', async () => {
    const nativeReady = Promise.withResolvers<void>();
    const queryReady = Promise.withResolvers<void>();
    await Promise.all([
      app.bean.executor.mockCtx(() =>
        runWithZodQueryCoercion(false, async () => {
          assertNative();
          nativeReady.resolve();
          await queryReady.promise;
          assertNative();
        }),
      ),
      app.bean.executor.mockCtx(async () => {
        await nativeReady.promise;
        try {
          assertQuery();
          await runWithZodQueryCoercion(true, async () => {
            await Promise.resolve();
            assertQuery();
          });
        } finally {
          queryReady.resolve();
        }
      }),
    ]);
    await app.bean.executor.mockCtx(async () => assertQuery());
  });
});
