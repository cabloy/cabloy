import type { ConfigLocale } from '../../../../types/config/locale.ts';
import type { IBeanScopeLocale } from '../../type.ts';
import type { ILocaleMagic, ILocaleRecord } from './type.ts';

import { cast } from '../../../../types/utils/cast.ts';
import { useApp } from '../../../framework/useApp.ts';
import { LocaleModuleNameSeparator } from './type.ts';

export function $localeScope<M extends keyof IBeanScopeLocale, K extends keyof IBeanScopeLocale[M]>(
  moduleName: M,
  key: K,
  ...args: any[]
): ILocaleMagic<`${M}::${K extends string ? K : never}`> {
  return $makeLocaleMagic(`${moduleName}::${String(key)}`, ...args) as any;
}

export function $makeLocaleMagic<T extends string>(str: T, ...args: any[]): ILocaleMagic<T> {
  return {
    toString() {
      return str;
    },
    toJSON() {
      if (!str || !str.includes(LocaleModuleNameSeparator)) return str;
      const app = useApp();
      return app.meta.text(str, ...args);
    },
  } as any;
}

// not use : ILocaleMagic
export function text(strings: any, ...expressions: any): any {
  return {
    toString() {
      let result = '';
      for (let i = 0; i < expressions.length; i++) {
        result += strings[i];
        result += expressions[i];
      }
      return result;
    },
    toJSON() {
      const app = useApp();
      let result = '';
      for (let i = 0; i < strings.length; i++) {
        result += strings[i];
        if (i < expressions.length) {
          const expression = app.meta.text(expressions[i]);
          if (typeof expression === 'string' || isLocaleMagic(expression)) {
            result += app.meta.text(expression);
          } else {
            result += expression;
          }
        }
      }
      return result;
    },
  } as any;
}

export function isLocaleMagic(str: string | object) {
  return typeof str === 'object' && cast(str).toJSON;
}

export function canonicalizeLocale(value: unknown): string {
  return typeof value === 'string' ? value.trim().replaceAll('_', '-').toLowerCase() : '';
}

export function validateLocaleConfig(config: ConfigLocale): void {
  const items = config?.items;
  if (!items || typeof items !== 'object' || Object.keys(items).length === 0) {
    throw new Error('config.locale.items must contain at least one enabled locale');
  }
  for (const key of Object.keys(items)) {
    if (!key || canonicalizeLocale(key) !== key || typeof items[key] !== 'string') {
      throw new Error(`config.locale.items contains an invalid locale: ${key}`);
    }
  }
  if (
    typeof config.default !== 'string' ||
    !Object.hasOwn(items, config.default) ||
    canonicalizeLocale(config.default) !== config.default
  ) {
    throw new Error('config.locale.default must be an enabled config.locale.items key');
  }
}

/** Resolve an enabled input without allowing aliases to expand the configured set. */
export function resolveEnabledLocale(
  value: unknown,
  config: ConfigLocale,
  aliases: Record<string, string> = {},
): keyof ILocaleRecord | undefined {
  validateLocaleConfig(config);
  let locale = canonicalizeLocale(value);
  if (Object.hasOwn(aliases, locale)) locale = canonicalizeLocale(aliases[locale]);
  return Object.hasOwn(config.items, locale) ? (locale as keyof ILocaleRecord) : undefined;
}

/** Active-language selection only; explicit translation lookup remains independent. */
export function resolveLocale(
  value: unknown,
  config: ConfigLocale,
  aliases?: Record<string, string>,
): keyof ILocaleRecord {
  return resolveEnabledLocale(value, config, aliases) ?? config.default;
}
