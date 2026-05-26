import type * as Winston from 'winston';
import type DailyRotateFile from 'winston-daily-rotate-file';

export interface ILoggerFormatOpts {
  stack?: boolean;
  cause?: boolean;
}

export interface ILoggerOptionsClientInfo {
  clientName: keyof ILoggerClientRecord;
  level: () => LoggerLevel | false;
  child: () => string[] | undefined;
}

export interface ILoggerFormatFilterOpts {
  level: (() => LoggerLevel | false) | (LoggerLevel | false);
  child: (() => string[] | undefined) | (string[] | undefined);
  strict?: boolean;
  silly?: boolean;
}

export type TypeLoggerOptions =
  | Winston.LoggerOptions
  | ((clientInfo: ILoggerOptionsClientInfo, winston: typeof Winston) => Winston.LoggerOptions);
export type TypeLoggerRotateOptions = DailyRotateFile.DailyRotateFileTransportOptions & {
  enable: boolean;
};
export type TypeLoggerRotateOptionsFn = (
  fileName: string,
  winston: typeof Winston,
  clientInfo: ILoggerOptionsClientInfo,
) => TypeLoggerRotateOptions;

export interface ILoggerClientRecord {
  default: never;
}

export interface ILoggerChildRecord {}

export interface ConfigLogger {
  baseDir: string;
  base: TypeLoggerOptions;
  clients: Record<keyof ILoggerClientRecord, TypeLoggerOptions>;
  rotate: TypeLoggerRotateOptionsFn;
}

export type LoggerLevel = 'error' | 'warn' | 'info' | 'http' | 'verbose' | 'debug' | 'silly';

declare module 'winston' {
  interface LogMethod {
    (level: string, message: () => string, ...meta: any[]): any;
  }

  interface LeveledLogMethod {
    (message: () => string, ...meta: any[]): any;
  }
}
