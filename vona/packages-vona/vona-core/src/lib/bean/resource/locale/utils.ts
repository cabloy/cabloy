import type { IBeanScopeLocale } from '../../type.ts';
import type { ILocaleMagic } from './type.ts';

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
