import assert from 'node:assert/strict';
import test from 'node:test';

import {
  normalizeResourcePickerIds,
  resolveResourcePickerValue,
} from '../../src/lib/resourcePicker.ts';

test('resource picker normalization preserves identity types and deduplicates equivalent identities', () => {
  assert.deepEqual(normalizeResourcePickerIds(undefined), []);
  assert.deepEqual(normalizeResourcePickerIds(''), []);
  assert.deepEqual(normalizeResourcePickerIds(7), [7]);
  assert.deepEqual(normalizeResourcePickerIds([7, '7', 8, undefined, '']), [7, 8]);
});

test('resource picker result resolves a scalar identity for single mode', () => {
  assert.equal(resolveResourcePickerValue([7, 8], 'single', 1), 7);
  assert.equal(resolveResourcePickerValue([], 'single', 1), undefined);
});

test('resource picker result enforces the configured multiple selection maximum', () => {
  assert.deepEqual(resolveResourcePickerValue([1, 2, 3], 'multiple', 2), [1, 2]);
  assert.deepEqual(resolveResourcePickerValue([1, 2], 'multiple', 0), []);
  assert.deepEqual(
    resolveResourcePickerValue(
      Array.from({ length: 101 }, (_value, index) => index + 1),
      'multiple',
      100,
    ),
    Array.from({ length: 100 }, (_value, index) => index + 1),
  );
});
