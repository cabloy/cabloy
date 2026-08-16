import assert from 'node:assert/strict';
import test from 'node:test';

import { isSelectValueEqual } from '../../src/lib/utils.js';

test('Select values preserve standard string matching', () => {
  assert.equal(isSelectValueEqual(7, '7'), true);
  assert.equal(isSelectValueEqual('active', 'active'), true);
  assert.equal(isSelectValueEqual('active', 'inactive'), false);
});

test('Select boolean items match SQLite boolean values', () => {
  assert.equal(isSelectValueEqual(true, true), true);
  assert.equal(isSelectValueEqual(true, 1), true);
  assert.equal(isSelectValueEqual(true, '1'), true);
  assert.equal(isSelectValueEqual(false, false), true);
  assert.equal(isSelectValueEqual(false, 0), true);
  assert.equal(isSelectValueEqual(false, '0'), true);
});

test('Select boolean items reject incompatible values', () => {
  assert.equal(isSelectValueEqual(true, 0), false);
  assert.equal(isSelectValueEqual(true, '0'), false);
  assert.equal(isSelectValueEqual(false, 1), false);
  assert.equal(isSelectValueEqual(false, '1'), false);
  assert.equal(isSelectValueEqual(true, 'true'), true);
  assert.equal(isSelectValueEqual(false, 'false'), true);
});
