import type { CallToolResult, Tool } from '@modelcontextprotocol/server';

export const resourcePageLinksToolName = 'cabloy_resource_page_links';

export const resourcePageLinksTool: Tool = {
  name: resourcePageLinksToolName,
  description:
    'Return trusted browser links for standard Resource pages belonging to an exact server-published business tool. The current MCP Site and server-side permissions determine which links are returned. Links are navigation only; they do not grant browser access or prove that a record exists.',
  inputSchema: {
    type: 'object',
    properties: {
      sourceTool: {
        type: 'string',
        minLength: 1,
        maxLength: 128,
        pattern: '^[\\w-]+$',
      },
      links: {
        type: 'array',
        minItems: 1,
        maxItems: 8,
        items: {
          oneOf: [
            {
              type: 'object',
              properties: { page: { type: 'string', enum: ['list'] } },
              required: ['page'],
              additionalProperties: false,
            },
            {
              type: 'object',
              properties: { page: { type: 'string', enum: ['create'] } },
              required: ['page'],
              additionalProperties: false,
            },
            {
              type: 'object',
              properties: {
                page: { type: 'string', enum: ['view'] },
                id: {
                  type: 'string',
                  minLength: 1,
                  maxLength: 256,
                  pattern: '^[^\\x00-\\x1F\\x7F]*$',
                },
              },
              required: ['page', 'id'],
              additionalProperties: false,
            },
            {
              type: 'object',
              properties: {
                page: { type: 'string', enum: ['edit'] },
                id: {
                  type: 'string',
                  minLength: 1,
                  maxLength: 256,
                  pattern: '^[^\\x00-\\x1F\\x7F]*$',
                },
              },
              required: ['page', 'id'],
              additionalProperties: false,
            },
          ],
        },
      },
    },
    required: ['sourceTool', 'links'],
    additionalProperties: false,
  },
  outputSchema: {
    type: 'object',
    properties: {
      sourceTool: { type: 'string' },
      resource: { type: 'string' },
      links: {
        type: 'array',
        minItems: 0,
        maxItems: 8,
        items: {
          oneOf: [
            {
              type: 'object',
              properties: {
                page: { type: 'string', enum: ['list'] },
                uri: { type: 'string', format: 'uri' },
                name: { type: 'string' },
                description: { type: 'string' },
              },
              required: ['page', 'uri', 'name', 'description'],
              additionalProperties: false,
            },
            {
              type: 'object',
              properties: {
                page: { type: 'string', enum: ['create'] },
                uri: { type: 'string', format: 'uri' },
                name: { type: 'string' },
                description: { type: 'string' },
              },
              required: ['page', 'uri', 'name', 'description'],
              additionalProperties: false,
            },
            {
              type: 'object',
              properties: {
                page: { type: 'string', enum: ['view'] },
                id: {
                  type: 'string',
                  minLength: 1,
                  maxLength: 256,
                  pattern: '^[^\\x00-\\x1F\\x7F]*$',
                },
                uri: { type: 'string', format: 'uri' },
                name: { type: 'string' },
                description: { type: 'string' },
              },
              required: ['page', 'id', 'uri', 'name', 'description'],
              additionalProperties: false,
            },
            {
              type: 'object',
              properties: {
                page: { type: 'string', enum: ['edit'] },
                id: {
                  type: 'string',
                  minLength: 1,
                  maxLength: 256,
                  pattern: '^[^\\x00-\\x1F\\x7F]*$',
                },
                uri: { type: 'string', format: 'uri' },
                name: { type: 'string' },
                description: { type: 'string' },
              },
              required: ['page', 'id', 'uri', 'name', 'description'],
              additionalProperties: false,
            },
          ],
        },
      },
    },
    required: ['sourceTool', 'resource', 'links'],
    additionalProperties: false,
  },
  annotations: { readOnlyHint: true, destructiveHint: false, openWorldHint: false },
};

export type TypeResourcePage = 'list' | 'create' | 'view' | 'edit';

