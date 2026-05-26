import type { ILocaleRecord } from '../../lib/bean/resource/locale/type.ts';
import type { IBeanScopeLocale } from '../../lib/bean/type.ts';
import type { PowerPartial } from '../utils/powerPartial.ts';

// export const localeDefault = {
//   modules: {},
// };

export interface VonaLocale {
  modules: IBeanScopeLocale;
}

export type VonaLocaleOptional = PowerPartial<VonaLocale>;
export type VonaLocaleOptionalMap = Record<keyof ILocaleRecord, VonaLocaleOptional>;
