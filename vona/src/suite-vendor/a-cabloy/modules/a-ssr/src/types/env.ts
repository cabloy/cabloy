import type { ZovaMetaAppMode, ZovaMetaFlavor, ZovaMetaMode } from '@cabloy/module-info';

export interface ZovaConfigEnv {
  META_FLAVOR: ZovaMetaFlavor;
  META_MODE: ZovaMetaMode;
  META_APP_MODE: ZovaMetaAppMode;
  SITE_ID: string;
  APP_ROUTER_MODE: 'hash' | 'history' | 'abstract' | undefined;
  APP_ROUTER_BASE: string | undefined;
  APP_PUBLIC_PATH: string | undefined;
  APP_NAME: string | undefined;
  APP_TITLE: string | undefined;
  APP_VERSION: string | undefined;
  DEV_SERVER_HOST: string | undefined;
  DEV_SERVER_PORT: string | undefined;
  SSR_API_BASE_URL: string | undefined;
  OPENAPI_BASE_URL_DEFAULT: string | undefined;
  API_BASE_URL: string | undefined;
  API_PREFIX: string | undefined;
  API_JWT: string | undefined;
  SSR_COOKIE_THEMEDARK_DEFAULT: string | undefined;
  SSR_WITH_VONA: string | undefined;
  SSR_PROFILE: 'public' | 'session' | undefined;
}
