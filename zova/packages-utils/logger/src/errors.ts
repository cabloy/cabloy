/**
 * Refactored by zhennann
 * (C) 2010 Charlie Robbins
 * MIT LICENCE
 */

import { format } from './format.ts';
import { LEVEL, MESSAGE } from './types.ts';

export const errors = format((einfo, { stack, cause }: any) => {
  if (einfo instanceof Error) {
    const info = Object.assign({}, einfo, {
      level: einfo.level,
      [LEVEL]: einfo[LEVEL] || einfo.level,
      message: einfo.message,
      [MESSAGE]: einfo[MESSAGE] || einfo.message,
    });

    if (stack) info.stack = einfo.stack;
    if (cause) info.cause = einfo.cause;
    return info;
  }

  if (!(einfo.message instanceof Error)) return einfo;

  // Assign all enumerable properties and the
  // message property from the error provided.
  const err = einfo.message;
  Object.assign(einfo, err);
  einfo.message = err.message;
  einfo[MESSAGE] = err.message;

  // Assign the stack and/or cause if requested.
  if (stack) einfo.stack = err.stack;
  if (cause) einfo.cause = err.cause;
  return einfo;
});
