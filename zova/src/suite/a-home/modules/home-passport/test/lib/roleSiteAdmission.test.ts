import assert from 'node:assert/strict';
import test from 'node:test';
import { isRoleSiteAdmitted } from 'zova-module-home-base';

test('admits an exact site match', () => {
  assert.equal(isRoleSiteAdmitted('web', [{ siteIds: ['web'] }]), true);
  assert.equal(isRoleSiteAdmitted('admin', [{ siteIds: ['web'] }]), false);
});

test('admits every non-empty site through the wildcard', () => {
  assert.equal(isRoleSiteAdmitted('web', [{ siteIds: ['*'] }]), true);
  assert.equal(isRoleSiteAdmitted('admin', [{ siteIds: ['*'] }]), true);
  assert.equal(isRoleSiteAdmitted(undefined, [{ siteIds: ['*'] }]), false);
  assert.equal(isRoleSiteAdmitted('', [{ siteIds: ['*'] }]), false);
});

test('combines site admission across roles', () => {
  assert.equal(isRoleSiteAdmitted('admin', [{ siteIds: ['web'] }, { siteIds: ['admin'] }]), true);
  assert.equal(
    isRoleSiteAdmitted('web', [{ siteIds: ['storefront'] }, { siteIds: ['admin'] }]),
    false,
  );
});
