import type { VonaMetaFlavor, VonaMetaMode } from '@cabloy/module-info';

export interface VonaConfigEnv {
  META_FLAVOR: VonaMetaFlavor;
  META_MODE: VonaMetaMode;
  APP_NAME: string | undefined;
  APP_TITLE: string | undefined;
  APP_VERSION: string | undefined;
  SERVER_KEYS: string | undefined;
  SERVER_GLOBALPREFIX: string | undefined;
  SERVER_PUBLICDIR: string | undefined;
  SERVER_SUBDOMAINOFFSET: string | undefined;
  SERVER_WORKERS: string | undefined;
  SERVER_LISTEN_HOSTNAME: string | undefined;
  SERVER_LISTEN_PORT: string | undefined;
  SERVER_LISTEN_DISABLE: 'true' | 'false' | undefined;
  SERVER_SERVE_PROTOCOL: string | undefined;
  SERVER_SERVE_HOST: string | undefined;
  TEST_WHYISNODERUNNING: string | undefined;
  LOGGER_DIR: string | undefined;
  LOGGER_DUMMY: 'true' | 'false' | undefined;
  LOGGER_ROTATE_ENABLE: 'true' | 'false' | undefined;
  LOGGER_ROTATE_FILENAME: string | undefined;
  LOGGER_ROTATE_DATEPATTERN: string | undefined;
  LOGGER_ROTATE_MAXSIZE: string | undefined;
  LOGGER_ROTATE_MAXFILES: string | undefined;
}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test';
      META_FLAVOR: VonaMetaFlavor;
      META_MODE: VonaMetaMode;
    }
  }
}
