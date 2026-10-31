import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, readFileSync, realpathSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { it } from 'node:test';

import { runTestChild } from '../src/lib/bean/cli.bin.test.ts';
import { formatActiveResourceCounts } from '../toolsIsolate/testDiagnostics.ts';

it('formats only deterministic active resource type counts, including small and empty lists', () => {
  assert.equal(formatActiveResourceCounts([]), '{}');
  assert.equal(formatActiveResourceCounts(['Timeout']), '{"Timeout":1}');
  const types = Object.freeze(['Timeout', 'TCPWrap', 'Timeout', 'PipeWrap']);
  assert.equal(formatActiveResourceCounts(types), '{"PipeWrap":1,"TCPWrap":1,"Timeout":2}');
  assert.equal(formatActiveResourceCounts(types.toReversed()), formatActiveResourceCounts(types));
});

it('wires opt-in test diagnostics without stack preloads or private handle inspection', () => {
  const runner = readFileSync(new URL('../toolsIsolate/test.ts', import.meta.url), 'utf8');
  assert.ok(!runner.includes('why-is-node-running'));
  assert.ok(!runner.includes('_getActiveHandles'));
  assert.match(
    runner,
    /if \(process.env.TEST_WHYISNODERUNNING === 'true'\) \{\s*await sleep\(2000\);\s*console.error\([\s\S]*?formatActiveResourceCounts\(process.getActiveResourcesInfo\(\)\)/,
  );
});

it('preserves literal test patterns and arguments through a real Node child', async () => {
  const projectPath = mkdtempSync(join(tmpdir(), 'vona test argv '));
  try {
    const probe = join(projectPath, 'argv probe.mjs');
    const output = join(projectPath, 'argv.json');
    const fixtures = join(projectPath, 'test', 'support');
    mkdirSync(fixtures, { recursive: true });
    for (const name of ['first.ts', 'second.ts']) writeFileSync(join(fixtures, name), '');
    writeFileSync(
      probe,
      `import { writeFileSync } from 'node:fs';
writeFileSync(process.argv[2], JSON.stringify({ argv: process.argv.slice(3), cwd: process.cwd() }));
`,
    );
    const args = [
      'test/**/*.ts',
      'test/*.ts,test/support/*.ts',
      '',
      'a value with spaces',
      'literal & ; $HOME $(echo unexpected) %PATH% [brackets]',
    ];
    await runTestChild([probe, output, ...args], projectPath);
    const observed = JSON.parse(readFileSync(output, 'utf8'));
    assert.deepEqual(observed.argv, args);
    assert.equal(realpathSync(observed.cwd), realpathSync(projectPath));
  } finally {
    rmSync(projectPath, { recursive: true, force: true });
  }
});

it('rejects child failure and spawn failure without leaking signal listeners', async () => {
  const projectPath = mkdtempSync(join(tmpdir(), 'vona test exit '));
  try {
    const listeners = [process.listenerCount('SIGINT'), process.listenerCount('SIGTERM')];
    await assert.rejects(
      runTestChild(['--eval', 'process.exit(7)'], projectPath),
      /Test child exited: 7/,
    );
    await assert.rejects(runTestChild(['--eval', ''], join(projectPath, 'missing')), {
      code: 'ENOENT',
    });
    assert.deepEqual(
      [process.listenerCount('SIGINT'), process.listenerCount('SIGTERM')],
      listeners,
    );
  } finally {
    rmSync(projectPath, { recursive: true, force: true });
  }
});
