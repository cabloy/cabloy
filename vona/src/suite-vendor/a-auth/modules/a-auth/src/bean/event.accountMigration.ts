import type { TableIdentity } from 'table-identity';

import { BeanEventBase, Event } from 'vona-module-a-event';

export interface TypeEventAccountMigrationData {
  userIdFrom: TableIdentity;
  userIdTo: TableIdentity;
}

export type TypeEventAccountMigrationResult = void;

@Event()
export class EventAccountMigration extends BeanEventBase<
  TypeEventAccountMigrationData,
  TypeEventAccountMigrationResult
> {}
