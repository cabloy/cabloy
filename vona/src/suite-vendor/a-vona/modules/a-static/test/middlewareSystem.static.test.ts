import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { registerHooks } from 'node:module';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import ts from 'typescript';

async function loadMiddleware(platform: 'posix' | 'win32' | 'native') {
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
          'node:path':
            platform === 'native'
              ? undefined
              : `import {posix,win32} from 'node:path'; export default {...${platform},posix,win32};`,
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
  try {
    return await import(middlewareUrl);
  } finally {
    hooks.deregister();
  }
}

for (const platform of ['posix', 'win32'] as const) {
  const { getFullPath } = await loadMiddleware(platform);
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

const { MiddlewareSystemStatic, getFullPath } = await loadMiddleware('native');

async function withStaticFile(run: (dir: string, contents: string) => Promise<void>) {
  const dir = await mkdtemp(path.join(tmpdir(), 'vona-static-test-'));
  const contents = 'actual static cache fixture\n';
  try {
    await writeFile(path.join(dir, 'asset.txt'), contents);
    await run(dir, contents);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

function createStaticMiddleware(dir: string, resolver = getFullPath) {
  const middleware = new MiddlewareSystemStatic();
  middleware.app = {
    meta: { isProd: true },
    config: { server: { publicDir: dir } },
  };
  const middlewares = middleware._createMiddlewares({
    apiStaticPrefix: '/api/static/',
    dirs: [],
    dynamic: true,
    preload: false,
    maxFiles: 10,
    getFullPath: resolver,
  });
  assert.equal(middlewares.length, 2);
  return middlewares[1];
}

function createStaticContext(filename = 'asset.txt', method = 'GET', etag?: string) {
  const headers: Record<string, string> = {};
  return {
    app: {
      scope: () => ({ event: { resolvePath: { emit: (data, fallback) => fallback(data) } } }),
    },
    path: `/api/static/public/${filename}`,
    method,
    state: {} as { staticFileServed?: boolean },
    status: 404,
    response: {} as { lastModified?: Date; etag?: string },
    type: '',
    length: 0,
    body: undefined as Buffer | string | undefined,
    get fresh() {
      return this.status === 200 && etag !== undefined && etag === this.response.etag;
    },
    set(name: string, value: string) {
      headers[name] = value;
    },
    acceptsEncodings: () => 'identity',
  };
}

const unexpectedNext = async () => assert.fail('static response must not fall through');

// Invoke the cache middleware returned by the real factory; only the framework shell is stubbed.
test('real static cache marks cold/warm GET, HEAD and conditional 304 responses', async () => {
  await withStaticFile(async (dir, contents) => {
    let resolutions = 0;
    const serve = createStaticMiddleware(dir, (...args) => {
      resolutions++;
      return getFullPath(...args);
    });
    for (const phase of ['cold', 'warm']) {
      const ctx = createStaticContext();
      await serve(ctx, unexpectedNext);
      assert.equal(ctx.status, 200, phase);
      assert.equal(ctx.state.staticFileServed, true, phase);
      assert.ok(Buffer.isBuffer(ctx.body), phase);
      assert.equal(ctx.body.toString(), contents, phase);
      assert.equal(ctx.length, Buffer.byteLength(contents), phase);
    }

    const head = createStaticContext('asset.txt', 'HEAD');
    await serve(head, unexpectedNext);
    assert.equal(head.status, 200);
    assert.equal(head.state.staticFileServed, true);
    assert.equal(head.body, undefined);
    assert.equal(head.length, Buffer.byteLength(contents));
    assert.ok(head.response.etag);

    const conditional = createStaticContext('asset.txt', 'GET', head.response.etag);
    await serve(conditional, unexpectedNext);
    assert.equal(conditional.status, 304);
    assert.equal(conditional.state.staticFileServed, true);
    assert.equal(conditional.body, undefined);
    assert.equal(resolutions, 1, 'warm requests must use the installed cache');
  });
});

test('real static cache distinguishes a missing file, resolver-owned SSR and resolver rejection', async () => {
  await withStaticFile(async dir => {
    const failure = new Error('static resolver failed');
    const serve = createStaticMiddleware(dir, async (ctx, ...args) => {
      if (ctx.path.endsWith('/ssr')) {
        ctx.status = 200;
        ctx.body = '<html>SSR fixture</html>';
        return true;
      }
      if (ctx.path.endsWith('/reject')) throw failure;
      return getFullPath(ctx, ...args);
    });
    const missing = createStaticContext('missing.txt');
    let nextCalls = 0;
    await serve(missing, async () => {
      nextCalls++;
      assert.equal(Object.hasOwn(missing.state, 'staticFileServed'), false);
    });
    assert.equal(nextCalls, 1);
    assert.equal(missing.status, 404);
    assert.equal(Object.hasOwn(missing.state, 'staticFileServed'), false);

    const ssr = createStaticContext('ssr');
    await serve(ssr, unexpectedNext);
    assert.equal(ssr.status, 200);
    assert.equal(ssr.body, '<html>SSR fixture</html>');
    assert.equal(ssr.state.staticFileServed, false);

    const rejected = createStaticContext('reject');
    await assert.rejects(serve(rejected, unexpectedNext), error => error === failure);
    assert.equal(Object.hasOwn(rejected.state, 'staticFileServed'), false);
  });
});

test('real static cache keeps interleaved fallthrough and served contexts independent', async () => {
  await withStaticFile(async dir => {
    const serve = createStaticMiddleware(dir);
    const missing = createStaticContext('missing.txt');
    const enteredNext = Promise.withResolvers<void>();
    const releaseNext = Promise.withResolvers<void>();
    const pending = serve(missing, async () => {
      enteredNext.resolve();
      await releaseNext.promise;
    });
    try {
      await Promise.race([
        enteredNext.promise,
        pending.then(() => assert.fail('missing file must reach next')),
      ]);
      const served = createStaticContext();
      await serve(served, unexpectedNext);
      assert.equal(served.state.staticFileServed, true);
      assert.equal(Object.hasOwn(missing.state, 'staticFileServed'), false);
    } finally {
      releaseNext.resolve();
      await pending;
    }
    assert.equal(Object.hasOwn(missing.state, 'staticFileServed'), false);
  });
});
