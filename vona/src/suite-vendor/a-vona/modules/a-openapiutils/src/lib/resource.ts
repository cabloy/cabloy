import type { IResourceRecord } from 'vona-module-a-openapi';

export function $resourceName<K extends keyof IResourceRecord>(name: K): K {
  return name;
}
