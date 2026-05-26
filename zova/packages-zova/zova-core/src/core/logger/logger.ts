import type { LoggerLevel } from '@cabloy/logger';

import { Logger } from '@cabloy/logger';

import type { ILoggerChildRecord, ILoggerClientRecord, TypeLoggerOptions } from './types.ts';

import { BeanSimple } from '../../bean/beanSimple.ts';
import { sys } from '../sys/sys.ts';
import { deepExtend } from '../sys/util.ts';

const SymbolLoggerInstances = Symbol('SymbolLoggerInstances');

export class SysLogger extends BeanSimple {
  private [SymbolLoggerInstances]: Record<keyof ILoggerClientRecord, Logger> = {} as any;

  public dispose() {
    for (const key in this[SymbolLoggerInstances]) {
      const logger = this[SymbolLoggerInstances][key];
      _closeLogger(logger);
    }
    this[SymbolLoggerInstances] = {} as any;
  }

  get(clientName?: keyof ILoggerClientRecord) {
    clientName = clientName || 'default';
    if (!this[SymbolLoggerInstances][clientName]) {
      this[SymbolLoggerInstances][clientName] = this._createClient(clientName);
    }
    return this[SymbolLoggerInstances][clientName];
  }

  child(childName?: keyof ILoggerChildRecord, clientName?: keyof ILoggerClientRecord) {
    const logger = this.get(clientName);
    if (!childName) return logger;
    return logger.child({ name: childName });
  }

  getFilterLevel(clientName?: keyof ILoggerClientRecord): LoggerLevel | undefined {
    return getLoggerFilterLevel(clientName);
  }

  setFilterLevel(level: LoggerLevel | boolean, clientName?: keyof ILoggerClientRecord) {
    setLoggerFilterLevel(level, clientName);
  }

  private _createClient(clientName: keyof ILoggerClientRecord): Logger {
    const configClient = this.sys.config.logger.clients[clientName];
    if (!configClient) throw new Error(`logger client not found: ${clientName}`);
    const configNode = deepExtend(
      {},
      this._prepareConfigClient(clientName, this.sys.config.logger.base),
      this._prepareConfigClient(clientName, configClient as unknown as TypeLoggerOptions),
    );
    const logger = new Logger(configNode);
    return logger;
  }

  private _prepareConfigClient(
    clientName: keyof ILoggerClientRecord,
    configClient: TypeLoggerOptions,
  ) {
    if (typeof configClient !== 'function') return configClient;
    return configClient.call(this.sys, {
      clientName,
      level: () => getLoggerFilterLevel(clientName),
    });
  }
}

function _closeLogger(logger: Logger) {
  if ((logger as any).__closed__) return;
  logger.end();
  (logger as any).__closed__ = true;
}

export function getLoggerFilterLevel(
  clientName?: keyof ILoggerClientRecord,
): LoggerLevel | undefined {
  clientName = clientName || 'default';
  if (sys.env.META_MODE === 'production') return; // disable on prod: not use process.env.PROD
  const envName = `LOGGER_CLIENT_${clientName.toUpperCase()}`;
  const level = sys.env[envName];
  if (level === 'false') return;
  if (level === 'true' || !level) return 'info';
  return level as LoggerLevel;
}

export function setLoggerFilterLevel(
  level: LoggerLevel | boolean,
  clientName?: keyof ILoggerClientRecord,
) {
  clientName = clientName || 'default';
  if (sys.env.META_MODE === 'production') return; // disable on prod: not use process.env.PROD
  const envName = `LOGGER_CLIENT_${clientName.toUpperCase()}`;
  sys.env[envName] = level.toString();
}
