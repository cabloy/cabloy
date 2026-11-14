import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';
import { z } from 'zod';

import { DtoMcpScopeOption } from './mcpTool.ts';

export interface IDtoOptionsAuthorizationSummary extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsAuthorizationSummary>()
export class DtoAuthorizationSummary {
  @Api.field(z.string())
  clientName: string;

  @Api.field(z.string())
  resource: string;

  @Api.field(z.string())
  ssrSiteId: string;

  @Api.field(z.string())
  scopesUrl: string;

  @Api.field(z.string())
  scope: string;

  @Api.field(v.array(v.object(DtoMcpScopeOption)))
  options: DtoMcpScopeOption[];

  @Api.field(z.number())
  expiresAt: number;
}
