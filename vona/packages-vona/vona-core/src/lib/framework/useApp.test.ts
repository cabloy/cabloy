import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { test } from 'node:test';

const useAppUrl = new URL('./useApp.ts', import.meta.url).href;

for (const platform of ['win32', 'linux', 'darwin']) {
  test(`general apps use the single-app entry and await close on ${platform}`, () => {
    const source = `
      import assert from 'node:assert/strict';
      import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
      import { tmpdir } from 'node:os';
      import path from 'node:path';
      import { registerHooks } from 'node:module';
      const useAppUrl = ${JSON.stringify(useAppUrl)};
      const projectPath = mkdtempSync(path.join(tmpdir(), 'vona-general-app-'));
      const appSource =
        'export async function createSingleApp() {' +
        '  if (globalThis.failure) throw globalThis.failure;' +
        '  globalThis.factoryCalls++;' +
        '  return globalThis.__app__ = { meta: { async close() {' +
        '    await new Promise(resolve => setTimeout(resolve, 10));' +
        '    globalThis.closed = true;' +
        '  } } };' +
        '}';
      try {
        writeFileSync(path.join(projectPath, 'package.json'), '{"type":"module"}');
        for (const flavor of ['ci', 'other']) {
          const directory = path.join(projectPath, 'dist', flavor);
          mkdirSync(directory, { recursive: true });
          writeFileSync(path.join(directory, 'app.js'), appSource);
          writeFileSync(path.join(directory, 'bootstrap.js'), 'throw new Error("General apps must not bootstrap a server");');
        }
        const generatedRoot = path.join(projectPath, '.vona');
        mkdirSync(generatedRoot);
        writeFileSync(path.join(generatedRoot, 'app.ts'), appSource);
        const mocks = {
          '@cabloy/utils': 'export const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));',
          '../utils/util.ts': 'import { pathToFileURL } from "node:url"; export const pathToHref = file => pathToFileURL(file).href;',
          '../core/testIsolation.ts': 'export function resolveVonaLocalPaths(projectPath, mode) { globalThis.resolvedMode = mode; return { generatedRoot: globalThis.generatedRoot }; }',
        };
        registerHooks({
          resolve(specifier, context, nextResolve) {
            if (context.parentURL === useAppUrl && mocks[specifier]) {
              return { url: 'data:text/javascript,' + encodeURIComponent(mocks[specifier]), shortCircuit: true };
            }
            return nextResolve(specifier, context);
          },
        });
        Object.defineProperty(process, 'platform', { value: ${JSON.stringify(platform)} });
        globalThis.generatedRoot = generatedRoot;
        globalThis.factoryCalls = 0;
        const { createGeneralApp, closeApp, useApp } = await import(useAppUrl);
        for (const mode of ['prod', 'dev', 'test']) {
          globalThis.closed = false;
          const app = await createGeneralApp(projectPath, { META_MODE: mode, META_FLAVOR: 'ci' });
          assert.equal(app, useApp());
          assert.equal(globalThis.factoryCalls, 1);
          assert.equal(globalThis.closed, false);
          if (mode !== 'prod') assert.equal(globalThis.resolvedMode, mode);
          await closeApp();
          assert.equal(globalThis.closed, true, 'close must await application cleanup');
          assert.equal(useApp(), undefined);
          globalThis.factoryCalls = 0;
        }
        const failure = globalThis.failure = new Error('single-app startup failed');
        await assert.rejects(
          createGeneralApp(projectPath, { META_MODE: 'prod', META_FLAVOR: 'other' }),
          error => error === failure,
        );
        assert.equal(useApp(), undefined);
      } finally {
        rmSync(projectPath, { recursive: true, force: true });
      }
    `;
    const result = spawnSync(process.execPath, ['--input-type=module', '--eval', source], {
      encoding: 'utf8',
      timeout: 5_000,
    });
    assert.ifError(result.error);
    assert.equal(result.signal, null, result.stderr);
    assert.equal(result.status, 0, result.stderr);
  });
}
