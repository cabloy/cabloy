import type { ZovaMetaAppMode, ZovaMetaFlavor, ZovaMetaMode } from '@cabloy/module-info';

import type { TypeComponentLayoutRecord } from '../../bean/resource/component/type.ts';

export interface ZovaConfigEnv {
  META_FLAVOR: ZovaMetaFlavor;
  META_MODE: ZovaMetaMode;
  META_APP_MODE: ZovaMetaAppMode;
  APP_NAME: string | undefined;
  APP_TITLE: string | undefined;
  APP_DESCRIPTION: string | undefined;
  APP_VERSION: string | undefined;
  APP_META_VIEWPORT: string | undefined;
  APP_PUBLIC_PATH: string | undefined;
  APP_LOCALE_DEFAULT: string | undefined;
  APP_LOCALE_HEADER_KEY: string | undefined;
  APP_TZ_HEADER_KEY: string | undefined;
  DEV_SERVER_HOSTNAME: string | undefined;
  DEV_SERVER_PORT: string | undefined;
  LAYOUT_COMPONENT_EMPTY: keyof TypeComponentLayoutRecord | undefined;
  LAYOUT_COMPONENT_DEFAULT: keyof TypeComponentLayoutRecord | undefined;
  LAYOUT_SIDEBAR_LEFTOPENPC: string | undefined;
  STYLE_DEFAULT_THEME: string | undefined;
  SSR_API_BASE_URL: string | undefined;
  API_BASE_URL: string | undefined;
  API_PREFIX: string | undefined;
  API_JWT: string | undefined;
  SSR_PROD_PORT: string | undefined;
  SSR_PROD_PROTOCOL: string | undefined;
  SSR_PROD_HOST: string | undefined;
  SSR_WITH_VONA: string | undefined;
  SSR_COOKIE: string | undefined;
  OPENAPI_BASE_URL_DEFAULT: string | undefined;
  OPENAPI_BASE_URL_HOME_API: string | undefined;
  MOCK_ENABLED: string | undefined;
  MOCK_BUILD: string | undefined;
  MOCK_BUILD_PORT: string | undefined;
}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: ZovaMetaMode;
      META_FLAVOR: ZovaMetaFlavor;
      META_MODE: ZovaMetaMode;
      META_APP_MODE: ZovaMetaAppMode;
      // compatible with quasar
      // @ts-ignore ignore
      SSR: boolean;
      // @ts-ignore ignore
      DEV: boolean;
      // @ts-ignore ignore
      PROD: boolean;
      // @ts-ignore ignore
      // DEBUGGING: boolean;
      // @ts-ignore ignore
      CLIENT: boolean;
      // @ts-ignore ignore
      SERVER: boolean;
      // @ts-ignore ignore
      // MODE: string | undefined;
      // others: if needed, set env var type as 'true' | 'false'
    }
  }
}
