export function isSelectValueEqual(itemValue: unknown, value: unknown): boolean {
  if (String(itemValue) === String(value)) return true;
  if (typeof itemValue !== 'boolean') return false;
  return itemValue ? value === 1 || value === '1' : value === 0 || value === '0';
}
