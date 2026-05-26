/**
 * Refactored by zhennann
 * (C) 2010 Charlie Robbins
 * MIT LICENCE
 */

import type { Logger } from './logger.ts';

export class Profiler {
  logger: Logger;
  start: number;

  constructor(logger: Logger) {
    this.logger = logger;
    this.start = Date.now();
  }

  done(...args) {
    if (typeof args[args.length - 1] === 'function') {
      console.warn('Callback function no longer supported as of winston@3.0.0');
      args.pop();
    }

    const info = typeof args[args.length - 1] === 'object' ? args.pop() : {};
    info.level = info.level || 'info';
    info.durationMs = Date.now() - this.start;

    return this.logger.log(info);
  }
}
