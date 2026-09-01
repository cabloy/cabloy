import assert from 'node:assert';
import { describe, it } from 'node:test';

import {
  projectPublicSsrMenuGroups,
  projectPublicSsrMenus,
  resolveSsrMenuVisibilityDefault,
  resolveVisibleSsrMenuGroups,
} from '../src/lib/ssrMenuVisibility.ts';

function createMenus() {
  return [
    { name: 'test:public', title: 'Public', group: 'root' },
    { name: 'test:dynamic', title: 'Dynamic', roles: [], group: 'root' },
    { name: 'test:static', title: 'Static', roles: ['member'] },
  ] as any;
}

describe('ssrMenuVisibility.test.ts', () => {
  it('distinguishes public, dynamic-only, and static leaves', () => {
    const menus = createMenus();
    assert.deepEqual(
      resolveSsrMenuVisibilityDefault(menus, roles => roles.includes('member')),
      [menus[0], menus[2]],
    );
    assert.deepEqual(
      resolveSsrMenuVisibilityDefault(menus, () => false),
      [menus[0]],
    );
  });

  it('retains only groups that contain a visible descendant', () => {
    const groups = [
      { name: 'root', title: 'Root' },
      { name: 'nested', title: 'Nested', group: 'root' },
      { name: 'empty', title: 'Empty' },
    ];
    const menus = [{ name: 'test:visible', group: 'nested' }] as any;
    assert.deepEqual(resolveVisibleSsrMenuGroups(menus, groups), [groups[0], groups[1]]);
  });

  it('projects only public menu and group fields', () => {
    const menus = [
      {
        name: 'test:private',
        title: 'Private',
        roles: ['member'],
        policyRevision: 'private',
        associationState: 'private',
      },
    ] as any;
    const groups = [{ name: 'root', title: 'Root', catalogState: 'private' }] as any;
    const result = {
      menus: projectPublicSsrMenus(menus),
      groups: projectPublicSsrMenuGroups(groups),
    };
    assert.deepEqual(result.menus, [{ name: 'test:private', title: 'Private' }]);
    assert.deepEqual(result.groups, [{ name: 'root', title: 'Root' }]);
    const serialized = JSON.stringify(result);
    for (const forbidden of ['roles', 'policyRevision', 'associationState', 'catalogState']) {
      assert.equal(serialized.includes(forbidden), false, forbidden);
    }
  });
});
