import type { TableIdentity } from 'table-identity';
import type { TypeModelWhere } from 'vona-module-a-orm';

import { BeanBase, beanFullNameFromOnionName } from 'vona';
import { Bean } from 'vona-module-a-bean';

import type { IRbacActionDescriptor, IRbacPolicyDecision, IRbacScopeTerm } from '../types/rbac.ts';
import type { IRbacScopeAccess, IRbacScopeAdapter } from '../types/scope.ts';

import { getRbacDecision, hasRbacAllScope, rbacActionKey } from '../lib/rbac.ts';

@Bean()
export class BeanRbacScope extends BeanBase {
  private _scopeAdapter: IRbacScopeAdapter | undefined;

  async isUnrestricted(): Promise<boolean> {
    return await this.scopeAdapter.isUnrestricted();
  }

  async current(actionKey?: string): Promise<IRbacScopeAccess> {
    const action = this.resolveAction(actionKey);
    if (!action) this.app.throw(403);

    const decision = getRbacDecision(this.ctx);
    if (!this.isDecisionForAction(decision, action)) this.app.throw(403);

    const unrestricted = hasRbacAllScope(decision);
    const ownerValues =
      action.action === 'create'
        ? await this.prepareOwnerValues(action, decision, unrestricted)
        : undefined;
    return this.createAccess(action, decision, unrestricted, ownerValues);
  }

  private get scopeAdapter(): IRbacScopeAdapter {
    if (!this._scopeAdapter) {
      const beanFullName = beanFullNameFromOnionName(
        this.scope.config.adapter.rbacScope,
        'service',
      );
      this._scopeAdapter = this.bean._getBean(beanFullName) as IRbacScopeAdapter;
    }
    return this._scopeAdapter;
  }

  private async prepareOwnerValues(
    action: IRbacActionDescriptor,
    decision: IRbacPolicyDecision,
    unrestricted: boolean,
  ): Promise<Record<string, TableIdentity | null | undefined>> {
    const values = await this.scopeAdapter.ownerValues(action, decision);
    const departmentField = action.options.dataScopeField ?? 'departmentId';
    const ownerField = action.options.dataScopeMineField ?? 'userIdOwner';
    const ownerValues = {
      [departmentField]: values.departmentId,
      [ownerField]: values.userIdOwner,
    };
    if (!this.matches(action, decision, unrestricted, ownerValues)) this.app.throw(403);
    return ownerValues;
  }

  private createAccess(
    action: IRbacActionDescriptor,
    decision: IRbacPolicyDecision,
    unrestricted: boolean,
    ownerValues: Record<string, TableIdentity | null | undefined> | undefined,
  ): IRbacScopeAccess {
    return {
      action,
      decision,
      unrestricted,
      ownerValues: () => {
        if (!ownerValues) this.app.throw(500, 'RBAC scope owner values are not initialized');
        return { ...ownerValues };
      },
      where: (callerWhere?: TypeModelWhere<any>) =>
        this.where(action, decision, unrestricted, callerWhere),
      checkEntry: (entry: object | undefined) => {
        if (entry !== undefined && !this.matches(action, decision, unrestricted, entry)) {
          this.app.throw(403);
        }
      },
      checkEntries: (entries: readonly object[]) => {
        for (const entry of entries) {
          if (!this.matches(action, decision, unrestricted, entry)) this.app.throw(403);
        }
      },
      permissionProjection: () => this.permissionProjection(action, decision, unrestricted),
    };
  }

  private permissionProjection(
    action: IRbacActionDescriptor,
    decision: IRbacPolicyDecision,
    unrestricted: boolean,
  ) {
    const matcher =
      unrestricted || !action.options.dataScope
        ? { mode: 'all' as const }
        : {
            mode: 'any' as const,
            rules: (decision.terms ?? []).flatMap(term => {
              if (term.dataScope === 'all') return [];
              if (term.dataScope === 'mine') {
                return [
                  {
                    field: action.options.dataScopeMineField ?? 'userIdOwner',
                    values: [term.ownerId],
                  },
                ];
              }
              return [
                {
                  field: action.options.dataScopeField ?? 'departmentId',
                  values: [...term.departmentIds],
                },
              ];
            }),
          };
    if (matcher.mode === 'any' && matcher.rules.length === 0) this.app.throw(403);
    return { key: action.actionKey, allowed: decision.allowed, matcher };
  }

