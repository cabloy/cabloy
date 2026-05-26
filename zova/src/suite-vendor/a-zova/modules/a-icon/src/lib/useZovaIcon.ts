import { ref, watchEffect } from 'vue';
import { sys } from 'zova';

import type { IIconInfo, IIconRecord } from '../types/icon.js';

export function $getZovaIcon(iconName?: keyof IIconRecord): IIconInfo | undefined {
  return sys.meta.$icon.parseIconInfoSync(iconName);
}

export function $useZovaIcon(iconGetter: () => keyof IIconRecord | undefined) {
  const iconInfo = ref<IIconInfo>();

  watchEffect(() => {
    iconInfo.value = $getZovaIcon(iconGetter());
  });

  return { iconInfo };
}
