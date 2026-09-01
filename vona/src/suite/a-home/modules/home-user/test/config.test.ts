import assert from 'node:assert';
import { describe, it } from 'node:test';

import { config } from '../src/config/config.ts';
import { builtinRoles } from '../src/config/roles.ts';

function createConfig(env: Record<string, string | undefined>) {
  return config({ meta: { env } } as never);
}

describe('config.test.ts', () => {
  it('uses wildcard defaults without mutating static role definitions', () => {
    const configured = createConfig({
      HOME_USER_BUILTIN_ROLE_REGISTERED_USER_SITE_IDS: 'web',
      HOME_USER_BUILTIN_ROLE_SYSTEM_ADMIN_SITE_IDS: 'web,admin',
    });
    assert.deepEqual(configured.builtinRoles.registeredUser.siteIds, ['web']);
    assert.deepEqual(configured.builtinRoles.systemAdmin.siteIds, ['web', 'admin']);
    assert.deepEqual(builtinRoles.registeredUser.siteIds, ['*']);
    assert.deepEqual(builtinRoles.systemAdmin.siteIds, ['*']);

    const defaults = createConfig({});
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
