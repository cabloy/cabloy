import type { SysIcon } from '../bean/sys.icon.js';
import type { IconGroup } from '../lib/iconGroup.js';

export interface IIconRecord {}

export interface IIconMeta {
  module: string;
  group: string;
  name: string;
  fullName: string;
  symbolId: string;
}

export interface IIconInfo {
  meta: IIconMeta;
  symbolId: string; // '' or valid icon
}

export type TypeIconGroups = Record<string, IconGroup>;
export type TypeIconModules = Record<string, TypeIconGroups>;
export type TypeIconSymbols = Record<string, string>;

declare module 'zova' {
  export interface SysMeta {
    $icon: SysIcon;
  }
}
