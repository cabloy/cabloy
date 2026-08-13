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
  const publicOptions = resolveSsrProfileOptions('public', profiles);
  const sessionOptions = resolveSsrProfileOptions('session', profiles);

  assert.equal(publicOptions.useCookie, false);
  assert.equal(sessionOptions.useCookie, true);
  assert.deepEqual(publicOptions.responseCache, { expires: '10m' });
  assert.deepEqual(sessionOptions.responseCache, { expires: 0 });
});

test('SSR route options override only the response-cache policy', () => {
  const override = resolveSsrProfileOptions('public', profiles, {
    responseCache: { expires: '5m' },
  });
  const disabled = resolveSsrProfileOptions('public', profiles, { responseCache: false });

  assert.equal(override.useCookie, false);
  assert.deepEqual(override.responseCache, { expires: '5m' });
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
