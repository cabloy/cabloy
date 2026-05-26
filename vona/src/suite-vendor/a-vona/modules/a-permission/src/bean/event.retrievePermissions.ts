import type { IOpenapiPermissions, IResourceRecord } from 'vona-module-a-openapi';

import { BeanEventBase, Event } from 'vona-module-a-event';

export interface TypeEventRetrievePermissionsData {
  resource: keyof IResourceRecord;
}

export type TypeEventRetrievePermissionsResult = IOpenapiPermissions;

@Event()
export class EventRetrievePermissions extends BeanEventBase<
  TypeEventRetrievePermissionsData,
  TypeEventRetrievePermissionsResult
> {}
