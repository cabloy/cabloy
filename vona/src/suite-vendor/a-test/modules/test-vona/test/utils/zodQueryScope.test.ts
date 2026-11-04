import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { runWithZodQueryCoercion } from 'vona';
import { app } from 'vona-mock';
import { z } from 'zod';

const query = z.object({ count: z.number(), title: z.string().optional() });
const level = z.union([z.literal(1), z.literal(2), z.literal(3)]);

function assertQuery() {
  assert.deepEqual(query.parse({ count: '2', title: '' }), { count: 2, title: undefined });
  for (const value of [1, 2, 3]) {
    assert.equal(level.parse(String(value)), value);
    assert.equal(level.parse(value), value);
  }
  for (const value of ['4', '1.5', 'invalid', 4, 1.5, true, [1], null, undefined]) {
    assert.equal(level.safeParse(value).success, false);
  }
}

function assertNative() {
  assert.equal(query.safeParse({ count: '2' }).success, false);
  assert.deepEqual(query.parse({ count: 2, title: '' }), { count: 2, title: '' });
  for (const value of [1, 2, 3]) {
    assert.equal(level.safeParse(String(value)).success, false);
    assert.equal(level.parse(value), value);
  }
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

  it('adapts numeric literals without changing string literals or union order', async () => {
    await app.bean.executor.mockCtx(async () => {
      await runWithZodQueryCoercion(true, async () => {
        assert.equal(z.literal([1, 2, 3]).parse('2'), 2);
        for (const value of ['', 'null', 'undefined', '2']) {
          assert.equal(z.literal(value).parse(value), value);
        }
        const mixed = z.literal([1, '1', 'auto']);
        assert.equal(mixed.parse('1'), '1');
        assert.equal(mixed.parse(1), 1);
        assert.equal(mixed.parse('auto'), 'auto');
        assert.equal(z.union([z.literal('1'), z.literal(1)]).parse('1'), '1');
        assert.equal(z.union([z.literal(1), z.literal('1')]).parse('1'), 1);
        for (const value of ['', 'null', 'undefined', false, []]) {
          assert.equal(z.literal(0).safeParse(value).success, false);
        }
        assert.equal(level.optional().parse(undefined), undefined);
      });
      await runWithZodQueryCoercion(false, async () => {
        assert.equal(z.literal([1, 2, 3]).safeParse('2').success, false);
        assert.equal(z.union([z.literal(1), z.literal('1')]).parse('1'), '1');
      });
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
