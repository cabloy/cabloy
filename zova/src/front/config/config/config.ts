import type {
  ILocaleRecord,
  ZovaConfigOptional,
  ZovaConfigSsrResponseCachePolicy,
  ZovaSys,
} from 'zova';
import type { IThemeRecord } from 'zova-module-a-style';

import { colorizer, combine, errors, splatter, timestamp } from '@cabloy/logger';
import { formatLoggerConsole, formatLoggerFilter } from 'zova';

export default function (sys: ZovaSys) {
  const config: ZovaConfigOptional = {};
  const env = sys.env;

  // routes
  config.routes = {
    path: {
      '/home/indexadmin/dashboard': { alias: '/' },
      '/home/login': { alias: '/login' },
      '/demo/todo/todo': { alias: '/todo' },
    },
    name: {
      'demo-todo:item': { alias: '/todo/:id' },
    },
  };

  // app
  config.app = {
    name: env.APP_NAME,
    title: env.APP_TITLE,
    description: env.APP_DESCRIPTION,
    version: env.APP_VERSION,
  };

  // api
  config.api = {
    baseURL: process.env.SERVER ? env.SSR_API_BASE_URL || env.API_BASE_URL : env.API_BASE_URL,
    prefix: env.API_PREFIX,
    jwt: env.API_JWT !== 'false',
  };

  // ssr
  config.ssr = {
    withVona: env.SSR_WITH_VONA === 'true',
    hmr: env.SSR_WITH_VONA === 'true' && env.META_MODE === 'development',
    profiles: {
      public: {
        useCookie: false,
        responseCache: {
          expires:
            env.SSR_PROFILE_PUBLIC_RESPONSE_CACHE_EXPIRES as ZovaConfigSsrResponseCachePolicy['expires'],
        },
      },
      session: {
        useCookie: true,
        responseCache: {
          expires:
            env.SSR_PROFILE_SESSION_RESPONSE_CACHE_EXPIRES as ZovaConfigSsrResponseCachePolicy['expires'],
        },
      },
    },
  };

  // ws
  config.ws = {
    baseURL: config.api.baseURL?.replace('https://', 'wss://').replace('http://', 'ws://'),
    prefix: '/ws',
  };

  // locale
  config.locale = {
    default: env.APP_LOCALE_DEFAULT as keyof ILocaleRecord,
    storeKey: 'locale',
    items: {
      'en-us': 'LanguageEnglish',
      'zh-cn': 'LanguageChinese',
    },
  };

  // tz
  config.tz = {
    storeKey: 'tz',
  };

  // layout
  config.layout = {
    app: {
      component: 'a-app:app',
    },
    component: {
      empty: env.LAYOUT_COMPONENT_EMPTY,
      default: env.LAYOUT_COMPONENT_DEFAULT,
    },
  };

  // logger
  config.logger = {
    base(this: ZovaSys, clientInfo) {
      return {
        format: combine(
          splatter(),
          errors({ stack: true }),
          timestamp(),
          formatLoggerFilter({ level: clientInfo.level, silly: true }),
          colorizer(),
          formatLoggerConsole(),
        ),
      };
    },
    clients: {
      default: {},
    },
  };

  // modules
  config.modules = {
    'a-style': {
      defaultTheme: env.STYLE_DEFAULT_THEME as keyof IThemeRecord,
    },
  };

  // onions
  config.onions = {};

  return config;
}
