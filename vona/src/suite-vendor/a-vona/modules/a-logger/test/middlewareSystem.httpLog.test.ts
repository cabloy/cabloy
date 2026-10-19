import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { registerHooks } from 'node:module';
import { test } from 'node:test';
import ts from 'typescript';

const middlewareUrl = new URL(
  '../src/bean/middlewareSystem.httpLog.ts?fixture=httpLog',
  import.meta.url,
).href;
const boundaryFixture = `data:text/javascript,${encodeURIComponent(`
  export class BeanBase {}
  let boundary;
  export function getRequestBoundary() { return boundary; }
  export function setBoundary(value) { boundary = value; }
`)}`;
const { setBoundary } = await import(boundaryFixture);
const hooks = registerHooks({
  resolve(specifier, context, nextResolve) {
    if (context.parentURL === middlewareUrl) {
      if (specifier === 'vona') return { url: boundaryFixture, shortCircuit: true };
      const source = {
        'vona-module-a-aspect': 'export function MiddlewareSystem() { return () => {}; }',
        'pino-std-serializers':
          'export default { req: req => ({ headers: req.headers, url: req.url }) };',
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
        source: ts.transpileModule(readFileSync(new URL(url), 'utf8'), {
          compilerOptions: {
            experimentalDecorators: true,
            target: ts.ScriptTarget.ESNext,
            module: ts.ModuleKind.ESNext,
          },
        }).outputText,
        shortCircuit: true,
      };
    }
    return nextLoad(url, context);
  },
});
const { MiddlewareSystemHttpLog } = await import(middlewareUrl);
hooks.deregister();

test('HTTP logger skips context and diagnostic access inside a request boundary', async () => {
  const middleware = Object.create(MiddlewareSystemHttpLog.prototype);
  for (const key of ['app', 'ctx', '$loggerChild']) {
    Object.defineProperty(middleware, key, {
      get() {
        assert.fail('protected diagnostic access');
      },
    });
  }
  let calls = 0;
  setBoundary({ diagnostics: 'suppress' });
  try {
    assert.equal(
      await middleware.execute({}, async () => {
        calls++;
        return 23;
      }),
      23,
    );
    assert.equal(calls, 1);
  } finally {
    setBoundary(undefined);
  }
});

for (const path of ['/health/ready', '/health/test-stop']) {
  test(`HTTP logger redacts request authorization and response proof at ${path} without mutating headers`, async () => {
    const headers = {
      'x-vona-test-challenge': 'secret-challenge',
      'X-Vona-Test-Stop-Authorization': 'secret-authorization',
      'x-vona-test-stop-nonce': 'secret-nonce',
      'accept': 'application/json',
    };
    const responseHeaders = {
      'x-vona-test-proof': 'secret-readiness',
      'X-Vona-Test-Stop-Proof': 'secret-ack',
      'content-type': 'application/json',
    };
    const logs: string[] = [];
    const middleware = Object.create(MiddlewareSystemHttpLog.prototype);
    Object.assign(middleware, {
      app: { meta: { env: { VONA_TEST_RUN_ID: '20261014010203-a1b2c3d4' } } },
      ctx: {
        path,
        req: { url: path, headers },
        res: { statusCode: 200, getHeaders: () => responseHeaders },
      },
      $loggerChild: () => ({
        http: (message: () => string) => logs.push(message()),
        startTimer: () => ({ done: ({ message }: { message: string }) => logs.push(message) }),
      }),
    });
    await middleware.execute({}, async () => {});
    assert.equal(logs.length, 2);
    assert.equal(logs.join('\n').includes('secret-'), false);
    assert.match(logs[0], /application\/json/);
    assert.match(logs[1], /application\/json/);
    assert.equal(headers['X-Vona-Test-Stop-Authorization'], 'secret-authorization');
    assert.equal(responseHeaders['X-Vona-Test-Stop-Proof'], 'secret-ack');
  });
}
