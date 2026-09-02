import assert from 'node:assert/strict';
import test from 'node:test';

import { resourceRouteMeta } from '../../src/lib/resourceRouteMeta.ts';

function getResourceKey(url: string) {
  const resource = decodeURIComponent(url.substring('/rest/resource/'.length));
  const route = { params: { resource } };
  return {
    resource,
    componentKey: resourceRouteMeta.componentKey(route),
    tabKey: resourceRouteMeta.tabKey(route),
  };
}

test('resource root canonicalizes colon URL spellings to one component key', () => {
  const expectedKey = '/rest/resource/admin-user%3Auser';

  for (const url of [
    '/rest/resource/admin-user:user',
    '/rest/resource/admin-user%3Auser',
    '/rest/resource/admin-user%3auser',
  ]) {
    const actual = getResourceKey(url);
    assert.equal(actual.resource, 'admin-user:user');
    assert.equal(actual.componentKey, expectedKey);
    assert.equal(actual.tabKey, expectedKey);
  }
});

test('resource root keeps distinct resource workspaces separate', () => {
  const user = getResourceKey('/rest/resource/admin-user:user');
  const role = getResourceKey('/rest/resource/admin-user:role');

  assert.notEqual(user.componentKey, role.componentKey);
  assert.notEqual(user.tabKey, role.tabKey);
});
