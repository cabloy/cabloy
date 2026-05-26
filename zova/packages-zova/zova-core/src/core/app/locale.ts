import type { IBeanScopeLocale, PowerPartial } from '../../index.ts';

export const localeDefault = {
  modules: {},
};

export type ZovaLocale = {
  modules: IBeanScopeLocale;
} & typeof localeDefault;

export type ZovaLocaleOptional = PowerPartial<ZovaLocale>;
export type ZovaLocaleOptionalMap = Record<string, ZovaLocaleOptional>;
