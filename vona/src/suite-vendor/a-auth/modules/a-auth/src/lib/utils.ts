import type { IAuthUserProfile } from 'vona-module-a-user';

import type { TypeStrategyOauth2VerifyArgs } from '../types/authProvider.ts';

export function getStrategyOauth2Profile<T = IAuthUserProfile>(
  args: TypeStrategyOauth2VerifyArgs<T>,
): T {
  return args[2];
}

export type TypeOauthRedirectKind =
  | 'absolute'
  | 'invalid'
  | 'missing'
  | 'non_http'
  | 'protocol_relative'
  | 'relative';

export interface IOauthRedirectDiagnostic {
  redirectKind: TypeOauthRedirectKind;
  redirectOrigin?: string;
  redirectProtocol?: string;
  redirectHost?: string;
  redirectHostname?: string;
  redirectPort?: string;
}

export function getOauthRedirectDiagnostic(redirect: string): IOauthRedirectDiagnostic {
  if (redirect.startsWith('//')) return { redirectKind: 'protocol_relative' };
  if (redirect.startsWith('/')) return { redirectKind: 'relative' };

  let url: URL;
  try {
    url = new URL(redirect);
  } catch {
    return { redirectKind: 'invalid' };
  }

  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    return { redirectKind: 'non_http', redirectProtocol: url.protocol };
  }

  return {
    redirectKind: 'absolute',
    redirectOrigin: url.origin,
    redirectProtocol: url.protocol,
    redirectHost: url.host,
    redirectHostname: url.hostname,
    redirectPort: url.port || undefined,
  };
}
