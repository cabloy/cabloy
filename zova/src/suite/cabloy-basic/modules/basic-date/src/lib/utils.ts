import { DateTime } from 'luxon';

import { ITableCellOptionsDate } from '../bean/tableCell.date.jsx';
import { TypeDateInputType } from '../types/date.js';

export function dateFormatUtil(value: any, options?: ITableCellOptionsDate) {
  if (!value) return;
  if (!options) return value;
  const datetime = _normalizeDateTime(
    value,
    options.preset ? _dateInputTypeFromPreset(options.preset) : 'date',
  );
  if (!datetime) return value;
  if (options.format) {
    return datetime.toFormat(options.format);
  } else if (options.preset) {
    return datetime.toLocaleString(DateTime[options.preset]);
  }
  return value;
}

export function dateInputTypeFromPreset(preset?: string): TypeDateInputType {
  return _dateInputTypeFromPreset(preset);
}

export function dateToInputValue(value: any, type: TypeDateInputType = 'date') {
  if (!value) return '';
  const datetime = _normalizeDateTime(value, type);
  if (!datetime) return '';
  return _formatDateTimeForInput(datetime, type);
}

export function dateFromInputValue(value: string | undefined, type: TypeDateInputType = 'date') {
  if (!value) return undefined;
  const datetime = _parseInputValue(value, type);
  return datetime?.toJSDate();
}

function _dateInputTypeFromPreset(preset?: string): TypeDateInputType {
  if (!preset) return 'date';
  if (preset.startsWith('TIME_')) return 'time';
  if (preset.startsWith('DATETIME_')) return 'datetime-local';
  return 'date';
}

function _normalizeDateTime(value: any, type: TypeDateInputType) {
  if (value instanceof Date) {
    const datetime = DateTime.fromJSDate(value);
    return datetime.isValid ? datetime : undefined;
  }
  if (typeof value === 'string') {
    return _parseInputValue(value, type);
  }
  return undefined;
}

function _parseInputValue(value: string, type: TypeDateInputType) {
  const normalizedValue = type === 'datetime-local' && value.length === 16 ? `${value}:00` : value;
  const datetime =
    type === 'time'
      ? DateTime.fromFormat(normalizedValue, normalizedValue.length === 5 ? 'HH:mm' : 'HH:mm:ss')
      : DateTime.fromISO(normalizedValue);
  return datetime.isValid ? datetime : undefined;
}

function _formatDateTimeForInput(datetime: DateTime, type: TypeDateInputType) {
  if (type === 'time') {
    return datetime.toFormat('HH:mm:ss');
  }
  if (type === 'datetime-local') {
    return datetime.toFormat("yyyy-LL-dd'T'HH:mm:ss");
  }
  return datetime.toISODate() ?? '';
}
