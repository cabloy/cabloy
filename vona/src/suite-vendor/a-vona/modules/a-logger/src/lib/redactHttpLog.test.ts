import assert from 'node:assert/strict';
import { EventEmitter } from 'node:events';
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

test('test console threshold leaves file diagnostics and non-test console unchanged', async () => {
  for (const isTest of [true, false]) {
    const files: any[][] = [];
    const consoleTransport = { level: 'silly' };
    const clientInfo = { clientName: 'default', level: () => 'debug', child: () => undefined };
    const app = {
      meta: { env: {}, isTest },
      bean: {
        logger: {
          makeTransportFile(...args: any[]) {
            files.push(args);
            return { args };
          },
          makeTransportConsole(info: unknown) {
            assert.equal(info, clientInfo);
            return consoleTransport;
          },
        },
      },
    };
    const config = await createConfig(app as any);
    const diagnostic = (config.logger!.clients!.default as Function).call(app, clientInfo);
    assert.equal(diagnostic.transports.at(-1), consoleTransport);
    assert.equal(consoleTransport.level, isTest ? 'warn' : 'silly');
    assert.deepEqual(files, [
      [clientInfo, 'error', 'error'],
      [clientInfo, 'warn', 'warn'],
      [clientInfo, 'http', 'http'],
      [clientInfo, 'combined'],
    ]);
    assert.equal(clientInfo.level(), 'debug');
  }
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

for (const event of ['finish', 'close']) {
  for (const staticFileServed of [undefined, false, true]) {
    test(`access ${event} uses terminal static classification: ${staticFileServed}`, async () => {
      const records: any[] = [];
      const res = Object.assign(new EventEmitter(), {
        statusCode: 200,
        headersSent: true,
        writableFinished: false,
        destroyed: false,
      });
      const ctx = {
        state: {} as { staticFileServed?: boolean },
        req: { method: 'GET', url: '/api/report.csv' },
        res,
      };
      const fake = {
        ctx,
        $loggerChild: (name: string, client: string) => {
          assert.equal(name, 'res');
          assert.equal(client, 'access');
          return { info: (message: () => string) => records.push(JSON.parse(message())) };
        },
      };
      await MiddlewareSystemHttpLog.prototype.execute.call(fake as any, {}, async () => {});
      assert.equal(records.length, 0, 'next settlement is not a response terminal event');
      // Classification may become available after next settles, but before the terminal event.
      ctx.state.staticFileServed = staticFileServed;
      res.writableFinished = event === 'finish';
      res.emit(event);
      assert.equal(records.length, staticFileServed === true ? 0 : 1);
      if (records.length) {
        assert.equal(records[0].outcome, event === 'finish' ? 'finished' : 'aborted');
        assert.equal(records[0].statusCode, 200);
      }
      assert.equal(res.listenerCount('finish'), 0);
      assert.equal(res.listenerCount('close'), 0);
      ctx.state.staticFileServed = false;
      res.emit('finish');
      res.emit('close');
      assert.equal(records.length, staticFileServed === true ? 0 : 1);
    });
  }
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

test('one deferred access message snapshots entry and first-terminal state before filter acceptance', async t => {
  const pending: { level: string; name: string; message: () => string }[] = [];
  let now = 100.25;
  t.mock.method(performance, 'now', () => now);
  const stringify = t.mock.method(JSON, 'stringify');
  const req = {
    method: 'POST',
    url: `https://${secret}:${secret}@example.invalid/callback?code=${secret}#${secret}`,
    headers: { authorization: secret },
    body: { token: secret },
  };
  const res = Object.assign(new EventEmitter(), {
    statusCode: 200,
    headersSent: false,
    writableFinished: false,
    destroyed: false,
    getHeaders: () => assert.fail('access projection must not read response headers'),
  });
  const fake = {
    ctx: { req, res, state: {} },
    $loggerChild: (name: string, client: string) => {
      assert.equal(name, 'res');
      assert.equal(client, 'access');
      return { info: (message: () => string) => pending.push({ level: 'info', name, message }) };
    },
  };
  await MiddlewareSystemHttpLog.prototype.execute.call(fake as any, {}, async () => {
    assert.equal(pending.length, 0);
    req.method = 'PATCH';
    req.url = '/changed-before-terminal';
    now = 102;
  });
  assert.equal(pending.length, 0);
  now = 107.75;
  res.statusCode = 204;
  res.headersSent = true;
  res.writableFinished = true;
  res.emit('finish');
  assert.equal(pending.length, 1);
  assert.equal(stringify.mock.callCount(), 0, 'JSON encoding must remain lazy');
  req.method = 'DELETE';
  req.url = '/changed-after-terminal';
  res.statusCode = 500;
  now = 999;
  res.emit('close');
  res.emit('finish');
  assert.equal(pending.length, 1);
  assert.equal(res.listenerCount('finish'), 0);
  assert.equal(res.listenerCount('close'), 0);

  const rejectedLevel = formatLoggerFilter({ level: 'warn', child: undefined });
  const rejectedChild = formatLoggerFilter({ level: 'info', child: ['other'] });
  const disabled = formatLoggerFilter({ level: false, child: undefined });
  const accepted = formatLoggerFilter({ level: 'info', child: ['res'] });
  const info = pending[0]!;
  assert.equal(typeof info.message, 'function');
  let evaluations = 0;
  const message = () => {
    evaluations++;
    return info.message();
  };
  assert.equal(rejectedLevel.transform({ ...info, message }, rejectedLevel.options), false);
  assert.equal(rejectedChild.transform({ ...info, message }, rejectedChild.options), false);
  assert.equal(disabled.transform({ ...info, message }, disabled.options), false);
  assert.equal(evaluations, 0);
  assert.equal(stringify.mock.callCount(), 0);
  const first = accepted.transform({ ...info, message }, accepted.options);
  const second = accepted.transform({ ...info, message }, accepted.options);
  assert.ok(first);
  assert.deepEqual(second, first);
  assert.equal(evaluations, 1);
  assert.equal(stringify.mock.callCount(), 1);
  assert.equal(first.message.includes(secret), false);
  assert.deepEqual(JSON.parse(first.message), {
    method: 'POST',
    url: 'https://example.invalid/callback?[REDACTED]',
    statusCode: 204,
    durationMs: 7.5,
    outcome: 'finished',
  });
});

for (const failure of [false, true]) {
  test(`actual access projection waits for terminal status after downstream ${failure ? 'error' : 'success'}`, async () => {
    const output: string[] = [];
    const filter = formatLoggerFilter({ level: 'info', child: undefined });
    const headers = Object.freeze({
      authorization: secret,
      cookie: secret,
      accept: 'application/json',
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
    const res = Object.assign(new EventEmitter(), {
      statusCode: 200,
      headersSent: false,
      writableFinished: false,
      destroyed: false,
    });
    const fake = {
      ctx: { req, res, state: {} },
      $loggerChild: (name: string, client: string) => {
        assert.equal(name, 'res');
        assert.equal(client, 'access');
        return {
          info: (message: () => string) => {
            const info = filter.transform({ level: 'info', name, message }, filter.options);
            assert.ok(info);
            output.push(info.message);
          },
        };
      },
    };
    let calls = 0;
    const error = new Error(secret);
    const execution = MiddlewareSystemHttpLog.prototype.execute.call(fake as any, {}, async () => {
      calls++;
      assert.equal(fake.ctx.req, req);
      assert.equal(req.headers.authorization, secret);
      assert.equal(req.body.token, secret);
      if (failure) throw error;
    });
    if (failure) {
      await assert.rejects(execution, value => value === error);
    } else {
      await execution;
    }
    assert.equal(calls, 1);
    assert.equal(output.length, 0);
    // The response/error mapper chooses the final status after middleware settlement.
    res.statusCode = failure ? 503 : 204;
    res.headersSent = true;
    res.writableFinished = true;
    res.emit('finish');
    res.emit('close');
    assert.equal(output.length, 1);
    assert.equal(output[0]!.includes(secret), false);
    const record = JSON.parse(output[0]!);
    assert.deepEqual(Object.keys(record).sort(), [
      'durationMs',
      'method',
      'outcome',
      'statusCode',
      'url',
    ]);
    assert.equal(record.method, 'POST');
    assert.equal(record.url, '/callback?[REDACTED]');
    assert.equal(record.statusCode, failure ? 503 : 204);
    assert.equal(record.outcome, 'finished');
    assert.ok(Number.isFinite(record.durationMs) && record.durationMs >= 0);
    assert.equal(req.url, `/callback?custom=${secret}`);
    assert.equal(headers.authorization, secret);
    assert.deepEqual(Object.getOwnPropertyDescriptor(globalThis, '__app__'), previousApp);
  });
}

for (const headersSent of [false, true]) {
  test(`aborted close snapshots ${headersSent ? 'sent' : 'null unsent'} status and wins over later finish`, async () => {
    const messages: (() => string)[] = [];
    const res = Object.assign(new EventEmitter(), {
      statusCode: 202,
      headersSent,
      writableFinished: false,
      destroyed: false,
    });
    let unrelatedFinishes = 0;
    let unrelatedCloses = 0;
    const onFinish = () => unrelatedFinishes++;
    const onClose = () => unrelatedCloses++;
    res.on('finish', onFinish);
    res.on('close', onClose);
    const fake = {
      ctx: { req: { method: 'GET', url: '/stream' }, res, state: {} },
      $loggerChild: () => ({ info: (message: () => string) => messages.push(message) }),
    };
    await MiddlewareSystemHttpLog.prototype.execute.call(fake as any, {}, async () => {});
    assert.equal(messages.length, 0);
    assert.equal(res.listenerCount('finish'), 2);
    assert.equal(res.listenerCount('close'), 2);
    res.destroyed = true;
    res.emit('close');
    assert.equal(messages.length, 1);
    assert.deepEqual(res.listeners('finish'), [onFinish]);
    assert.deepEqual(res.listeners('close'), [onClose]);
    res.headersSent = true;
    res.statusCode = 500;
    res.writableFinished = true;
    res.emit('finish');
    res.emit('close');
    assert.equal(messages.length, 1);
    const record = JSON.parse(messages[0]!());
    assert.equal(record.outcome, 'aborted');
    assert.equal(record.statusCode, headersSent ? 202 : null);
    assert.equal(unrelatedFinishes, 1);
    assert.equal(unrelatedCloses, 2);
    res.removeListener('finish', onFinish);
    res.removeListener('close', onClose);
  });
}

test('close after writableFinished is finished even without a finish event', async () => {
  const records: any[] = [];
  const res = Object.assign(new EventEmitter(), {
    statusCode: 206,
    headersSent: true,
    writableFinished: false,
    destroyed: false,
  });
  const fake = {
    ctx: { req: { method: 'GET', url: '/stream' }, res, state: {} },
    $loggerChild: () => ({ info: (message: () => string) => records.push(JSON.parse(message())) }),
  };
  await MiddlewareSystemHttpLog.prototype.execute.call(fake as any, {}, async () => {});
  res.writableFinished = true;
  res.emit('close');
  assert.equal(records.length, 1);
  assert.equal(records[0].outcome, 'finished');
  assert.equal(records[0].statusCode, 206);
  assert.equal(res.listenerCount('finish'), 0);
  assert.equal(res.listenerCount('close'), 0);
});

for (const event of ['finish', 'close']) {
  test(`early ${event} publishes immediately while next is pending, without later reclassification`, async () => {
    const messages: (() => string)[] = [];
    const res = Object.assign(new EventEmitter(), {
      statusCode: 201,
      headersSent: false,
      writableFinished: false,
      destroyed: false,
    });
    const state: { staticFileServed?: boolean } = {};
    const fake = {
      ctx: { req: { method: 'POST', url: '/pending' }, res, state },
      $loggerChild: () => ({ info: (message: () => string) => messages.push(message) }),
    };
    const ready = Promise.withResolvers<void>();
    let nextSettled = false;
    const execution = MiddlewareSystemHttpLog.prototype.execute.call(fake as any, {}, async () => {
      await ready.promise;
      state.staticFileServed = true;
      nextSettled = true;
    });
    try {
      assert.equal(messages.length, 0);
      res.writableFinished = event === 'finish';
      res.headersSent = event === 'finish';
      res.destroyed = event === 'close';
      res.emit(event);
      assert.equal(nextSettled, false);
      assert.equal(messages.length, 1, 'terminal logging must not wait for next');
      assert.equal(res.listenerCount('finish'), 0);
      assert.equal(res.listenerCount('close'), 0);
    } finally {
      ready.resolve();
      await execution;
    }
    assert.equal(nextSettled, true);
    assert.equal(state.staticFileServed, true);
    // Evaluate only after static classification changes: the terminal decision is immutable.
    const record = JSON.parse(messages[0]!());
    assert.equal(record.outcome, event === 'finish' ? 'finished' : 'aborted');
    assert.equal(record.statusCode, event === 'finish' ? 201 : null);
    res.emit('finish');
    res.emit('close');
    assert.equal(messages.length, 1);
  });
}

for (const writableFinished of [false, true]) {
  test(`already ${writableFinished ? 'finished' : 'destroyed'} response is captured once at entry`, async () => {
    const records: any[] = [];
    const res = Object.assign(new EventEmitter(), {
      statusCode: 204,
      headersSent: writableFinished,
      writableFinished,
      destroyed: true,
    });
    const fake = {
      ctx: { req: { method: 'GET', url: '/already-terminal' }, res, state: {} },
      $loggerChild: () => ({
        info: (message: () => string) => records.push(JSON.parse(message())),
      }),
    };
    let nextCalls = 0;
    await MiddlewareSystemHttpLog.prototype.execute.call(fake as any, {}, async () => {
      nextCalls++;
      assert.equal(records.length, 1);
      assert.equal(res.listenerCount('finish'), 0);
      assert.equal(res.listenerCount('close'), 0);
    });
    res.emit('finish');
    res.emit('close');
    assert.equal(nextCalls, 1);
    assert.equal(records.length, 1);
    assert.equal(records[0].outcome, writableFinished ? 'finished' : 'aborted');
    assert.equal(records[0].statusCode, writableFinished ? 204 : null);
  });
}
