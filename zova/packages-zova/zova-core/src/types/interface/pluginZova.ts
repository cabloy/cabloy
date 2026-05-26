import type { IModule } from '@cabloy/module-info';
import type { RouteRecordRaw } from '@cabloy/vue-router';
import type { ViteHotContext } from 'vite/types/hot.js';

import type { ZovaLocaleOptionalMap } from '../../core/app/locale.ts';
import type { Constructable } from '../../decorator/index.ts';
import type { TypeModuleResourceConfig } from './module.ts';
import type {
  IMonkeyApp,
  IMonkeyController,
  IMonkeyModule,
  IMonkeyModuleSys,
  IMonkeySys,
} from './monkey.ts';
export interface PluginZovaModulesMeta {
  modules: Record<string, IModule>;
  moduleNames: string[];
}

export interface PluginZovaOptions {
  modulesMeta: PluginZovaModulesMeta;
  locales: ZovaLocaleOptionalMap;
  config: TypeModuleResourceConfig[];
  // eslint-disable-next-line no-undef
  env: NodeJS.ProcessEnv;
  viteHot: ViteHotContext;
  SysMonkey?: Constructable<IMonkeyModuleSys & IMonkeySys>;
  AppMonkey?: Constructable<IMonkeyModule & IMonkeyApp & IMonkeyController>;
  legacyRoutes?: RouteRecordRaw[];
}
