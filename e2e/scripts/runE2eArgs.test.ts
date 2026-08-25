import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import test from 'node:test';

import { buildTagGrep, combineGreps, parseE2eArgs } from './runE2eArgs.ts';

function withSpecs(callback: (specsDir: string) => void): void {
  const tempDir = mkdtempSync(resolve(tmpdir(), 'cabloy-e2e-args-'));
  try {
    const specsDir = resolve(tempDir, 'specs');
    mkdirSync(specsDir);
    for (const name of ['account', 'a-commerce', 'cabloy-basic']) {
      writeFileSync(resolve(specsDir, `${name}.spec.ts`), '');
    }
    callback(specsDir);
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
}

test('parses mode, multiple specs, and repeatable tags', () => {
  withSpecs(specsDir => {
    assert.deepEqual(
      parseE2eArgs(
        ['--clean', 'cabloy-basic', 'account', '--tag', '@web', '--tag=@smoke'],
        specsDir,
      ),
      {
        mode: 'clean',
        specNames: ['cabloy-basic', 'account'],
        playwrightArgs: [],
        tags: ['@web', '@smoke'],
      },
    );
  });
});

test('allows no spec names and forwards Playwright filters', () => {
  withSpecs(specsDir => {
    assert.deepEqual(parseE2eArgs(['--fast', '--grep', '@flow'], specsDir), {
      mode: 'fast',
      specNames: [],
      playwrightArgs: ['--grep', '@flow'],
      tags: [],
    });
  });
});

test('rejects invalid or unknown specs and managed config overrides', () => {
  withSpecs(specsDir => {
    assert.throws(() => parseE2eArgs(['--fast', '../account'], specsDir), /Invalid E2E spec name/);
    assert.throws(() => parseE2eArgs(['--fast', 'missing'], specsDir), /Unknown E2E spec/);
    assert.throws(
      () => parseE2eArgs(['--fast', '--config', 'other.ts'], specsDir),
      /manages --config/,
    );
  });
});

test('requires exactly one run mode', () => {
  withSpecs(specsDir => {
    assert.throws(() => parseE2eArgs(['account'], specsDir), /Missing E2E mode/);
    assert.throws(() => parseE2eArgs(['--clean', '--fast'], specsDir), /exactly one/);
  });
});

test('combines tags with an existing grep expression', () => {
  assert.equal(buildTagGrep(['@web', '@smoke']), '(?=.*@web)(?=.*@smoke)');
  assert.deepEqual(combineGreps(['--grep', '@flow'], ['@web', '@smoke']), [
    '--grep',
    '(?=.*(?:@flow))(?=.*@web)(?=.*@smoke)',
  ]);
});
