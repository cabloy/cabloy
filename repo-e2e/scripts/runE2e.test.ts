import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, readFileSync, realpathSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import test from 'node:test';

import { runPlaywright } from './runE2e.ts';
import { buildSpecFilter, parseE2eArgs } from './runE2eArgs.ts';

function withCli(
  callback: (fixture: {
    rootDir: string;
    configFile: string;
    specsDir: string;
    outputFile: string;
  }) => void,
  exitCode = 0,
): void {
  const rootDir = mkdtempSync(resolve(tmpdir(), 'cabloy e2e café [x]+(y).$-'));
  try {
    const packageDir = resolve(rootDir, 'node_modules', '@playwright', 'test');
    const specsDir = resolve(rootDir, 'specs 中文 [selected]');
    const configFile = resolve(rootDir, 'config café [ui].ts');
    const outputFile = resolve(rootDir, 'observed argv.json');
    mkdirSync(packageDir, { recursive: true });
    mkdirSync(specsDir);
    writeFileSync(resolve(rootDir, 'package.json'), JSON.stringify({ type: 'module' }));
    writeFileSync(
      resolve(packageDir, 'package.json'),
      JSON.stringify({ name: '@playwright/test', exports: { './cli': './cli.cjs' } }),
    );
    writeFileSync(
      resolve(packageDir, 'cli.cjs'),
      `require('node:fs').writeFileSync(${JSON.stringify(outputFile)}, JSON.stringify({
        args: process.argv.slice(2), cwd: process.cwd(), execPath: process.execPath,
      })); process.exit(${exitCode});`,
    );
    for (const name of ['cabloy-basic', 'home-user-account']) {
      writeFileSync(resolve(specsDir, `${name}.spec.ts`), '');
    }
    callback({ rootDir, configFile, specsDir, outputFile });
  } finally {
    rmSync(rootDir, { recursive: true, force: true });
  }
}

test('launches the resolved JavaScript CLI through Node without a shell in Unicode/space paths', () => {
  withCli(fixture => {
    const playwrightArgs = [
      '--grep',
      'café 中文 "quoted" & $HOME; $(not-a-command) | > ignored',
      '--trace=retain-on-failure',
      '--output',
      'artifacts with spaces 中文',
    ];
    runPlaywright({
      ...fixture,
      parsed: parseE2eArgs(
        ['cabloy-basic', 'home-user-account', ...playwrightArgs],
        fixture.specsDir,
      ),
    });
    const observed = JSON.parse(readFileSync(fixture.outputFile, 'utf8'));
    assert.equal(observed.cwd, realpathSync(fixture.rootDir));
    assert.equal(observed.execPath, process.execPath);
    assert.deepEqual(observed.args, [
      'test',
      '--config',
      fixture.configFile,
      buildSpecFilter(resolve(fixture.specsDir, 'cabloy-basic.spec.ts')),
      buildSpecFilter(resolve(fixture.specsDir, 'home-user-account.spec.ts')),
      ...playwrightArgs,
    ]);
    for (let index = 0; index < 2; index++) {
      const name = ['cabloy-basic', 'home-user-account'][index];
      const selectedPath = resolve(fixture.specsDir, `${name}.spec.ts`).replaceAll('\\', '/');
      const filter = new RegExp(observed.args[3 + index]);
      assert.match(selectedPath, filter);
      assert.doesNotMatch(`${selectedPath}.unselected`, filter);
      assert.doesNotMatch(selectedPath.replace('.spec.ts', 'XspecXts'), filter);
    }
  });
});

test('keeps all-spec discovery and combines tags without changing additional arguments', () => {
  withCli(fixture => {
    runPlaywright({
      ...fixture,
      parsed: parseE2eArgs(['--tag', '@web', '--grep=@flow', '--list'], fixture.specsDir),
    });
    const observed = JSON.parse(readFileSync(fixture.outputFile, 'utf8'));
    assert.deepEqual(observed.args, [
      'test',
      '--config',
      fixture.configFile,
      '--grep=(?=.*(?:@flow))(?=.*@web)',
      '--list',
    ]);
  });
});

test('propagates the Playwright CLI failure rather than reporting a successful launch', () => {
  withCli(fixture => {
    assert.throws(
      () => runPlaywright({ ...fixture, parsed: parseE2eArgs([], fixture.specsDir) }),
      (error: Error & { status?: number }) => error.status === 23,
    );
  }, 23);
});
