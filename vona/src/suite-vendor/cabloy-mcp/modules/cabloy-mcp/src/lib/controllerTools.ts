import type { CallToolResult, Tool } from '@modelcontextprotocol/server';
import type { Constructable, VonaApplication } from 'vona';
import type { IMcpToolOptions } from 'vona-module-a-openapiutils';
import type { IAnalysisPolicy, IQueryPolicy, TypeAnalysisMode } from 'vona-module-a-orm';
import type { IDecoratorSsrSiteOptions } from 'vona-module-a-ssr';
import type { TypeMcpScope } from 'vona-module-mcp-auth';

import { fromJsonSchema, ProtocolError, Server } from '@modelcontextprotocol/server';
import { appMetadata, runWithZodQueryCoercion } from 'vona';
import { SymbolMcpOptions } from 'vona-module-a-openapiutils';
import { checkQueryBudget, PublicQueryError, validateQuery } from 'vona-module-a-orm';
import { RateLimitError, RateLimitUnavailableError } from 'vona-module-a-ratelimit';
import { getCacheControllerRoutes } from 'vona-module-a-web';
import { isMcpScope } from 'vona-module-mcp-auth';
import z from 'zod';

import type { IToolCallDiagnostic } from './controllerToolDiagnostics.ts';
import type { IControllerQueryCapability } from './controllerToolQuery.ts';
import type { ToolSchema } from './controllerToolSchema.ts';

import {
  compactToolSchema,
  queryRepairHint,
  toolContract,
  toolContractName,
} from './controllerToolContract.ts';
import { beginToolCall, recordToolCall } from './controllerToolDiagnostics.ts';
import { controllerToolQuery } from './controllerToolQuery.ts';
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
  /** Explicit enabled Site boundary; absence is never an all-Sites registry. */
  ssrSiteId?: string;
  includeTool?(identity: IControllerToolIdentity): boolean;
  isToolVisible?(identity: IControllerToolIdentity, controller: Constructable): Promise<boolean>;
  /** Exact consented bindings, not names alone or a dynamic include expression. */
  toolAccess?: ReadonlyArray<IControllerToolIdentity & { name: string }>;
  toolAccessReadOnly?: boolean;
  logout?(): Promise<void>;
}

