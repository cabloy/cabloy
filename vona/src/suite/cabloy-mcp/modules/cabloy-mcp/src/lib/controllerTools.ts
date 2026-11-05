import type { CallToolResult, Tool } from '@modelcontextprotocol/server';
import type { VonaApplication } from 'vona';
import type { IMcpToolOptions } from 'vona-module-a-openapiutils';
import type { TypeMcpScope } from 'vona-module-mcp-auth';

import { fromJsonSchema, ProtocolError, Server } from '@modelcontextprotocol/server';
import { appMetadata, runWithZodQueryCoercion } from 'vona';
import { SymbolMcpOptions } from 'vona-module-a-openapiutils';
import { getCacheControllerRoutes } from 'vona-module-a-web';
import { isMcpScope } from 'vona-module-mcp-auth';
import z from 'zod';

import type { ToolSchema } from './controllerToolSchema.ts';

import {
  closeMutationInputSchema,
  isPrimitiveSchema,
  normalizeDateTransport,
  resolveSchema,
  serializeDateTransport,
  strictInputSchema,
  toolSchema,
  UnsupportedActionContract,
} from './controllerToolSchema.ts';

export interface IControllerToolDiagnostic {
  controller: string;
  action: string;
  reason: string;
}

export interface IControllerToolIdentity {
  controller: string;
  action: string;
}

export interface IControllerToolCatalogEntry extends IControllerToolIdentity {
  name: string;
  controllerSummary: string;
  summary: string;
  description: string;
  readOnly: boolean;
}

export interface IControllerToolServerOptions {
  includeTool?(identity: IControllerToolIdentity): boolean;
  isToolVisible?(identity: IControllerToolIdentity): Promise<boolean>;
  /** Exact consented bindings, not names alone or a dynamic include expression. */
  toolAccess?: ReadonlyArray<IControllerToolIdentity & { name: string }>;
  toolAccessReadOnly?: boolean;
}

interface IControllerTool {
  identity: IControllerToolIdentity;
  controllerSummary: string;
  summary: string;
  tool: Tool;
  readOnly: boolean;
  call(args: Record<string, unknown>): Promise<CallToolResult>;
}

function objectValidator(schema: z.ZodType): z.ZodObject | undefined {
  if (schema instanceof z.ZodObject) return schema;
  if (
    schema instanceof z.ZodOptional ||
    schema instanceof z.ZodNullable ||
    schema instanceof z.ZodDefault
  ) {
    return objectValidator(schema.unwrap() as z.ZodType);
  }
  return undefined;
}

function failure(message: string): CallToolResult {
  return { isError: true, content: [{ type: 'text', text: message }] };
}

