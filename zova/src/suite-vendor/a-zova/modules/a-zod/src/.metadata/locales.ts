import type { TypeLocaleBase } from 'zova';

import { useApp, useComputed } from 'zova';

import locale_en_us from '../config/locale/en-us.js';
import locale_zh_cn from '../config/locale/zh-cn.js';

export const locales = {
  'en-us': locale_en_us,
  'zh-cn': locale_zh_cn,
};

export function $useLocale<K extends keyof (typeof locales)[TypeLocaleBase]>(
  key: K,
  ...args: any[]
) {
  const app = useApp();
  const str = `a-zod::${key}`;
  return useComputed(() => {
    return app.meta.text(str, ...args);
  });
}
