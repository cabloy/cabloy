type AggregateFunction = 'count' | 'sum' | 'avg' | 'min' | 'max';
type AggregateSpec = Partial<Record<AggregateFunction, PropertyKey | readonly PropertyKey[]>>;

export function normalizeAggregateValue(value: unknown, fn: 'count'): string | undefined;
export function normalizeAggregateValue(
  value: unknown,
  fn: AggregateFunction,
): string | null | undefined;
export function normalizeAggregateValue(
  value: unknown,
  fn: AggregateFunction,
): string | null | undefined {
  if (value === undefined) return value;
  if (value === null && fn !== 'count') return value;
  if (typeof value === 'string') {
    if (fn !== 'count' || /^(0|[1-9]\d*)$/.test(value)) return value;
  } else if (typeof value === 'number') {
    if (Number.isFinite(value) && (fn !== 'count' || (Number.isSafeInteger(value) && value >= 0))) {
      return String(value);
    }
  } else if (typeof value === 'bigint' && (fn !== 'count' || value >= 0n)) {
    return String(value);
  }
  throw new TypeError(`Invalid ORM ${fn} aggregate result`);
}

export function normalizeAggregateRows<T extends {}>(rows: T[], aggrs?: AggregateSpec): T[] {
  if (!aggrs || rows.length === 0) return rows;
  const aliases: [string, AggregateFunction][] = [];
  for (const fn of ['count', 'sum', 'avg', 'min', 'max'] as const) {
    const columns = aggrs[fn];
    if (columns === undefined) continue;
    for (const column of typeof columns === 'object' ? columns : [columns]) {
      aliases.push([`${fn}_${column === '*' ? 'all' : String(column)}`, fn]);
    }
  }
  let result = rows;
  for (const [index, row] of rows.entries()) {
    let target = row;
    for (const [alias, fn] of aliases) {
      if (!Object.hasOwn(row, alias)) continue;
      const value = (row as Record<string, unknown>)[alias];
      const normalized = normalizeAggregateValue(value, fn);
      if (value === normalized) continue;
      if (target === row) target = { ...row };
      (target as Record<string, unknown>)[alias] = normalized;
    }
    if (target === row) continue;
    if (result === rows) result = [...rows];
    result[index] = target;
  }
  return result;
}
