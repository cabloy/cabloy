import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';
import { z } from 'zod';

export interface IDtoOptionsAuthorizationDecision extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsAuthorizationDecision>()
export class DtoAuthorizationDecision {
  @Api.field(z.string().regex(/^[\w-]{43}$/))
  request: string;

  @Api.field(z.boolean())
  allow: boolean;

  @Api.field(
    z
      .string()
      .regex(/^(?:mcp:(?:all|read)|mcp:custom:[\w-]{43})$/)
      .optional(),
  )
  scope?: string;
}
