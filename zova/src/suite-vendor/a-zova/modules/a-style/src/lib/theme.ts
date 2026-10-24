import type { IThemeRecord } from '../types/theme.ts';

export function $getThemeName<K extends keyof IThemeRecord>(themeName: K): K {
  return themeName;
}
