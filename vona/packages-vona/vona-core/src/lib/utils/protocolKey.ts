import type { ILocaleRecord } from '../bean/resource/locale/type.ts';

export interface IProtocolKeyRecord {
  'x-vona-locale': keyof ILocaleRecord | undefined;
  'x-vona-tz': string | undefined;
  'x-vona-instance-name': string | undefined;
  'x-vona-passport-code': string | undefined;
  'x-vona-oauth-code': string | undefined;
  'x-vona-openapi-schema': 'true' | 'false' | undefined;
}

export function $protocolKey<K extends keyof IProtocolKeyRecord>(key: K): K {
  return key;
}
