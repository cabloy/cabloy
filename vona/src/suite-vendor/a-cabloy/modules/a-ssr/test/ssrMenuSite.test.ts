import assert from 'node:assert';
import { describe, it } from 'node:test';

import type { IDecoratorSsrMenuOptions } from '../src/types/ssrMenu.ts';
import type { IDecoratorSsrMenuGroupOptions } from '../src/types/ssrMenuGroup.ts';
import type { IDecoratorSsrSiteOptions } from '../src/types/ssrSite.ts';

import { BeanSsrSiteBase } from '../src/lib/beanSsrSiteBase.ts';
import { SsrMenu } from '../src/lib/ssrMenu.ts';
import { SsrMenuGroup } from '../src/lib/ssrMenuGroup.ts';
import { validateSsrMenuSite } from '../src/lib/ssrMenuSite.ts';

function checkSiteTypes() {
  // @ts-expect-error SSR menus must explicitly bind a site
  const menu: IDecoratorSsrMenuOptions<IDecoratorSsrSiteOptions> = { item: {} };
  // @ts-expect-error SSR menu groups must explicitly bind a site
  const group: IDecoratorSsrMenuGroupOptions<IDecoratorSsrSiteOptions> = { item: {} };
  // @ts-expect-error SSR menu decorator options are required
  SsrMenu();
  // @ts-expect-error SSR menu group decorator options are required
  SsrMenuGroup();
  return { menu, group };
}
void checkSiteTypes;

function prepareMenus(options: unknown, locale = 'en-us') {
  const owner = {
    $onionName: 'test:admin',
    $scope: { ssr: { service: { ssr: { prepareMenuLink: (link: unknown) => link } } } },
  };
  return (BeanSsrSiteBase.prototype as any)._prepareMenusOrGroups.call(owner, locale, [
    { name: 'test:menu', beanOptions: { options } },
  ]);
}

describe('ssrMenuSite.test.ts', () => {
  it('requires explicit nonblank sites in both decorators, including array entries', () => {
    for (const site of [
      undefined,
      null,
      '',
      ' \t ',
      1,
      false,
      {},
      [''],
      ['test:admin', undefined],
      Array.from({ length: 1 }),
    ]) {
      assert.throws(() => validateSsrMenuSite(site, 'test:menu'), /site for test:menu/);
      assert.throws(() => SsrMenu({ site } as any), /site for SsrMenu/);
      assert.throws(() => SsrMenuGroup({ site } as any), /site for SsrMenuGroup/);
    }
    assert.throws(() => SsrMenu(undefined as any), /explicitly specify site/);
    assert.throws(() => SsrMenu({} as any), /explicitly specify site/);
    assert.throws(() => SsrMenuGroup(undefined as any), /explicitly specify site/);
    assert.throws(() => SsrMenuGroup({} as any), /explicitly specify site/);
  });

  it('accepts scalar sites, explicit sharing, and empty arrays without changing their values', () => {
    for (const site of ['test:admin', ['test:admin', 'test:web'], []]) {
      assert.doesNotThrow(() => validateSsrMenuSite(site, 'test:menu'));
      assert.equal(typeof SsrMenu({ site } as any), 'function');
      assert.equal(typeof SsrMenuGroup({ site } as any), 'function');
    }
  });

  it('validates effective options before rendered menu site or locale filtering', () => {
    for (const site of [undefined, null, '', '  ', ['']]) {
      assert.throws(
        () => prepareMenus({ site, locale: ['zh-cn'], item: {} }),
        /site for test:menu/,
      );
    }
    assert.throws(() => prepareMenus(undefined), /site for test:menu/);
  });

  it('preserves optional locale behavior and renders only explicitly bound menus or groups', () => {
    const expected = [
      { name: 'test:menu', title: undefined, description: undefined, link: undefined },
    ];
    assert.deepEqual(prepareMenus({ site: 'test:admin', item: {} }), expected);
    assert.deepEqual(prepareMenus({ site: ['test:admin', 'test:web'], item: {} }), expected);
    assert.deepEqual(prepareMenus({ site: [], item: {} }), []);
    assert.deepEqual(prepareMenus({ site: 'test:web', item: {} }), []);
    assert.deepEqual(prepareMenus({ site: 'test:admin', locale: ['zh-cn'], item: {} }), []);
    assert.deepEqual(prepareMenus({ site: 'test:admin', locale: ['en-us'], item: {} }), expected);
    assert.deepEqual(prepareMenus({ site: 'test:admin', locale: [], item: {} }), []);
  });
});