  private where(
    action: IRbacActionDescriptor,
    decision: IRbacPolicyDecision,
    unrestricted: boolean,
    callerWhere?: TypeModelWhere<any>,
  ): TypeModelWhere<any> | undefined {
    if (unrestricted) return callerWhere;
    const scopeWhere = this.scopeWhere(action, decision);
    if (!scopeWhere) this.app.throw(403);
    if (!callerWhere) return scopeWhere;
    return { _and_: { _and_: callerWhere, _and_0: scopeWhere } } as TypeModelWhere<any>;
  }

  private scopeWhere(
    action: IRbacActionDescriptor,
    decision: IRbacPolicyDecision,
  ): TypeModelWhere<any> | undefined {
    const predicates = (decision.terms ?? []).flatMap(term => this.termPredicates(action, term));
    if (!predicates.length) return undefined;
    return (predicates.length === 1 ? predicates[0] : { _or_: predicates }) as TypeModelWhere<any>;
  }

  private matches(
    action: IRbacActionDescriptor,
    decision: IRbacPolicyDecision,
    unrestricted: boolean,
    row: object,
  ): boolean {
    const values = row as Record<string, unknown>;
    if (unrestricted) return true;
    return (decision.terms ?? []).some(term => {
      if (term.dataScope === 'all') return true;
      if (term.dataScope === 'mine') {
        const field = action.options.dataScopeMineField ?? 'userIdOwner';
        return String(values[field] ?? '') === term.ownerId;
      }
      const field = action.options.dataScopeField ?? 'departmentId';
      return term.departmentIds.includes(String(values[field] ?? ''));
    });
  }

  private resolveAction(actionKey?: string): IRbacActionDescriptor | undefined {
    const catalog = this.bean.rbacCatalog.getCatalog();
    if (actionKey) return catalog.get(actionKey);
    const route = this.ctx.route;
    return route
      ? catalog.get(rbacActionKey(route.controllerBeanFullName, route.action))
      : undefined;
  }

  private isDecisionForAction(
    decision: IRbacPolicyDecision | undefined,
    action: IRbacActionDescriptor,
  ): decision is IRbacPolicyDecision {
    return Boolean(
      decision?.allowed &&
      decision.actionKey === action.actionKey &&
      decision.action.actionKey === action.actionKey &&
      decision.action.actionInheritKey === action.actionInheritKey &&
      decision.action.controllerBeanFullName === action.controllerBeanFullName &&
      decision.action.action === action.action &&
      this.isValidTerms(decision.terms),
    );
  }

  private isValidTerms(terms: IRbacScopeTerm[] | undefined): boolean {
    if (!terms?.length) return false;
    return terms.every(term => {
      if (term.dataScope === 'all') return true;
      if (term.dataScope === 'mine')
        return typeof term.ownerId === 'string' && term.ownerId.length > 0;
      return (
        ['customDepartments', 'ownDepartment', 'ownDepartmentAndDescendants'].includes(
          term.dataScope,
        ) &&
        Array.isArray(term.departmentIds) &&
        term.departmentIds.length > 0 &&
        term.departmentIds.every(id => typeof id === 'string' && id.length > 0)
      );
    });
  }

  private termPredicates(
    action: IRbacActionDescriptor,
    term: IRbacScopeTerm,
  ): Record<string, unknown>[] {
    if (term.dataScope === 'all') return [{}];
    if (term.dataScope === 'mine') {
      const field = action.options.dataScopeMineField ?? 'userIdOwner';
      return [{ [field]: term.ownerId }];
    }
    const field = action.options.dataScopeField ?? 'departmentId';
    return [{ [field]: { _in_: term.departmentIds } }];
  }
}
