import type { ZovaConfigMeta } from '@cabloy/module-info';
import type ms from 'ms';
import type { VNodeChild } from 'vue';

import type {
  ILayoutRecord,
  TypeComponentAppRecord,
  TypeComponentLayoutRecord,
} from '../../bean/resource/component/type.ts';
import type { ILocaleRecord } from '../../bean/resource/locale/type.ts';
import type { ZovaConfigRoutes } from '../../bean/resource/page/type.ts';
import type {
  IBeanScopeConfig,
  TypeComponentBoundaryRenderMode,
  TypeComponentBoundaryRetry,
} from '../../bean/type.ts';
import type { ZovaConfigEnv } from '../../types/utils/env.ts';
import type { PowerPartial } from '../../types/utils/powerPartial.ts';
import type { ZovaContext } from '../context/context.ts';
import type { ConfigLogger } from '../logger/types.ts';

export function configDefault(env: ZovaConfigEnv): PowerPartial<ZovaConfig> {
  const config: PowerPartial<ZovaConfig> = {
    meta: {
      flavor: env.META_FLAVOR,
      mode: env.META_MODE,
      appMode: env.META_APP_MODE,
    },
    boundary: {},
  };
  return config;
}

export interface ZovaConfigApp {
  name: string;
  title: string;
  description: string;
  version: string;
}

export interface ZovaConfigBoundaryLoading {
  delay?: number;
}

export interface ZovaConfigBoundary {
  loading?: ZovaConfigBoundaryLoading;
  renderLoading?: (ctx: ZovaContext, renderMode: TypeComponentBoundaryRenderMode) => VNodeChild;
  renderError?: (
    ctx: ZovaContext,
    error: unknown,
    renderMode: TypeComponentBoundaryRenderMode,
    retry?: TypeComponentBoundaryRetry,
  ) => VNodeChild;
}

export interface ZovaConfigSsrResponseCachePolicy {
  expires?: number | ms.StringValue;
}

export interface ZovaConfigSsrProfile {
  useCookie: boolean;
  responseCache: false | ZovaConfigSsrResponseCachePolicy;
}

export interface ZovaConfig {
  meta: ZovaConfigMeta;
  app: ZovaConfigApp;
  boundary: ZovaConfigBoundary;
  api: {
    baseURL: string;
    prefix: string;
    jwt: boolean;
  };
  ssr: {
    withVona: boolean;
    hmr: boolean;
    profiles: {
      public: ZovaConfigSsrProfile;
      session: ZovaConfigSsrProfile;
    };
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
  };
  routes: ZovaConfigRoutes;
  modules: IBeanScopeConfig;
}

export type ZovaConfigOptional = PowerPartial<ZovaConfig>;
