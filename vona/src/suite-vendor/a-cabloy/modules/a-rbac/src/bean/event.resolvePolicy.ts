import { BeanEventBase, Event } from 'vona-module-a-event';

import type { IRbacPolicyDecision, IRbacPolicyRequest } from '../types/rbac.ts';

export type TypeEventResolvePolicyData = IRbacPolicyRequest;

export type TypeEventResolvePolicyResult = IRbacPolicyDecision | undefined;

@Event()
export class EventResolvePolicy extends BeanEventBase<
  TypeEventResolvePolicyData,
  TypeEventResolvePolicyResult
> {}
