/**
 * Refactored by zhennann
 * (C) 2010 Charlie Robbins
 * MIT LICENCE
 */

import fecha from 'fecha';

import { format } from './format.ts';

export const timestamp = format((info, opts: any = {}) => {
  if (opts.format) {
    info.timestamp =
      typeof opts.format === 'function' ? opts.format() : fecha.format(new Date(), opts.format);
  }

  if (!info.timestamp) {
    info.timestamp = new Date().toISOString();
  }

  if (opts.alias) {
    info[opts.alias] = info.timestamp;
  }

  return info;
});
