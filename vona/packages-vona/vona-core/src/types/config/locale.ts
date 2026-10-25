import type { ILocaleRecord } from '../../lib/bean/resource/locale/type.ts';
import type { IBeanScopeLocale } from '../../lib/bean/type.ts';
import type { PowerPartial } from '../utils/powerPartial.ts';

export interface ConfigLocale {
  items: Partial<Record<keyof ILocaleRecord, string>>;
  default: keyof ILocaleRecord;
}

export interface VonaLocale {
  modules: IBeanScopeLocale;
}

export type VonaLocaleOptional = PowerPartial<VonaLocale>;
export type VonaLocaleOptionalMap = Partial<Record<keyof ILocaleRecord, VonaLocaleOptional>>;

// Only capability.locale modules interpret this envelope as cross-module resources.
export interface ILocaleProviderResource {
  modules?: Record<string, Record<string, string>>;
  [key: string]: string | Record<string, Record<string, string>> | undefined;
}
