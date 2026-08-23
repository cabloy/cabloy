import type { TableIdentity } from 'table-identity';
import type { IOpenapiPermissionActionRbac } from 'vona-module-a-openapi';
import type { TypeModelWhere } from 'vona-module-a-orm';

import type { IRbacActionDescriptor, IRbacPolicyDecision } from './rbac.ts';

export type IRbacScopeOwnerValues = Record<string, TableIdentity | null | undefined>;

export interface IRbacScopeAdapter {
  isUnrestricted(): Promise<boolean>;
  ownerValues(
    action: IRbacActionDescriptor,
    decision: IRbacPolicyDecision,
  ): Promise<IRbacScopeOwnerValues>;
}

export interface IRbacScopeAccess {
  action: IRbacActionDescriptor;
  decision: IRbacPolicyDecision;
  unrestricted: boolean;
  ownerValues(): Record<string, TableIdentity | null | undefined>;
  where(callerWhere?: TypeModelWhere<any>): TypeModelWhere<any> | undefined;
  checkEntry(entry: object | undefined): void;
  checkEntries(entries: readonly object[]): void;
  /** A safe permission projection for Resource permission consumers. */
  permissionProjection(): IOpenapiPermissionActionRbac;
}
