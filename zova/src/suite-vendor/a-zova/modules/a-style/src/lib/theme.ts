import type { IThemeRecord } from '../types/theme.js';

export function $getThemeName<K extends keyof IThemeRecord>(themeName: K): K {
  return themeName;
}
