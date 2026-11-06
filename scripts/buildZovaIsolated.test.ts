import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import {
  existsSync,
  linkSync,
  lstatSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readlinkSync,
  realpathSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

import {
  compilationEnv,
  copySnapshotTree,
  createBuildTargets,
  outputPlanEnv,
  publishBuildTargets,
  readOutputPlan,
  runPairedBuild,
  snapshotZova,
  validateBuildTargets,
  withBuildLock,
} from './buildZovaIsolated.ts';

const root = fileURLToPath(new URL('../', import.meta.url));

function fixture() {
  return realpathSync(mkdtempSync(path.join(tmpdir(), 'cabloy-build-zova-')));
}

function write(file: string, content: string) {
  mkdirSync(path.dirname(file), { recursive: true });
  writeFileSync(file, content);
}

function directoryLink(target: string, link: string) {
  symlinkSync(
    process.platform === 'win32' ? path.resolve(path.dirname(link), target) : target,
    link,
    process.platform === 'win32' ? 'junction' : 'dir',
  );
}

function fileLinkUnavailable(error: unknown) {
  return (
    process.platform === 'win32' &&
    ['EPERM', 'EACCES', 'ENOTSUP'].includes((error as NodeJS.ErrnoException).code ?? '')
  );
}

// Keep Windows startup prerequisites, but do not inherit application or test-mode
// overrides into a fixture whose dotenv files own those values.
function fixtureEnv(): NodeJS.ProcessEnv {
  return Object.fromEntries(
    Object.entries(process.env).filter(
      ([key]) =>
        !/^(?:APP_|BUILD_|SERVER_LISTEN_PORT$|NODE_ENV$|NODE_OPTIONS$|NODE_PATH$|FLAVOR$|META_|DEV$|PROD$|SSR$|VONA_TEST_|TEST_CLAIM_)/i.test(
          key,
        ),
    ),
  );
}

test('snapshots current files, metadata and nested dependencies without sharing writable files', async t => {
  const dir = fixture();
  try {
    const source = path.join(dir, 'zova');
    const snapshot = path.join(dir, 'snapshot');
    const files: Record<string, string> = {
      'src/current.ts': 'current dirty source',
      'src/untracked.ts': 'new untracked source',
      'src/.metadata/pages.ts': 'current generated metadata',
      'packages-utils/example/src/index.ts': 'workspace source',
      'packages-utils/example/types.d.ts': 'workspace declarations',
      'packages-utils/example/dist/index.js': 'workspace runtime dist',
      'packages-utils/example/node_modules/nested/dist/index.js': 'nested dependency runtime',
      'node_modules/dependency/dist/index.js': 'installed dependency runtime',
      'node_modules/dependency/node_modules/nested/index.js': 'deep installed dependency',
      'node_modules/.pnpm/package/node_modules/package/dist/index.js': 'installed store runtime',
    };
    for (const [file, content] of Object.entries(files)) write(path.join(source, file), content);
    const excluded = ['.zova', '.quasar', '.zova-rest', 'dist', 'dist-releases'];
    for (const name of excluded) write(path.join(source, name, 'dev-owned'), name);
    directoryLink('../packages-utils/example', path.join(source, 'node_modules/example'));
    directoryLink('example', path.join(source, 'node_modules/example-chain'));

    await snapshotZova(source, snapshot);

    for (const [file, content] of Object.entries(files)) {
      assert.equal(readFileSync(path.join(snapshot, file), 'utf8'), content, file);
      assert.equal(lstatSync(path.join(snapshot, file)).isFile(), true, file);
    }
    for (const name of excluded) {
      assert.equal(existsSync(path.join(snapshot, name)), false, name);
      assert.equal(readFileSync(path.join(source, name, 'dev-owned'), 'utf8'), name);
    }
    for (const name of ['example', 'example-chain']) {
      assert.equal(lstatSync(path.join(snapshot, 'node_modules', name)).isSymbolicLink(), true);
      assert.equal(
        realpathSync(path.join(snapshot, 'node_modules', name)),
        path.join(snapshot, 'packages-utils/example'),
      );
    }
    if (process.platform === 'win32') {
      assert.equal(
        path.isAbsolute(readlinkSync(path.join(snapshot, 'node_modules/example'))),
        true,
      );
    } else {
      assert.equal(
        readlinkSync(path.join(snapshot, 'node_modules/example')),
        '../packages-utils/example',
      );
    }
    for (const [file, original] of [
      ['src/current.ts', files['src/current.ts']],
      ['node_modules/dependency/dist/index.js', files['node_modules/dependency/dist/index.js']],
      ['node_modules/example/types.d.ts', files['packages-utils/example/types.d.ts']],
    ]) {
      writeFileSync(path.join(snapshot, file), 'snapshot-only change');
      assert.equal(readFileSync(path.join(source, file), 'utf8'), original);
    }

    await t.test(
      'internal source file links are contained and independently writable',
      async fileTest => {
        const link = path.join(source, 'src/.metadata/modules.d.ts');
        try {
          symlinkSync(path.join(source, 'packages-utils/example/types.d.ts'), link, 'file');
        } catch (error) {
          if (!fileLinkUnavailable(error)) throw error;
          fileTest.skip('Creating source file symlinks requires Windows symlink privileges');
          return;
        }
        const fileSnapshot = path.join(dir, 'file-link-snapshot');
        await snapshotZova(source, fileSnapshot);
        const copiedLink = path.join(fileSnapshot, 'src/.metadata/modules.d.ts');
        assert.equal(readFileSync(copiedLink, 'utf8'), files['packages-utils/example/types.d.ts']);
        if (process.platform === 'win32') {
          assert.equal(lstatSync(copiedLink).isSymbolicLink(), false);
          assert.equal(lstatSync(copiedLink).nlink, 1);
        } else {
          assert.equal(
            realpathSync(copiedLink),
            path.join(fileSnapshot, 'packages-utils/example/types.d.ts'),
          );
        }
        writeFileSync(copiedLink, 'file-link snapshot-only change');
        assert.equal(readFileSync(link, 'utf8'), files['packages-utils/example/types.d.ts']);
        if (process.platform === 'win32') {
          assert.equal(
            readFileSync(path.join(fileSnapshot, 'packages-utils/example/types.d.ts'), 'utf8'),
            files['packages-utils/example/types.d.ts'],
            'a Windows file-link copy must not alias even the snapshot target',
          );
        }
      },
    );
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('rejects both relative and absolute symlinks escaping the snapshot source', async () => {
  const dir = fixture();
  try {
    const external = path.join(dir, 'external', 'index.js');
    write(external, 'external dependency must remain untouched');
    for (const [name, link] of [
      ['relative', '../../external'],
      ['absolute', path.dirname(external)],
    ]) {
      const source = path.join(dir, name);
      mkdirSync(path.join(source, 'node_modules'), { recursive: true });
      directoryLink(link, path.join(source, 'node_modules/external'));
      await assert.rejects(
        copySnapshotTree(source, path.join(dir, `${name}-snapshot`)),
        /external|outside|escape|symlink|link/i,
      );
      assert.equal(readFileSync(external, 'utf8'), 'external dependency must remain untouched');
    }
    for (const name of ['broken', 'cycle', 'chained-escape']) {
      const source = path.join(dir, name);
      mkdirSync(source);
      if (name === 'broken') {
        directoryLink('missing', path.join(source, 'link'));
      } else if (name === 'cycle') {
        directoryLink('second', path.join(source, 'first'));
        directoryLink('first', path.join(source, 'second'));
      } else {
        directoryLink(path.dirname(external), path.join(source, 'escape'));
        directoryLink('escape', path.join(source, 'link'));
      }
      await assert.rejects(copySnapshotTree(source, path.join(dir, `${name}-snapshot`)));
    }
    assert.equal(readFileSync(external, 'utf8'), 'external dependency must remain untouched');
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('production compilation suppresses dotenv output-copy controls without changing application identity', () => {
  const dir = fixture();
  try {
    write(
      path.join(dir, 'env/.env'),
      [
        'APP_NAME=synthetic-build-test',
        'APP_VERSION=9.8.7',
        'SERVER_LISTEN_PORT=17102',
        'BUILD_OUTDIR=../must-not-write',
        'BUILD_COPY_DIST=../must-not-copy-dist',
        'BUILD_COPY_RELEASE=../must-not-copy-release',
        'BUILD_REST_COPY_DIST=../must-not-copy-rest',
      ].join('\n'),
    );
    write(path.join(dir, 'env/.env.production'), 'BUILD_TEST_MODE=production\n');
    write(path.join(dir, 'env/.env.development'), 'BUILD_TEST_MODE=development\n');
    const child = path.join(dir, 'load-environment.mjs');
    write(
      child,
      `import { createConfigUtils } from ${JSON.stringify(new URL('../zova/packages-utils/zova-vite/src/configUtils.ts', import.meta.url).href)};
const loaded = createConfigUtils(
  { mode: 'production', appMode: 'ssr', flavor: 'cabloyBasicWeb' },
  { appDir: process.cwd() },
).loadEnvs();
const keys = ['APP_NAME', 'APP_VERSION', 'SERVER_LISTEN_PORT', 'BUILD_TEST_MODE', 'NODE_ENV', 'META_MODE', 'META_APP_MODE', 'META_FLAVOR', 'BUILD_OUTDIR', 'BUILD_COPY_DIST', 'BUILD_COPY_RELEASE', 'BUILD_REST_COPY_DIST'];
process.stdout.write(JSON.stringify(Object.fromEntries(keys.map(key => [key, loaded[key]]))));
`,
    );
    const inherited = {
      ...fixtureEnv(),
      BUILD_COPY_DIST: 'inherited-copy',
      APP_VERSION: '9.8.7',
    };
    const before = { ...inherited };
    const privateOutDir = 'dist/ssr-cabloyBasicWeb';
    const env = compilationEnv(inherited, privateOutDir, 'cabloyBasicWeb');
    for (const invalidOutput of ['../must-not-write', path.join(dir, 'absolute-output')]) {
      assert.throws(
        () => compilationEnv(inherited, invalidOutput, 'cabloyBasicWeb'),
        /canonical private dist path/,
      );
    }
    assert.deepEqual(inherited, before);
    for (const key of ['SystemRoot', 'SYSTEMROOT', 'TEMP', 'TMP', 'PATH', 'Path']) {
      if (key in inherited) assert.equal(env[key], inherited[key]);
    }
    const result = spawnSync(process.execPath, [child], {
      cwd: dir,
      env,
      encoding: 'utf8',
      timeout: 15_000,
    });
    assert.equal(result.error, undefined);
    assert.equal(result.status, 0, result.stderr);
    assert.deepEqual(JSON.parse(result.stdout), {
      APP_NAME: 'synthetic-build-test',
      APP_VERSION: '9.8.7',
      SERVER_LISTEN_PORT: '17102',
      BUILD_TEST_MODE: 'production',
      NODE_ENV: 'production',
      META_MODE: 'production',
      META_APP_MODE: 'ssr',
      META_FLAVOR: 'cabloyBasicWeb',
      BUILD_OUTDIR: privateOutDir,
      BUILD_COPY_DIST: '',
      BUILD_COPY_RELEASE: '',
      BUILD_REST_COPY_DIST: '',
    });
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('output-plan results require one bounded regular file with exactly five strings', async t => {
  const dir = fixture();
  const plan = {
    appVersion: '9.8.7',
    buildOutDir: 'dist/custom web',
    buildCopyDist: '',
    buildCopyRelease: '',
    buildRestCopyDist: '',
  };
  try {
    const valid = path.join(dir, 'valid.json');
    write(valid, JSON.stringify(plan));
    assert.deepEqual(await readOutputPlan(valid), plan);
    const boundary = {
      ...plan,
      buildCopyDist: 'x'.repeat(64 * 1024 - Buffer.byteLength(JSON.stringify(plan))),
    };
    const boundaryFile = path.join(dir, 'boundary.json');
    write(boundaryFile, JSON.stringify(boundary));
    assert.equal(lstatSync(boundaryFile).size, 64 * 1024);
    assert.deepEqual(await readOutputPlan(boundaryFile), boundary);
    for (const [name, content] of [
      ['malformed', '{"appVersion":'],
      ['extra', JSON.stringify({ ...plan, unexpected: 'never expose loaded environment' })],
      ['missing-field', JSON.stringify({ ...plan, buildCopyRelease: undefined })],
      ['wrong-type', JSON.stringify({ ...plan, buildOutDir: 1 })],
      ['array', JSON.stringify(Object.values(plan))],
      ['null', 'null'],
      ['oversize', JSON.stringify({ ...boundary, buildCopyDist: `${boundary.buildCopyDist}x` })],
    ]) {
      const file = path.join(dir, `${name}.json`);
      write(file, content);
      await assert.rejects(readOutputPlan(file), undefined, name);
    }
    await assert.rejects(readOutputPlan(path.join(dir, 'absent.json')));
    await assert.rejects(readOutputPlan(dir));
    const hardlink = path.join(dir, 'hardlink.json');
    linkSync(valid, hardlink);
    await assert.rejects(readOutputPlan(hardlink), /single|link|regular/i);
    assert.equal(readFileSync(valid, 'utf8'), JSON.stringify(plan));

    await t.test(
      'rejects result file symlinks when source symlinks are available',
      async linkTest => {
        const symlink = path.join(dir, 'symlink.json');
        try {
          symlinkSync(valid, symlink, 'file');
        } catch (error) {
          if (!fileLinkUnavailable(error)) throw error;
          linkTest.skip('Creating source file symlinks requires Windows symlink privileges');
          return;
        }
        await assert.rejects(readOutputPlan(symlink), /link|regular/i);
      },
    );
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test(
  'Windows controlled environment keys discard aliases without changing unrelated values',
  { skip: process.platform !== 'win32' },
  () => {
    const inherited = {
      ...fixtureEnv(),
      node_env: 'test',
      Node_Env: 'development',
      flavor: 'inherited',
      meta_flavor: 'inherited',
      Meta_Mode: 'test',
      meta_app_mode: 'spa',
      build_outdir: '../unsafe',
      Build_Copy_Dist: '../unsafe',
      build_copy_release: '../unsafe',
      build_rest_copy_dist: '../unsafe',
      APP_NAME: 'preserved identity',
      SERVER_LISTEN_PORT: '17102',
      TEMP: 'preserved temp',
      SystemRoot: 'preserved system root',
    };
    const before = { ...inherited };
    const controls = {
      NODE_ENV: 'production',
      FLAVOR: 'cabloyBasicWeb',
      META_FLAVOR: 'cabloyBasicWeb',
      META_MODE: 'production',
      META_APP_MODE: 'ssr',
    };
    for (const [env, expected] of [
      [outputPlanEnv(inherited, 'cabloyBasicWeb'), controls],
      [
        compilationEnv(inherited, 'dist/ssr-cabloyBasicWeb', 'cabloyBasicWeb'),
        {
          ...controls,
          BUILD_OUTDIR: 'dist/ssr-cabloyBasicWeb',
          BUILD_COPY_DIST: '',
          BUILD_COPY_RELEASE: '',
          BUILD_REST_COPY_DIST: '',
        },
      ],
    ] as const) {
      for (const [key, value] of Object.entries(expected)) {
        assert.deepEqual(
          Object.keys(env).filter(name => name.toUpperCase() === key),
          [key],
        );
        assert.equal(env[key], value);
      }
      for (const key of ['APP_NAME', 'SERVER_LISTEN_PORT', 'TEMP', 'SystemRoot']) {
        assert.equal(env[key], inherited[key]);
      }
    }
    assert.deepEqual(inherited, before);
  },
);

test('paired builds publish sequentially only after SSR and REST succeed and clean up only their owned run', async () => {
  const dir = fixture();
  try {
    const devSentinel = path.join(dir, 'zova/.zova/dev-owned');
    const unrelated = path.join(dir, 'unrelated-run/owned-by-someone-else');
    write(devSentinel, 'live development runtime');
    write(unrelated, 'do not remove');
    for (const failAt of ['ssr', 'rest', undefined]) {
      const published = path.join(dir, 'published/sentinel');
      write(published, 'previous paired output');
      const events: string[] = [];
      let ownedRun = '';
      const run = withBuildLock(dir, async runDir => {
        ownedRun = runDir;
        assert.equal(existsSync(runDir), true);
        await assert.rejects(
          withBuildLock(dir, async () => assert.fail('a concurrent build must not start')),
          /build|lock|already|active/i,
        );
        assert.equal(existsSync(runDir), true, 'a rejected contender must preserve the active run');
        await runPairedBuild({
          flavor: 'cabloyBasicWeb',
          runSSR: async () => {
            events.push('ssr');
            write(path.join(runDir, 'ssr/index.js'), 'new SSR');
            await Promise.resolve();
            if (failAt === 'ssr') throw new Error('SSR fixture failure');
            events.push('ssr-complete');
          },
          runREST: async () => {
            events.push('rest');
            write(path.join(runDir, 'rest/index.js'), 'new REST');
            await Promise.resolve();
            if (failAt === 'rest') throw new Error('REST fixture failure');
            events.push('rest-complete');
          },
          publish: async () => {
            events.push('publish');
            writeFileSync(published, 'new paired output');
          },
        });
      });
      if (failAt) await assert.rejects(run, /fixture failure/);
      else await run;
      assert.deepEqual(
        events,
        failAt === 'ssr'
          ? ['ssr']
          : failAt === 'rest'
            ? ['ssr', 'ssr-complete', 'rest']
            : ['ssr', 'ssr-complete', 'rest', 'rest-complete', 'publish'],
      );
      assert.equal(
        readFileSync(published, 'utf8'),
        failAt ? 'previous paired output' : 'new paired output',
      );
      assert.equal(
        existsSync(ownedRun),
        false,
        'finished and failed runs must remove their scratch',
      );
      assert.equal(readFileSync(devSentinel, 'utf8'), 'live development runtime');
      assert.equal(readFileSync(unrelated, 'utf8'), 'do not remove');
    }
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('artifact targets preserve output names, reject unsafe destinations and roll back failed handoffs', async () => {
  const dir = fixture();
  try {
    const rootDir = path.join(dir, 'checkout');
    const zovaDir = path.join(rootDir, 'zova');
    const runDir = path.join(rootDir, 'run');
    const sources = { ssr: path.join(runDir, 'ssr'), rest: path.join(runDir, 'rest') };
    const options = { rootDir, zovaDir, runDir };
    write(path.join(sources.ssr, 'sentinel'), 'new SSR');
    write(path.join(sources.rest, 'sentinel'), 'new REST');
    mkdirSync(zovaDir, { recursive: true });
    const plan = {
      appVersion: '9.8.7',
      buildOutDir: '',
      buildCopyDist: '../../copies,../../second-copies',
      buildCopyRelease: '../../releases',
      buildRestCopyDist: '../../rest-copies',
    };
    const targets = createBuildTargets(zovaDir, 'cabloyBasicWeb', plan, sources);
    assert.deepEqual(
      targets
        .map(target => [
          target.source,
          path.relative(dir, target.destination).split(path.sep).join('/'),
        ])
        .sort(),
      [
        [sources.ssr, 'checkout/zova/dist/ssr-cabloyBasicWeb'],
        [sources.ssr, 'checkout/zova/dist-releases/ssr-cabloyBasicWeb-9.8.7'],
        [sources.ssr, 'copies/ssr-cabloyBasicWeb'],
        [sources.ssr, 'second-copies/ssr-cabloyBasicWeb'],
        [sources.ssr, 'releases/ssr-cabloyBasicWeb-9.8.7'],
        [sources.rest, 'checkout/zova/dist/rest-cabloyBasicWeb'],
        [sources.rest, 'checkout/zova/dist-releases/rest-cabloyBasicWeb-9.8.7'],
        [sources.rest, 'rest-copies/cabloy-basic-web'],
      ].sort(),
    );
    const custom = createBuildTargets(
      zovaDir,
      'cabloyBasicWeb',
      { ...plan, buildOutDir: 'custom-output/web' },
      sources,
    );
    assert.ok(
      custom.some(target => target.destination === path.join(zovaDir, 'custom-output/web')),
    );
    assert.ok(custom.some(target => target.destination === path.join(dir, 'copies/web')));
    await validateBuildTargets(targets, options);
    for (const destination of [
      zovaDir,
      path.join(zovaDir, 'src'),
      path.join(zovaDir, 'node_modules/pkg'),
      path.join(zovaDir, '.zova'),
    ]) {
      await assert.rejects(validateBuildTargets([{ source: sources.ssr, destination }], options));
    }
    await assert.rejects(
      validateBuildTargets(
        [
          { source: sources.ssr, destination: path.join(dir, 'overlap') },
          { source: sources.rest, destination: path.join(dir, 'overlap/child') },
        ],
        options,
      ),
      /overlap|ancestor|contain/i,
    );

    const handoff = [
      { source: sources.ssr, destination: path.join(zovaDir, 'dist/ssr-cabloyBasicWeb') },
      { source: sources.rest, destination: path.join(zovaDir, 'dist/rest-cabloyBasicWeb') },
    ];
    for (const target of handoff)
      write(path.join(target.destination, 'sentinel'), 'previous output');
    await assert.rejects(
      publishBuildTargets(
        [handoff[0], { ...handoff[1], source: path.join(runDir, 'missing-rest') }],
        options,
      ),
    );
    for (const target of handoff) {
      assert.equal(
        readFileSync(path.join(target.destination, 'sentinel'), 'utf8'),
        'previous output',
      );
    }
    await assert.rejects(
      publishBuildTargets(handoff, {
        ...options,
        beforeReplace: async (_target, index) => {
          if (index === 1) throw new Error('handoff fixture failure');
        },
      }),
      (error: unknown) => {
        assert.ok(error instanceof Error);
        assert.match(error.message, /previous outputs restored/);
        assert.ok(error.cause instanceof Error);
        assert.equal(error.cause.message, 'handoff fixture failure');
        return true;
      },
    );
    for (const target of handoff) {
      assert.equal(
        readFileSync(path.join(target.destination, 'sentinel'), 'utf8'),
        'previous output',
      );
    }
    await publishBuildTargets(handoff, options);
    assert.equal(readFileSync(path.join(handoff[0].destination, 'sentinel'), 'utf8'), 'new SSR');
    assert.equal(readFileSync(path.join(handoff[1].destination, 'sentinel'), 'utf8'), 'new REST');
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test(
  'Windows destinations reject protected case aliases, namespace paths and duplicate identities',
  { skip: process.platform !== 'win32' },
  async () => {
    const dir = fixture();
    try {
      const rootDir = path.join(dir, 'checkout');
      const zovaDir = path.join(rootDir, 'zova');
      const runDir = path.join(rootDir, 'run');
      const source = path.join(runDir, 'ssr');
      mkdirSync(zovaDir, { recursive: true });
      write(path.join(source, 'sentinel'), 'new SSR');
      const options = { rootDir, zovaDir, runDir };
      for (const destination of [
        path.join(dir, 'outside/NoDe_MoDuLeS/pkg'),
        path.join(dir, 'outside/.GiT/artifact'),
        path.join(dir, 'outside/.ZoVa/artifact'),
        path.join(dir, 'outside/RuN/artifact'),
        path.toNamespacedPath(path.join(dir, 'outside/artifact')),
        path.join(dir, 'outside/trailing-dot.'),
        path.join(dir, 'outside/trailing-space '),
      ]) {
        await assert.rejects(
          validateBuildTargets([{ source, destination }], options),
          undefined,
          destination,
        );
      }
      await assert.rejects(
        validateBuildTargets(
          [
            { source, destination: path.join(dir, 'outside/Artifact') },
            { source, destination: path.join(dir, 'outside/artifact') },
          ],
          options,
        ),
      );
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  },
);

test('ordinary root builds retain workspace mappings and isolation is explicitly selected', () => {
  const scripts = JSON.parse(readFileSync(path.join(root, 'package.json'), 'utf8')).scripts;
  assert.equal(scripts['build:zova:all'], 'npm run build:zova && npm run build:zova:commerce');
  assert.equal(scripts['build:zova'], 'pnpm --dir zova run build:ssr:cabloyBasicBatch');
  assert.equal(scripts['build:zova:commerce'], 'pnpm --dir zova run build:ssr:cabloyCommerceBatch');
  const mappings = {
    'build:zova:admin': 'cabloyBasicAdmin',
    'build:zova:web': 'cabloyBasicWeb',
    'build:zova:commerce:web': 'cabloyCommerce',
    'build:zova:commerce:admin': 'cabloyCommerceAdmin',
  };
  const workspaceScripts = JSON.parse(
    readFileSync(path.join(root, 'zova/package.original.json'), 'utf8'),
  ).scripts;
  for (const [name, flavor] of Object.entries(mappings)) {
    assert.equal(
      scripts[name],
      `pnpm --dir zova run build:ssr:${flavor} && pnpm --dir zova run build:rest:${flavor}`,
      name,
    );
    assert.ok(workspaceScripts[`build:ssr:${flavor}`]);
    assert.ok(workspaceScripts[`build:rest:${flavor}`]);
  }
  assert.ok(workspaceScripts['build:ssr:cabloyBasicBatch']);
  assert.ok(workspaceScripts['build:ssr:cabloyCommerceBatch']);
  assert.equal(scripts['build:zova:isolated'], 'node scripts/buildZovaIsolated.ts');
  assert.equal(scripts.build, 'npm run build:zova:all && npm run build:vona');
  assert.equal(scripts['build:docker'], 'npm run build:zova:all && npm run build:vona:docker');
  assert.equal(scripts['dev:zova:admin'], 'cd zova && npm run dev:ssr:cabloyBasicAdmin');
  assert.equal(scripts['dev:zova:web'], 'cd zova && npm run dev:ssr:cabloyBasicWeb');
  assert.equal(scripts['dev:zova:commerce:web'], 'cd zova && npm run dev:ssr:cabloyCommerce');
  assert.equal(
    scripts['dev:zova:commerce:admin'],
    'cd zova && npm run dev:ssr:cabloyCommerceAdmin',
  );
});
