import type { IModule, ISuite } from '@cabloy/module-info';

import { parseInfoPro } from '@cabloy/module-info';
import assert from 'node:assert/strict';
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { test } from 'node:test';

import { glob } from '../src/index.ts';
import { bindSuitesModules } from '../src/suites.ts';

function createModule(name: string, root: string): IModule {
  const info = parseInfoPro(name, 'vona', 'module');
  assert.ok(info);
  return { name, info, root, pkg: '', package: { name, version: '1.0.0' } };
}

function createSuite(name: string, root: string): ISuite {
  const info = parseInfoPro(name, 'vona', 'suite');
  assert.ok(info);
  return { name, info, root, pkg: '', package: { name, version: '1.0.0' }, modules: [] };
}

for (const [platform, paths, projectPath] of [
  ['POSIX', path.posix, '/project with spaces/vona'],
  ['Windows', path.win32, 'C:\\project with spaces\\vona'],
] as const) {
  for (const directory of ['suite', 'suite-vendor']) {
    test(`binds ${platform} ${directory} members without duplicate standalone checks`, () => {
      const root = paths.join(projectPath, 'src', directory, 'a-example');
      const suite = createSuite('a-example', root);
      const first = createModule('a-first', paths.join(root, 'modules', 'a-first'));
      const second = createModule('a-second', paths.join(root, 'modules', 'a-second'));
      const standalone = createModule(
        'a-standalone',
        paths.join(projectPath, 'src', 'module', 'a-standalone'),
      );
      const orphan = createModule(
        'a-orphan',
        paths.join(projectPath, 'src', directory, 'a-missing', 'modules', 'a-orphan'),
      );
      const suites = { 'a-example': suite };
      const modules = {
        'a-first': first,
        'a-second': second,
        'a-standalone': standalone,
        'a-orphan': orphan,
      };

      bindSuitesModules(suites, modules);

      assert.equal(first.suite, 'a-example');
      assert.equal(second.suite, 'a-example');
      assert.deepEqual(suite.modules, ['a-first', 'a-second']);
      assert.equal(first.root, paths.join(root, 'modules', 'a-first'));
      assert.equal(standalone.suite, undefined);
      assert.equal('a-orphan' in modules, false);
      const independent = Object.values(modules).filter(
        item => !item.suite && !item.info.node_modules,
      );
      assert.deepEqual(
        independent.map(item => item.name),
        ['a-standalone'],
      );
      assert.equal(1 + Object.keys(suites).length + independent.length, 3);
    });
  }
}

test('glob binds suite members and excludes members of disabled suites', async () => {
  const projectPath = await mkdtemp(path.join(tmpdir(), 'cabloy-module-glob-'));
  try {
    for (const directory of [
      'src/suite/a-local',
      'src/suite/a-local/modules/a-first',
      'src/suite-vendor/a-vendor',
      'src/suite-vendor/a-vendor/modules/a-second',
      'src/module/a-standalone',
    ]) {
      const root = path.join(projectPath, directory);
      await mkdir(root, { recursive: true });
      await writeFile(
        path.join(root, 'package.json'),
        JSON.stringify({ name: directory.split('/').at(-1), version: '1.0.0' }),
      );
    }
    const options = { projectPath, projectMode: 'vona', log: false } as const;
    const meta = await glob(options);
    assert.equal(meta.modules['a-first'].suite, 'a-local');
    assert.equal(meta.modules['a-second'].suite, 'a-vendor');
    assert.deepEqual(meta.suites['a-local'].modules, ['a-first']);
    assert.deepEqual(meta.suites['a-vendor'].modules, ['a-second']);
    assert.deepEqual(
      meta.modulesArray.filter(item => !item.suite).map(item => item.name),
      ['a-standalone'],
    );

    const disabled = await glob({ ...options, disabledSuites: ['a-local', 'a-vendor'] });
    assert.deepEqual(Object.keys(disabled.suites), []);
    assert.deepEqual(
      disabled.modulesArray.map(item => item.name),
      ['a-standalone'],
    );
  } finally {
    await rm(projectPath, { recursive: true, force: true });
  }
});
