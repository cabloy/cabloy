import assert from 'node:assert/strict';
import test from 'node:test';

import { BeanCommandSelectedBase } from '../../src/lib/beanCommandSelectedBase.ts';

const command = Object.create(BeanCommandSelectedBase.prototype) as BeanCommandSelectedBase;
const renderContext = { $scene: 'app' } as any;

test('selected command IDs do not impose a frontend count limit', () => {
  const ids = Array.from({ length: 101 }, (_, index) => index + 1);

  assert.deepEqual(
    command.getResourceAndIds({ resource: 'test:resource', ids } as any, renderContext),
    {
      resource: 'test:resource',
      ids,
    },
  );
});

test('selected command IDs require a nonempty unique normalized collection', () => {
  assert.throws(
    () => command.getResourceAndIds({ resource: 'test:resource', ids: [] } as any, renderContext),
    /should specify resource and selected ids/,
  );
  assert.throws(
    () => command.getResourceAndIds({ ids: [1] } as any, renderContext),
    /should specify resource and selected ids/,
  );
  assert.throws(
    () =>
      command.getResourceAndIds(
        { resource: 'test:resource', ids: [undefined as never] } as any,
        renderContext,
      ),
    /selected row id cannot empty/,
  );
  assert.throws(
    () => command.getResourceAndIds({ resource: 'test:resource', ids: [''] } as any, renderContext),
    /selected row id cannot empty/,
  );
  assert.throws(
    () =>
      command.getResourceAndIds({ resource: 'test:resource', ids: [1, '1'] } as any, renderContext),
    /duplicate selected row id: 1/,
  );
});
