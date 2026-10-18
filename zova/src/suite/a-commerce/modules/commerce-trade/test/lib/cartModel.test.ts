import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { stripTypeScriptTypes } from 'node:module';
import test from 'node:test';

const source = readFileSync(new URL('../../src/model/cart.ts', import.meta.url), 'utf8')
  .replace(/^import[\s\S]*?;\n/gm, '')
  .replace(/^@Model[^\n]*\n/gm, '');
const javascript = stripTypeScriptTypes(source).replace(
  'export class ModelCart',
  'class ModelCart',
);

function createModel() {
  const invalidated = Promise.withResolvers<void>();
  const released = Promise.withResolvers<void>();
  const cache = new Map<string, unknown>([['current', { items: [] }]]);
  class BeanModelBase {
    $useMutationData(options: unknown) {
      return options;
    }

    $setQueryData(key: string[], value: unknown) {
      assert.deepEqual(key, ['current']);
      cache.set('current', value);
    }

    async $invalidateQueries(filters: unknown) {
      assert.deepEqual(filters, { queryKey: ['current'] });
      invalidated.resolve();
      await released.promise;
    }
  }
  const ModelCart = new Function('BeanModelBase', `${javascript}\nreturn ModelCart;`)(
    BeanModelBase,
  );
  return { model: new ModelCart(), cache, invalidated, released };
}

for (const method of ['addItem', 'updateItem', 'deleteItem', 'clear']) {
  test(`${method} publishes the authoritative cart before its refresh completes`, async () => {
    const { model, cache, invalidated, released } = createModel();
    cache.set('current', { id: '1', items: [{ id: '2', quantity: 2 }] });
    const cart = {
      id: '1',
      items: method === 'clear' || method === 'deleteItem' ? [] : [{ id: '2', quantity: 1 }],
    };
    const success = model[method]().onSuccess(cart);
    try {
      await invalidated.promise;
      // The destination page reads this same query-owned value during navigation.
      assert.equal(cache.get('current'), cart);
    } finally {
      released.resolve();
      await success;
    }
  });
}

test('checkout invalidates the cart without publishing its different response contract', async () => {
  const { model, cache, invalidated, released } = createModel();
  const previous = cache.get('current');
  const success = model.checkout().onSuccess({ orderId: '3', state: 'awaiting_payment' });
  try {
    await invalidated.promise;
    assert.equal(cache.get('current'), previous);
  } finally {
    released.resolve();
    await success;
  }
});
