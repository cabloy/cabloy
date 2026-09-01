import assert from 'node:assert';
import { describe, it } from 'node:test';

import { config } from '../src/config/config.ts';
import { builtinRoles } from '../src/config/roles.ts';

function createConfig(env: Record<string, string | undefined>) {
  return config({ meta: { env } } as never);
}

describe('config.test.ts', () => {
  it('uses environment overrides and defaults without mutating static role definitions', () => {
    const configured = createConfig({
      HOME_USER_PASSWORD_DEFAULT_ADMIN: 'strong-admin-password',
      HOME_USER_DISABLE_BOOTSTRAP_SYSTEM_ADMIN: 'true',
      HOME_USER_DISABLE_USER_ADMIN: 'true',
      HOME_USER_BUILTIN_ROLE_REGISTERED_USER_SITE_IDS: 'web',
      HOME_USER_BUILTIN_ROLE_SYSTEM_ADMIN_SITE_IDS: 'web,admin',
    });
    assert.equal(configured.passwordDefault.admin, 'strong-admin-password');
    assert.equal(configured.disableBootstrapSystemAdmin, true);
    assert.equal(configured.disableUserAdmin, true);
    assert.deepEqual(configured.builtinRoles.registeredUser.siteIds, ['web']);
    assert.deepEqual(configured.builtinRoles.systemAdmin.siteIds, ['web', 'admin']);
    assert.deepEqual(builtinRoles.registeredUser.siteIds, ['*']);
    assert.deepEqual(builtinRoles.systemAdmin.siteIds, ['*']);

    const defaults = createConfig({
      HOME_USER_PASSWORD_DEFAULT_ADMIN: '',
      HOME_USER_DISABLE_BOOTSTRAP_SYSTEM_ADMIN: 'false',
      HOME_USER_DISABLE_USER_ADMIN: 'invalid',
    });
    assert.equal(defaults.passwordDefault.admin, '123456');
    assert.equal(defaults.disableBootstrapSystemAdmin, false);
    assert.equal(defaults.disableUserAdmin, false);
    assert.deepEqual(defaults.builtinRoles.registeredUser.siteIds, ['*']);
    assert.deepEqual(defaults.builtinRoles.systemAdmin.siteIds, ['*']);
  });

  it('parses comma-delimited role site IDs and falls back for blank values', () => {
    const configured = createConfig({
      HOME_USER_BUILTIN_ROLE_REGISTERED_USER_SITE_IDS: ' web, admin, , store ',
      HOME_USER_BUILTIN_ROLE_SYSTEM_ADMIN_SITE_IDS: ' , ',
    });
    assert.deepEqual(configured.builtinRoles.registeredUser.siteIds, ['web', 'admin', 'store']);
    assert.deepEqual(configured.builtinRoles.systemAdmin.siteIds, ['*']);
  });

  it('rejects non-exclusive wildcard role site IDs', () => {
    assert.throws(
      () =>
        createConfig({
          HOME_USER_BUILTIN_ROLE_REGISTERED_USER_SITE_IDS: '*,web',
        }),
      /HOME_USER_BUILTIN_ROLE_REGISTERED_USER_SITE_IDS/,
    );
    assert.throws(
      () =>
        createConfig({
          HOME_USER_BUILTIN_ROLE_SYSTEM_ADMIN_SITE_IDS: 'web,*',
        }),
      /HOME_USER_BUILTIN_ROLE_SYSTEM_ADMIN_SITE_IDS/,
    );
  });
});
