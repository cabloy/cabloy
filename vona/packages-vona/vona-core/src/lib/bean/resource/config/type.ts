import type { VonaApplication } from '../../../core/application.ts';

export type TypeModuleConfig<T extends (app: VonaApplication) => object> = ReturnType<T>;
