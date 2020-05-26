const _config = require('../../../build/config.js');

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const uuid = require('uuid');

const {
  isProd,
  detectStatus,
  detectErrorMessage,
  /* accepts,*/
} = require('egg-onerror/lib/utils');

// eslint-disable-next-line
module.exports = appInfo => {
  const config = {};

  // cluster
  config.cluster = {
    listen: {
      port: _config.backend.port,
      hostname: _config.backend.hostname,
    },
  };

  // safe
  config.security = {
    csrf: {
      enable: false,
    },
  };

  // mysql
  config.mysql = {
    app: true,
    agent: false,
  };

  // io
  config.io = {
    init: {
    },
    namespace: {
      '/': {
        connectionMiddleware: [ 'connection' ],
        packetMiddleware: [ 'packet' ],
      },
    },
    generateId: () => {
      return uuid.v4();
    },
  };

  // middlewares
  config.mws = {
  };

  // model
  config.model = {
    disableDeleted: false,
    disableInstance: false,
  };

  // modules
  config.modules = {
  };

  // session
  config.session = {
    key: 'CABLOY_SESS',
    httpOnly: true,
    encrypt: true,
  };

  // multipart
  config.multipart = {
    fileSize: '30mb',
    fileExtensions: [
      '.txt', '.ini',
      '.apk',
      '.rar',
      '.xls', '.xlsx',
      '.ppt', '.pptx',
      '.doc', '.docx',
      '.pdf',
      '.aac', '.ogg', '.m4a', '.mp3', '.wav',
    ],
  };

  // siteFile
  config.siteFile = {
    '/favicon.ico': fs.readFileSync(path.join(__dirname, 'favicon.ico')),
  };

  // queue
  config.queue = {
    redlock: {
      clients: [ 'redlock' ],
      options: {
        driftFactor: 0.01,
        retryCount: -1,
        retryDelay: 200,
        retryJitter: 100,
        lockTTL: 60 * 1000,
      },
    },
    bottleneck: {
      expiration: 60 * 1000,
    },
    startup: {
      debounce: 6 * 1000,
    },
    worker: {
      lockDuration: 10 * 1000,
    },
    scheduler: {
      maxStalledCount: 1000,
      stalledInterval: 10 * 1000,
    },
  };

  // mysql
  config.mysql = {
    clients: {
      // donnot change the name
      __ebdb: {
        // debug: true,
        hook: {
          meta: {
            color: 'orange',
            long_query_time: 0,
          },
          callback: {
            onConnection,
            onQuery,
          },
        },
      },
    },
  };

  // onerror
  config.onerror = {
    json(err) {
      const status = detectStatus(err);

      this.status = status;
      const code = err.code || err.type;
      const message = detectErrorMessage(this, err);

      // json error
      const errorJson = {
        code,
        message,
        errors: err.errors,
      };

      if (status >= 500 && !isProd(this.app)) {
        // provide detail error stack in local env
        errorJson.stack = err.stack;
        errorJson.name = err.name;
        for (const key in err) {
          if (!errorJson[key]) {
            errorJson[key] = err[key];
          }
        }
      }

      this.body = errorJson;
    },
  };

  return config;
};

function onQuery(hook, ms, sequence, args) {
  if (!hook.meta.long_query_time || hook.meta.long_query_time < ms) {
    const message = `threadId: ${sequence._connection.threadId}, ${ms}ms ==> ${sequence.sql}`;
    console.log(chalk.keyword(hook.meta.color)(message));
  }
}

async function onConnection(conn) {
  await sessionVariablesSet(conn);
}

async function sessionVariablesSet(conn) {
  await sessionVariableSet(conn, 'SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED');
  await sessionVariableSet(conn, 'SET SESSION explicit_defaults_for_timestamp=ON');
}

async function sessionVariableSet(conn, sql) {
  try {
    await conn.query(sql);
    return true;
  } catch (error) {
    return false;
  }
}

