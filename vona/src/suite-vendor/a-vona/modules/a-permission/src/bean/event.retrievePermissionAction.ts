import type { IOpenapiPermissionAction, IResourceRecord } from 'vona-module-a-openapi';

import { BeanEventBase, Event } from 'vona-module-a-event';

export interface TypeEventRetrievePermissionActionData {
  resource: keyof IResourceRecord;
  actionKey: string;
}

export type TypeEventRetrievePermissionActionResult = IOpenapiPermissionAction;

@Event()
export class EventRetrievePermissionAction extends BeanEventBase<
  TypeEventRetrievePermissionActionData,
  TypeEventRetrievePermissionActionResult
> {}
