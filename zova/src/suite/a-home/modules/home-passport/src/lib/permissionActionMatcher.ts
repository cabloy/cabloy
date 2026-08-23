import type { IOpenapiPermissionActionRbac } from 'zova-module-a-openapi';

export function matchPermissionAction(
  actionPermission: IOpenapiPermissionActionRbac,
  currentData?: Record<string, unknown> | readonly Record<string, unknown>[],
): boolean {
  if (!actionPermission || actionPermission.allowed !== true) return false;
  const matcher = actionPermission.matcher;
  if (!matcher || typeof matcher !== 'object') return false;
  if (matcher.mode === 'all') return true;
  if (matcher.mode !== 'any' || !Array.isArray(matcher.rules) || matcher.rules.length === 0) {
    return false;
  }
  if (
    !matcher.rules.every(
      rule =>
        rule &&
        typeof rule.field === 'string' &&
        rule.field.length > 0 &&
        Array.isArray(rule.values) &&
        rule.values.length > 0 &&
        rule.values.every(value => typeof value === 'string'),
    )
  ) {
    return false;
  }
  if (!currentData) return true;
  const records = Array.isArray(currentData) ? currentData : [currentData];
  if (records.length === 0) return false;
  return records.every(record => {
    if (!record || typeof record !== 'object') return false;
    return matcher.rules.some(rule => {
      const value = record[rule.field];
      return value !== undefined && rule.values.includes(String(value));
    });
  });
}
