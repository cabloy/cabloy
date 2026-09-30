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
      name: 'test:shared',
      beanOptions: {
        options: {
          site: ['test:admin', 'test:web'],
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
      name: 'test:unbound',
      beanOptions: {
        options: { site: [], item: { roles: [] } },
      },
    },
  ] as any;
}

describe('ssrMenuEligibility.test.ts', () => {
  it('preserves optional locale matching and scalar or array bindings', () => {
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
        ssrMenuName: 'test:shared',
        onionName: 'test:shared',
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
        ssrMenuName: 'test:shared',
        onionName: 'test:shared',
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
    assert.deepEqual(resolveSsrMenuEligibility('test:admin', 'test:shared', menus), {
      ssrSiteName: 'test:admin',
      ssrMenuName: 'test:shared',
      rolesDefined: true,
    });
    assert.deepEqual(resolveSsrMenuEligibility('test:web', 'test:shared', menus), {
      ssrSiteName: 'test:web',
      ssrMenuName: 'test:shared',
      rolesDefined: true,
    });
  });

  it('rejects invalid menu and group sites before catalog partitioning or eligibility lookup', () => {
    const sites = [{ ssrSiteName: 'test:admin', title: 'Admin' }];
    for (const site of [undefined, null, '', '  ', [''], ['test:admin', null]]) {
      const invalid = [{ name: 'test:invalid', beanOptions: { options: { site } } }] as any;
      assert.throws(() => resolveSsrMenuCatalog(sites, invalid), /site for test:invalid/);
      assert.throws(() => resolveSsrMenuCatalog([], [], invalid), /site for test:invalid/);
      assert.throws(
        () =>
          resolveSsrMenuEligibility('test:admin', 'test:shared', [...createMenus(), ...invalid]),
        /site for test:invalid/,
      );
    }
    const missing = [{ name: 'test:missingOptions', beanOptions: {} }] as any;
    assert.throws(() => resolveSsrMenuCatalog(sites, missing), /site for test:missingOptions/);
    assert.throws(
      () => resolveSsrMenuEligibility('test:admin', 'test:missing', missing),
      /site for test:missingOptions/,
    );
  });

  it('partitions scalar and shared groups and accepts empty menu or group site arrays', () => {
    const groups = [
      { name: 'test:adminGroup', beanOptions: { options: { site: 'test:admin', item: {} } } },
      {
        name: 'test:sharedGroup',
        beanOptions: { options: { site: ['test:admin', 'test:web'], item: {} } },
      },
      { name: 'test:unboundGroup', beanOptions: { options: { site: [], item: {} } } },
    ] as any;
    const catalog = resolveSsrMenuCatalog(
      [
        { ssrSiteName: 'test:admin', title: 'Admin' },
        { ssrSiteName: 'test:web', title: 'Web' },
        { ssrSiteName: 'test:future', title: 'Future' },
      ],
      createMenus(),
      groups,
    );
    assert.deepEqual(
      catalog.groups.map(group => [group.ssrSiteName, group.ssrMenuGroupName]),
      [
        ['test:admin', 'test:adminGroup'],
        ['test:admin', 'test:sharedGroup'],
        ['test:web', 'test:sharedGroup'],
      ],
    );
    assert.equal(
      catalog.menus.some(menu => menu.ssrMenuName === 'test:unbound'),
      false,
    );
    assert.equal(
      catalog.menus.some(menu => menu.ssrSiteName === 'test:future'),
      false,
    );
    assert.equal(resolveSsrMenuEligibility('test:web', 'test:unbound', createMenus()), undefined);
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
    assert.equal(resolveSsrMenuEligibility('test:admin', 'test:unbound', menus), undefined);
  });
});
