import type {
  ILoggerChildRecord,
  ILoggerClientRecord,
  ILoggerOptionsClientInfo,
  LoggerLevel,
} from 'vona';
import type { ILoggerFormatOpts } from 'vona';
import type * as Transport from 'winston-transport';

import {
  BeanBase,
  formatLoggerConsole,
  formatLoggerCtx,
  formatLoggerDummy,
  formatLoggerErrors,
  formatLoggerFilter,
} from 'vona';
import { Bean } from 'vona-module-a-bean';
import * as Winston from 'winston';

@Bean()
export class BeanLogger extends BeanBase {
  public getFilterLevel(clientName?: keyof ILoggerClientRecord): LoggerLevel | false {
    return this.app.meta.logger.getFilterLevel(clientName);
  }

  public setFilterLevel(level: LoggerLevel | boolean, clientName?: keyof ILoggerClientRecord) {
    this.app.meta.logger.setFilterLevel(level, clientName);
    this.scope.broadcast.setFilterLevel.emit({ level, clientName });
  }

  public getFilterChild(clientName?: keyof ILoggerClientRecord): string[] | undefined {
    return this.app.meta.logger.getFilterChild(clientName);
  }

  public setFilterChild(child: string | string[], clientName?: keyof ILoggerClientRecord) {
    this.app.meta.logger.setFilterChild(child, clientName);
    this.scope.broadcast.setFilterChild.emit({ child, clientName });
  }

  public get default(): Winston.Logger {
    return this.app.meta.logger.get();
  }

  public get(clientName?: keyof ILoggerClientRecord): Winston.Logger {
    return this.app.meta.logger.get(clientName);
  }

  public getChild(
    childName: keyof ILoggerChildRecord,
    clientName?: keyof ILoggerClientRecord,
  ): Winston.Logger {
    return this.app.meta.logger.get(clientName).child({ name: childName });
  }

  public makeFormatBase(opts: ILoggerFormatOpts) {
    return Winston.format.combine(
      formatLoggerErrors(opts),
      formatLoggerCtx(),
      Winston.format.splat(),
      Winston.format.timestamp(),
    );
  }

  public makeTransportFile(
    clientInfo: ILoggerOptionsClientInfo,
    fileName: string,
    levelStrict?: LoggerLevel,
    childStrict?: string | string[],
  ): Transport {
    return this.app.meta.logger.createTransportFile(fileName, clientInfo, {
      level: levelStrict ?? 'silly',
      format: Winston.format.combine(
        formatLoggerFilter({
          child: childStrict ?? clientInfo.child,
          level: levelStrict ?? clientInfo.level,
          strict: !!levelStrict,
        }),
        Winston.format.json(),
      ),
    });
  }

  public makeTransportConsole(clientInfo: ILoggerOptionsClientInfo): Transport {
    return new Winston.transports.Console({
      level: 'silly',
      format: Winston.format.combine(
        formatLoggerDummy(),
        formatLoggerFilter({ child: clientInfo.child, level: clientInfo.level, silly: true }),
        Winston.format.colorize(),
        formatLoggerConsole(clientInfo),
      ),
      forceConsole: true,
    });
  }
}
