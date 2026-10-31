import assert from 'node:assert/strict';
import { test } from 'node:test';
import { z } from 'zod';

const schemas = [z.string(), z.string().optional(), z.string().nullable()];

test('string adaptation converts only common primitives across string wrappers', () => {
  const cases: [unknown, string][] = [
    [1, '1'],
    [0, '0'],
    [true, 'true'],
    [false, 'false'],
    [1n, '1'],
    [0n, '0'],
    ['value', 'value'],
  ];
  for (const schema of schemas) {
    for (const [input, expected] of cases) {
      assert.deepEqual(schema.safeParse(input), { success: true, data: expected });
    }
  }
});

test('string adaptation rejects nonprimitive values without invoking conversion hooks', () => {
  const calls: string[] = [];
  const custom = {
    [Symbol.toPrimitive]() {
      calls.push('toPrimitive');
      return '1';
    },
    toString() {
      calls.push('toString');
      return '1';
    },
    valueOf() {
      calls.push('valueOf');
      return 1;
    },
  };
  const inputs = [[1], {}, () => '1', Symbol('value'), custom];
  for (const schema of schemas) {
    for (const input of inputs) {
      assert.equal(schema.safeParse(input).success, false);
    }
  }
  assert.deepEqual(calls, []);
});

test('string adaptation retains empty and nullable input behavior', () => {
  const required = z.string();
  const optional = z.string().optional();
  const nullable = z.string().nullable();
  for (const input of [undefined, null, '']) {
    assert.equal(required.safeParse(input).success, false);
    assert.deepEqual(optional.safeParse(input), { success: true, data: undefined });
  }
  for (const input of [undefined, '']) {
    assert.equal(nullable.safeParse(input).success, false);
  }
  assert.deepEqual(nullable.safeParse(null), { success: true, data: null });
  assert.deepEqual(nullable.safeParse('null'), { success: true, data: null });
  assert.deepEqual(required.safeParse('null'), { success: true, data: 'null' });
  assert.deepEqual(optional.safeParse('null'), { success: true, data: 'null' });
});