export interface IResourcePageLinkRequest {
  page: TypeResourcePage;
  id?: string;
}

export interface IResourcePageLink {
  page: TypeResourcePage;
  id?: string;
  uri: string;
  name: string;
  description: string;
}

const recordPages = new Set<TypeResourcePage>(['view', 'edit']);

function hasControlCharacters(value: string): boolean {
  for (let index = 0; index < value.length; index++) {
    const code = value.charCodeAt(index);
    if (code < 0x20 || code === 0x7f) return true;
  }
  return false;
}

function normalizePublicPath(publicPath: string): string {
  const normalized = publicPath.trim().replace(/^\/+|\/+$/g, '');
  if (normalized.includes('..')) throw new Error('Invalid SSR Site public path');
  return normalized;
}

function assertPageRequest(request: IResourcePageLinkRequest) {
  if (!['list', 'create', 'view', 'edit'].includes(request.page)) {
    throw new Error('Invalid Resource page');
  }
  if (recordPages.has(request.page)) {
    if (request.id === undefined) throw new Error('Resource record ID required');
  } else if (request.id !== undefined) {
    throw new Error('Resource record ID not allowed');
  }
  if (request.id !== undefined) {
    if (!request.id.length || request.id.length > 256 || hasControlCharacters(request.id)) {
      throw new Error('Invalid Resource record ID');
    }
  }
}

/** Resolve one canonical Resource page URL from trusted server-owned URL parts. */
export function resolveResourcePageLink(options: {
  protocol: string;
  host: string;
  publicPath: string;
  businessResource: string;
  request: IResourcePageLinkRequest;
}): IResourcePageLink {
  assertPageRequest(options.request);
  if (!options.businessResource || hasControlCharacters(options.businessResource)) {
    throw new Error('Invalid business Resource');
  }
  const publicPath = normalizePublicPath(options.publicPath);
  const resource = encodeURIComponent(options.businessResource);
  const pagePath =
    options.request.page === 'list'
      ? ''
      : options.request.page === 'create'
        ? '/create'
        : `/${encodeURIComponent(options.request.id!)}${options.request.page === 'edit' ? '/edit' : ''}`;
  const origin = new URL(`${options.protocol}://${options.host}`);
  origin.pathname = `${publicPath ? `/${publicPath}` : ''}/rest/resource/${resource}${pagePath}`;
  origin.search = '';
  origin.hash = '';
  const pageLabel = options.request.page === 'list' ? 'list' : options.request.page;
  return {
    page: options.request.page,
    ...(options.request.id === undefined ? {} : { id: options.request.id }),
    uri: origin.href,
    name: `Open ${options.businessResource} ${pageLabel} page`,
    description: `Open the ${pageLabel} page for ${options.businessResource}. Browser authentication and Resource permissions still apply.`,
  };
}

/** Resolve a bounded batch without accepting any caller-controlled URL component. */
export function resolveResourcePageLinks(options: {
  protocol: string;
  host: string;
  publicPath: string;
  businessResource: string;
  requests: IResourcePageLinkRequest[];
}): IResourcePageLink[] {
  if (!options.requests.length || options.requests.length > 8) {
    throw new Error('Invalid Resource page link count');
  }
  return options.requests.map(request => resolveResourcePageLink({ ...options, request }));
}

export function resourcePageLinksResult(options: {
  sourceTool: string;
  resource: string;
  links: IResourcePageLink[];
}): CallToolResult {
  const structuredContent = {
    sourceTool: options.sourceTool,
    resource: options.resource,
    links: options.links,
  };
  const text = options.links.map(link => `${link.name}: ${link.uri}`).join('\n');
  return {
    content: [
      { type: 'text', text: text || 'No Resource page links available.' },
      ...options.links.map(link => ({
        type: 'resource_link' as const,
        uri: link.uri,
        name: link.name,
        description: link.description,
        mimeType: 'text/html',
      })),
    ],
    structuredContent,
  };
}
