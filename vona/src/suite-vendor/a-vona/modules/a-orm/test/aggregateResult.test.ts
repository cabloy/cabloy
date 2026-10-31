import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { normalizeAggregateRows, normalizeAggregateValue } from '../src/lib/aggregateResult.ts';

describe('ORM aggregate result adaptation', () => {
  it('preserves driver strings and converts supported numeric scalars', () => {
    for (const fn of ['count', 'sum', 'avg', 'min', 'max'] as const) {
      for (const value of [0, 17, 17n, Number.MAX_SAFE_INTEGER, '900719925474099312345']) {
        assert.equal(normalizeAggregateValue(value, fn), String(value));
      }
      assert.equal(normalizeAggregateValue(undefined, fn), undefined);
      for (const value of [true, {}, new Date(), Number.NaN, Infinity, -Infinity]) {
        assert.throws(() => normalizeAggregateValue(value, fn), TypeError);
      }
    }
    for (const fn of ['sum', 'avg', 'min', 'max'] as const) {
      for (const value of ['001.2300', '-12345678901234567890.12345', '1e-100', -1.25, -1n]) {
        assert.equal(normalizeAggregateValue(value, fn), String(value));
      }
      assert.equal(normalizeAggregateValue(null, fn), null);
    }
  });

  it('rejects invalid and already lossy count values', () => {
    for (const value of [
      null,
      -1,
      -1n,
      1.5,
      Number.MAX_SAFE_INTEGER + 1,
      '',
      '01',
      '-1',
      '+1',
      ' 1',
      '1 ',
      '1.0',
      '1e3',
    ]) {
      assert.throws(() => normalizeAggregateValue(value, 'count'), TypeError);
    }
  });

  it('adapts only requested aliases without mutating cached rows', () => {
    const unchanged = Object.freeze({ level: 2, count_all: '2', sum_age: null });
    const legacy = Object.freeze({
      level: 1,
      count_all: 2,
      avg_age: 1.25,
      sum_age: null,
      count_name: 7,
    });
    const rows = [unchanged, legacy];
    const result = normalizeAggregateRows(rows, { count: '*', sum: 'age', avg: 'age' });
    assert.notEqual(result, rows);
    assert.equal(result[0], unchanged);
    assert.notEqual(result[1], legacy);
    assert.deepEqual(result[1], {
      level: 1,
      count_all: '2',
      avg_age: '1.25',
      sum_age: null,
      count_name: 7,
    });
    assert.equal(legacy.count_all, 2);
    assert.equal(normalizeAggregateRows(result, { count: '*', sum: 'age', avg: 'age' }), result);
    assert.equal(normalizeAggregateRows(rows), rows);
    assert.equal(normalizeAggregateRows(rows, {}), rows);
  });

  it('preserves absent and undefined aliases and supports column lists', () => {
    const rows = [{ count_all: 0n, count_imageId: undefined, name: 'unchanged' }];
    assert.deepEqual(normalizeAggregateRows(rows, { count: ['*', 'imageId', 'name'] }), [
      { count_all: '0', count_imageId: undefined, name: 'unchanged' },
    ]);
    assert.equal(Object.hasOwn(rows[0], 'count_name'), false);
    const empty: object[] = [];
    assert.equal(normalizeAggregateRows(empty, { count: '*' }), empty);
  });
});
