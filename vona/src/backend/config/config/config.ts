import type { ILoggerOptionsClientInfo, VonaApplication, VonaConfigOptional } from 'vona';
import type { IMailClientRecord, TypeMailTransportService } from 'vona-module-a-mail';
import type { IDatabaseClientRecord } from 'vona-module-a-orm';

import { replaceTemplate } from '@cabloy/utils';
import {
  $protocolKey,
  getLoggerPathPhysicalRoot,
  getPublicPathPhysicalRoot,
  getSqlite3DatabaseNameDefault,
  getSqlite3NativeBinding,
} from 'vona';

declare module 'vona' {
  export interface IInstanceRecord {
    shareTest: never;
    isolateTest: never;
  }
}

declare module 'vona-module-a-orm' {
  export interface IDatabaseClientRecord {
    isolateTest: never;
  }
}

export default async function (app: VonaApplication) {
  const config: VonaConfigOptional = {};
  const env = app.meta.env;

  // modules
  config.modules = {};

  // onions
  config.onions = {};

  // meta
  config.meta = {
    flavor: env.META_FLAVOR,
    mode: env.META_MODE,
  };

  // instance
  config.instance = {
    getInstanceName: undefined,
    queryField: $protocolKey('x-vona-instance-name'),
    headerField: $protocolKey('x-vona-instance-name'),
    instances: {},
  };

  // server
  const publicDir = env.SERVER_PUBLICDIR || getPublicPathPhysicalRoot(app);
  const subdomainOffset = Number.parseInt(env.SERVER_SUBDOMAINOFFSET || '1');
  const workers = Number.parseInt(env.SERVER_WORKERS!);
  config.server = {
    keys: (env.SERVER_KEYS || '').split(','),
    globalPrefix: env.SERVER_GLOBALPREFIX || '/api',
    publicDir,
    subdomainOffset,
    workers,
    listen: {
      hostname: env.SERVER_LISTEN_HOSTNAME,
      port: Number.parseInt(env.SERVER_LISTEN_PORT!),
      disable: env.SERVER_LISTEN_DISABLE === 'true',
    },
    serve: {
      protocol: env.SERVER_SERVE_PROTOCOL,
      host: env.SERVER_SERVE_HOST,
    },
  };

  // proxy
  config.proxy = {
    enable: true,
    ipHeaders: 'x-real-ip,x-forwarded-for',
    hostHeaders: 'x-forwarded-host,host',
    protocolHeaders: 'x-forwarded-proto',
    maxProxyCount: 1,
    maxIpsCount: 15,
  };

  // logger
  const loggerDir = env.LOGGER_DIR || getLoggerPathPhysicalRoot(app);
  config.logger = {
    baseDir: loggerDir,
    rotate(filename: string) {
      return {
        enable: env.LOGGER_ROTATE_ENABLE === 'true',
        filename: replaceTemplate(env.LOGGER_ROTATE_FILENAME!, { filename }),
        datePattern: env.LOGGER_ROTATE_DATEPATTERN,
        maxSize: env.LOGGER_ROTATE_MAXSIZE,
        maxFiles: env.LOGGER_ROTATE_MAXFILES,
      };
    },
    base(this: VonaApplication) {
      return {
        format: this.bean.logger.makeFormatBase({ stack: true }),
        transports: undefined,
      };
    },
    clients: {
      default(this: VonaApplication, clientInfo: ILoggerOptionsClientInfo) {
        const transports = [
          this.bean.logger.makeTransportFile(clientInfo, 'error', 'error'),
          this.bean.logger.makeTransportFile(clientInfo, 'warn', 'warn'),
          this.bean.logger.makeTransportFile(clientInfo, 'http', 'http'),
          this.bean.logger.makeTransportFile(clientInfo, 'combined'),
          this.bean.logger.makeTransportConsole(clientInfo),
        ];
        return { transports };
      },
    },
  };

  // redis
  config.redis = {
    base: {
      host: env.REDIS_DEFAULT_HOST,
      port: Number.parseInt(env.REDIS_DEFAULT_PORT!),
      password: env.REDIS_DEFAULT_PASSWORD,
      db: Number.parseInt(env.REDIS_DEFAULT_DB!),
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
    },
    clients: {
      default: { keyPrefix: true },
      cache: { keyPrefix: true },
      io: { keyPrefix: true },
      summer: { keyPrefix: true },
      model: { keyPrefix: true },
      worker: { keyPrefix: true },
      redlock: {},
      queue: {},
      broadcast: {},
    },
  };

  // database
  config.database = {
    testDatabase: false,
    base: {
      pool: { min: 0, max: 5 },
      acquireConnectionTimeout: 60000 * 10,
      asyncStackTraces: true,
    },
    defaultClient: env.DATABASE_DEFAULT_CLIENT as keyof IDatabaseClientRecord,
    clients: {
      sqlite3: {
        client: 'better-sqlite3',
        connection: {
          filename: env.DATABASE_CLIENT_SQLITE3_FILENAME || getSqlite3DatabaseNameDefault(app),
          options: {
            nativeBinding: getSqlite3NativeBinding(app, env.DATABASE_CLIENT_SQLITE3_NATIVEBINDING),
          },
        },
      },
      pg: {
        client: 'pg',
        connection: {
          host: env.DATABASE_CLIENT_PG_HOST,
          port: Number.parseInt(env.DATABASE_CLIENT_PG_PORT!),
          user: env.DATABASE_CLIENT_PG_USER,
          password: env.DATABASE_CLIENT_PG_PASSWORD,
          database: env.DATABASE_CLIENT_PG_DATABASE,
        },
      },
      mysql: {
        client: 'mysql2',
        connection: {
          host: env.DATABASE_CLIENT_MYSQL_HOST,
          port: Number.parseInt(env.DATABASE_CLIENT_MYSQL_PORT!),
          user: env.DATABASE_CLIENT_MYSQL_USER,
          password: env.DATABASE_CLIENT_MYSQL_PASSWORD,
          database: env.DATABASE_CLIENT_MYSQL_DATABASE,
        },
      },
    },
  };

  // Multi-Instance/Multi-Tenancy
  config.database.clients!.isolateTest = {
    ...config.database.clients![env.DATABASE_DEFAULT_CLIENT as keyof IDatabaseClientRecord],
  };

  // mail
  config.modules['a-mail'] = {
    defaultClient: env.MAIL_DEFAULT_CLIENT as keyof IMailClientRecord,
    clients: {
      system: {
        transport: {
          service: (env.MAIL_SYSTEM_TRANSPORT_SERVICE as TypeMailTransportService) || undefined,
          host: env.MAIL_SYSTEM_TRANSPORT_HOST || undefined,
          port: env.MAIL_SYSTEM_TRANSPORT_PORT
            ? Number.parseInt(env.MAIL_SYSTEM_TRANSPORT_PORT)
            : undefined,
          secure: env.MAIL_SYSTEM_TRANSPORT_SECURE === 'true',
          auth: {
            user: env.MAIL_SYSTEM_TRANSPORT_AUTH_USER || undefined,
            pass: env.MAIL_SYSTEM_TRANSPORT_AUTH_PASS || undefined,
          },
        },
        defaults: {
          from: env.MAIL_SYSTEM_DEFAULTS_FROM || undefined,
        },
      },
    },
  };

  return config;
}
