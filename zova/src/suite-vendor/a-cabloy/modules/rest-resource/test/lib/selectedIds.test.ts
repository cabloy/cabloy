import assert from 'node:assert/strict';
import test from 'node:test';

import { validateSelectedIds } from '../../src/lib/selectedIds.ts';

test('selected mutation IDs require a nonempty unique normalized collection', () => {
  assert.deepEqual(validateSelectedIds([7, 'student-8']), [7, 'student-8']);
  assert.throws(() => validateSelectedIds([]), /selected ids cannot empty/);
  assert.throws(() => validateSelectedIds([undefined as never]), /selected row id cannot empty/);
  assert.throws(() => validateSelectedIds(['']), /selected row id cannot empty/);
  assert.throws(() => validateSelectedIds([1, '1']), /duplicate selected row id: 1/);
});

test('selected mutation IDs do not impose a frontend count limit', () => {
  const ids = Array.from({ length: 101 }, (_, index) => index + 1);
  const validatedIds = validateSelectedIds(ids);

  assert.deepEqual(validatedIds, ids);
  assert.notEqual(validatedIds, ids);
});
