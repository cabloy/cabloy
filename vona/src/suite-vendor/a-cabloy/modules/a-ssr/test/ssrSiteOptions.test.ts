import assert from 'node:assert';
import { describe, it } from 'node:test';

import type { IDecoratorSsrSiteOptions } from '../src/types/ssrSite.ts';

import { BeanSsrSiteBase } from '../src/lib/beanSsrSiteBase.ts';

function siteOptions(
  mode: string,
  demonstration = false,
  defaults = {},
  overrides = {},
): IDecoratorSsrSiteOptions {
  const owner = {
    $onionName: 'test:web',
    app: {
      meta: { env: { META_MODE: mode, DEMONSTRATION_ENABLED: String(demonstration) } },
      util: { protocol: 'http', host: 'localhost' },
    },
    bean: {
      onion: {
        ssrSite: {
          getOnionOptionsDynamic: (name: string) => {
            assert.equal(name, 'test:web');
            return { siteId: 'web', ...overrides };
          },
        },
      },
    },
    $scope: { ssr: { config: { site: { default: defaults } } } },
  };
  return Object.getOwnPropertyDescriptor(BeanSsrSiteBase.prototype, 'siteOptions')!.get!.call(
    owner,
  );
}

describe('SSR site public API origin', () => {
  it('supplies the same public origin to server and browser', () => {
    const options = siteOptions('test');
    assert.equal(options.envServer?.API_BASE_URL, 'http://localhost');
    assert.equal(options.envClient?.API_BASE_URL, 'http://localhost');
    assert.equal(options.envServer?.SSR_API_BASE_URL, 'http://localhost');
  });

  it('keeps an internal SSR transport override separate from the public origin', () => {
    const options = siteOptions(
      'test',
      false,
      {},
      {
        envServer: { SSR_API_BASE_URL: 'http://internal-api:7102' },
      },
    );
    assert.equal(options.envServer?.SSR_API_BASE_URL, 'http://internal-api:7102');
    assert.equal(options.envServer?.API_BASE_URL, 'http://localhost');
    assert.equal(options.envClient?.API_BASE_URL, 'http://localhost');
  });
});

describe('SSR site runtime mode', () => {
  it('uses production for test and production backends, keeping development and demonstration', () => {
    for (const [mode, demonstration, expected] of [
      ['test', false, 'production'],
      ['prod', false, 'production'],
      ['dev', false, 'development'],
      ['test', true, 'development'],
      ['prod', true, 'development'],
    ] as const) {
      const options = siteOptions(mode, demonstration);
      assert.equal(options.envServer?.META_MODE, expected);
      assert.equal(options.envClient?.META_MODE, expected);
    }
  });

  it('preserves explicit module defaults and dynamic Site overrides for both runtimes', () => {
    const development = {
      envServer: { META_MODE: 'development' },
      envClient: { META_MODE: 'development' },
    };
    const production = {
      envServer: { META_MODE: 'production' },
      envClient: { META_MODE: 'production' },
    };
    const defaults = siteOptions('test', false, development);
    assert.equal(defaults.envServer?.META_MODE, 'development');
    assert.equal(defaults.envClient?.META_MODE, 'development');
    const overrides = siteOptions('test', false, development, production);
    assert.equal(overrides.envServer?.META_MODE, 'production');
    assert.equal(overrides.envClient?.META_MODE, 'production');
    assert.equal(overrides.envServer?.SITE_ID, 'web');
    assert.equal(overrides.envClient?.SITE_ID, 'web');
  });
});
