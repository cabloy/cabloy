import type z from 'zod';

import { replaceTemplate } from '@cabloy/word-utils';

export type LocaleAdapterFn = (text: string, ...args: any[]) => string;
export type LocaleCurrentAdapterFn = () => string;
export type ZodLocaleError = () => { localeError: z.core.$ZodErrorMap };
export type ZodLocaleErrors = Record<string, ZodLocaleError>;
export type ZodLocaleErrorsInstance = Record<string, z.core.$ZodErrorMap>;

export function translateError(localeAdapterFn: LocaleAdapterFn, key: string, scope?: object) {
  // 1. pre translate
  const content = localeAdapterFn(key);
  // 2. temp translate
  const [, args] = _replaceTemplate(content, scope);
  if (args.length === 0) return content;
  let message = localeAdapterFn(key, ...args);
  // 3. extact translate
  message = replaceTemplate(message, scope)!;
  return message;
}

function _replaceTemplate(content: string, scope?: object | undefined): [string, any[]] {
  if (!content) return [content, []];
  if (!scope) return [content, []];
  const args: any[] = [];
  content = content.toString().replace(/(\\)?\{\{ *([\w.]+) *\}\}/g, (block, skip, key) => {
    if (skip) {
      return block.substring(skip.length);
    }
    let value = getProperty(scope, key);
    value = value !== undefined ? value : '';
    args.push(value);
    return '%s';
  });
  return [content, args];
}

function getProperty(obj, name, sep?) {
  return _getProperty(obj, name, sep, false);
}

function _getProperty(obj, name, sep, forceObject) {
  if (!obj) return undefined;
  const names = name.split(sep || '.');
  // loop
  for (const name of names) {
    if (obj[name] === undefined || obj[name] === null) {
      if (forceObject) {
        obj[name] = {};
      } else {
        obj = obj[name];
        break;
      }
    }
    obj = obj[name];
  }
  return obj;
}

export function toRaw(observed) {
  const raw = observed && observed.__v_raw;
  return raw ? toRaw(raw) : observed;
}
