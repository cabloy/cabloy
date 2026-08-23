import type { VonaContext } from 'vona';

import type { IRbacCapability, IRbacPolicyDecision } from '../types/rbac.ts';

export const SymbolRbacDecision = Symbol('SymbolRbacDecision');

export function createRbacAllScopeDecision(
  action: IRbacPolicyDecision['action'],
): IRbacPolicyDecision {
  return { allowed: true, actionKey: action.actionKey, action, terms: [{ dataScope: 'all' }] };
}

export function createRbacCapability(key: string, allowed: boolean): IRbacCapability {
  return { key, allowed };
}

export function isRbacCapability(value: unknown): value is IRbacCapability {
  if (!value || typeof value !== 'object') return false;
  const capability = value as Partial<IRbacCapability>;
  return (
    Object.keys(capability).every(key => key === 'key' || key === 'allowed') &&
    typeof capability.key === 'string' &&
    capability.key.length > 0 &&
    typeof capability.allowed === 'boolean'
  );
}

export function hasRbacAllScope(decision: IRbacPolicyDecision): boolean {
  return decision.terms?.some(term => term.dataScope === 'all') === true;
}

export function rbacActionKey(controllerBeanFullName: string, action: string): string {
  return `${controllerBeanFullName}#${action}`;
}

export function getRbacDecision(ctx: VonaContext): IRbacPolicyDecision | undefined {
  return ctx[SymbolRbacDecision];
}

export function setRbacDecision(ctx: VonaContext, decision: IRbacPolicyDecision): void {
  ctx[SymbolRbacDecision] = decision;
}

export function clearRbacDecision(ctx: VonaContext): void {
  delete ctx[SymbolRbacDecision];
}
