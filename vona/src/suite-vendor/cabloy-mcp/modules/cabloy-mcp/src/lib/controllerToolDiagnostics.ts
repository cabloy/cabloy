import type { VonaApplication } from 'vona';
import type { IQueryPolicy } from 'vona-module-a-orm';

import { randomUUID } from 'node:crypto';
import { performance } from 'node:perf_hooks';

export interface IToolCallDiagnostic {
  callId: string;
  tool: string;
  started: number;
  outcome: 'success' | 'unavailable' | 'invalid_arguments' | 'resource_not_found' | 'action_failed';
}

interface IQueryDiagnosticInput {
  policy: IQueryPolicy;
  namedFilters: readonly string[];
  value: unknown;
}

type QueryShape =
  | { field: string; op: string }
  | { and: QueryShape[] }
  | { or: QueryShape[] }
  | { not: QueryShape }
  | { truncated: true };

const controlNames = new Set(['where', 'orders', 'pageNo', 'pageSize', 'groups', 'aggrs']);

/** Only validated query structure is retained; operands never enter diagnostics. */
export function summarizeToolQueries(inputs: IQueryDiagnosticInput[]) {
  let remaining = 32;
  let truncated = inputs.length > 8;
  const trim = (): QueryShape => {
    truncated = true;
    return { truncated: true };
  };
  const queries = inputs.slice(0, 8).map(({ policy, namedFilters, value }) => {
    const query = value as Record<string, unknown> | undefined;
    const names = namedFilters.filter(
      name => !controlNames.has(name) && query?.[name] !== undefined,
    );
    if (names.length > 16 || names.some(name => name.length > 64)) truncated = true;
    const project = (node: any, depth: number): QueryShape => {
      if (remaining-- <= 0 || depth > 6 || !node || typeof node !== 'object') return trim();
      if ('and' in node || 'or' in node) {
        const key = 'and' in node ? 'and' : 'or';
        if (!Array.isArray(node[key])) return trim();
        const children: QueryShape[] = [];
        for (const child of node[key]) {
          if (remaining <= 0) {
            children.push(trim());
            break;
          }
          children.push(project(child, depth + 1));
        }
        return key === 'and' ? { and: children } : { or: children };
      }
      if ('not' in node) return { not: project(node.not, depth + 1) };
      const field = Object.keys(policy.fields).find(name => name === node.field);
      const op = field && policy.fields[field].operators.find(op => op === node.op);
      if (!field || !op || field.length > 64) return trim();
      return { field, op };
    };
    return {
      namedFilters: names.filter(name => name.length <= 64).slice(0, 16),
      ...(query?.where === undefined ? {} : { where: project(query.where, 1) }),
    };
  });
  // Bound the whole projection too, including unusually large server-owned names.
  if (JSON.stringify(queries).length > 4096) return { queries: [], truncated: true };
  return { queries, ...(truncated ? { truncated: true } : {}) };
}

export function beginToolCall(tool: string): IToolCallDiagnostic {
  return { callId: randomUUID(), tool, started: performance.now(), outcome: 'action_failed' };
}

export function recordToolCall(
  app: VonaApplication,
  call: IToolCallDiagnostic,
  stage: 'received' | 'dispatch' | 'settled',
  queries?: () => IQueryDiagnosticInput[],
): void {
  try {
    app.bean.logger.getChild('mcp').debug(`mcp.tool.call ${stage}`, {
      callId: call.callId,
      tool: call.tool,
      ...(stage === 'dispatch' && queries ? summarizeToolQueries(queries()) : {}),
      ...(stage === 'settled'
        ? {
            outcome: call.outcome,
            durationMs: Math.round((performance.now() - call.started) * 100) / 100,
          }
        : {}),
    });
  } catch {
    // Diagnostics must not change tool execution or expose an unsafe exception.
  }
}
