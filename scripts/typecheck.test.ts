import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, realpathSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

import { commands } from '../vona/packages-cli/cli-set-api/src/lib/commands.ts';
import { resolveTypeScriptCompiler, runTypeScript } from './typescriptRunner.ts';

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

test('Vona command discovery omits the retired typecheck CLI and retains builds', () => {
  assert.equal(Object.hasOwn(commands.bin, 'tsc'), false);
  assert.equal(commands.bin.build.bean, 'bin.build');
  assert.equal(commands.bin.buildModule.bean, 'bin.buildModule');
  assert.equal(commands.bin.buildGeneral.bean, 'bin.buildGeneral');
});

test('daily checks and CI use single-project workspace defaults', () => {
  const scripts = JSON.parse(readFileSync(path.join(root, 'package.json'), 'utf8')).scripts;
  const vonaScripts = JSON.parse(
    readFileSync(path.join(root, 'vona/package.original.json'), 'utf8'),
  ).scripts;
  assert.deepEqual(
    Object.keys(scripts)
      .filter(name => name === 'tsc' || name.startsWith('tsc:'))
      .sort(),
    ['tsc', 'tsc:vona', 'tsc:zova'],
  );
  assert.equal(scripts.tsc, 'npm run tsc:zova && npm run tsc:vona');
  assert.equal(scripts['tsc:zova'], 'pnpm --dir zova run tsc');
  assert.equal(scripts['tsc:vona'], 'pnpm --dir vona run tsc');
  assert.equal(vonaScripts['tsc:native:force'], undefined);
  for (const workspace of ['vona', 'zova']) {
    const workspaceScripts = JSON.parse(
      readFileSync(path.join(root, workspace, 'package.original.json'), 'utf8'),
    ).scripts;
    const project = workspace === 'vona' ? 'tsconfig.json' : 'tsconfig.vue-tsc.json';
    assert.equal(workspaceScripts.tsc, 'npm run tsc:native');
    assert.equal(workspaceScripts.prerun, `npm run ${workspace} :tools:deps`);
    for (const [variant, compiler] of [
      ['native', 'native'],
      ['legacy', 'typescript'],
    ]) {
      assert.equal(
        workspaceScripts[`tsc:${variant}`],
        `npm run prerun && node ../scripts/typecheck.ts ${compiler} ${workspace} --noEmit --incremental false --project ${project}`,
      );
    }
    assert.deepEqual(
      JSON.parse(readFileSync(path.join(root, workspace, 'package.json'), 'utf8')).scripts,
      workspaceScripts,
    );
    if (workspace === 'zova') {
      for (const [name, command] of Object.entries(workspaceScripts)) {
        if (
          name.startsWith('dev:') ||
          name.startsWith('build:spa') ||
          name.startsWith('build:ssr:') ||
          name.startsWith('build:rest:')
        ) {
          if (name.endsWith('Batch')) continue;
          assert.ok(
            (command as string).startsWith('npm run prerun && '),
            `${name} must prepare without an automatic typecheck`,
          );
        }
      }
    }
  }
  const workflow = readFileSync(path.join(root, '.github/workflows/vona-tsc.yml'), 'utf8');
  assert.match(workflow, /run: npm run tsc\s*$/m);
  assert.doesNotMatch(workflow, /run:.*\btsc:[\w-]+/);
});

test('Vona daily config discovers source and tests without changing publication config', () => {
  const require = createRequire(path.join(root, 'vona/package.json'));
  const ts = require('typescript');
  const configFile = path.join(root, 'vona/tsconfig.json');
  const config = JSON.parse(readFileSync(configFile, 'utf8'));
  assert.equal(config.include, undefined);
  assert.equal(config.references, undefined);
  const host = {
    ...ts.sys,
    onUnRecoverableConfigFileDiagnostic(diagnostic) {
      assert.fail(ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n'));
    },
  };
  const parsed = ts.getParsedCommandLineOfConfigFile(configFile, {}, host);
  assert.deepEqual(parsed.errors, []);
  assert.equal(parsed.projectReferences, undefined);
  assert.equal(parsed.options.noEmit, true);
  assert.equal(parsed.options.composite, false);
  assert.equal(parsed.options.declaration, false);
  assert.equal(parsed.options.declarationMap, false);
  const files = new Set(
    parsed.fileNames.map(file =>
      path.relative(path.join(root, 'vona'), file).split(path.sep).join('/'),
    ),
  );
  for (const file of [
    'src/backend/typing/modules.d.ts',
    'src/suite/a-training/modules/training-student/src/index.ts',
    'src/suite/a-training/modules/training-student/test/student.test.ts',
    'src/suite-vendor/a-test/modules/test-vona/test/application.test.ts',
  ]) {
    assert.ok(files.has(file), `${file} must be discovered`);
  }
  for (const file of files) {
    assert.doesNotMatch(file, /(^|\/)(?:node_modules|dist|cli)\//);
    assert.doesNotMatch(
      file,
      /^(?:packages-cli|packages-utils|packages-vona|coverage|\.app[^/]*|\.vona[^/]*|\.zova-rest)\//,
    );
  }
  const publish = ts.getParsedCommandLineOfConfigFile(
    path.join(root, 'vona/src/suite/a-training/modules/training-student/tsconfig.build.json'),
    {},
    host,
  );
  assert.deepEqual(publish.errors, []);
  assert.equal(publish.options.composite, true);
  assert.equal(publish.options.declaration, true);
  assert.equal(publish.options.emitDeclarationOnly, true);
  assert.equal(publish.options.noEmit, false);
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
