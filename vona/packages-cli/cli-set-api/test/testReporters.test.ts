import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { it } from 'node:test';

const reporterUrl = new URL('../toolsIsolate/testReporters.ts', import.meta.url).href;

it('reports passing and failing coverage tests to stdout while draining LCOV', () => {
  const projectPath = mkdtempSync(join(tmpdir(), 'vona coverage reporters '));
  try {
    const fixture = join(projectPath, 'coverage.test.mjs');
    const report = join(projectPath, 'lcov.info');
    const runner = join(projectPath, 'runner.mjs');
    writeFileSync(
      runner,
      `import { createWriteStream } from 'node:fs';
import { run } from 'node:test';
import { reportTestResults } from ${JSON.stringify(reporterUrl)};
const stream = run({ files: [${JSON.stringify(fixture)}], isolation: 'none', coverage: true });
stream.on('test:summary', summary => { process.exitCode = summary.success ? 0 : 1; });
await reportTestResults(stream, process.stdout, createWriteStream(${JSON.stringify(report)}));
console.log('reporters drained');
`,
    );
    for (const succeeds of [true, false]) {
      writeFileSync(
        fixture,
        `import assert from 'node:assert/strict';
import { it } from 'node:test';
it('coverage assertion probe', () => assert.equal(1, ${succeeds ? 1 : 2}));
`,
      );
      const result = spawnSync(process.execPath, ['--experimental-test-coverage', runner], {
        cwd: projectPath,
        encoding: 'utf8',
        timeout: 30000,
      });
      assert.ifError(result.error);
      assert.equal(result.status, succeeds ? 0 : 1, result.stderr);
      assert.match(result.stdout, /coverage assertion probe/);
      assert.match(result.stdout, /reporters drained/);
      assert.match(result.stdout, new RegExp(`pass ${succeeds ? 1 : 0}`));
      assert.match(result.stdout, new RegExp(`fail ${succeeds ? 0 : 1}`));
      if (!succeeds) {
        assert.match(result.stdout, /ERR_ASSERTION/);
        assert.match(result.stdout, /1 !== 2/);
        assert.match(result.stdout, /coverage\.test\.mjs/);
      }
      const lcov = readFileSync(report, 'utf8');
      assert.match(lcov, /SF:.*coverage\.test\.mjs/);
      assert.match(lcov, /DA:\d+,\d+/);
      assert.match(lcov, /end_of_record/);
      assert.doesNotMatch(lcov, /coverage assertion probe|ERR_ASSERTION/);
    }
  } finally {
    rmSync(projectPath, { recursive: true, force: true });
  }
});
