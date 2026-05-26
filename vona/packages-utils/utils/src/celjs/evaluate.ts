import type { Environment, ParseResult } from '@marcbachmann/cel-js';

import { isNil } from '../check.ts';
import { celEnvBase } from './base.ts';
import {
  StringPrefixCel,
  StringPrefixRaw,
  StringPrefixRegexp,
  StringPresetThis,
  StringPresetThisDef,
} from './types.ts';
import { evaluateSimple } from './utils.ts';

export function evaluateExpressions<T = any>(
  expressions: any,
  context?: object,
  celEnv?: Environment,
  dry?: boolean,
): T {
  if (isNil(expressions)) return _returnExpressionWithDry(expressions, dry);
  if (Array.isArray(expressions)) {
    return expressions.map(item => _evaluateExpressionInner(item, context, celEnv, dry)) as any;
  } else if (typeof expressions === 'object') {
    if (expressions.$$typeof) return expressions;
    if (expressions instanceof Date) return expressions as any;
    const res = {};
    for (const key in expressions) {
      res[key] = _evaluateExpressionInner(expressions[key], context, celEnv, dry);
    }
    return res as any;
  }
  // others
  return _evaluateExpressionInner(expressions, context, celEnv, dry);
}

function _evaluateExpressionInner<T = any>(
  expression: any,
  context?: object,
  celEnv?: Environment,
  dry?: boolean,
): T {
  if (isNil(expression)) return _returnExpressionWithDry(expression, dry);
  if (typeof expression === 'object') return evaluateExpressions(expression, context, celEnv, dry);
  if (typeof expression !== 'string') return _returnExpressionWithDry(expression, dry);
  if (!expression.startsWith(StringPrefixCel)) return _returnExpressionWithDry(expression, dry);
  return dry
    ? (true as any)
    : evaluate(expression.substring(StringPrefixCel.length), context, celEnv);
}

function _returnExpressionWithDry(expression: any, dry?: boolean) {
  return dry ? false : expression;
}

export function evaluate<T = any>(expression: string, context?: object, celEnv?: Environment): T {
  if (expression.startsWith(StringPrefixRaw)) {
    return expression.substring(StringPrefixRaw.length) as any;
  } else if (expression.startsWith(StringPrefixRegexp)) {
    return evaluateSimple(expression.substring(StringPrefixRegexp.length));
  } else if (expression === StringPresetThis) {
    return (context ?? {}) as T;
  } else if (expression === StringPresetThisDef) {
    return (celEnv ?? celEnvBase).getDefinitions() as T;
  }
  return (celEnv ?? celEnvBase).evaluate(expression, context);
}

export function parse(expression: string, celEnv?: Environment): ParseResult {
  return (celEnv ?? celEnvBase).parse(expression);
}
