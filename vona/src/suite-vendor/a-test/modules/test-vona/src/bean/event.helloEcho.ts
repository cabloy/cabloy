import { BeanEventBase, Event } from 'vona-module-a-event';

export interface TypeEventHelloEchoData {
  text: string;
}

export type TypeEventHelloEchoResult = string;

@Event()
export class EventHelloEcho extends BeanEventBase<
  TypeEventHelloEchoData,
  TypeEventHelloEchoResult
> {}
