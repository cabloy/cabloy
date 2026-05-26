import { evaluateExpressions } from './celjs/evaluate.ts';
import { StringPrefixCel, StringPrefixRegexp } from './celjs/types.ts';
import { evaluateSimple } from './celjs/utils.ts';

export type TypeMatchSelectorFunction = (this: any, ...args: any[]) => boolean;
export type TypeMatchSelectorRule<T> = T | RegExp | TypeMatchSelectorFunction;
export type TypeMatchSelectorRules<T> = TypeMatchSelectorRule<T>[] | TypeMatchSelectorRule<T>;

export function matchSelector<T>(
  match: TypeMatchSelectorRules<T>,
  selector: string | boolean,
  matchThis?: any,
  ...matchArgs: any[]
) {
  if (!Array.isArray(match)) {
    // prepare
    if (typeof match === 'string' && match.startsWith(StringPrefixRegexp)) {
      match = evaluateSimple(match.substring(StringPrefixRegexp.length));
    }
    return (
      (typeof match === 'string' &&
        match.startsWith(StringPrefixCel) &&
        !!evaluateExpressions(match, {
          selector,
          context:
            matchArgs[0] && typeof matchArgs[0] === 'object' ? { ...matchArgs[0] } : matchArgs[0],
        })) ||
      (typeof match === 'string' &&
        !match.startsWith(StringPrefixCel) &&
        typeof selector === 'string' &&
        match === selector) ||
      (match instanceof RegExp && typeof selector === 'string' && match.test(selector)) ||
      (typeof match === 'function' && (match as any).call(matchThis, selector, ...matchArgs))
    );
  }
  return match.some(item => matchSelector(item, selector));
}
