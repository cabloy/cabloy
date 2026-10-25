import type { MetadataKey } from 'vona';

import { appMetadata } from 'vona';

import type { IMcpToolOptions } from '../../types/api.ts';

import { SymbolMcpOptions } from '../const/decorator.ts';

function tool(options?: Omit<IMcpToolOptions, 'name'>): ClassDecorator & MethodDecorator;
function tool(options: IMcpToolOptions): MethodDecorator;
function tool(options: IMcpToolOptions = {}): ClassDecorator & MethodDecorator {
  return function (target: object, prop?: MetadataKey, descriptor?: PropertyDescriptor) {
    if (prop === undefined && options.name !== undefined) {
      throw new Error('mcp.tool name is only valid on a controller action');
    }
    // An options object, including an empty one, is the explicit opt-in marker.
    const metadata = appMetadata.getOwnMetadataMap(
      true,
      SymbolMcpOptions,
      target,
      prop,
    ) as IMcpToolOptions;
    Object.assign(metadata, options);
    return descriptor;
  } as ClassDecorator & MethodDecorator;
}

export const mcp = { tool };
