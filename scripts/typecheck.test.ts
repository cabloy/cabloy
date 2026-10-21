import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, realpathSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

import { CliBinTsc } from '../vona/packages-cli/cli-set-api/src/lib/bean/cli.bin.tsc.ts';
import {
  resolveTypeScriptCompiler,
  runTypeScript,
} from '../vona/packages-cli/cli-set-api/src/lib/typescriptRunner.ts';

const root = fileURLToPath(new URL('../', import.meta.url));

function writeCompiler(root: string, packageName: string, report?: string) {
  const dir = path.join(root, 'node_modules', packageName);
  mkdirSync(dir, { recursive: true });
  writeFileSync(
    path.join(dir, 'package.json'),
    JSON.stringify({ name: 'typescript', bin: { tsc: 'compiler.cjs' } }),
  );
  writeFileSync(
    path.join(dir, 'compiler.cjs'),
    `
    const fs = require('node:fs');
    if (process.argv[2] === '--fail') process.exit(3);
    const report = ${JSON.stringify(report)};
    if (report) fs.appendFileSync(report, JSON.stringify({ cwd: process.cwd(), args: process.argv.slice(2), compiler: ${JSON.stringify(packageName)} }) + '\\n');
  `,
  );
  return path.join(dir, 'compiler.cjs');
}

