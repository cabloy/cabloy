import assert from 'node:assert';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';

describe('origin.test.ts', { concurrency: false }, () => {
  it('keeps the normal CORS policy while credential-link mode requires explicit exact origins', async () => {
    await withWhiteList('*', async () => {
      assert.equal(
        app.bean.security.checkOrigin('https://untrusted.example.test', 'api.example.test'),
        'https://untrusted.example.test',
      );
      assert.equal(
        app.bean.security.checkOrigin('https://untrusted.example.test', 'api.example.test', {
          exact: true,
        }),
        '',
      );
      assert.equal(app.bean.security.checkOrigin(undefined, 'api.example.test'), 'null');
      assert.equal(
        app.bean.security.checkOrigin(undefined, 'api.example.test', { exact: true }),
        '',
      );
      assert.equal(
        app.bean.security.checkOrigin('https://api.example.test', 'api.example.test', {
          exact: true,
        }),
        '',
      );
    });
  });

  it('allows localhost origins across development ports while default CORS remains closed', async () => {
    await withWhiteList([], async () => {
      assert.equal(
        app.bean.security.checkOrigin('http://localhost:9000', 'localhost:7102'),
        'http://localhost:9000',
      );
      assert.equal(
        app.bean.security.checkOrigin('http://localhost.evil.test:9000', 'localhost:7102'),
        '',
      );
      assert.equal(app.bean.security.checkOrigin('http://127.0.0.1:9000', 'localhost:7102'), '');
      assert.equal(
        app.bean.security.checkOrigin('https://untrusted.example.test', 'api.example.test'),
        '',
      );
    });
  });

  it('accepts normalized explicit HTTP(S) origins only', async () => {
    await withWhiteList(['http://localhost:9000', 'https://App.Example.Test:443/'], async () => {
      assert.equal(
        app.bean.security.checkOrigin('http://localhost:9000', undefined, { exact: true }),
        'http://localhost:9000',
      );
      assert.equal(
        app.bean.security.checkOrigin('https://app.example.test', undefined, { exact: true }),
        'https://app.example.test',
      );
      assert.equal(
        app.bean.security.checkOrigin('https://app.example.test:444', undefined, { exact: true }),
        '',
      );
      assert.equal(
        app.bean.security.checkOrigin('https://other.example.test', undefined, { exact: true }),
        '',
      );
    });
  });

  it('allows an opt-in canonical same origin without a whitelist entry', async () => {
    await withWhiteList([], async () => {
      const protocol = app.ctx.protocol;
      const origin = `${protocol}://app.example.test`;
      const defaultPort = protocol === 'https' ? ':443' : ':80';
      const otherProtocol = protocol === 'https' ? 'http' : 'https';
      assert.equal(
        app.bean.security.checkOrigin(origin, `app.example.test${defaultPort}`, {
          exact: true,
          allowSameOrigin: true,
        }),
        origin,
      );
      assert.equal(
        app.bean.security.checkOrigin(origin, 'app.example.test', {
          exact: true,
          allowSameOrigin: true,
        }),
        origin,
      );
      assert.equal(
        app.bean.security.checkOrigin(origin, 'app.example.test:8443', {
          exact: true,
          allowSameOrigin: true,
        }),
        '',
      );
      assert.equal(
        app.bean.security.checkOrigin(`${otherProtocol}://app.example.test`, 'app.example.test', {
          exact: true,
          allowSameOrigin: true,
        }),
        '',
      );
      assert.equal(app.bean.security.checkOrigin(origin, 'app.example.test', { exact: true }), '');
    });
  });

  it('allows localhost consumer origins only in dev/test mode with a localhost API host', async () => {
    await withWhiteList([], async () => {
      assert.equal(
        app.bean.security.checkOrigin('http://localhost:9000', 'localhost:7102', {
          exact: true,
          allowLocalhost: true,
        }),
        'http://localhost:9000',
      );
      assert.equal(
        app.bean.security.checkOrigin('http://localhost:9001', 'localhost', {
          exact: true,
          allowLocalhost: true,
        }),
        'http://localhost:9001',
      );
      assert.equal(
        app.bean.security.checkOrigin('http://localhost:9000', 'localhost.evil.test:7102', {
          exact: true,
          allowLocalhost: true,
        }),
        '',
      );
      assert.equal(
        app.bean.security.checkOrigin('http://127.0.0.1:9000', 'localhost:7102', {
          exact: true,
          allowLocalhost: true,
        }),
        '',
      );
      assert.equal(
        app.bean.security.checkOrigin('http://localhost:9000', 'localhost:7102', { exact: true }),
        '',
      );
    });
  });

  it('rejects wildcard, suffix, and non-origin whitelist entries in credential-link mode', async () => {
    for (const whiteList of [
      ['*.example.test'],
      ['.example.test'],
      ['example.test'],
      ['https://app.example.test/account'],
      ['https://app.example.test?source=config'],
      ['https://user@app.example.test'],
    ]) {
      await withWhiteList(whiteList, async () => {
        assert.equal(
          app.bean.security.checkOrigin('https://app.example.test', undefined, { exact: true }),
          '',
        );
      });
    }
  });

  it('rejects non-origin caller values in credential-link mode', async () => {
    await withWhiteList(['https://app.example.test'], async () => {
      for (const origin of [
        undefined,
        null,
        'null',
        'https://user@app.example.test',
        'https://app.example.test/path',
        'https://app.example.test?query=value',
        'https://app.example.test#fragment',
        'javascript:alert(1)',
        'file:///account/password-reset',
      ]) {
        assert.equal(app.bean.security.checkOrigin(origin, undefined, { exact: true }), '');
      }
    });
  });
});

async function withWhiteList(whiteList: string | string[], fn: () => Promise<void>) {
  await app.bean.executor.mockCtx(async () => {
    const options =
      app.bean.onion.middlewareSystem.getOnionSlice('a-security:cors').beanOptions.options;
    const whiteListPrevious = options.whiteList;
    options.whiteList = Array.isArray(whiteList) ? [...whiteList] : whiteList;
    try {
      await fn();
    } finally {
      options.whiteList = whiteListPrevious;
    }
  });
}
