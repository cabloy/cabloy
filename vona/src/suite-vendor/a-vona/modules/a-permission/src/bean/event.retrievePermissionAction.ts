import type { IResourceRecord } from 'vona-module-a-openapi';

import { BeanEventBase, Event } from 'vona-module-a-event';

export interface TypeEventRetrievePermissionActionData {
  resource: keyof IResourceRecord;
  actionKey: string;
}

export type TypeEventRetrievePermissionActionResult = boolean;

@Event()
export class EventRetrievePermissionAction extends BeanEventBase<
  TypeEventRetrievePermissionActionData,
  TypeEventRetrievePermissionActionResult
> {}