/** Opt-in mapping only; every call retains the ordinary Action authorization boundary. */
export async function createControllerToolServer(
  app: VonaApplication,
  scope?: TypeMcpScope,
  serverOptions: IControllerToolServerOptions = {},
) {
  if (!isMcpScope(scope) || (scope.startsWith('mcp:custom:') && !serverOptions.toolAccess)) {
    throw new Error('MCP authorization scope required');
  }
  return runWithZodQueryCoercion(true, async () => {
    const tools = new Map<string, IControllerTool>();
    const diagnostics: IControllerToolDiagnostic[] = [];
    const routes = getCacheControllerRoutes(app);
    for (const controller of app.bean.onion.controller.getOnionsEnabledCached()) {
      for (const route of routes[controller.beanOptions.beanFullName] ?? []) {
        if (
          serverOptions.includeTool &&
          !serverOptions.includeTool({
            controller: controller.beanOptions.beanFullName,
            action: route.action,
          })
        ) {
          continue;
        }
        const defaults = appMetadata.getMetadata<IMcpToolOptions>(
          SymbolMcpOptions,
          route.controller,
        );
        const local = appMetadata.getMetadata<IMcpToolOptions>(
          SymbolMcpOptions,
          route.controller.prototype,
          route.action,
        );
        if (!defaults && !local) continue;
        const options = { ...defaults, ...local };
        const name =
          local?.name ??
          `${controller.beanOptions.beanFullName.replace('.controller.', '_').replace(/[^\w-]/g, '_')}_${route.action}`;
        if (!/^[\w-]{1,128}$/.test(name) || tools.has(name)) {
          throw new Error(`Invalid or duplicate MCP tool name: ${name}`);
        }
        try {
          const contract = app
            .scope('a-openapi')
            .service.openapi.getControllerActionContract(route.controller, route.action);
          if (
            contract.contentType !== 'application/json' ||
            (contract.openapiOptions?.httpCode !== undefined &&
              contract.openapiOptions.httpCode !== 200)
          ) {
            throw new UnsupportedActionContract('Only JSON/200 Actions are supported');
          }
          if (typeof contract.openapiOptions?.bodySchemaWrapper === 'function') {
            throw new UnsupportedActionContract('Custom response wrappers are not supported');
          }
          if (
            contract.request.headers ||
            contract.argsMeta.some(
              arg =>
                arg.extractValue ||
                ['request', 'response', 'rawBody', 'field', 'fields', 'file', 'files'].includes(
                  arg.type,
                ),
            )
          ) {
            throw new UnsupportedActionContract(
              'Native, upload or header bindings are not supported',
            );
          }
          const document = await app.bean.openapi.generateJsonOfControllerAction(
            route.controller,
            route.action,
            'V31',
            { includeExcluded: true, schemaTarget: 'mcp' },
          );
          const operation = Object.values(document.paths ?? {})
            .map(path => (path as any)?.[route.routeMethod])
            .find(Boolean);
          if (!operation)
            throw new UnsupportedActionContract('Action has no representable operation');
          const schemas = (document.components?.schemas ?? {}) as Record<string, ToolSchema>;
          const locations: Record<string, ToolSchema> = {};
          for (const parameter of operation.parameters ?? []) {
            if (!['path', 'query'].includes(parameter.in)) {
              throw new UnsupportedActionContract(
                'Only path, query and JSON body inputs are supported',
              );
            }
            const location = parameter.in === 'path' ? 'params' : 'query';
            const group = (locations[location] ??= {
              type: 'object',
              properties: {},
              required: [],
              additionalProperties: false,
            });
            group.properties[parameter.name] =
              parameter.in === 'path'
                ? { allOf: [parameter.schema, { not: { const: '' } }] }
                : parameter.schema;
            if (parameter.required) group.required.push(parameter.name);
          }
          if (operation.requestBody) {
            const body = operation.requestBody.content?.['application/json']?.schema;
            if (!body) throw new UnsupportedActionContract('JSON body required');
            locations.body = body;
          }
          const keys = Object.keys(locations);
          const flat =
            keys.length === 1 && resolveSchema(locations[keys[0]], schemas).type === 'object';
          const input: ToolSchema = flat
            ? strictInputSchema(locations[keys[0]], schemas)
            : {
                type: 'object',
                properties: Object.fromEntries(
                  keys.map(key => [
                    key,
                    resolveSchema(locations[key], schemas).type === 'object'
                      ? strictInputSchema(locations[key], schemas)
                      : locations[key],
                  ]),
                ),
                required: keys.filter(key => key !== 'body' || operation.requestBody.required),
                additionalProperties: false,
              };
          const response = operation.responses?.['200']?.content?.['application/json']?.schema;
          if (!response) throw new UnsupportedActionContract('JSON response schema required');
          const envelope = resolveSchema(response, schemas);
          const rawOutput =
            contract.openapiOptions?.bodySchemaWrapper === false
              ? envelope
              : envelope.properties?.data;
          if (!rawOutput)
            throw new UnsupportedActionContract('Business response schema unavailable');
          let output = resolveSchema(rawOutput, schemas);
          // OpenAPI represents optional object reads as object|null. Missing resources
          // are errors, so the successful MCP contract contains only the object.
          if (
            Array.isArray(output.type) &&
            output.type.includes('object') &&
            output.type.every((type: string) => type === 'object' || type === 'null')
          ) {
            output = { ...output, type: 'object' };
          }
          let validator = contract.response;
          if (options.output?.pick) {
            const object = objectValidator(validator);
            if (
              !object ||
              output.type !== 'object' ||
              options.output.pick.some(key => !object.shape[key] || !output.properties?.[key])
            ) {
              throw new Error(`Invalid MCP output.pick: ${name}`);
            }
            const pick = new Set(options.output.pick);
            output = {
              ...output,
              properties: Object.fromEntries(
                Object.entries(output.properties).filter(([key]) => pick.has(key)),
              ),
              required: (output.required ?? []).filter((key: string) => pick.has(key)),
              additionalProperties: false,
            };
            validator = z.object(
              Object.fromEntries(options.output.pick.map(key => [key, object.shape[key]])),
            );
          }
          if (!output.type && !output.anyOf && !output.oneOf && !output.allOf && !output.enum) {
            throw new UnsupportedActionContract('Typed response contract required');
          }
          const direct = output.type === 'object';
          const readOnly = options.readOnly ?? route.routeMethod === 'get';
          const inputSchema = toolSchema(input, schemas);
          if (!readOnly) closeMutationInputSchema(inputSchema);
          const outputSchema = toolSchema(
            direct
              ? output
              : {
                  type: 'object',
                  properties: { result: rawOutput },
                  required: ['result'],
                  additionalProperties: false,
                },
            schemas,
          );
          const inputCheck = fromJsonSchema(inputSchema as Parameters<typeof fromJsonSchema>[0])[
            '~standard'
          ];
          const outputCheck = isPrimitiveSchema(rawOutput, schemas)
            ? fromJsonSchema(outputSchema as Parameters<typeof fromJsonSchema>[0])['~standard']
            : undefined;
          const tool: Tool = {
            name,
            description: local?.description
              ? app.meta.text(local.description)
              : operation.description ||
                operation.summary ||
                `${controller.beanOptions.beanFullName}#${route.action}`,
            inputSchema,
            outputSchema,
            annotations: {
              readOnlyHint: readOnly,
              ...(readOnly ? { destructiveHint: false } : {}),
            },
          };
          tools.set(name, {
            identity: { controller: controller.beanOptions.beanFullName, action: route.action },
            controllerSummary: controller.beanOptions.options?.summary
              ? app.meta.text(controller.beanOptions.options.summary)
              : '',
            summary: operation.summary ?? '',
            tool,
            readOnly,
            async call(args) {
              const checked = await inputCheck.validate(
                serializeDateTransport(args, inputSchema, schemas),
              );
              if (checked.issues) throw new ProtocolError(-32602, 'Invalid tool arguments');
              const values = flat ? { [keys[0]]: args } : args;
              const bound: Record<string, unknown> = {};
              for (const key of keys) {
                const schema = contract.request[key as keyof typeof contract.request];
                const transported = normalizeDateTransport(values[key], locations[key], schemas);
                const parsed = await runWithZodQueryCoercion(false, () =>
                  schema!.safeParseAsync(transported),
                );
                if (!parsed.success) throw new ProtocolError(-32602, 'Invalid tool arguments');
                bound[key] = parsed.data;
              }
              try {
                const result = await app.bean.executor.performAction(
                  route.routeMethod as any,
                  route.routePathRaw,
                  { ...bound, innerAccess: false },
                );
                if (result === undefined || (direct && result === null)) {
                  return failure('Resource not found');
                }
                if (outputCheck && (await outputCheck.validate({ result })).issues) {
                  return failure('Action failed');
                }
                const parsed = await validator.parseAsync(result);
                const structuredContent = JSON.parse(
                  JSON.stringify(direct ? parsed : { result: parsed }),
                ) as Record<string, unknown>;
                return {
                  content: [{ type: 'text', text: JSON.stringify(structuredContent) }],
                  structuredContent,
                };
              } catch {
                return failure('Action failed');
              }
            },
          });
        } catch (error) {
          if (!(error instanceof UnsupportedActionContract)) throw error;
          diagnostics.push({
            controller: controller.beanOptions.beanFullName,
            action: route.action,
            reason: error.message,
          });
        }
      }
    }
    const work = new Set<Promise<unknown>>();
    function track<T>(fn: () => Promise<T>): Promise<T> {
      const pending = Promise.resolve().then(() => runWithZodQueryCoercion(true, fn));
      work.add(pending);
      void pending.then(
        () => work.delete(pending),
        () => work.delete(pending),
      );
      return pending;
    }
    const bindingKey = (name: string, identity: IControllerToolIdentity) =>
      JSON.stringify([name, identity.controller, identity.action]);
    const exactTools = new Set(serverOptions.toolAccess?.map(tool => bindingKey(tool.name, tool)));
    const allowed = (item: IControllerTool) =>
      scope === 'mcp:all' ||
      (scope === 'mcp:read'
        ? item.readOnly
        : exactTools.has(bindingKey(item.tool.name, item.identity)) &&
          (!serverOptions.toolAccessReadOnly || item.readOnly));
    async function visibleTools(): Promise<IControllerTool[]> {
      if (!app.ctx) throw new ProtocolError(-32603, 'Request context required');
      const visible: IControllerTool[] = [];
      try {
        // Guard checks temporarily own route state on this context, so never fan them out.
        for (const item of tools.values()) {
          if (!allowed(item)) continue;
          if (
            serverOptions.isToolVisible &&
            !(await serverOptions.isToolVisible({ ...item.identity }))
          ) {
            continue;
          }
          visible.push(item);
        }
      } catch {
        throw new ProtocolError(-32603, 'Tool discovery failed');
      }
      return visible;
    }
    const server = new Server(
      { name: 'cabloy-mcp-actions', version: '0.1.0' },
      { capabilities: { tools: {} } },
    );
    server.setRequestHandler('tools/list', () =>
      track(async () => {
        return { tools: (await visibleTools()).map(item => item.tool) };
      }),
    );
    server.setRequestHandler('tools/call', request =>
      track(async () => {
        if (!app.ctx) throw new ProtocolError(-32603, 'Request context required');
        const tool = tools.get(request.params.name);
        if (!tool || !allowed(tool)) throw new ProtocolError(-32602, 'Tool unavailable');
        return tool.call(request.params.arguments ?? {});
      }),
    );
    return Object.assign(server, {
      diagnostics,
      async catalog(): Promise<IControllerToolCatalogEntry[]> {
        return (await visibleTools()).map(item => ({
          ...item.identity,
          name: item.tool.name,
          controllerSummary: item.controllerSummary,
          summary: item.summary,
          description: item.tool.description ?? '',
          readOnly: item.readOnly,
        }));
      },
      async settleWork() {
        while (work.size) await Promise.allSettled([...work]);
      },
    });
  });
}
