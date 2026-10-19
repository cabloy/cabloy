import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { registerHooks } from 'node:module';
import path from 'node:path';
import { test } from 'node:test';
import ts from 'typescript';

for (const platform of ['posix', 'win32'] as const) {
  const middlewareUrl = new URL(
    `../src/bean/middlewareSystem.static.ts?fixture=static-${platform}`,
    import.meta.url,
  ).href;
  const hooks = registerHooks({
    resolve(specifier, context, nextResolve) {
      if (context.parentURL === middlewareUrl) {
        const source = {
          'vona': 'export class BeanBase {} export function compose() {}',
          'vona-module-a-aspect': 'export function MiddlewareSystem() { return () => {}; }',
          'node:path': `import {posix,win32} from 'node:path'; export default {...${platform},posix,win32};`,
          '../.metadata/this.ts': "export const __ThisModule__ = 'a-static';",
        }[specifier];
        if (source)
          return { url: `data:text/javascript,${encodeURIComponent(source)}`, shortCircuit: true };
      }
      return nextResolve(specifier, context);
    },
    load(url, context, nextLoad) {
      if (url === middlewareUrl) {
        return {
          format: 'module',
          source: ts.transpileModule(
            `${readFileSync(new URL(url), 'utf8')}\nexport { getFullPath };`,
            {
              compilerOptions: {
                experimentalDecorators: true,
                target: ts.ScriptTarget.ESNext,
                module: ts.ModuleKind.ESNext,
              },
            },
          ).outputText,
          shortCircuit: true,
        };
      }
      return nextLoad(url, context);
    },
  });
  let getFullPath;
  try {
    ({ getFullPath } = await import(middlewareUrl));
  } finally {
    hooks.deregister();
  }
  const filesystem = path[platform];
  const root = platform === 'win32' ? 'D:\\app\\public' : '/app/public';
  const assetRoot = platform === 'win32' ? 'D:\\modules' : '/modules';
  const ctx = {
    app: {
      scope: () => ({ event: { resolvePath: { emit: (data, fallback) => fallback(data) } } }),
      meta: { modules: { 'home-index': {} } },
      util: {
        getAssetPathPhysical: (module: string, scene: string, filename: string) =>
          filesystem.join(assetRoot, module, scene, filename),
      },
    },
  };
  const options = { apiStaticPrefix: '/api/static/' };

  test(`${platform}: static URL separators resolve public uploads and module assets to native paths`, async () => {
    for (const separator of ['/', '\\']) {
      const publicUrl = 'api/static/public/1/image-native/default/avatar.jpg'.replaceAll(
        '/',
        separator,
      );
      assert.equal(
        await getFullPath(ctx, root, publicUrl, options),
        filesystem.join(root, '1', 'image-native', 'default', 'avatar.jpg'),
      );
      const moduleUrl = 'api/static/home/index/img/vona.png'.replaceAll('/', separator);
      assert.equal(
        await getFullPath(ctx, root, moduleUrl, options),
        filesystem.join(assetRoot, 'home-index', 'static', 'img', 'vona.png'),
      );
    }
  });

  test(`${platform}: static resolution preserves root-prefix configuration and rejects unknown routes`, async () => {
    assert.equal(
      await getFullPath(ctx, root, 'public/avatar.jpg', { apiStaticPrefix: '/' }),
      filesystem.join(root, 'avatar.jpg'),
    );
    assert.equal(await getFullPath(ctx, root, 'other/public/avatar.jpg', options), undefined);
    assert.equal(
      await getFullPath(ctx, root, 'api/static/unknown/module/file.jpg', options),
      undefined,
    );
    await assert.rejects(
      getFullPath(ctx, root, 'api/static/public/../../outside.jpg', options),
      /unsafe filename/,
    );
  });
}
