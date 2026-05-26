import type { ZovaConfigMeta } from '@cabloy/module-info';

import type {
  ILayoutRecord,
  TypeComponentAppRecord,
  TypeComponentLayoutRecord,
} from '../../bean/resource/component/type.ts';
import type { ILocaleRecord } from '../../bean/resource/locale/type.ts';
import type { ZovaConfigRoutes } from '../../bean/resource/page/type.ts';
import type { IBeanScopeConfig } from '../../bean/type.ts';
import type { ZovaConfigEnv } from '../../types/utils/env.ts';
import type { PowerPartial } from '../../types/utils/powerPartial.ts';
import type { ConfigLogger } from '../logger/types.ts';

export function configDefault(env: ZovaConfigEnv): PowerPartial<ZovaConfig> {
  const config: PowerPartial<ZovaConfig> = {
    meta: {
      flavor: env.META_FLAVOR,
      mode: env.META_MODE,
      appMode: env.META_APP_MODE,
    },
  };
  return config;
}

export interface ZovaConfig {
  meta: ZovaConfigMeta;
  app: {
    name: string;
    title: string;
    description: string;
    version: string;
  };
  api: {
    baseURL: string;
    prefix: string;
    jwt: boolean;
  };
  ssr: {
    cookie: boolean;
    withVona: boolean;
    ignoreCookieOnServer: boolean;
    hmr: boolean;
  };
  ws: {
    baseURL: string;
    prefix: string;
  };
  logger: ConfigLogger;
  locale: {
    default: keyof ILocaleRecord;
    storeKey: string;
    items: Record<keyof ILocaleRecord, string>;
  };
  tz: {
    storeKey: string;
  };
  layout: {
    app: {
      component: keyof TypeComponentAppRecord;
    };
    component: {
      [K in keyof ILayoutRecord]: keyof TypeComponentLayoutRecord;
    };
    sidebar: {
      leftOpenPC: boolean;
      breakpoint: number;
    };
  };
  routes: ZovaConfigRoutes;
  modules: IBeanScopeConfig;
}

export type ZovaConfigOptional = PowerPartial<ZovaConfig>;
