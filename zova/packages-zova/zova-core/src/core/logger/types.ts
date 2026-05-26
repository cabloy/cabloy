import type { LoggerLevel, LoggerOptions } from '@cabloy/logger';

import type { PowerPartial } from '../../types/utils/powerPartial.ts';

export interface ILoggerOptionsClientInfo {
  clientName: keyof ILoggerClientRecord;
  level: () => LoggerLevel | undefined;
}

export type TypeLoggerOptions =
  | LoggerOptions
  | ((clientInfo: ILoggerOptionsClientInfo) => LoggerOptions);

export interface ILoggerClientRecord {
  default: never;
}

export interface ILoggerChildRecord {
  module: never;
}

export interface ConfigLogger {
  base: TypeLoggerOptions;
  clients: Record<keyof ILoggerClientRecord, PowerPartial<TypeLoggerOptions>>;
}
