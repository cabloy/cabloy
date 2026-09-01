import type { TableIdentity } from 'table-identity';

import { BeanEventBase, Event } from 'vona-module-a-event';

import type { ISsrMenuItemPrepared } from '../types/ssrMenu.ts';

export interface TypeEventResolveMenuVisibilityData {
  ssrSiteName: string;
  menus: ISsrMenuItemPrepared[];
  currentRoleIds: TableIdentity[];
}

export type TypeEventResolveMenuVisibilityResult = ISsrMenuItemPrepared[];

@Event()
export class EventResolveMenuVisibility extends BeanEventBase<
  TypeEventResolveMenuVisibilityData,
  TypeEventResolveMenuVisibilityResult
> {}
