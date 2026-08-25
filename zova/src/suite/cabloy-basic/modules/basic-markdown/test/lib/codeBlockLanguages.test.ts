import assert from 'node:assert/strict';
import test from 'node:test';

import {
  codeBlockLanguages,
  getCodeBlockLanguage,
  isCodeBlockLanguage,
} from '../../src/lib/codeBlockLanguages.js';

test('Code block languages contain stable unique identifiers', () => {
  assert.equal(new Set(codeBlockLanguages).size, codeBlockLanguages.length);
  assert.equal(codeBlockLanguages.includes('typescript'), true);
  assert.equal(codeBlockLanguages.includes('python'), true);
});

test('Code block languages normalize supported aliases without treating unknown values as plain text', () => {
  assert.equal(getCodeBlockLanguage('ts'), 'typescript');
  assert.equal(getCodeBlockLanguage('js'), 'javascript');
  assert.equal(getCodeBlockLanguage('sh'), 'shell');
  assert.equal(getCodeBlockLanguage('plaintext'), undefined);
  assert.equal(getCodeBlockLanguage(undefined), undefined);
  assert.equal(isCodeBlockLanguage('typescript'), true);
  assert.equal(isCodeBlockLanguage('ts'), true);
  assert.equal(isCodeBlockLanguage('plaintext'), false);
});
