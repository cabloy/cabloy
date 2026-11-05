import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';
import { z } from 'zod';

export interface IDtoOptionsMcpTool extends IDecoratorDtoOptions {}

@Dto()
export class DtoMcpToolIdentity {
  @Api.field(z.string().min(1).max(255))
  name: string;

  @Api.field(z.string().min(1).max(255))
  controller: string;

  @Api.field(z.string().min(1).max(255))
  action: string;
}

@Dto()
export class DtoMcpTool extends DtoMcpToolIdentity {
  @Api.field()
  description: string;

  @Api.field()
  readOnly: boolean;
}

@Dto()
export class DtoMcpScopeTool extends DtoMcpTool {
  @Api.field()
  available: boolean;
}

@Dto()
export class DtoMcpScopeOption {
  @Api.field()
  scope: string;

  @Api.field()
  name: string;

  @Api.field()
  description: string;

  @Api.field(v.array(v.object(DtoMcpScopeTool)))
  tools: DtoMcpScopeTool[];

  @Api.field()
  allowed: boolean;

  @Api.field(
    z.enum(['outside_requested_scope', 'outside_client_scope', 'tools_unavailable']).optional(),
  )
  reason?: 'outside_requested_scope' | 'outside_client_scope' | 'tools_unavailable';
}
