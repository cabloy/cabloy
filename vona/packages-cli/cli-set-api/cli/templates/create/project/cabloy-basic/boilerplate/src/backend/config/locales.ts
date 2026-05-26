import type { TypeLocaleBase, VonaLocaleOptionalMap } from 'vona';

import { $makeLocaleMagic } from 'vona';

import {
  localeDefault as localeDefault_en_us,
  localeModules as localeModules_en_us,
} from './locale/en-us.ts';
import {
  localeDefault as localeDefault_zh_cn,
  localeModules as localeModules_zh_cn,
} from './locale/zh-cn.ts';

export const localesDefault = {
  'en-us': localeDefault_en_us,
  'zh-cn': localeDefault_zh_cn,
};

export const localesModules: VonaLocaleOptionalMap = {
  'en-us': localeModules_en_us,
  'zh-cn': localeModules_zh_cn,
};

export function $localeDefault<K extends keyof (typeof localesDefault)[TypeLocaleBase]>(
  key: K,
  ...args: any[]
): any {
  return $makeLocaleMagic(`::${key}`, ...args);
}
