import type { IProtocolKeyRecord, VonaApplication } from 'vona';

import { $protocolKey } from 'vona';

export interface I18nConfigLocale {
  queryField?: keyof IProtocolKeyRecord;
  headerField?: keyof IProtocolKeyRecord;
  cookieField?: string;
  localeAlias: Record<string, string>;
  writeCookie: boolean;
  cookieMaxAge: number;
  cookieDomain?: string;
}

export interface I18nConfigTz {
  defaultTz?: string;
  queryField?: keyof IProtocolKeyRecord;
  headerField?: keyof IProtocolKeyRecord;
  cookieField?: string;
  writeCookie: boolean;
  cookieMaxAge: number;
  cookieDomain?: string;
}

export interface I18nConfig {
  locale: I18nConfigLocale;
  tz: I18nConfigTz;
}

export function config(_app: VonaApplication) {
  return {
    locale: {
      queryField: $protocolKey('x-vona-locale'),
      headerField: $protocolKey('x-vona-locale'),
      cookieField: 'locale',
      localeAlias: {},
      writeCookie: false,
      cookieMaxAge: 1 * 365 * 24 * 60 * 60 * 1000,
    },
    tz: {
      defaultTz: undefined,
      queryField: $protocolKey('x-vona-tz'),
      headerField: $protocolKey('x-vona-tz'),
      cookieField: 'tz',
      writeCookie: false,
      cookieMaxAge: 1 * 365 * 24 * 60 * 60 * 1000,
    },
  } as I18nConfig;
}