test('selects exact packages, preserving compiler argv, cwd and failures', async () => {
  const dir = realpathSync(mkdtempSync(path.join(tmpdir(), 'cabloy-typecheck-')));
  try {
    const projectPath = path.join(dir, 'project with spaces');
    mkdirSync(projectPath);
    await assert.rejects(
      runTypeScript('native', [], { projectPath }),
      /Cannot resolve @typescript\/native/,
    );
    const report = path.join(dir, 'calls.jsonl');
    const native = writeCompiler(dir, '@typescript/native', report);
    const legacy = writeCompiler(projectPath, 'typescript');
    assert.equal(resolveTypeScriptCompiler('native', projectPath), native);
    assert.equal(resolveTypeScriptCompiler('typescript', projectPath), legacy);
    const args = ['--project', 'file with spaces.json', 'literal;argument', '$unchanged'];
    await runTypeScript('native', args, { projectPath });
    assert.deepEqual(JSON.parse(readFileSync(report, 'utf8')), {
      cwd: projectPath,
      args,
      compiler: '@typescript/native',
    });
    await assert.rejects(runTypeScript('native', ['--fail'], { projectPath }), { exitCode: 3 });
    await assert.rejects(
      runTypeScript('native', [], { projectPath, cwd: path.join(dir, 'missing') }),
      { code: 'ENOENT' },
    );
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('Vona keeps its legacy default and visits the same graph with native', async () => {
  const dir = realpathSync(mkdtempSync(path.join(tmpdir(), 'cabloy-check-graph-')));
  try {
    const report = path.join(dir, 'calls.jsonl');
    writeCompiler(dir, '@typescript/native', report);
    const suiteRoot = path.join(dir, 'suite');
    const moduleRoot = path.join(dir, 'standalone');
    mkdirSync(suiteRoot);
    mkdirSync(moduleRoot);
    const calls: unknown[] = [];
    const cli = Object.create(CliBinTsc.prototype);
    Object.defineProperties(cli, {
      modulesMeta: {
        value: {
          suites: {
            local: { root: suiteRoot, info: { originalName: 'local' } },
            external: { info: { node_modules: true } },
          },
          modulesArray: [
            { root: moduleRoot, info: { originalName: 'standalone' } },
            { suite: 'local', info: {} },
            { info: { node_modules: true } },
          ],
        },
      },
      helper: {
        value: {
          processHelper: {
            tsc: async (...args: unknown[]) => {
              calls.push(args);
            },
          },
        },
      },
    });
    await cli._tsc(dir, false);
    assert.deepEqual(
      calls,
      [dir, suiteRoot, moduleRoot].map(cwd => [['-b'], { cwd }]),
    );
    for (const force of [false, true]) {
      for (const builders of [undefined, 1, 2]) {
        writeFileSync(report, '');
        await cli._tsc(dir, force, 'native', builders);
        const nativeCalls = readFileSync(report, 'utf8')
          .trim()
          .split('\n')
          .map(line => JSON.parse(line));
        const args = force ? ['-b', '--force'] : ['-b'];
        if (builders !== undefined) args.push('--builders', String(builders));
        assert.deepEqual(
          nativeCalls,
          [dir, suiteRoot, moduleRoot].map(cwd => ({
            cwd,
            args,
            compiler: '@typescript/native',
          })),
        );
      }
    }
    assert.equal(calls.length, 3, 'native must not use the legacy binary helper');
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('Vona rejects invalid or legacy builder limits before starting compilation', async () => {
  const cli = Object.create(CliBinTsc.prototype);
  for (const builders of [0, -1, 1.5, Number.NaN, Infinity, Number.MAX_SAFE_INTEGER + 1]) {
    await assert.rejects(cli._tsc(root, true, 'native', builders), /positive safe integer/);
  }
  await assert.rejects(cli._tsc(root, true, 'typescript', 1), /requires --compiler=native/);
});

test('root commands retain optional native checks and use legacy in CI', () => {
  const scripts = JSON.parse(readFileSync(path.join(root, 'package.json'), 'utf8')).scripts;
  const vonaScripts = JSON.parse(
    readFileSync(path.join(root, 'vona/package.original.json'), 'utf8'),
  ).scripts;
  assert.equal(scripts.tsc, 'npm run tsc:native');
  assert.equal(scripts['tsc:native'], 'npm run tsc:zova:native && npm run tsc:vona:native');
  assert.equal(scripts['tsc:force'], 'npm run tsc:zova:native && npm run tsc:vona:native:force');
  assert.equal(scripts['tsc:vona:native'], 'pnpm --dir vona run tsc:native');
  assert.equal(scripts['tsc:vona:native:force'], 'pnpm --dir vona run tsc:native:force');
  assert.equal(
    vonaScripts['tsc:native'],
    'npm run prerun && npm run vona :bin:tsc -- --compiler=native',
  );
  assert.equal(vonaScripts['tsc:native:force'], `${vonaScripts['tsc:native']} --force`);
  assert.equal(vonaScripts['tsc:legacy'], 'npm run prerun && npm run vona :bin:tsc -- --force');
  assert.equal(scripts['tsc:legacy'], 'npm run tsc:zova:legacy && pnpm --dir vona run tsc:legacy');
  assert.equal(
    scripts['tsc:zova:legacy'],
    'node scripts/typecheck.ts typescript zova --noEmit --incremental false --project tsconfig.vue-tsc.json',
  );
  const workflow = readFileSync(path.join(root, '.github/workflows/vona-tsc.yml'), 'utf8');
  assert.match(workflow, /run: npm run tsc:legacy\s*$/m);
  assert.doesNotMatch(workflow, /run:.*tsc(?::[\w-]+)*native|npm run tsc:force/);
});

test('release dry-run keeps default checks before publishing only', () => {
  for (const [mode, shouldCheck] of [
    ['--publish-only', true],
    ['--changelog-only', false],
    ['--release-only', false],
  ] as const) {
    const result = spawnSync(process.execPath, ['scripts/release.ts', '--dry-run', mode], {
      cwd: root,
      encoding: 'utf8',
      timeout: 30_000,
    });
    assert.equal(result.error, undefined);
    assert.equal(result.status, 0, result.stderr);
    const lines = result.stdout.split(/\r?\n/).map(line => line.trim());
    const check = lines.indexOf('[dry-run] npm run tsc');
    assert.equal(check !== -1, shouldCheck, mode);
    if (shouldCheck) {
      assert.ok(lines.indexOf('[dry-run] npm publish') > check);
    }
  }
});

test('installation retains TS5 APIs and exact stable native compiler', () => {
  for (const workspace of ['.', 'vona', 'zova']) {
    const require = createRequire(path.join(root, workspace, 'package.json'));
    const ts = require('typescript');
    assert.equal(ts.version, '5.9.3');
    assert.equal(typeof ts.createSourceFile, 'function');
    assert.match(ts.transpileModule('const value: number = 1;', {}).outputText, /value/);
  }
  const require = createRequire(path.join(root, 'package.json'));
  assert.equal(require('@typescript/native/package.json').version, '7.0.2');
});
