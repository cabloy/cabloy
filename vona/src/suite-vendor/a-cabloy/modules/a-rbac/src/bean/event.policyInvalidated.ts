import { BeanEventBase, Event } from 'vona-module-a-event';

export type TypeRbacPolicyInvalidationKind = 'policy' | 'role' | 'scopeTopology';

export interface TypeEventPolicyInvalidatedData {
  kind: TypeRbacPolicyInvalidationKind;
  removedRoleIds?: string[];
  removedScopeIds?: string[];
}

export type TypeEventPolicyInvalidatedResult = void;

@Event()
export class EventPolicyInvalidated extends BeanEventBase<
  TypeEventPolicyInvalidatedData,
  TypeEventPolicyInvalidatedResult
> {}
