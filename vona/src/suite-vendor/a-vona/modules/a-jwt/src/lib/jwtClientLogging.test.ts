import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { registerHooks } from 'node:module';
import { test } from 'node:test';
import ts from 'typescript';

const previousApp = Object.getOwnPropertyDescriptor(globalThis, '__app__');
const vonaUrl = new URL('../../../../../../../', import.meta.url);
const clientUrl = new URL('../service/jwtClient.ts?fixture=jwtLogging', import.meta.url).href;
const formatterUrl = new URL('packages-vona/vona-core/src/lib/core/logger/utils.ts', vonaUrl).href;
const checkUrl = new URL('packages-utils/utils/src/check.ts', vonaUrl).href;
const utilsUrl = new URL('packages-utils/utils/src/utils.ts', vonaUrl).href;
const castUrl = new URL('packages-vona/vona-core/src/types/utils/cast.ts', vonaUrl).href;
const fixture = (source: string) => `data:text/javascript,${encodeURIComponent(source)}`;
const frameworkFixture = fixture(`
  export class BeanBase {}
  export { cast } from ${JSON.stringify(castUrl)};
  export function deepExtend() { throw new Error('unexpected client initialization'); }
`);
const utilityFixture = fixture(`
  export { isNil } from ${JSON.stringify(checkUrl)};
  export { catchError } from ${JSON.stringify(utilsUrl)};
`);
const hooks = registerHooks({
  resolve(specifier, context, nextResolve) {
    if (context.parentURL === clientUrl) {
      if (specifier === 'vona') return { url: frameworkFixture, shortCircuit: true };
      if (specifier === '@cabloy/utils') return { url: utilityFixture, shortCircuit: true };
      if (specifier === 'vona-module-a-bean') {
        return {
          url: fixture('export function Service() { return () => {}; }'),
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
    if (url === clientUrl) {
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
const { ServiceJwtClient, formatLoggerFilter } = await (async () => {
  try {
    return { ...(await import(clientUrl)), ...(await import(formatterUrl)) };
  } finally {
    hooks.deregister();
  }
})();

const secret = 'synthetic-jwt-secret-sentinel';

for (const operation of ['sign', 'verify'] as const) {
  for (const failure of [false, true]) {
    test(`actual JWT ${operation} debug log, ${failure ? 'error' : 'success'}`, async () => {
      const output: string[] = [];
      const filter = formatLoggerFilter({ level: 'debug', child: undefined });
      const error = new Error(secret);
      const payloadData = Object.freeze({ value: secret });
      const options = Object.freeze({ path: '/callback', expiresIn: 60 });
      const signOptions = Object.freeze({ issuer: 'synthetic-test' });
      const verifyOptions = Object.freeze({ issuer: 'synthetic-test' });
      let calls = 0;
      const fake: any = {
        _clientName: 'access',
        _clientOptions: { secret, signOptions, verifyOptions },
        fieldClient: 'client',
        fieldPath: 'path',
        fieldData: 'data',
        _signInner: ServiceJwtClient.prototype['_signInner'],
        _verifyInner: ServiceJwtClient.prototype['_verifyInner'],
        _checkVerifyPath: ServiceJwtClient.prototype._checkVerifyPath,
        scope: { service: { jwtExtract: { fromAllWays: () => secret } } },
        app: {
          throw: () => {
            throw new Error('unexpected authentication change');
          },
        },
        $loggerChild: (name: string) => {
          assert.equal(name, 'jwt');
          return {
            debug: (message: any) => {
              const info = filter.transform({ level: 'debug', message }, filter.options);
              assert.ok(info);
              output.push(JSON.stringify(info));
            },
          };
        },
        _jwtInstance: {
          sign: (payload: any, key: string, passedOptions: any, callback: any) => {
            calls++;
            assert.equal(key, secret);
            assert.equal(payload.data, payloadData);
            assert.equal(payload.client, 'access');
            assert.equal(payload.path, '/callback');
            assert.deepEqual(passedOptions, { ...signOptions, expiresIn: 60 });
            callback(failure ? error : null, failure ? undefined : secret);
          },
          verify: (token: string, key: string, passedOptions: any, callback: any) => {
            calls++;
            assert.equal(token, secret);
            assert.equal(key, secret);
            assert.equal(passedOptions, verifyOptions);
            callback(
              failure ? error : null,
              failure
                ? undefined
                : {
                    client: 'access',
                    path: '/callback',
                    data: payloadData,
                  },
            );
          },
        },
      };
      const execution =
        operation === 'sign'
          ? ServiceJwtClient.prototype.sign.call(fake, payloadData, options)
          : ServiceJwtClient.prototype.verify.call(fake, secret, options);
      if (failure) {
        await assert.rejects(execution, value => value === error);
      } else {
        assert.equal(await execution, operation === 'sign' ? secret : payloadData);
      }
      assert.equal(calls, 1);
      assert.equal(output.length, 1);
      assert.equal(output.join('\n').includes(secret), false);
      assert.equal(
        JSON.parse(output[0]!).message,
        `jwt.${operation}: ${failure ? 'failed' : 'completed'}`,
      );
      assert.deepEqual(Object.getOwnPropertyDescriptor(globalThis, '__app__'), previousApp);
    });
  }
}

test('JWT extraction and missing-token behavior retain safe debug diagnostics', async () => {
  const output: string[] = [];
  let extracted = 0;
  const fake = {
    _clientName: 'access',
    scope: {
      service: {
        jwtExtract: {
          fromAllWays: () => {
            extracted++;
            return undefined;
          },
        },
      },
    },
    _verifyInner: ServiceJwtClient.prototype['_verifyInner'],
    $loggerChild: () => ({ debug: (message: () => string) => output.push(message()) }),
  };
  assert.equal(await ServiceJwtClient.prototype.verify.call(fake as any), undefined);
  assert.equal(extracted, 1);
  assert.deepEqual(output, ['jwt.verify: completed']);
});
