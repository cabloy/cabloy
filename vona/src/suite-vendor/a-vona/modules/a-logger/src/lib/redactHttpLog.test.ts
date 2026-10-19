import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { registerHooks } from 'node:module';
import { test } from 'node:test';
import ts from 'typescript';

import { redactHttpLogHeaders, redactHttpLogUrl } from './redactHttpLog.ts';

const previousApp = Object.getOwnPropertyDescriptor(globalThis, '__app__');
const vonaUrl = new URL('../../../../../../../', import.meta.url);
const middlewareUrl = new URL(
  '../bean/middlewareSystem.httpLog.ts?fixture=httpLogging',
  import.meta.url,
).href;
const formatterUrl = new URL('packages-vona/vona-core/src/lib/core/logger/utils.ts', vonaUrl).href;
const checkUrl = new URL('packages-utils/utils/src/check.ts', vonaUrl).href;
const fixture = (source: string) => `data:text/javascript,${encodeURIComponent(source)}`;
const hooks = registerHooks({
  resolve(specifier, context, nextResolve) {
    if (context.parentURL === middlewareUrl) {
      if (specifier === 'vona') {
        return {
          url: fixture('export class BeanBase {} export function getRequestBoundary() {}'),
          shortCircuit: true,
        };
      }
      if (specifier === 'vona-module-a-aspect') {
        return {
          url: fixture('export function MiddlewareSystem() { return () => {}; }'),
          shortCircuit: true,
        };
      }
    }
    if (context.parentURL === formatterUrl) {
      if (specifier === '@cabloy/utils') return { url: checkUrl, shortCircuit: true };
      if (specifier === '../../framework/useApp.ts') {
        return {
          url: fixture(
            'export function useApp() { throw new Error("unexpected application access"); }',
          ),
          shortCircuit: true,
        };
      }
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
const { MiddlewareSystemHttpLog, formatLoggerFilter } = await (async () => {
  try {
    return { ...(await import(middlewareUrl)), ...(await import(formatterUrl)) };
  } finally {
    hooks.deregister();
  }
})();

const secret = 'synthetic-http-secret-sentinel';

test('header copies hide standard, mixed-case and custom credentials', () => {
  const headers = Object.freeze({
    'Authorization': secret,
    'Proxy-Authorization': secret,
    'Cookie': secret,
    'Set-Cookie': Object.freeze([secret, secret]),
    'X-Custom-Credential': secret,
    'Location': `/callback?code=${secret}`,
    'Referer': `/callback?state=${secret}`,
    'Content-Type': 'application/json',
    'content-length': '42',
    'accept': 'application/json',
  });
  const logged = redactHttpLogHeaders(headers);
  assert.equal(JSON.stringify(logged).includes(secret), false);
  assert.equal(logged['Content-Type'], 'application/json');
  assert.equal(logged['content-length'], '42');
  assert.equal(logged.accept, 'application/json');
  assert.equal(headers.Authorization, secret);
  assert.deepEqual(headers['Set-Cookie'], [secret, secret]);
  assert.notEqual(logged, headers);
});

test('URL projections omit all query/fragment data and absolute-URL userinfo', () => {
  for (const key of [
    'access_token',
    'refresh_token',
    'code',
    'state',
    'x-vona-passport-code',
    'custom',
  ]) {
    const url = `/callback?${key}=${secret}&${key}=${secret}#${secret}`;
    assert.equal(redactHttpLogUrl(url), '/callback?[REDACTED]');
  }
  assert.equal(redactHttpLogUrl(`/callback#${secret}`), '/callback?[REDACTED]');
  assert.equal(
    redactHttpLogUrl(`https://${secret}:${secret}@example.invalid/callback?x=${secret}`),
    'https://example.invalid/callback?[REDACTED]',
  );
  assert.equal(
    redactHttpLogUrl(`//${secret}@example.invalid/callback`),
    '//example.invalid/callback',
  );
  assert.equal(redactHttpLogUrl('https://['), '[REDACTED]');
  assert.equal(redactHttpLogUrl(`data:${secret}`), '[REDACTED]');
  assert.equal(redactHttpLogUrl({ path: secret }), undefined);
  assert.equal(redactHttpLogUrl('/ordinary/path'), '/ordinary/path');
  assert.equal(redactHttpLogUrl('*'), '*');
});

for (const failure of [false, true]) {
  test(`actual middleware strict-http projection, downstream ${failure ? 'error' : 'success'}`, async () => {
    const output: string[] = [];
    const filter = formatLoggerFilter({ level: 'http', child: undefined, strict: true });
    const capture = (message: any, extra = {}) => {
      const info = filter.transform({ level: 'http', message, ...extra }, filter.options);
      assert.ok(info);
      output.push(JSON.stringify(info));
    };
    const headers = Object.freeze({
      authorization: secret,
      cookie: secret,
      accept: 'application/json',
    });
    const responseHeaders = Object.freeze({
      'set-cookie': [secret],
      'content-type': 'application/json',
    });
    const req = Object.freeze({
      method: 'POST',
      url: `/callback?custom=${secret}`,
      originalUrl: `/callback?x-vona-passport-code=${secret}`,
      query: { custom: secret },
      params: { token: secret },
      body: { token: secret },
      headers,
      socket: { remoteAddress: '127.0.0.1', remotePort: 12345 },
    });
    const ctx = {
      req,
      path: '/callback',
      res: { statusCode: 204, getHeaders: () => responseHeaders },
    };
    const fake = {
      ctx,
      app: { meta: { env: {} } },
      $loggerChild: (name: string) => {
        assert.ok(name === 'req' || name === 'res');
        return {
          http: (message: any) => capture(message),
          startTimer: () => ({
            done: (info: any) => {
              assert.equal(info.level, 'http');
              capture(info.message, { durationMs: 7 });
            },
          }),
        };
      },
    };
    let calls = 0;
    const error = new Error(secret);
    const execution = MiddlewareSystemHttpLog.prototype.execute.call(fake as any, {}, async () => {
      calls++;
      assert.equal(ctx.req, req);
      assert.equal(ctx.req.headers.authorization, secret);
      assert.equal(ctx.req.body.token, secret);
      if (failure) throw error;
    });
    if (failure) {
      await assert.rejects(execution, value => value === error);
    } else {
      await execution;
    }
    assert.equal(calls, 1);
    assert.equal(output.length, failure ? 1 : 2);
    assert.equal(output.join('\n').includes(secret), false);
    const request = JSON.parse(JSON.parse(output[0]!).message);
    assert.equal(request.method, 'POST');
    assert.equal(request.url, '/callback?[REDACTED]');
    assert.equal(request.query, undefined);
    assert.equal(request.params, undefined);
    assert.equal(request.body, undefined);
    assert.equal(request.raw, undefined);
    if (!failure) {
      const response = JSON.parse(output[1]!);
      assert.equal(response.durationMs, 7);
      assert.equal(JSON.parse(response.message).statusCode, 204);
    }
    assert.equal(req.url, `/callback?custom=${secret}`);
    assert.deepEqual(responseHeaders['set-cookie'], [secret]);
    assert.deepEqual(Object.getOwnPropertyDescriptor(globalThis, '__app__'), previousApp);
  });
}
