import objectHash from 'object-hash';

export function hashkey(key: any): string {
  if (key === undefined || key === null) {
    return '';
  }
  if (Array.isArray(key) || typeof key === 'object') {
    return objectHash(key, { respectType: false });
  }
  if (typeof key !== 'string') {
    return String(key);
  }
  return key;
}
