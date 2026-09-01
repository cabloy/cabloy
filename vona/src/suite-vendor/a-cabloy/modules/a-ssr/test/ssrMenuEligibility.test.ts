import assert from 'node:assert';
import { describe, it } from 'node:test';

import {
  checkSsrBinding,
  resolveSsrMenuCatalog,
  resolveSsrMenuEligibility,
} from '../src/lib/ssrMenuEligibility.ts';

function createMenus() {
  return [
    {
      name: 'test:omitted',
      beanOptions: {
        options: {
          item: { roles: [] },
          locale: ['en-us'],
        },
      },
    },
    {
      name: 'test:keyed',
      beanOptions: {
        options: {
          site: ['test:admin', 'test:web'],
          items: {
            static: { roles: ['systemAdmin'] },
            public: {},
          },
        },
      },
    },
    {
      name: 'test:malformed',
      beanOptions: {},
    },
  ] as any;
}

describe('ssrMenuEligibility.test.ts', () => {
  it('matches unset, scalar, or array bindings', () => {
    assert.equal(checkSsrBinding('test:admin', undefined), true);
    assert.equal(checkSsrBinding('test:admin', null), true);
    assert.equal(checkSsrBinding('test:admin', ''), true);
    assert.equal(checkSsrBinding('test:admin', 'test:admin'), true);
    assert.equal(checkSsrBinding('test:web', 'test:admin'), false);
    assert.equal(checkSsrBinding('test:web', ['test:admin', 'test:web']), true);
    assert.equal(checkSsrBinding('en-us', ['zh-cn', 'en-us']), true);
    assert.equal(checkSsrBinding('en-us', []), false);
  });

  it('derives every enabled-site partition with site and onion identities', () => {
    const catalog = resolveSsrMenuCatalog(
      [
        { ssrSiteName: 'test:admin', title: 'Admin' },
        { ssrSiteName: 'test:web', title: 'Web' },
      ],
      createMenus(),
    );
    assert.deepEqual(catalog.sites, [
      { ssrSiteName: 'test:admin', title: 'Admin' },
      { ssrSiteName: 'test:web', title: 'Web' },
    ]);
    assert.deepEqual(catalog.menus, [
      {
        ssrSiteName: 'test:admin',
        ssrMenuName: 'test:omitted',
        onionName: 'test:omitted',
        roles: [],
      },
      {
        ssrSiteName: 'test:admin',
        ssrMenuName: 'test:keyed#static',
        onionName: 'test:keyed',
        roles: ['systemAdmin'],
      },
      {
        ssrSiteName: 'test:admin',
        ssrMenuName: 'test:keyed#public',
        onionName: 'test:keyed',
        roles: undefined,
      },
      {
        ssrSiteName: 'test:web',
        ssrMenuName: 'test:omitted',
        onionName: 'test:omitted',
        roles: [],
      },
      {
        ssrSiteName: 'test:web',
        ssrMenuName: 'test:keyed#static',
        onionName: 'test:keyed',
        roles: ['systemAdmin'],
      },
      {
        ssrSiteName: 'test:web',
        ssrMenuName: 'test:keyed#public',
        onionName: 'test:keyed',
        roles: undefined,
      },
    ]);
  });

  it('resolves final leaves independently of locale', () => {
    const menus = createMenus();
    assert.deepEqual(resolveSsrMenuEligibility('test:admin', 'test:omitted', menus), {
      ssrSiteName: 'test:admin',
      ssrMenuName: 'test:omitted',
      rolesDefined: true,
    });
    assert.deepEqual(resolveSsrMenuEligibility('test:web', 'test:omitted', menus), {
      ssrSiteName: 'test:web',
      ssrMenuName: 'test:omitted',
      rolesDefined: true,
    });
  });

  it('distinguishes dynamic/static leaves from public leaves and exact keyed names', () => {
    const menus = createMenus();
    assert.deepEqual(resolveSsrMenuEligibility('test:admin', 'test:keyed#static', menus), {
      ssrSiteName: 'test:admin',
      ssrMenuName: 'test:keyed#static',
      rolesDefined: true,
    });
    assert.deepEqual(resolveSsrMenuEligibility('test:web', 'test:keyed#public', menus), {
      ssrSiteName: 'test:web',
      ssrMenuName: 'test:keyed#public',
      rolesDefined: false,
    });
    assert.equal(resolveSsrMenuEligibility('test:admin', 'test:keyed', menus), undefined);
    assert.equal(resolveSsrMenuEligibility('test:other', 'test:keyed#static', menus), undefined);
    assert.equal(resolveSsrMenuEligibility('test:admin', 'test:missing', menus), undefined);
    assert.equal(resolveSsrMenuEligibility('test:admin', 'test:malformed', menus), undefined);
  });
});
