import assert from 'node:assert/strict';
import { mkdtemp, mkdir, realpath, rm, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { createServer } from 'vite';

import {
  createZovaRuntimeResolverPlugin,
  resolveZovaLocalPath,
  resolveZovaRuntimeDir,
  resolveZovaViteContext,
} from '../src/zovaRuntimeResolver.ts';

function withEnv(t, env: Record<string, string | undefined>) {
  for (const [key, value] of Object.entries(env)) {
    const previous = process.env[key];
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
    t.after(() => {
      if (previous === undefined) delete process.env[key];
      else process.env[key] = previous;
    });
  }
}

test('runtime paths default compatibly and honor local overrides', t => {
  withEnv(t, { ZOVA_RUNTIME_DIR: undefined, ZOVA_ISOLATED: undefined });
  assert.equal(resolveZovaRuntimeDir(), '.zova');
  assert.equal(resolveZovaRuntimeDir('.zova-custom'), '.zova-custom');
  assert.equal(resolveZovaRuntimeDir('./.zova-custom'), '.zova-custom');
  assert.deepEqual(resolveZovaViteContext({ appDir: '/checkout/zova' }), {
    appDir: path.resolve('/checkout/zova'),
    runtimeDir: '.zova',
    runtimePath: path.resolve('/checkout/zova/.zova'),
    isolated: false,
  });
  process.env.ZOVA_RUNTIME_DIR = '.zova-build-1';
  process.env.ZOVA_ISOLATED = 'true';
  assert.equal(resolveZovaRuntimeDir('.zova'), '.zova-build-1');
  assert.equal(resolveZovaViteContext({ appDir: '/checkout/zova' }).isolated, true);
});

test('rejects empty, absolute, escaping and nested runtime directories', t => {
  withEnv(t, { ZOVA_RUNTIME_DIR: undefined, ZOVA_ISOLATED: undefined });
  for (const value of [
    '',
    '.',
    '..',
    '/',
    '/tmp/runtime',
    '../runtime',
    'x/../runtime',
    'x/runtime',
    'D:\\runtime',
    'D:runtime',
    '\\\\server\\runtime',
    '\\runtime',
    '.zova?raw',
    '.zova\0runtime',
  ]) {
    assert.throws(() => resolveZovaRuntimeDir(value), /Zova runtime directory/);
  }
  process.env.ZOVA_RUNTIME_DIR = '';
  assert.throws(() => resolveZovaRuntimeDir('.zova'), /Zova runtime directory/);
});

test('isolated runtime paths require an explicit owned sibling', t => {
  withEnv(t, { ZOVA_ISOLATED: 'true', ZOVA_RUNTIME_DIR: undefined });
  for (const value of [undefined, '.zova', 'src', '.zova-build-', '.zova-build-../src']) {
    assert.throws(() => resolveZovaRuntimeDir(value), /explicit .zova-build/);
  }
  assert.equal(resolveZovaRuntimeDir('.zova-build-ID-1'), '.zova-build-ID-1');
});

test('local sibling path validation rejects symlinks and non-directory roots', async () => {
  const appDir = await mkdtemp(path.join(tmpdir(), 'zova-local-path-'));
  try {
    assert.equal(
      resolveZovaLocalPath(appDir, '.zova-rest-build-ID', '.zova-rest-build-'),
      path.join(appDir, '.zova-rest-build-ID'),
    );
    for (const dir of ['../escape', '.zova-rest', 'src', '.zova-rest-build-']) {
      assert.throws(() => resolveZovaLocalPath(appDir, dir, '.zova-rest-build-'));
    }
    await mkdir(path.join(appDir, 'owned'));
    await symlink(path.join(appDir, 'owned'), path.join(appDir, '.zova-build-link'), 'junction');
    assert.throws(
      () => resolveZovaViteContext({ appDir, runtimeDir: '.zova-build-link' }),
      /symlink/,
    );
    await writeFile(path.join(appDir, '.zova-build-file'), 'not a directory');
    assert.throws(() => resolveZovaLocalPath(appDir, '.zova-build-file'), /non-directory/);
  } finally {
    await rm(appDir, { recursive: true, force: true });
  }
});

test('runtime resolver is absent for ordinary builds', t => {
  withEnv(t, { ZOVA_ISOLATED: undefined, ZOVA_RUNTIME_DIR: '.zova-build-1' });
  assert.equal(createZovaRuntimeResolverPlugin({ appDir: '/checkout/zova' }), undefined);
  process.env.ZOVA_ISOLATED = 'false';
  assert.equal(createZovaRuntimeResolverPlugin({ appDir: '/checkout/zova' }), undefined);
});

test('isolated resolver remaps only the application runtime and delegates suffix resolution to Vite', async t => {
  withEnv(t, { ZOVA_ISOLATED: 'true', ZOVA_RUNTIME_DIR: '.zova-build-1' });
  const appDir = await realpath(await mkdtemp(path.join(tmpdir(), 'zova-resolver-')));
  let server;
  try {
    const runtimePath = path.join(appDir, '.zova-build-1');
    const legacyPath = path.join(appDir, '.zova');
    const importer = path.join(appDir, 'src/boot/zova.ts');
    await mkdir(path.dirname(importer), { recursive: true });
    await mkdir(path.join(runtimePath, 'app'), { recursive: true });
    await mkdir(path.join(legacyPath, 'app'), { recursive: true });
    await writeFile(importer, 'export {};');
    await writeFile(path.join(runtimePath, 'app/utils.ts'), 'export const fromIsolated = true;');
    await writeFile(
      path.join(runtimePath, 'app/controller.tsx'),
      'export const controller = true;',
    );
    await writeFile(path.join(legacyPath, 'app/utils.ts'), 'export const fromShared = true;');
    const plugin = createZovaRuntimeResolverPlugin({ appDir, runtimeDir: '.zova' });
    server = await createServer({
      root: appDir,
      configFile: false,
      logLevel: 'silent',
      plugins: [plugin],
      server: { middlewareMode: true, hmr: false, watch: null },
      optimizeDeps: { noDiscovery: true, include: [] },
    });
    const resolve = (source: string, owner = importer) =>
      server.environments.client.pluginContainer.resolveId(source, owner);
    const normalizedRuntime = runtimePath.replaceAll('\\', '/');
    for (const [source, expected] of [
      ['../../.zova/app/utils.ts', '/app/utils.ts'],
      ['app/.zova/app/utils.js', '/app/utils.ts'],
      [path.join(legacyPath, 'app/utils.js'), '/app/utils.ts'],
      ['app/.zova/app/utils.js?raw', '/app/utils.ts?raw'],
      ['../../.zova/app/utils.js', '/app/utils.ts'],
      ['../../.zova/app/controller.jsx', '/app/controller.tsx'],
      ['../../.zova/app/controller.js', '/app/controller.tsx'],
      ['../../.zova/app/utils', '/app/utils.ts'],
      ['../../.zova/app/utils.js?raw', '/app/utils.ts?raw'],
    ]) {
      assert.equal((await resolve(source))?.id, normalizedRuntime + expected, source);
    }
    // A missing isolated file must not silently fall back to stale shared state.
    await writeFile(path.join(legacyPath, 'only-shared.ts'), 'export {};');
    await assert.rejects(resolve('../../.zova/only-shared.ts'), /Unable to resolve isolated/);
    // Run the hook with a minimal delegate to prove unrelated requests are not intercepted.
    const hook = plugin!.resolveId as Function;
    const untouched = [
      ['../../.zova-other/app/utils.ts', importer],
      ['../../other/.zova/app/utils.ts', importer],
      ['../../.zova-rest/index.ts', importer],
      ['app/.zova-other/app/utils.ts', importer],
      ['app/.zova-rest/index.ts', importer],
      [path.join(appDir, 'other/.zova/app/utils.ts'), importer],
      ['zova', importer],
      ['../../src/config.ts', importer],
      ['../../.zova/app/utils.ts', path.join(appDir, '../outside/src/file.ts')],
      ['../../.zova/app/utils.ts', '\0virtual'],
    ];
    for (const [source, owner] of untouched) {
      assert.equal(
        await hook.call(
          {
            resolve() {
              assert.fail('unexpected delegation');
            },
          },
          source,
          owner,
          {},
        ),
        null,
      );
    }
  } finally {
    await server?.close();
    await rm(appDir, { recursive: true, force: true });
  }
});
