import assert from 'node:assert/strict';
import { mkdir, mkdtemp, readFile, realpath, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { it } from 'node:test';

import { CliBinBuildRest } from '../src/lib/bean/cli.bin.buildRest.ts';

const isolatedKeys = [
  'ZOVA_ISOLATED',
  'ZOVA_RUNTIME_DIR',
  'ZOVA_QUASAR_ROOT',
  'ZOVA_QUASAR_CACHE',
  'ZOVA_QUASAR_CONFIG_DIR',
  'ZOVA_REST_DIR',
  'ZOVA_REST_TSCONFIG',
  'ZOVA_REST_OUTDIR',
];

async function withFixture(run: (projectPath: string, cli: CliBinBuildRest) => Promise<void>) {
  const previous = Object.fromEntries(
    [
      ...isolatedKeys,
      'NODE_ENV',
      'META_FLAVOR',
      'META_MODE',
      'META_APP_MODE',
      'DEV',
      'PROD',
      'SSR',
    ].map(key => [key, process.env[key]]),
  );
  for (const key of isolatedKeys) delete process.env[key];
  const projectPath = await mkdtemp(path.join(os.tmpdir(), 'rest-cli-'));
  try {
    const cli = Object.create(CliBinBuildRest.prototype) as CliBinBuildRest;
    Object.defineProperty(cli, 'options', {
      value: { context: { argv: { projectPath, _: [] } } },
    });
    // Metadata was already loaded by the CLI dispatcher. Do not scan dependencies.
    cli.modulesMeta = {} as any;
    await writeFile(path.join(projectPath, 'package.json'), JSON.stringify({ scripts: {} }));
    for (const dir of ['.zova', '.zova-rest', 'dist/rest-admin']) {
      await mkdir(path.join(projectPath, dir), { recursive: true });
      await writeFile(path.join(projectPath, dir, 'sentinel'), 'shared');
    }
    await run(projectPath, cli);
  } finally {
    for (const [key, value] of Object.entries(previous)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
    await rm(projectPath, { recursive: true, force: true });
  }
}

async function assertSharedUntouched(projectPath: string) {
  for (const dir of ['.zova', '.zova-rest', 'dist/rest-admin']) {
    assert.equal(await readFile(path.join(projectPath, dir, 'sentinel'), 'utf8'), 'shared');
  }
}

async function declareHook(projectPath: string, exitCode = 0) {
  await writeFile(
    path.join(projectPath, 'package.json'),
    JSON.stringify({
      scripts: { 'build:isolated': 'node hook.mjs' },
    }),
  );
  await writeFile(
    path.join(projectPath, 'hook.mjs'),
    `
    import { writeFileSync } from 'node:fs';
    writeFileSync('called.json', JSON.stringify({ cwd: process.cwd(), args: process.argv.slice(2) }));
    process.exitCode = ${exitCode};
  `,
  );
}

it('public REST delegates once through the app hook with default/selected flavor and project cwd', async () => {
  for (const flavor of [undefined, 'cabloyBasicWeb']) {
    await withFixture(async (projectPath, cli) => {
      await declareHook(projectPath);
      cli.context.argv.flavor = flavor;
      cli._prepareResources = async () => {
        assert.fail('delegation must not prepare a leaf');
      };
      cli._build = async () => {
        assert.fail('delegation must not compile');
      };
      await cli.execute();
      assert.deepEqual(JSON.parse(await readFile(path.join(projectPath, 'called.json'), 'utf8')), {
        cwd: await realpath(projectPath),
        args: ['--operation', 'rest', flavor ?? 'admin'],
      });
      await assertSharedUntouched(projectPath);
    });
  }
});

it('declared invalid or failing hooks fail visibly without legacy fallback', async () => {
  for (const hook of ['', 42, null, 'failing']) {
    await withFixture(async (projectPath, cli) => {
      if (hook === 'failing') {
        await declareHook(projectPath, 7);
      } else {
        await writeFile(
          path.join(projectPath, 'package.json'),
          JSON.stringify({
            scripts: { 'build:isolated': hook },
          }),
        );
      }
      cli._prepareResources = async () => {
        assert.fail('must not fall back to legacy preparation');
      };
      cli._build = async () => {
        assert.fail('must not fall back to compilation');
      };
      await assert.rejects(cli.execute(), hook === 'failing' ? /exit code: 7/ : /non-empty string/);
      await assertSharedUntouched(projectPath);
    });
  }
});

it('external apps without a coordinator retain the ordinary REST lifecycle', () =>
  withFixture(async (projectPath, cli) => {
    const events: string[] = [];
    cli._prepareResources = async (context, runtimeDir) => {
      events.push('prepare');
      assert.equal(context.isolated, false);
      assert.equal(context.srcDir, path.join(projectPath, '.zova-rest'));
      assert.equal(context.outDir, path.join(projectPath, 'dist/rest-admin'));
      assert.equal(runtimeDir, '.zova');
    };
    cli._build = async () => {
      events.push('build');
    };
    await cli.execute();
    assert.deepEqual(events, ['prepare', 'build']);
    await assert.rejects(readFile(path.join(projectPath, '.zova-rest/sentinel')), {
      code: 'ENOENT',
    });
  }));

it('partial isolated environment fails before delegation or destructive writes', async () => {
  for (const key of isolatedKeys) {
    await withFixture(async (projectPath, cli) => {
      await declareHook(projectPath);
      process.env[key] = key === 'ZOVA_ISOLATED' ? 'true' : '.zova-build-test';
      await assert.rejects(cli.execute(), /[Ii]solated/);
      await assertSharedUntouched(projectPath);
      await assert.rejects(readFile(path.join(projectPath, 'called.json')), { code: 'ENOENT' });
    });
  }
});

async function isolate(projectPath: string) {
  Object.assign(process.env, {
    ZOVA_ISOLATED: 'true',
    ZOVA_RUNTIME_DIR: '.zova-build-test',
    ZOVA_QUASAR_ROOT: path.join(projectPath, '.quasar-build-test'),
    ZOVA_QUASAR_CACHE: path.join(projectPath, '.quasar-build-test/cache'),
    ZOVA_QUASAR_CONFIG_DIR: path.join(projectPath, '.quasar-build-test/config'),
    ZOVA_REST_DIR: '.zova-rest-build-test',
    ZOVA_REST_TSCONFIG: '.tsconfig.rest-build-test.json',
    ZOVA_REST_OUTDIR: path.join(projectPath, '.quasar-build-test/output/rest-admin'),
  });
  for (const dir of ['.zova-build-test', '.zova-rest-build-test', '.quasar-build-test']) {
    await mkdir(path.join(projectPath, dir));
  }
  await writeFile(
    path.join(projectPath, 'tsconfig.rest.json'),
    '{"include":["src/**/*",".zova-rest/**/*"]}',
  );
}

it('internal REST validates same-run paths before removing entries or outputs', () =>
  withFixture(async (projectPath, cli) => {
    await declareHook(projectPath);
    await isolate(projectPath);
    await mkdir(path.join(projectPath, '.zova-rest-build-test/entry'));
    await writeFile(path.join(projectPath, '.zova-rest-build-test/entry/sentinel'), 'owned');
    process.env.ZOVA_QUASAR_ROOT = path.join(projectPath, '.quasar-build-other');
    await assert.rejects(cli.execute(), /selected build run/);
    assert.equal(
      await readFile(path.join(projectPath, '.zova-rest-build-test/entry/sentinel'), 'utf8'),
      'owned',
    );
    await assertSharedUntouched(projectPath);
    await assert.rejects(readFile(path.join(projectPath, 'called.json')), { code: 'ENOENT' });
  }));

it('internal REST generates fresh private runtime before rendering and compiles directly without recursion', () =>
  withFixture(async (projectPath, cli) => {
    // An invalid public hook must not be consulted by the internal leaf.
    await writeFile(path.join(projectPath, 'package.json'), '{"scripts":{"build:isolated":null}}');
    await isolate(projectPath);
    const configDir = path.join(projectPath, 'src/front/config/config');
    await mkdir(configDir, { recursive: true });
    await writeFile(path.join(configDir, 'config.ts'), 'export default {};');
    await writeFile(path.join(configDir, 'config.admin.ts'), 'export default {};');
    await writeFile(path.join(projectPath, '.zova-build-test/config.ts'), 'stale other flavor');
    const events: string[] = [];
    Object.defineProperty(cli, 'template', {
      value: {
        resolveTemplatePath: () => 'rest',
        async renderDir(srcDir: string) {
          events.push('render');
          const config = await readFile(
            path.join(projectPath, '.zova-build-test/config.ts'),
            'utf8',
          );
          assert.match(config, /config\.admin\.ts/);
          assert.doesNotMatch(config, /stale/);
          const env = await readFile(path.join(projectPath, '.zova-build-test/env.ts'), 'utf8');
          assert.match(env, /"META_FLAVOR": "admin"/);
          assert.match(env, /"META_MODE": "production"/);
          assert.match(env, /"META_APP_MODE": "ssr"/);
          const utils = await readFile(
            path.join(projectPath, '.zova-build-test/app/utils.ts'),
            'utf8',
          );
          assert.match(utils, /from '\.\.\/config\.ts'/);
          assert.match(utils, /from '\.\.\/modules-meta\.ts'/);
          await writeFile(path.join(srcDir, 'package.json'), '{"name":"rest-test","version":"1"}');
        },
      },
    });
    cli._build = async context => {
      events.push('build');
      assert.equal(context.isolated, true);
      assert.equal(context.srcDir, path.join(projectPath, '.zova-rest-build-test/entry'));
      assert.equal(context.outDir, process.env.ZOVA_REST_OUTDIR);
      assert.equal(path.dirname(context.tsconfigPath), projectPath);
      assert.equal(
        JSON.parse(await readFile(context.tsconfigPath, 'utf8')).compilerOptions.rootDir,
        '.',
      );
    };
    await cli.execute();
    assert.deepEqual(events, ['render', 'build']);
    await assertSharedUntouched(projectPath);
  }));
