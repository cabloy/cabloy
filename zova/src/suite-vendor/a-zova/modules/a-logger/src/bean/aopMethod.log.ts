import type { ILoggerChildRecord, ILoggerClientRecord, Next, NextSync } from 'zova';
import type {
  IAopMethodExecute,
  IAopMethodGet,
  IAopMethodSet,
  IDecoratorAopMethodOptions,
} from 'zova-module-a-bean';

import { LoggerLevel, Profiler } from '@cabloy/logger';
import { evaluateExpressions } from '@cabloy/utils';
import { BeanAopMethodBase, cast, SymbolBeanFullName } from 'zova';
import { AopMethod } from 'zova-module-a-bean';

export interface IAopMethodOptionsLog extends IDecoratorAopMethodOptions {
  level: LoggerLevel;
  childName?: keyof ILoggerChildRecord;
  clientName?: keyof ILoggerClientRecord;
  args?: boolean;
  result?: boolean;
  context?: Record<string, any>;
}

@AopMethod<IAopMethodOptionsLog>({
  level: 'info',
})
export class AopMethodLog
  extends BeanAopMethodBase
  implements IAopMethodGet, IAopMethodSet, IAopMethodExecute
{
  get(options: IAopMethodOptionsLog, next: NextSync, receiver: any, prop: string): any {
    const context = this._getContext(options, receiver);
    const message = `${receiver[SymbolBeanFullName]}#${prop}(get)`;
    const logger = this.sys.meta.logger.child(options.childName, options.clientName);
    // begin
    const profiler = logger.startTimer();
    // next
    try {
      const res = next();
      this._logResult(profiler, context, res, options, message);
      return res;
    } catch (err: any) {
      this._logError(profiler, context, err, options, message);
      throw err;
    }
  }

  set(
    options: IAopMethodOptionsLog,
    value: any,
    next: NextSync,
    receiver: any,
    prop: string,
  ): boolean {
    const context = this._getContext(options, receiver);
    const message = `${receiver[SymbolBeanFullName]}#${prop}(set)`;
    const logger = this.sys.meta.logger.child(options.childName, options.clientName);
    // begin
    const profiler = logger.startTimer();
    // next
    try {
      const res = next();
      this._logValue(profiler, context, value, options, message);
      return res;
    } catch (err: any) {
      this._logError(profiler, context, err, options, message);
      throw err;
    }
  }

  execute(
    options: IAopMethodOptionsLog,
    _args: [],
    next: Next | NextSync,
    receiver: any,
    prop: string,
  ): Promise<any> | any {
    const context = this._getContext(options, receiver);
    const message = `${receiver[SymbolBeanFullName]}#${prop}`;
    const logger = this.sys.meta.logger.child(options.childName, options.clientName);
    // begin
    if (options.args !== false) {
      const info: any = { level: options.level, message };
      if (context) info.context = context;
      if (_args.length > 0) info.args = _args;
      logger.log(info);
    }
    const profiler = logger.startTimer();
    // next
    try {
      const res = next();
      if (res?.then) {
        return res
          .then((res: any) => {
            options.result !== false && this._logResult(profiler, context, res, options, message);
            return res;
          })
          .catch((err: Error) => {
            this._logError(profiler, context, err, options, message);
            throw err;
          });
      }
      options.result !== false && this._logResult(profiler, context, res, options, message);
      return res;
    } catch (err: any) {
      this._logError(profiler, context, err, options, message);
      throw err;
    }
  }

  _getContext(options: IAopMethodOptionsLog, receiver: any) {
    return evaluateExpressions(options.context, {
      self: receiver,
      sys: cast(receiver).sys,
      app: cast(receiver).app,
      ctx: cast(receiver).ctx,
    });
  }

  _logValue(
    profiler: Profiler,
    context: any,
    value: any,
    options: IAopMethodOptionsLog,
    message: string,
  ) {
    const info: any = { level: options.level, message };
    if (context) info.context = context;
    info.value = value;
    profiler.done(info);
  }

  _logResult(
    profiler: Profiler,
    context: any,
    res: any,
    options: IAopMethodOptionsLog,
    message: string,
  ) {
    const info: any = { level: options.level, message };
    if (context) info.context = context;
    if (res !== undefined) info.result = res;
    profiler.done(info);
  }

  _logError(
    profiler: Profiler,
    context: any,
    err: Error,
    _options: IAopMethodOptionsLog,
    message: string,
  ) {
    const info: any = { level: 'error', message };
    if (context) info.context = context;
    if (err) info.error = err;
    profiler.done(info);
  }
}
