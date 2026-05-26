import { colorize, format, NpmConfigSetLevels, print } from '@cabloy/logger';
import { isEmptyObject } from '@cabloy/utils';

const SymbolLoggerMessage = Symbol('SymbolLoggerMessage');

export const formatLoggerFilter = format((info, opts: any) => {
  const level = typeof opts.level === 'function' ? opts.level() : opts.level;
  if (!level) return false;
  if (opts.strict) {
    if (NpmConfigSetLevels[info.level as string] === NpmConfigSetLevels[level])
      return __formatLoggerFilterCheckInfo(info);
    return false;
  }
  if (
    NpmConfigSetLevels[info.level as string] <= NpmConfigSetLevels[level] ||
    (opts.silly && info.level === 'silly')
  )
    return __formatLoggerFilterCheckInfo(info);
  return false;
});

export const formatLoggerConsole = () => {
  return print(({ timestamp, level, stack, message, name, beanFullName, durationMs, ...meta }) => {
    const textName = name ? ` ${colorize('verbose', `[${name}]`)}` : '';
    const textBeanFullName = beanFullName ? ` ${colorize('tip', `[${beanFullName}]`)}` : '';
    const textMessage = ` ${message}`;
    const textDurationMs =
      durationMs !== undefined ? ` ${colorize('verbose', `+${durationMs}ms`)}` : '';
    const textStack = stack ? `\n${stack}` : '';
    const result: any[] = [
      `${timestamp} ${level}${textName}${textBeanFullName}${textMessage}${textDurationMs}${textStack}`,
    ];
    if (!isEmptyObject(meta)) {
      const meta2 = {};
      for (const key in meta) {
        meta2[key] = meta[key];
      }
      result.push(meta2);
    }
    return result;
  });
};

function __formatLoggerFilterCheckInfo(info) {
  if (typeof info.message === 'function') {
    if (info.message[SymbolLoggerMessage] === undefined) {
      info.message[SymbolLoggerMessage] = info.message();
    }
    info.message = info.message[SymbolLoggerMessage];
  }
  return info;
}
