import type { ZovaConfigSsrProfile } from 'zova';

import type {
  ISsrProfileOptions,
  ISsrResponseCachePolicy,
  ISsrRouteProfileOptions,
  TypeSsrProfile,
} from '../types/ssr.js';

export function resolveSsrProfile(
  routeProfile: TypeSsrProfile | undefined,
  defaultProfile: string | undefined,
): TypeSsrProfile {
  const ssrProfile = routeProfile ?? defaultProfile ?? 'public';
  if (ssrProfile !== 'public' && ssrProfile !== 'session') {
    throw new Error(`invalid SSR profile: ${ssrProfile}`);
  }
  return ssrProfile;
}

export function resolveSsrProfileOptions(
  ssrProfile: TypeSsrProfile,
  profiles: Readonly<Record<TypeSsrProfile, ZovaConfigSsrProfile>>,
  routeProfileOptions?: Readonly<ISsrRouteProfileOptions>,
  metaLocale?: boolean,
): Readonly<ISsrProfileOptions> {
  const profileOptions = profiles[ssrProfile];
  if (!profileOptions) {
    throw new Error(`invalid SSR profile: ${ssrProfile}`);
  }
  const responseCache =
    routeProfileOptions?.responseCache ??
    (ssrProfile === 'public' && metaLocale !== true
      ? { expires: 0 }
      : profileOptions.responseCache);
  return Object.freeze({
    useCookie: ssrProfile === 'session' && profileOptions.useCookie,
    responseCache:
      responseCache === false
        ? false
        : (Object.freeze({ ...responseCache }) as Readonly<ISsrResponseCachePolicy>),
  });
}
