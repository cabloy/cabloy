/**
 * Refactored by zhennann
 * (C) 2010 Charlie Robbins
 * MIT LICENCE
 */

import { cascade } from './cascade.ts';
import { format } from './format.ts';

export function combine(...formats) {
  const combinedFormat = format(cascade(formats));
  return combinedFormat();
}
