import type { MetadataKey } from 'vona';

import { appMetadata } from 'vona';

import type { IMcpToolOptions } from '../../types/api.ts';

import { SymbolMcpOptions } from '../const/decorator.ts';

function tool(options: IMcpToolOptions = {}): MethodDecorator {
  if (
    options.ssrSites !== undefined &&
    (!Array.isArray(options.ssrSites) ||
      !options.ssrSites.length ||
      options.ssrSites.some(site => typeof site !== 'string' || !/^[\w-]+:[\w-]+$/.test(site)) ||
      new Set(options.ssrSites).size !== options.ssrSites.length)
  ) {
    throw new Error('Invalid MCP tool ssrSites');
  }
  return function (target: object, prop?: MetadataKey, descriptor?: PropertyDescriptor) {
    if (prop === undefined) {
      throw new Error('Mcp.tool is only valid on a controller action');
    }
    // An options object, including an empty one, is the explicit opt-in marker.
    const metadata = appMetadata.getOwnMetadataMap(
      false,
      SymbolMcpOptions,
      target,
      prop,
    ) as IMcpToolOptions;
    Object.assign(metadata, options);
    return descriptor;
  } as MethodDecorator;
}

export const Mcp = { tool };
