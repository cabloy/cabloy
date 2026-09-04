import type { TableIdentity } from 'table-identity';

import { BeanEventBase, Event } from 'vona-module-a-event';

export interface TypeEventRoleMembershipChangedData {
  userIds: TableIdentity[];
  roleIds: TableIdentity[];
}

export type TypeEventRoleMembershipChangedResult = void;

@Event()
export class EventRoleMembershipChanged extends BeanEventBase<
  TypeEventRoleMembershipChangedData,
  TypeEventRoleMembershipChangedResult
> {}
