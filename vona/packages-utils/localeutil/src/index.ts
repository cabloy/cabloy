import { getText } from './util.ts';

export * from './util.ts';

export type Flags = [number, number?];
export type KeyCache = [Flags, string];
export type KeysCaches = Record<string, KeyCache[] | false>;
export type KeysCachesLocales = Record<string, KeysCaches>;
const __keysCachesLocales: KeysCachesLocales = {};

export function getLocaleText(
  supportCustomMessage: boolean,
  locales1: Record<string, object> | undefined,
  locales2: Record<string, object> | undefined,
  locale: string,
  key: string,
  ...args: any[]
): string {
  const keyCaches = _parseKeyCaches(locales1, locales2, locale, key);
  // loop
  if (keyCaches !== false) {
    for (const keyCache of keyCaches) {
      const flags = keyCache[0];
      const _key = keyCache[1];
      const argIndex = flags[1] ?? 0;
      if (args[argIndex] === flags[0]) {
        return _getLocaleText_inner(
          supportCustomMessage,
          locales1,
          locales2,
          locale,
          _key,
          ...args,
        );
      }
    }
  }
  // others
  return _getLocaleText_inner(supportCustomMessage, locales1, locales2, locale, key, ...args);
}

function _parseKeyCaches(
  locales1: Record<string, object> | undefined,
  locales2: Record<string, object> | undefined,
  locale: string,
  key: string,
) {
  if (!__keysCachesLocales[locale]) __keysCachesLocales[locale] = {};
  const keysCaches = __keysCachesLocales[locale];
  if (keysCaches[key] !== undefined) return keysCaches[key];
  //
  const _keyCaches: KeyCache[] = [];
  // module locales
  _collectKeyCaches(_keyCaches, false, locales1, locale, key);
  // global locales
  _collectKeyCaches(_keyCaches, true, locales2, locale, key);
  //
  keysCaches[key] = _keyCaches.length === 0 ? false : _keyCaches;
  return keysCaches[key];
}

function _collectKeyCaches(
  keyCaches: KeyCache[],
  checkExists: boolean,
  locales: Record<string, object> | undefined,
  locale: string,
  key: string,
) {
  if (!locales || !locales[locale]) return;
  for (const _key in locales[locale]) {
    if (_key === key || !_key.startsWith(key)) continue;
    let flag = _key.substring(key.length);
    if (flag.startsWith('_')) flag = flag.substring(1);
    const flags = flag.split('_').map(item => Number(item)) as Flags;
    if (!checkExists || !keyCaches.some(item => item[1] === _key)) {
      keyCaches.push([flags, _key]);
    }
  }
}

function _getLocaleText_inner(
  supportCustomMessage: boolean,
  locales1: Record<string, object> | undefined,
  locales2: Record<string, object> | undefined,
  locale: string,
  key: string,
  ...args: any[]
): string {
  if (!key) return '';
  // try locale
  let text = locales1?.[locale]?.[key] ?? locales2?.[locale]?.[key];
  if (text === undefined && locale !== 'en-us') {
    // try en-us
    text = locales1?.['en-us']?.[key] ?? locales2?.['en-us']?.[key];
  }
  // equal key
  if (text === undefined) {
    text = key;
  }
  // support custom message
  if (supportCustomMessage && !text.replaceAll('%%', '').includes('%') && args[0]) {
    return getText(...args);
  }
  // format
  return getText(text, ...args);
}

export function formatLocale(locale) {
  // support zh_CN, en_US => zh-CN, en-US
  return locale.replace('_', '-').toLowerCase();
}
