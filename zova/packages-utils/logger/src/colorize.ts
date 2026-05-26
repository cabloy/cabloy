/**
 * Refactored by zhennann
 * (C) 2010 Charlie Robbins
 * MIT LICENCE
 */

import { LEVEL, MESSAGE } from './types.ts';

const codes = {
  black: [30, 39],
  red: [31, 39],
  green: [32, 39],
  yellow: [33, 39],
  blue: [34, 39],
  magenta: [35, 39],
  cyan: [36, 39],
  white: [37, 39],
  gray: [90, 39],
  grey: [90, 39],
};

let allColors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'green',
  verbose: 'cyan',
  debug: 'blue',
  silly: 'magenta',
  tip: 'gray',
};

export function colorize(color, text) {
  if (!text) return text;
  const code = codes[allColors[color]];
  if (!code) return text;
  const open = `\x1B[${code[0]}m`;
  const close = `\x1B[${code[1]}m`;
  return `${open}${text}${close}`;
}

class Colorizer {
  options: any;
  constructor(opts: any = {}) {
    if (opts.colors) {
      allColors = Object.assign({}, allColors, opts.colors);
    }
    this.options = opts;
  }

  colorize(lookup, level, message?) {
    if (typeof message === 'undefined') {
      message = level;
    }
    return colorize(lookup, message);
  }

  transform(info, opts) {
    if (opts.all && typeof info[MESSAGE] === 'string') {
      info[MESSAGE] = this.colorize(info[LEVEL], info.level, info[MESSAGE]);
    }

    if (opts.level || opts.all || !opts.message) {
      info.level = this.colorize(info[LEVEL], info.level);
    }

    if (opts.all || opts.message) {
      info.message = this.colorize(info[LEVEL], info.level, info.message);
    }

    return info;
  }
}

export function colorizer(opts?) {
  return new Colorizer(opts);
}
