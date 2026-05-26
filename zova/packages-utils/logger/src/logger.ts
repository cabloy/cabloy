/**
 * Refactored by zhennann
 * (C) 2010 Charlie Robbins
 * MIT LICENCE
 */

import type { LoggerLevel, LoggerOptions, LogInfo } from './types.ts';

import { Profiler } from './profiler.ts';
import { LEVEL, MESSAGE, SPLAT } from './types.ts';

const formatRegExp = /%[scdjifoO%]/g;

export class Logger {
  options: LoggerOptions;
  defaultMeta?: object;

  constructor(options: LoggerOptions, defaultMeta?: object) {
    this.options = options;
    this.defaultMeta = defaultMeta;
  }

  child(defaultMeta: object): Logger {
    const defaultMetaNew = Object.assign({}, this.defaultMeta, defaultMeta);
    return new Logger(this.options, defaultMetaNew);
  }

  error(msg?: any, ...splat) {
    return this.log('error', msg, ...splat);
  }

  warn(msg?: any, ...splat) {
    return this.log('warn', msg, ...splat);
  }

  info(msg?: any, ...splat) {
    return this.log('info', msg, ...splat);
  }

  http(msg?: any, ...splat) {
    return this.log('http', msg, ...splat);
  }

  verbose(msg?: any, ...splat) {
    return this.log('verbose', msg, ...splat);
  }

  debug(msg?: any, ...splat) {
    return this.log('debug', msg, ...splat);
  }

  silly(msg?: any, ...splat) {
    return this.log('silly', msg, ...splat);
  }

  log(level: LoggerLevel | LogInfo, msg?: any, ...splat) {
    // Optimize for the hotpath of logging JSON literals
    if (arguments.length === 1) {
      // Yo dawg, I heard you like levels ... seriously ...
      // In this context the LHS `level` here is actually the `info` so read
      // this as: info[LEVEL] = info.level;
      level[LEVEL] = (level as LogInfo).level;
      this._addDefaultMeta(level as LogInfo);
      this.write(level as LogInfo);
      return this;
    }

    // Slightly less hotpath, but worth optimizing for.
    if (arguments.length === 2) {
      if (msg && typeof msg === 'object') {
        msg[LEVEL] = msg.level = level;
        this._addDefaultMeta(msg);
        this.write(msg);
        return this;
      }

      msg = { [LEVEL]: level, level, message: msg };
      this._addDefaultMeta(msg);
      this.write(msg);
      return this;
    }

    const [meta] = splat;
    if (typeof meta === 'object' && meta !== null) {
      // Extract tokens, if none available default to empty array to
      // ensure consistancy in expected results
      const tokens = msg && msg.match && msg.match(formatRegExp);

      if (!tokens) {
        const info = Object.assign({}, this.defaultMeta, meta, {
          [LEVEL]: level,
          [SPLAT]: splat,
          level,
          message: msg,
        });

        if (meta.message) info.message = `${info.message} ${meta.message}`;
        if (meta.stack) info.stack = meta.stack;
        if (meta.cause) info.cause = meta.cause;

        this.write(info);
        return this;
      }
    }

    this.write(
      Object.assign({}, this.defaultMeta, {
        [LEVEL]: level as LoggerLevel,
        [SPLAT]: splat,
        level: level as LoggerLevel,
        message: msg,
      }),
    );
    return this;
  }

  write(logInfo: LogInfo) {
    const info = this.options.format.transform(logInfo, this.options.format.options);
    if (!info) return;
    const message = info[MESSAGE];
    if (Array.isArray(message)) {
      // eslint-disable-next-line
      console.log(...message);
    } else {
      // eslint-disable-next-line
      console.log(message);
    }
  }

  startTimer() {
    return new Profiler(this);
  }

  _addDefaultMeta(logInfo: LogInfo) {
    if (this.defaultMeta) {
      Object.assign(logInfo, this.defaultMeta);
    }
  }

  end() {
    // donothing
  }
}
