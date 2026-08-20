import assert from 'node:assert';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';

describe('origin.test.ts', { concurrency: false }, () => {
  it('keeps normal CORS separate from exact credential-link authorization', async () => {
    await withWhiteList('*', async () => {
      assert.equal(
        app.bean.security.checkOrigin('https://untrusted.example.test', 'api.example.test'),
        'https://untrusted.example.test',
      );
      assert.equal(
        app.bean.security.checkOriginExact('https://untrusted.example.test', 'api.example.test'),
        '',
      );
      assert.equal(app.bean.security.checkOrigin(undefined, 'api.example.test'), 'null');
      assert.equal(app.bean.security.checkOriginExact(undefined, 'api.example.test'), '');
      const sameOrigin = `${app.ctx.protocol}://api.example.test`;
      assert.equal(
        app.bean.security.checkOriginExact(sameOrigin, 'api.example.test'),
        new URL(sameOrigin).origin,
      );
    });
  });

  it('allows loopback origins across development ports while default CORS remains closed', async () => {
    await withWhiteList([], async () => {
      for (const [origin, host] of [
        ['http://localhost:9000', 'localhost:7102'],
        ['http://127.0.0.1:9000', 'localhost:7102'],
        ['http://[::1]:9000', '127.0.0.1:7102'],
      ]) {
        assert.equal(app.bean.security.checkOrigin(origin, host), new URL(origin).origin);
      }
      assert.equal(
        app.bean.security.checkOrigin('http://localhost.evil.test:9000', 'localhost:7102'),
        '',
      );
      assert.equal(app.bean.security.checkOrigin('http://127.0.0.2:9000', 'localhost:7102'), '');
      assert.equal(
        app.bean.security.checkOrigin('https://untrusted.example.test', 'api.example.test'),
        '',
      );
    });
  });

  it('accepts normalized explicit HTTP(S) origins only', async () => {
    await withWhiteList(['http://localhost:9000', 'https://App.Example.Test:443/'], async () => {
      assert.equal(
        app.bean.security.checkOriginExact('http://localhost:9000'),
        'http://localhost:9000',
      );
      assert.equal(
        app.bean.security.checkOriginExact('https://app.example.test'),
        'https://app.example.test',
      );
      assert.equal(app.bean.security.checkOriginExact('https://app.example.test:444'), '');
      assert.equal(app.bean.security.checkOriginExact('https://other.example.test'), '');
    });
  });

  it('supports exact same-origin authorization alongside whitelist and loopback policies', async () => {
    await withWhiteList([], async () => {
      const sameOrigin = `${app.ctx.protocol}://app.example.test`;
      assert.equal(
        app.bean.security.checkOriginExact(sameOrigin, 'app.example.test'),
        new URL(sameOrigin).origin,
      );
      assert.equal(
        app.bean.security.checkOriginExact(
          `${app.ctx.protocol}://APP.EXAMPLE.TEST`,
          'app.example.test',
        ),
        new URL(sameOrigin).origin,
      );
      const defaultPort = app.ctx.protocol === 'https' ? 443 : 80;
      assert.equal(
        app.bean.security.checkOriginExact(sameOrigin, `app.example.test:${defaultPort}`),
        new URL(sameOrigin).origin,
      );
      assert.equal(
        app.bean.security.checkOriginExact(
          app.ctx.protocol === 'https' ? 'http://app.example.test' : 'https://app.example.test',
          'app.example.test',
        ),
        '',
      );
      assert.equal(
        app.bean.security.checkOriginExact(
          `${app.ctx.protocol}://app.example.test:444`,
          'app.example.test',
        ),
        '',
      );
      assert.equal(
        app.bean.security.checkOriginExact(
          `${app.ctx.protocol}://app.example.test.evil.test`,
          'app.example.test',
        ),
        '',
      );
      assert.equal(app.bean.security.checkOriginExact(sameOrigin, undefined), '');
      assert.equal(app.bean.security.checkOriginExact(sameOrigin, 'app.example.test/path'), '');

      for (const origin of [
        'http://localhost:9000',
        'http://127.0.0.1:9000',
        'http://[::1]:9000',
      ]) {
        for (const host of ['localhost:7102', '127.0.0.1:7102', '[::1]:7102']) {
          assert.equal(app.bean.security.checkOriginExact(origin, host), new URL(origin).origin);
        }
      }
      assert.equal(
        app.bean.security.checkOriginExact('http://localhost:9000', 'localhost.evil.test:7102'),
        '',
      );
      assert.equal(
        app.bean.security.checkOriginExact('http://localhost:9000', '192.168.1.10:7102'),
        '',
      );
    });

    await withWhiteList(['https://app.example.test'], async () => {
      assert.equal(
        app.bean.security.checkOriginExact('https://app.example.test'),
        'https://app.example.test',
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
        assert.equal(app.bean.security.checkOriginExact('https://app.example.test'), '');
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
        assert.equal(app.bean.security.checkOriginExact(origin), '');
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
