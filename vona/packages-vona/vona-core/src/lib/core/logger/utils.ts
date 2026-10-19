import { isEmptyObject } from '@cabloy/utils';
import chalk from 'chalk';
import { LEVEL, MESSAGE } from 'triple-beam';
import * as Winston from 'winston';

import type {
  ILoggerFormatFilterOpts,
  ILoggerFormatOpts,
  ILoggerOptionsClientInfo,
} from '../../../types/interface/logger.ts';

import { cast } from '../../../types/utils/cast.ts';
import { useApp } from '../../framework/useApp.ts';
import { getRequestBoundary } from '../requestBoundary.ts';

const SymbolLoggerMessage = Symbol('SymbolLoggerMessage');

export const formatLoggerBoundary = Winston.format(info => {
  if (getRequestBoundary()) return false;
  return info;
});

export const formatLoggerAxiosError = Winston.format((einfo, opts: any) => {
  if (getRequestBoundary()) return false;
  const { stack, cause } = opts;
  if (
    (einfo instanceof Error && einfo.constructor.name.includes('AxiosError')) ||
    einfo.name === 'AxiosError' ||
    einfo.isAxiosError
  ) {
    const info = Object.assign({}, einfo, {
      level: einfo.level,
      [LEVEL]: einfo[LEVEL] || einfo.level,
      message: einfo.message,
      [MESSAGE]: einfo[MESSAGE] || einfo.message,
    });
    if (stack) info.stack = einfo.stack;
    if (cause) info.cause = einfo.cause;
    info.message = `${info.message}: ${cast(info.config).url}`;
    info[MESSAGE] = `${info[MESSAGE]}: ${cast(info.config).url}`;
    delete info.config;
    delete info.request;
    delete info.response;
    return info;
  }
  return einfo;
});

export const formatLoggerErrors = (opts: ILoggerFormatOpts) => {
  if (getRequestBoundary()) return formatLoggerBoundary();
  return Winston.format.combine(
    formatLoggerBoundary(),
    formatLoggerAxiosError(opts),
    Winston.format.errors(opts),
  );
};

export const formatLoggerCtx = Winston.format((info, _opts: any) => {
  if (getRequestBoundary()) return false;
  const app = useApp();
  if (!app.ctx) return info;
  if (app.ctx.method) info.method = app.ctx.method;
  if (app.ctx.path) info.path = app.ctx.path;
  const telemetry = (app.ctx.state as any).telemetry;
  if (telemetry?.requestId) info.request_id = telemetry.requestId;
  const span = telemetry?.span ?? telemetry?.serverSpan;
  const spanContext = span?.spanContext();
  if (spanContext?.traceId && spanContext?.spanId) {
    info.trace_id = spanContext.traceId;
    info.span_id = spanContext.spanId;
    info.trace_flags = spanContext.traceFlags;
  }
  return info;
});

export const formatLoggerDummy = Winston.format(info => {
  if (getRequestBoundary()) return false;
  const app = useApp();
  if (app.meta.env.LOGGER_DUMMY === 'true') return false;
  return info;
});

export const formatLoggerFilter = Winston.format(((info: any, opts: ILoggerFormatFilterOpts) => {
  if (getRequestBoundary()) return false;
  // check client
  const child = typeof opts.child === 'function' ? opts.child() : opts.child;
  if (child && !child.includes(info.name)) {
    if (opts.silly && info.level === 'silly') return __formatLoggerFilterCheckInfo(info);
    return false;
  }
  // check level
  const level = typeof opts.level === 'function' ? opts.level() : opts.level;
  if (!level) return false;
  if (opts.strict) {
    if (Winston.config.npm.levels[info.level] === Winston.config.npm.levels[level])
      return __formatLoggerFilterCheckInfo(info);
    return false;
  }
  if (
    Winston.config.npm.levels[info.level] <= Winston.config.npm.levels[level] ||
    (opts.silly && info.level === 'silly')
  ) {
    return __formatLoggerFilterCheckInfo(info);
  }
  return false;
}) as any);

export const formatLoggerConsole = (clientInfo: ILoggerOptionsClientInfo) => {
  return Winston.format.combine(
    formatLoggerBoundary(),
    Winston.format.printf(info => {
      if (getRequestBoundary()) return '';
      const { timestamp, level, stack, message, name, beanFullName, durationMs, ...meta } = info;
      const textClientName =
        clientInfo.clientName === 'default' ? '' : ` ${chalk.cyan(`[${clientInfo.clientName}]`)}`;
      const textName = name ? ` ${chalk.cyan(`[${name}]`)}` : '';
      const textBeanFullName = beanFullName ? ` ${chalk.gray(`[${beanFullName}]`)}` : '';
      const textMeta = !isEmptyObject(meta) ? ` ${JSON.stringify(meta)}` : '';
      const textMessage = ` ${message}`;
      const textDurationMs = durationMs !== undefined ? ` ${chalk.cyan(`+${durationMs}ms`)}` : '';
      const textStack = stack ? `\n${stack}` : '';
      return `${timestamp} ${level}${textClientName}${textName}${textBeanFullName}${textMeta}${textMessage}${textDurationMs}${textStack}`;
    }),
  );
};

function __formatLoggerFilterCheckInfo(info) {
  if (getRequestBoundary()) return false;
  if (typeof info.message === 'function') {
    if (info.message[SymbolLoggerMessage] === undefined) {
      info.message[SymbolLoggerMessage] = info.message();
    }
    info.message = info.message[SymbolLoggerMessage];
  }
  return info;
}
