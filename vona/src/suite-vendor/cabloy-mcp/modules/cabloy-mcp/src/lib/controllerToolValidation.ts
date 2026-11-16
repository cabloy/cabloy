import z from 'zod';

import type { ToolSchema } from './controllerToolSchema.ts';

import { resolveSchema } from './controllerToolSchema.ts';

// Only this small projection crosses the MCP error boundary, never raw Zod issues.
const validationData = z.strictObject({
  issues: z
    .array(
      z.strictObject({
        message: z.string().min(1).max(256),
        path: z
          .array(z.union([z.string().max(128), z.number().int().nonnegative().safe()]))
          .max(16),
      }),
    )
    .min(1)
    .max(10),
});

export function readToolValidationData(data: unknown) {
  const parsed = validationData.safeParse(data);
  return parsed.success ? parsed.data : undefined;
}

export function toolValidationData(
  issues: ReadonlyArray<z.core.$ZodIssue>,
  prefix: string[],
  schema: ToolSchema,
) {
  const definitions = schema.$defs ?? {};
  function children(node: ToolSchema, part: PropertyKey): ToolSchema[] {
    node = resolveSchema(node, definitions);
    const child =
      typeof part === 'number'
        ? node.items
        : Object.hasOwn(node.properties ?? {}, part)
          ? node.properties[part]
          : undefined;
    return [
      ...(child && typeof child === 'object' ? [child] : []),
      ...['allOf', 'anyOf', 'oneOf'].flatMap(key =>
        (node[key] ?? []).flatMap((branch: ToolSchema) => children(branch, part)),
      ),
    ];
  }
  return {
    issues: issues.slice(0, 10).map(issue => {
      const path: (string | number)[] = [];
      let nodes = [schema];
      for (const part of [...prefix, ...issue.path].slice(0, 16)) {
        if (typeof part !== 'string' && typeof part !== 'number') break;
        if (typeof part === 'string' && part.length > 128) break;
        if (typeof part === 'number' && (!Number.isSafeInteger(part) || part < 0)) break;
        nodes = nodes.flatMap(node => children(node, part));
        if (!nodes.length) break;
        path.push(part);
      }
      // Unknown keys and custom refinements can embed input in their messages.
      // Keep native messages for standard constraints, not arbitrary exception data.
      const message =
        path.length !== prefix.length + issue.path.length
          ? 'Invalid value'
          : issue.code === 'unrecognized_keys'
            ? 'Unrecognized fields'
            : issue.code === 'custom'
              ? 'Invalid value'
              : (z.locales.en().localeError({ input: undefined, ...issue }) as string);
      return { message: message.slice(0, 256) || 'Invalid value', path };
    }),
  };
}
