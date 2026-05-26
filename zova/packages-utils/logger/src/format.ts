/**
 * Refactored by zhennann
 * (C) 2010 Charlie Robbins
 * MIT LICENCE
 */

import type { FormatWrap, TransformFunction } from './types.ts';

export class Format {
  transform: TransformFunction;
  options?: object;

  constructor(transform: TransformFunction, opts?: object) {
    this.transform = transform;
    this.options = opts;
  }
}

export function format(transform: TransformFunction): FormatWrap {
  return (opts?: object) => {
    return new Format(transform, opts);
  };
}
