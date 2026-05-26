import { DateTime } from 'luxon';

import { ITableCellOptionsDate } from '../bean/tableCell.date.jsx';

export function dateFormatUtil(value: any, options?: ITableCellOptionsDate) {
  if (!value) return;
  if (!options) return value;
  const datetime = DateTime.fromJSDate(value);
  if (options.format) {
    return datetime.toFormat(options.format);
  } else if (options.preset) {
    return datetime.toLocaleString(DateTime[options.preset]);
  }
  return value;
}
