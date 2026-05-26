import { BeanEventBase, Event } from 'vona-module-a-event';

import type { IMiddlewareSystemOptionsStatic } from './middlewareSystem.static.ts';

export interface TypeEventResolvePathData {
  dir: string;
  filename: string;
  options: IMiddlewareSystemOptionsStatic;
}

export type TypeEventResolvePathResult = string | true | undefined;

@Event()
export class EventResolvePath extends BeanEventBase<
  TypeEventResolvePathData,
  TypeEventResolvePathResult
> {}