interface IControllerTool {
  identity: IControllerToolIdentity;
  controller: Constructable;
  controllerSummary: string;
  summary: string;
  tool: Tool;
  readOnly: boolean;
  queryCapabilities: IControllerQueryCapability[];
  inputContract: ToolSchema;
  outputContract: ToolSchema;
  compactPaths: { input: string[][]; output: string[][] };
  call(args: Record<string, unknown>, diagnostic: IToolCallDiagnostic): Promise<CallToolResult>;
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

const logoutName = 'cabloy_logout';
const logoutTool: Tool = {
  name: logoutName,
  description:
    'Call only when the user explicitly asks to log out of this MCP server or revoke its current authorization. Revokes the credential used for this request, including OAuth refresh capability. All connections sharing that authorization or personal access token lose access; independent authorizations remain unchanged. Does not close the conversation, clear client credentials or history, or log out of the website. Reconnect requires a new authorization or personal access token.',
  inputSchema: { type: 'object', properties: {}, additionalProperties: false },
  outputSchema: {
    type: 'object',
    properties: { loggedOut: { type: 'boolean', const: true }, message: { type: 'string' } },
    required: ['loggedOut', 'message'],
    additionalProperties: false,
  },
  annotations: { readOnlyHint: false, destructiveHint: true, openWorldHint: false },
};

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
  const ssrSiteId = serverOptions.ssrSiteId;
  const ssrSite = ssrSiteId
    ? app
        .scope('a-ssr')
        .service.ssr.getSitesEnabled()
        .find(site => (site.beanOptions.options as IDecoratorSsrSiteOptions).siteId === ssrSiteId)
    : undefined;
  if (!ssrSite) {
    throw new Error('Enabled MCP SSR Site required');
  }
  const registeredSites = new Set<string>(
    Object.values(app.bean.onion.ssrSite.onionsNormal).map(site => site.name),
  );
  return runWithZodQueryCoercion(true, async () => {
    const tools = new Map<string, IControllerTool>();
    const diagnostics: IControllerToolDiagnostic[] = [];
    const routes = getCacheControllerRoutes(app);
    for (const controller of app.bean.onion.controller.getOnionsEnabledCached()) {
      for (const route of routes[controller.beanOptions.beanFullName] ?? []) {
        const options = appMetadata.getOwnMetadata<IMcpToolOptions>(
          SymbolMcpOptions,
          route.controller.prototype,
          route.action,
        );
        if (!options) continue;
        // Validate declarations even when another Site is selected. Site exclusion must
        // happen before public-name collisions or schema compilation can cross boundaries.
        const sites = options.ssrSites as unknown;
        if (
          sites !== undefined &&
          (!Array.isArray(sites) ||
            !sites.length ||
            sites.some(site => typeof site !== 'string' || !registeredSites.has(site)) ||
            new Set(sites).size !== sites.length)
        ) {
          throw new Error(
            `Invalid MCP tool ssrSites: ${controller.beanOptions.beanFullName}#${route.action}`,
          );
        }
        if (Array.isArray(sites) && !sites.includes(ssrSite.name)) continue;
        if (
          serverOptions.includeTool &&
          !serverOptions.includeTool({
            controller: controller.beanOptions.beanFullName,
            action: route.action,
          })
        ) {
          continue;
        }
        const name =
          options.name ??
          `${controller.beanOptions.beanFullName.replace('.controller.', '_').replace(/[^\w-]/g, '_')}_${route.action}`;
        if (
          !/^[\w-]{1,128}$/.test(name) ||
          tools.has(name) ||
          name === toolContractName ||
          name === logoutName
        ) {
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
          // Filter pipe factories carry the native policy resolved from the DTO. Do not
          // reconstruct business limits from a second transport-specific configuration.
          const queryBindings = contract.argsMeta.flatMap(arg =>
            arg.pipes.flatMap(pipe => {
              const info = pipe() as {
                pipeName: string;
                options?: {
                  query?: IQueryPolicy;
                  analysis?: IAnalysisPolicy;
                  analysisMode?: TypeAnalysisMode;
                };
              };
              return info.pipeName === 'a-web:filter' && info.options?.query
                ? [
                    {
                      type: arg.type === 'param' ? 'params' : arg.type,
                      field: arg.field,
                      ...info.options,
                      query: info.options.query,
                    },
                  ]
                : [];
            }),
          );
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
          const runtimeInputSchema = toolSchema(input, schemas);
          if (!readOnly) closeMutationInputSchema(runtimeInputSchema);
          let discoveryInput = input;
          let queryCapabilities: IControllerQueryCapability[] = [];
          if (queryBindings.length) {
            try {
              const projected = controllerToolQuery(input, schemas, queryBindings, flat);
              discoveryInput = projected.input;
              queryCapabilities = projected.bindings;
            } catch (error) {
              if (!(error instanceof UnsupportedActionContract)) throw error;
              diagnostics.push({
                controller: controller.beanOptions.beanFullName,
                action: route.action,
                reason: `Query compaction unavailable: ${error.message}`,
              });
            }
          }
          const fullOutput = direct
            ? output
            : {
                type: 'object',
                properties: { result: rawOutput },
                required: ['result'],
                additionalProperties: false,
              };
          const outputContract = toolSchema(fullOutput, schemas);
          const inputPaths = options.discovery?.input ?? [];
          const outputPaths = options.discovery?.output ?? [];
          const inputSchema = toolSchema(
            compactToolSchema(discoveryInput, schemas, inputPaths, 'input'),
            schemas,
          );
          if (!readOnly) closeMutationInputSchema(inputSchema);
          const outputSchema = toolSchema(
            compactToolSchema(fullOutput, schemas, outputPaths, 'output'),
            schemas,
          );
          const compactPaths = {
            input: [
              ...queryCapabilities
                .map(binding => [...binding.argumentPath, 'where'])
                .filter(
                  path => !inputPaths.some(parent => parent.every((part, i) => part === path[i])),
                ),
              ...inputPaths,
            ],
            output: outputPaths,
          };
          const inputCheck = fromJsonSchema(
            runtimeInputSchema as Parameters<typeof fromJsonSchema>[0],
          )['~standard'];
          const outputCheck = isPrimitiveSchema(rawOutput, schemas)
            ? fromJsonSchema(outputContract as Parameters<typeof fromJsonSchema>[0])['~standard']
            : undefined;
          const description = options.description
            ? app.meta.text(options.description)
            : operation.description ||
              operation.summary ||
              `${controller.beanOptions.beanFullName}#${route.action}`;
          const queryDescription = queryBindings.length
            ? `${description}\n\nFor alternatives within one query, prefer a single call using where.or rather than separate calls and client-side merging. Use where.and for combined constraints; named filters are additional AND constraints. ${queryCapabilities.length ? `Before constructing where, call ${toolContractName} with {"tool":"${name}","section":"query"} for current argument paths, admitted fields, operators, exact operands and limits. The compact object declaration is not the full validation contract.` : 'Follow the full inputSchema for argument locations, admitted fields, operators and value types.'}`
            : description;
          const tool: Tool = {
            name,
            description:
              inputPaths.length || outputPaths.length
                ? `${queryDescription}\n\nSome input or output subtrees have compact discovery declarations. Call ${toolContractName} with {"tool":"${name}"} for an overview, or section "input" / "output" for the complete public contract. Compaction does not change validation or returned business data.`
                : queryDescription,
            inputSchema,
            outputSchema,
            annotations: {
              readOnlyHint: readOnly,
              ...(readOnly ? { destructiveHint: false } : {}),
            },
          };
          tools.set(name, {
            identity: { controller: controller.beanOptions.beanFullName, action: route.action },
            controller: route.controller,
            controllerSummary: controller.beanOptions.options?.summary
              ? app.meta.text(controller.beanOptions.options.summary)
              : '',
            summary: operation.summary ?? '',
            tool,
            readOnly,
            queryCapabilities,
            inputContract: runtimeInputSchema,
            outputContract,
            compactPaths,
            async call(args, diagnostic) {
              const values = flat ? { [keys[0]]: args } : args;
              const bound: Record<string, unknown> = {};
              try {
                for (const binding of queryBindings) {
                  const group = values[binding.type];
                  const value =
                    binding.field && group && typeof group === 'object'
                      ? (group as Record<string, unknown>)[binding.field]
                      : group;
                  // Iterative native limits must run before date traversal, AJV or
                  // recursive Zod unions, including calls over the in-memory transport.
                  checkQueryBudget(value, binding.query.limits);
                  if (value && typeof value === 'object' && !Array.isArray(value)) {
                    const controls = ['where', 'orders', 'pageNo', 'pageSize', 'groups', 'aggrs'];
                    validateQuery(
                      binding.query,
                      Object.fromEntries(
                        Object.entries(value).filter(([key]) => controls.includes(key)),
                      ),
                      binding.analysisMode ?? 'select',
                      binding.analysis,
                    );
                  }
                }
                const checked = await inputCheck.validate(
                  serializeDateTransport(args, runtimeInputSchema, runtimeInputSchema.$defs ?? {}),
                );
                if (checked.issues) throw new ProtocolError(-32602, 'Invalid tool arguments');
                for (const key of keys) {
                  const schema = contract.request[key as keyof typeof contract.request];
                  const transported = normalizeDateTransport(values[key], locations[key], schemas);
                  const parsed = await runWithZodQueryCoercion(false, () =>
                    schema!.safeParseAsync(transported),
                  );
                  if (!parsed.success) throw new ProtocolError(-32602, 'Invalid tool arguments');
                  bound[key] = parsed.data;
                }
              } catch (error) {
                if (error instanceof PublicQueryError) {
                  throw new ProtocolError(-32602, 'Invalid tool arguments', {
                    queryCode: error.queryCode,
                    path: error.path,
                    hint: queryRepairHint,
                  });
                }
                if (error instanceof ProtocolError) throw error;
                throw new ProtocolError(-32602, 'Invalid tool arguments');
              }
              recordToolCall(app, diagnostic, 'dispatch', () =>
                queryBindings
                  .filter(binding => binding.type === 'query')
                  .map(binding => {
                    const group = bound[binding.type];
                    const value =
                      binding.field && group && typeof group === 'object'
                        ? (group as Record<string, unknown>)[binding.field]
                        : group;
                    const location = resolveSchema(locations[binding.type], schemas);
                    const querySchema = binding.field
                      ? resolveSchema(location.properties?.[binding.field] ?? {}, schemas)
                      : location;
                    return {
                      policy: binding.query,
                      namedFilters: Object.keys(querySchema.properties ?? {}),
                      value,
                    };
                  }),
              );
              try {
                const result = await app.bean.executor.performAction(
                  route.routeMethod as any,
                  route.routePathRaw,
                  { ...bound, innerAccess: false },
                );
                if (result === undefined || (direct && result === null)) {
                  diagnostic.outcome = 'resource_not_found';
                  return failure('Resource not found');
                }
                if (outputCheck && (await outputCheck.validate({ result })).issues) {
                  return failure('Action failed');
                }
                const parsed = await validator.parseAsync(result);
                const structuredContent = JSON.parse(
                  JSON.stringify(direct ? parsed : { result: parsed }),
                ) as Record<string, unknown>;
                diagnostic.outcome = 'success';
                return {
                  content: [{ type: 'text', text: JSON.stringify(structuredContent) }],
                  structuredContent,
                };
              } catch (error) {
                if (error instanceof RateLimitError || error instanceof RateLimitUnavailableError) {
                  return {
                    ...failure(
                      error instanceof RateLimitError ? 'Too Many Requests' : 'Service Unavailable',
                    ),
                    _meta: {
                      'cabloy/rateLimit':
                        error instanceof RateLimitError
                          ? {
                              kind: 'rate_limit',
                              status: 429,
                              limit: error.errors.limit,
                              retryAfterSeconds: error.errors.retryAfterSeconds,
                            }
                          : { kind: 'rate_limit_unavailable', status: 503 },
                    },
                  };
                }
                if (error instanceof PublicQueryError) {
                  throw new ProtocolError(-32602, 'Invalid tool arguments', {
                    queryCode: error.queryCode,
                    path: error.path,
                    hint: queryRepairHint,
                  });
                }
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
          if (!(await targetVisible(item))) continue;
          visible.push(item);
        }
      } catch {
        throw new ProtocolError(-32603, 'Tool discovery failed');
      }
      return visible;
    }
    async function targetVisible(item: IControllerTool): Promise<boolean> {
      try {
        return serverOptions.isToolVisible
          ? await serverOptions.isToolVisible({ ...item.identity }, item.controller)
          : await app.ctx.bean.permission.checkPermissionControllerActionGuards(
              item.controller,
              item.identity.action,
            );
      } catch {
        throw new ProtocolError(-32603, 'Tool discovery failed');
      }
    }
    const logoutInputCheck = fromJsonSchema(
      logoutTool.inputSchema as Parameters<typeof fromJsonSchema>[0],
    )['~standard'];
    const contractInputCheck = fromJsonSchema(
      toolContract.inputSchema as Parameters<typeof fromJsonSchema>[0],
    )['~standard'];
    const env = app.meta.env;
    const server = new Server(
      {
        name: env.APP_NAME?.trim() || 'cabloy-mcp-actions',
        version: env.APP_VERSION?.trim() || '0.1.0',
      },
      { capabilities: { tools: {} } },
    );
    server.setRequestHandler('tools/list', () =>
      track(async () => {
        const visible = await visibleTools();
        return {
          tools: [
            ...visible.map(item => item.tool),
            ...(visible.length ? [toolContract] : []),
            ...(serverOptions.logout ? [logoutTool] : []),
          ],
        };
      }),
    );
    server.setRequestHandler('tools/call', request =>
      track(async () => {
        if (!app.ctx) throw new ProtocolError(-32603, 'Request context required');
        const contractCall = request.params.name === toolContractName;
        const logoutCall = request.params.name === logoutName && serverOptions.logout;
        const tool = tools.get(request.params.name);
        const admitted = tool && allowed(tool);
        const diagnostic = beginToolCall(
          logoutCall
            ? logoutName
            : contractCall
              ? toolContractName
              : admitted
                ? tool.tool.name
                : 'unavailable',
        );
        recordToolCall(app, diagnostic, 'received');
        try {
          if (logoutCall) {
            if ((await logoutInputCheck.validate(request.params.arguments ?? {})).issues) {
              diagnostic.outcome = 'invalid_arguments';
              throw new ProtocolError(-32602, 'Invalid tool arguments');
            }
            recordToolCall(app, diagnostic, 'dispatch');
            try {
              await logoutCall();
            } catch {
              return failure('Logout could not be confirmed. Reconnect if access is required.');
            }
            const structuredContent = {
              loggedOut: true,
              message:
                'Current MCP authorization revoked. All connections sharing it lose access. Reconnect with a new authorization or personal access token.',
            };
            diagnostic.outcome = 'success';
            return {
              content: [{ type: 'text' as const, text: JSON.stringify(structuredContent) }],
              structuredContent,
            };
          }
          if (contractCall) {
            const args = request.params.arguments ?? {};
            if ((await contractInputCheck.validate(args)).issues) {
              diagnostic.outcome = 'invalid_arguments';
              throw new ProtocolError(-32602, 'Invalid tool arguments');
            }
            const target = tools.get(args.tool as string);
            const section = args.section ?? 'overview';
            if (
              !target ||
              !allowed(target) ||
              !(await targetVisible(target)) ||
              (section === 'query' && !target.queryCapabilities.length)
            ) {
              diagnostic.outcome = 'unavailable';
              throw new ProtocolError(-32602, 'Tool unavailable');
            }
            const structuredContent =
              section === 'query'
                ? { grammarVersion: 1, tool: target.tool.name, bindings: target.queryCapabilities }
                : section === 'input' || section === 'output'
                  ? {
                      contractVersion: 1,
                      tool: target.tool.name,
                      section,
                      schema: section === 'input' ? target.inputContract : target.outputContract,
                    }
                  : {
                      contractVersion: 1,
                      tool: target.tool.name,
                      readOnly: target.readOnly,
                      sections: [
                        'overview',
                        'input',
                        'output',
                        ...(target.queryCapabilities.length ? ['query'] : []),
                      ],
                      input: {
                        type: target.inputContract.type,
                        compactPaths: target.compactPaths.input,
                      },
                      output: {
                        type: target.outputContract.type,
                        compactPaths: target.compactPaths.output,
                      },
                    };
            diagnostic.outcome = 'success';
            return {
              content: [{ type: 'text' as const, text: JSON.stringify(structuredContent) }],
              structuredContent,
            };
          }
          if (!admitted) {
            diagnostic.outcome = 'unavailable';
            throw new ProtocolError(-32602, 'Tool unavailable');
          }
          return await tool.call(request.params.arguments ?? {}, diagnostic);
        } catch (error) {
          if (admitted && error instanceof ProtocolError && error.code === -32602) {
            diagnostic.outcome = 'invalid_arguments';
          }
          throw error;
        } finally {
          recordToolCall(app, diagnostic, 'settled');
        }
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
