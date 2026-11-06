import assert from 'node:assert/strict';
import { mkdir, mkdtemp, readFile, rm, symlink, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { it } from 'node:test';
import ts from 'typescript';

import {
  resolveRestBuildPaths,
  writeIsolatedRestTsconfig,
} from '../src/lib/common/restBuildPaths.ts';

async function withFixture(
  callback: (projectPath: string, env: Record<string, string | undefined>) => Promise<void>,
) {
  const projectPath = await mkdtemp(path.join(os.tmpdir(), 'rest-build-paths-'));
  const env = {
    ZOVA_ISOLATED: 'true',
    ZOVA_RUNTIME_DIR: '.zova-build-test',
    ZOVA_QUASAR_ROOT: path.join(projectPath, '.quasar-build-test'),
    ZOVA_QUASAR_CACHE: path.join(projectPath, '.quasar-build-test/cache'),
    ZOVA_QUASAR_CONFIG_DIR: path.join(projectPath, '.quasar-build-test/config'),
    ZOVA_REST_DIR: '.zova-rest-build-test',
    ZOVA_REST_TSCONFIG: '.tsconfig.rest-build-test.json',
    ZOVA_REST_OUTDIR: path.join(projectPath, '.quasar-build-test/output/rest-web'),
  };
  try {
    for (const dir of ['.zova-build-test', '.zova-rest-build-test', '.quasar-build-test']) {
      await mkdir(path.join(projectPath, dir));
    }
    await callback(projectPath, env);
  } finally {
    await rm(projectPath, { recursive: true, force: true });
  }
}

it('keeps ordinary REST paths unchanged when no isolated environment is supplied', () =>
  withFixture(async projectPath => {
    const paths = await resolveRestBuildPaths(projectPath, 'web', '.zova', {});
    assert.equal(paths.srcDir, path.join(projectPath, '.zova-rest'));
    assert.equal(paths.outDir, path.join(projectPath, 'dist/rest-web'));
    assert.equal(paths.tsconfigPath, path.join(projectPath, 'tsconfig.rest.json'));
  }));

it('rejects incomplete, escaping and symlinked isolated paths before writes', () =>
  withFixture(async (projectPath, env) => {
    await assert.rejects(resolveRestBuildPaths(projectPath, 'web', '.zova', env));
    await assert.rejects(
      resolveRestBuildPaths(projectPath, 'web', '.zova-build-test', {
        ...env,
        ZOVA_REST_DIR: undefined,
      }),
    );
    await assert.rejects(
      resolveRestBuildPaths(projectPath, 'web', '.zova-build-test', {
        ...env,
        ZOVA_REST_OUTDIR: path.join(projectPath, 'dist/rest-web'),
      }),
    );
    await symlink(
      path.join(projectPath, '.zova-build-test'),
      path.join(projectPath, '.zova-rest-build-test/entry'),
      'dir',
    );
    await assert.rejects(
      resolveRestBuildPaths(projectPath, 'web', '.zova-build-test', env),
      /symlink/,
    );
  }));

it('private tsconfig inherits compiler options and selects real source plus isolated entry only', () =>
  withFixture(async (projectPath, env) => {
    const base = {
      compilerOptions: { strict: true, allowImportingTsExtensions: true, noEmit: true },
      include: ['src/**/*', 'src/**/.metadata/**/*', '.zova-rest/**/*', 'packages-zova/**/*'],
    };
    await writeFile(path.join(projectPath, 'tsconfig.rest.json'), JSON.stringify(base));
    const paths = await resolveRestBuildPaths(projectPath, 'web', '.zova-build-test', env);
    for (const file of [
      'src/main.ts',
      'src/module/.metadata/index.ts',
      'packages-zova/core/index.ts',
      '.zova-rest/index.ts',
      '.zova-rest-build-test/entry/index.ts',
    ]) {
      await mkdir(path.dirname(path.join(projectPath, file)), { recursive: true });
      await writeFile(path.join(projectPath, file), 'export {};');
    }
    await writeIsolatedRestTsconfig(projectPath, paths);
    const config = ts.readConfigFile(paths.tsconfigPath, ts.sys.readFile);
    const parsed = ts.parseJsonConfigFileContent(
      config.config,
      ts.sys,
      path.dirname(paths.tsconfigPath),
    );
    assert.deepEqual(parsed.errors, []);
    assert.equal(parsed.options.strict, true);
    assert.equal(parsed.options.rootDir, projectPath);
    assert.deepEqual(parsed.fileNames.map(file => path.relative(projectPath, file)).sort(), [
      '.zova-rest-build-test/entry/index.ts',
      'packages-zova/core/index.ts',
      'src/main.ts',
      'src/module/.metadata/index.ts',
    ]);
    assert.deepEqual(
      JSON.parse(await readFile(path.join(projectPath, 'tsconfig.rest.json'), 'utf8')),
      base,
    );
  }));
