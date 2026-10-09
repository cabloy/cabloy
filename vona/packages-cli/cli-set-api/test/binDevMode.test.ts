import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, it } from 'node:test';

import { CliBinDev, resolveDevMode, resolveTestWorkers } from '../src/lib/bean/cli.bin.dev.ts';
import command from '../src/lib/command/bin.dev.ts';

describe('bin.dev mode', () => {
  it('defaults to dev and accepts test explicitly', () => {
    assert.equal(resolveDevMode(undefined), 'dev');
    assert.equal(resolveDevMode('dev'), 'dev');
    assert.equal(resolveDevMode('test'), 'test');
    assert.deepEqual(command.options.mode.choices, ['dev', 'test']);
  });

  it('rejects invalid modes before runtime generation', () => {
    for (const value of ['', 'prod', 'unknown', true, ['dev', 'test'], null]) {
      assert.throws(() => resolveDevMode(value), /Invalid --mode: expected dev or test/);
    }
  });

  it('forces one worker in test mode without changing dev workers', () => {
    assert.equal(resolveTestWorkers('test', undefined), 1);
    assert.equal(resolveTestWorkers('test', 1), 1);
    assert.equal(resolveTestWorkers('dev', undefined), undefined);
    assert.equal(resolveTestWorkers('dev', 3), 3);
    for (const workers of [0, 2, '1', null, [1]]) {
      assert.throws(() => resolveTestWorkers('test', workers), /requires --workers=1/);
    }
  });

  it('supervises test-mode bootstrap exit without starting a server', async () => {
    const projectPath = mkdtempSync(join(tmpdir(), 'vona-bin-dev-mode-'));
    try {
      mkdirSync(join(projectPath, '.vona'));
      writeFileSync(join(projectPath, '.vona/register.js'), '');
      const cli = Object.create(CliBinDev.prototype) as CliBinDev;
      for (const code of [0, 7]) {
        writeFileSync(join(projectPath, '.vona/bootstrap.ts'), `process.exit(${code});`);
        if (code === 0) {
          await cli._runTest(projectPath);
        } else {
          await assert.rejects(cli._runTest(projectPath), /Test-mode dev server exited: 7/);
        }
      }
    } finally {
      rmSync(projectPath, { recursive: true, force: true });
    }
  });
});
