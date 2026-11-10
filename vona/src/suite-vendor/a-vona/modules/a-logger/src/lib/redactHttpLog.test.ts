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
const configUrl = new URL('src/backend/config/config/config.ts?fixture=accessLogging', vonaUrl)
  .href;
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
    if (context.parentURL === configUrl && specifier === 'vona') {
      return {
        url: fixture(`
          export const $protocolKey = value => value;
          export const getLoggerPathPhysicalRoot = () => '/unused/logs';
          export const getPublicPathPhysicalRoot = () => '/unused/public';
          export const getSqlite3DatabaseNameDefault = () => ':memory:';
        `),
        shortCircuit: true,
      };
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
const { MiddlewareSystemHttpLog, formatLoggerFilter, createConfig } = await (async () => {
  try {
    return {
      ...(await import(middlewareUrl)),
      ...(await import(formatterUrl)),
      createConfig: (await import(configUrl)).default,
    };
  } finally {
    hooks.deregister();
  }
})();

const secret = 'synthetic-http-secret-sentinel';

test('access configuration uses only a normal threshold file transport', async () => {
  const calls: any[][] = [];
  const transport = {};
  const app = {
    meta: { env: {} },
    bean: {
      logger: {
        makeTransportFile(...args: any[]) {
          calls.push(args);
          return transport;
        },
        makeTransportConsole() {
          assert.fail('access logs must not use the diagnostic console');
        },
      },
    },
  };
  const config = await createConfig(app as any);
  const clientInfo = { clientName: 'access', level: () => 'debug', child: () => undefined };
  const access = (config.logger!.clients!.access as Function).call(app, clientInfo);
  assert.deepEqual(access.transports, [transport]);
  assert.deepEqual(calls, [[clientInfo, 'access']]);
});

test('access filtering can be disabled independently of business debug', () => {
  let accessLevel: 'info' | false = 'info';
  const access = formatLoggerFilter({ level: () => accessLevel, child: undefined });
  const diagnostic = formatLoggerFilter({ level: 'debug', child: undefined });
  assert.ok(access.transform({ level: 'info', message: 'request' }, access.options));
  accessLevel = false;
  let evaluations = 0;
  assert.equal(
    access.transform(
      {
        level: 'info',
        message: () => {
          evaluations++;
          return 'request';
        },
      },
      access.options,
    ),
    false,
  );
  assert.equal(evaluations, 0);
  assert.ok(
    diagnostic.transform({ level: 'debug', message: 'business stage' }, diagnostic.options),
  );
});

for (const staticFileServed of [undefined, false, true]) {
  test(`access publication waits for static classification: ${staticFileServed}`, async () => {
    const records: string[] = [];
    const ctx = {
      path: '/api/report.csv',
      state: {} as { staticFileServed?: boolean },
      req: { method: 'GET', url: '/api/report.csv', headers: {} },
      res: { statusCode: 200, getHeaders: () => ({}) },
    };
    const fake = {
      ctx,
      app: { meta: { env: {} } },
      $loggerChild: (name: string, client: string) => {
        assert.equal(client, 'access');
        return {
          info: (message: () => string) => records.push(`${name}:${message()}`),
          startTimer: () => ({
            done: ({ message }: { message: () => string }) => records.push(`${name}:${message()}`),
          }),
        };
      },
    };
    const ready = Promise.withResolvers<void>();
    const execution = MiddlewareSystemHttpLog.prototype.execute.call(fake as any, {}, async () => {
      await ready.promise;
      ctx.state.staticFileServed = staticFileServed;
    });
    assert.equal(records.length, 0);
    ready.resolve();
    await execution;
    assert.equal(records.length, staticFileServed === true ? 0 : 2);
    if (records.length) {
      assert.ok(records[0]!.startsWith('req:'));
      assert.ok(records[1]!.startsWith('res:'));
    }
  });
}

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

test('URL path segments remain visible while query credentials are omitted', () => {
  assert.equal(
    redactHttpLogUrl('/reset-password/synthetic-path-token?code=synthetic-query-token'),
    '/reset-password/synthetic-path-token?[REDACTED]',
  );
});

test('deferred HTTP messages preserve sanitized snapshots and serialize only after acceptance', async () => {
  const pending: { level: string; message: () => string; durationMs?: number }[] = [];
  const headers = { accept: ['application/json'], authorization: secret };
  const responseHeaders = { 'content-type': ['application/json'], 'set-cookie': [secret] };
  const req = {
    method: 'POST',
    url: `/callback?code=${secret}`,
    headers,
    socket: { remoteAddress: '127.0.0.1', remotePort: 12345 },
  };
  const res = { statusCode: 204, getHeaders: () => responseHeaders };
  const fake = {
    ctx: { req, res, path: '/callback', state: {} },
    app: { meta: { env: {} } },
    $loggerChild: (name: string, client: string) => {
      assert.equal(client, 'access');
      assert.ok(name === 'req' || name === 'res');
      return {
        info: (message: () => string) => pending.push({ level: 'info', message }),
        startTimer: () => ({
          done: (info: (typeof pending)[number]) => pending.push({ ...info, durationMs: 7 }),
        }),
      };
    },
  };
  await MiddlewareSystemHttpLog.prototype.execute.call(fake as any, {}, async () => {
    assert.equal(pending.length, 0);
    req.method = 'PATCH';
    headers.accept.push('application/xml');
  });
  assert.equal(pending.length, 2);
  req.url = '/changed';
  res.statusCode = 500;
  headers.accept.push('text/plain');
  responseHeaders['content-type'].push('text/plain');
  headers.authorization = 'changed-credential';
  responseHeaders['set-cookie'].push('changed-cookie');

  const rejectedLevel = formatLoggerFilter({ level: 'warn', child: undefined });
  const rejectedChild = formatLoggerFilter({ level: 'info', child: ['other'] });
  const accepted = formatLoggerFilter({ level: 'info', child: undefined });
  const output: any[] = [];
  for (const info of pending) {
    assert.equal(typeof info.message, 'function');
    let evaluations = 0;
    const message = () => {
      evaluations++;
      return info.message();
    };
    assert.equal(rejectedLevel.transform({ ...info, message }, rejectedLevel.options), false);
    assert.equal(rejectedChild.transform({ ...info, message }, rejectedChild.options), false);
    assert.equal(evaluations, 0);
    const first = accepted.transform({ ...info, message }, accepted.options);
    const second = accepted.transform({ ...info, message }, accepted.options);
    assert.ok(first);
    assert.deepEqual(second, first);
    assert.equal(evaluations, 1);
    output.push(first);
  }
  assert.equal(JSON.stringify(output).includes(secret), false);
  const request = JSON.parse(output[0].message);
  const response = JSON.parse(output[1].message);
  assert.equal(request.method, 'POST');
  assert.equal(request.url, '/callback?[REDACTED]');
  assert.deepEqual(request.headers.accept, ['application/json']);
  assert.equal(request.headers.authorization, '[REDACTED]');
  assert.equal(response.url, '/callback?[REDACTED]');
  assert.equal(response.statusCode, 204);
  assert.deepEqual(response.headers['content-type'], ['application/json']);
  assert.equal(response.headers['set-cookie'], '[REDACTED]');
  assert.equal(output[1].durationMs, 7);
});

for (const failure of [false, true]) {
  test(`actual middleware access projection, downstream ${failure ? 'error' : 'success'}`, async () => {
    const output: string[] = [];
    const filter = formatLoggerFilter({ level: 'info', child: undefined });
    const capture = (message: any, extra = {}) => {
      const info = filter.transform({ level: 'info', message, ...extra }, filter.options);
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
      state: {},
      res: { statusCode: 204, getHeaders: () => responseHeaders },
    };
    const fake = {
      ctx,
      app: { meta: { env: {} } },
      $loggerChild: (name: string, client: string) => {
        assert.ok(name === 'req' || name === 'res');
        assert.equal(client, 'access');
        return {
          info: (message: any) => capture(message),
          startTimer: () => ({
            done: (info: any) => {
              assert.equal(info.level, 'info');
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
