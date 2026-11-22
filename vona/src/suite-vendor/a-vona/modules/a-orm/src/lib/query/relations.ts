import type { TypeQueryPredicate } from '../../types/query.ts';

/** Collect distinct relation names from a validated query predicate. */
export function getQueryRelationNames(predicate: TypeQueryPredicate | undefined): string[] {
  const names = new Set<string>();
  const visit = (node: TypeQueryPredicate) => {
    if ('relation' in node) {
      names.add(node.relation);
    } else if ('and' in node || 'or' in node) {
      for (const child of 'and' in node ? node.and : node.or) visit(child);
    } else if ('not' in node) {
      visit(node.not);
    }
  };
  if (predicate) visit(predicate);
  return [...names];
}
