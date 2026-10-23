import type { VNode } from 'vue';

import { createVNode } from 'vue';

import type { IIconRecord } from '../types/icon.ts';

import { ZIcon } from '../.metadata/index.ts';

export function $icon<K extends keyof IIconRecord>(
  name: K,
  size?: string | number,
  color?: string,
): VNode {
  return createVNode(ZIcon, {
    name,
    color,
    width: size,
    height: size,
  });
}

export function $iconName<K extends keyof IIconRecord>(name: K): K {
  return name;
}
