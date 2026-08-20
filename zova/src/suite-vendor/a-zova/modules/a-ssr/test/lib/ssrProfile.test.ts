import type { ZovaConfigSsrProfile } from 'zova';

import assert from 'node:assert/strict';
import test from 'node:test';

import type { ISsrRouteProfileOptions } from '../../src/types/ssr.ts';

import { resolveSsrProfile, resolveSsrProfileOptions } from '../../src/lib/ssrProfile.ts';

const profiles = {
  public: {
    useCookie: true,
    responseCache: { expires: '10m' },
  },
  session: {
    useCookie: true,
    responseCache: { expires: 0 },
  },
} satisfies Record<'public' | 'session', ZovaConfigSsrProfile>;

test('SSR profiles resolve route metadata before flavor defaults', () => {
  assert.equal(resolveSsrProfile('session', 'public'), 'session');
  assert.equal(resolveSsrProfile('public', 'session'), 'public');
  assert.equal(resolveSsrProfile(undefined, 'session'), 'session');
  assert.equal(resolveSsrProfile(undefined, undefined), 'public');
});

test('SSR profiles reject invalid values', () => {
  assert.throws(
    () => resolveSsrProfile('invalid' as any, 'public'),
    /invalid SSR profile: invalid/,
  );
  assert.throws(() => resolveSsrProfile(undefined, 'invalid'), /invalid SSR profile: invalid/);
  assert.throws(
    () => resolveSsrProfileOptions('session', { public: profiles.public } as any),
    /invalid SSR profile: session/,
  );
});

test('SSR profile options enforce the public cookie boundary', () => {
  const publicOptions = resolveSsrProfileOptions('public', profiles, undefined, true);
  const sessionOptions = resolveSsrProfileOptions('session', profiles);

  assert.equal(publicOptions.useCookie, false);
  assert.equal(sessionOptions.useCookie, true);
  assert.deepEqual(publicOptions.responseCache, { expires: '10m' });
  assert.deepEqual(sessionOptions.responseCache, { expires: 0 });
});

test('SSR public profiles disable default caching without URL locale metadata', () => {
  const missingLocale = resolveSsrProfileOptions('public', profiles);
  const falseLocale = resolveSsrProfileOptions('public', profiles, undefined, false);
  const sessionOptions = resolveSsrProfileOptions('session', profiles);

  assert.deepEqual(missingLocale.responseCache, { expires: 0 });
  assert.deepEqual(falseLocale.responseCache, { expires: 0 });
  assert.deepEqual(sessionOptions.responseCache, { expires: 0 });
  assert.ok(Object.isFrozen(missingLocale.responseCache));
  assert.notEqual(missingLocale.responseCache, falseLocale.responseCache);
});

test('SSR route options override locale-aware cache defaults', () => {
  const unlocalizedOverride = resolveSsrProfileOptions('public', profiles, {
    responseCache: { expires: '5m' },
  });
  const localeAwareOverride = resolveSsrProfileOptions(
    'public',
    profiles,
    { responseCache: { expires: '5m' } },
    true,
  );
  const disabled = resolveSsrProfileOptions('public', profiles, { responseCache: false }, true);

  assert.equal(unlocalizedOverride.useCookie, false);
  assert.deepEqual(unlocalizedOverride.responseCache, { expires: '5m' });
  assert.deepEqual(localeAwareOverride.responseCache, { expires: '5m' });
  assert.equal(disabled.responseCache, false);
});

test('SSR profile options are fresh immutable snapshots', () => {
  const routeOptions: ISsrRouteProfileOptions = {
    responseCache: { expires: '5m' },
  };
  const profileOptions: Record<'public' | 'session', ZovaConfigSsrProfile> = {
    public: { useCookie: false, responseCache: { expires: '10m' } },
    session: { useCookie: true, responseCache: { expires: 0 } },
  };
  const first = resolveSsrProfileOptions('public', profileOptions, routeOptions);
  const second = resolveSsrProfileOptions('public', profileOptions, routeOptions);

  assert.notEqual(first, second);
  assert.notEqual(first.responseCache, second.responseCache);
  assert.ok(Object.isFrozen(first));
  assert.ok(Object.isFrozen(first.responseCache));

  (routeOptions.responseCache as { expires: string }).expires = '1m';
  (profileOptions.public.responseCache as { expires: string }).expires = '1h';
  assert.deepEqual(first.responseCache, { expires: '5m' });
  assert.deepEqual(second.responseCache, { expires: '5m' });

  assert.throws(() => {
    (first as any).useCookie = true;
  }, TypeError);
  assert.throws(() => {
    (first.responseCache as { expires: string }).expires = '2m';
  }, TypeError);
});
