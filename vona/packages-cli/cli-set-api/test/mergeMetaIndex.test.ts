import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { mergeMetaIndex } from '../src/lib/mergeMetaIndex.ts';

const source = (indexes: string) => `import { Meta } from 'vona-module-a-meta';
@Meta({
  indexes: {
${indexes}
  },
})
class MetaIndex {}
`;

function declarations(code: string, table: string) {
  const matcher = /\.\.\.\$tableColumns\('([^']+)', (\[[^\]]+\]|'[^']+')\)/g;
  const found = [...code.matchAll(matcher)].filter(match => {
    const line = code.slice(code.lastIndexOf('\n', match.index) + 1, match.index);
    return match[1] === table && !line.includes('//');
  });
  assert.equal(found.length, 1, code);
  const fields = found[0][2];
  return fields.startsWith('[')
    ? Array.from(fields.matchAll(/'([^']+)'/g), match => match[1])
    : [fields.slice(1, -1)];
}

describe('mergeMetaIndex', () => {
  it('adds name and foreign-key indexes independently to a new table', () => {
    const input = source('');
    const withName = mergeMetaIndex(input, 'trainingRecord', 'name');
    const withForeignKey = mergeMetaIndex(withName, 'trainingRecord', 'studentId');
    assert.deepEqual(declarations(withForeignKey, 'trainingRecord'), ['name', 'studentId']);
    assert.equal(mergeMetaIndex(withForeignKey, 'trainingRecord', 'studentId'), withForeignKey);
  });

  it('merges existing arrays, composites, and repeated table spreads without changing other tables', () => {
    const input = source(`    ...$tableColumns('other', 'studentId'),
    ...$tableColumns('trainingRecord', ['name', 'state+expiresAt']),
    ...$tableColumns('trainingRecord', 'studentId'),`);
    const output = mergeMetaIndex(input, 'trainingRecord', 'studentId');
    assert.deepEqual(declarations(output, 'trainingRecord'), [
      'name',
      'state+expiresAt',
      'studentId',
    ]);
    assert.deepEqual(declarations(output, 'other'), ['studentId']);
    assert.equal(mergeMetaIndex(output, 'trainingRecord', 'studentId'), output);
  });

  it('repairs previously generated declarations even if the requested field appears first', () => {
    const input = source(`    ...$tableColumns('trainingRecord', 'studentId'),
    ...$tableColumns('trainingRecord', 'name'),`);
    const output = mergeMetaIndex(input, 'trainingRecord', 'studentId');
    assert.deepEqual(declarations(output, 'trainingRecord'), ['studentId', 'name']);
    assert.equal(mergeMetaIndex(output, 'trainingRecord', 'studentId'), output);
  });

  it('does not confuse another table or comment with an existing target index', () => {
    const input = source(`    // ...$tableColumns('trainingRecord', 'studentId'),
    ...$tableColumns('other', 'studentId'),`);
    const output = mergeMetaIndex(input, 'trainingRecord', 'studentId');
    assert.deepEqual(declarations(output, 'trainingRecord'), ['studentId']);
    assert.match(output, /\.\.\.\$tableColumns\('other', 'studentId'\)/);
  });

  it('rejects ambiguous same-table expressions', () => {
    const input = source("    ...$tableColumns('trainingRecord', fields),");
    assert.throws(
      () => mergeMetaIndex(input, 'trainingRecord', 'studentId'),
      /unsupported index fields/,
    );
    assert.throws(
      () => mergeMetaIndex(source("    trainingRecord: ['name'],"), 'trainingRecord', 'studentId'),
      /unsupported index property/,
    );
  });
});
