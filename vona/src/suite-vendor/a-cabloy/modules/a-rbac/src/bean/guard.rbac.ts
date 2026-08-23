import type { IDecoratorGuardOptions } from 'vona-module-a-aspect';

import { Guard, GuardBase } from 'vona-module-a-aspect';

import type {
  IRbacActionDescriptor,
  IRbacPolicyDecision,
  IRbacScopeTerm,
  TypeRbacDataScope,
} from '../types/rbac.ts';

import { clearRbacDecision, createRbacAllScopeDecision, setRbacDecision } from '../lib/rbac.ts';

export interface IGuardOptionsRbac extends IDecoratorGuardOptions {
  dataScope?: boolean;
  dataScopeField?: string;
  dataScopeMineField?: string;
  actionInherit?: string;
}

@Guard<IGuardOptionsRbac>({
  dataScopeField: 'departmentId',
  dataScopeMineField: 'userIdOwner',
})
export class GuardRbac extends GuardBase {
  async check(options: IGuardOptionsRbac): Promise<boolean> {
    clearRbacDecision(this.ctx);
    const action = this.bean.rbacCatalog.getAction(this.ctx.route);
    if (!action) return false;
    const effectiveAction = { ...action, options: { ...action.options, ...options } };
    if (await this.bean.rbacScope.isUnrestricted()) {
      setRbacDecision(this.ctx, createRbacAllScopeDecision(effectiveAction));
      return true;
    }

    const decision = await this.scope.event.resolvePolicy.emit(
      {
        action: effectiveAction,
        policyActionKey: action.actionInheritKey ?? action.actionKey,
      },
      async () => undefined,
    );
    if (!this.isValidDecision(decision, effectiveAction) || !decision.allowed) return false;
    setRbacDecision(this.ctx, { ...decision, action: effectiveAction });
    return true;
  }

  private isValidDecision(
    decision: unknown,
    action: IRbacActionDescriptor,
  ): decision is IRbacPolicyDecision {
    if (!decision || typeof decision !== 'object') return false;
    const value = decision as Partial<IRbacPolicyDecision>;
    if (typeof value.allowed !== 'boolean' || value.actionKey !== action.actionKey) return false;
    if (!this.isValidAction(value.action, action)) return false;
    if (value.revision !== undefined && typeof value.revision !== 'string') return false;
    if (value.terms !== undefined && !this.isValidTerms(value.terms)) return false;
    return !value.allowed || !action.options.dataScope || this.isValidTerms(value.terms);
  }

  private isValidAction(value: unknown, action: IRbacActionDescriptor): boolean {
    if (!value || typeof value !== 'object') return false;
    const descriptor = value as Partial<IRbacActionDescriptor>;
    return (
      descriptor.actionKey === action.actionKey &&
      descriptor.actionInheritKey === action.actionInheritKey &&
      descriptor.controllerBeanFullName === action.controllerBeanFullName &&
      descriptor.action === action.action
    );
  }

  private isValidTerms(value: unknown): value is IRbacScopeTerm[] {
    return Array.isArray(value) && value.length > 0 && value.every(term => this.isValidTerm(term));
  }

  private isValidTerm(value: unknown): value is IRbacScopeTerm {
    if (!value || typeof value !== 'object') return false;
    const term = value as {
      dataScope?: unknown;
      departmentIds?: unknown;
      ownerId?: unknown;
    };
    if (term.dataScope === 'all') return true;
    if (term.dataScope === 'mine') {
      return typeof term.ownerId === 'string' && term.ownerId.length > 0;
    }
    if (!this.isDepartmentDataScope(term.dataScope)) return false;
    return (
      Array.isArray(term.departmentIds) &&
      term.departmentIds.length > 0 &&
      term.departmentIds.every(id => typeof id === 'string' && id.length > 0)
    );
  }

  private isDepartmentDataScope(
    value: unknown,
  ): value is Exclude<TypeRbacDataScope, 'all' | 'mine'> {
    return ['customDepartments', 'ownDepartment', 'ownDepartmentAndDescendants'].includes(
      value as Exclude<TypeRbacDataScope, 'all' | 'mine'>,
    );
  }
}
