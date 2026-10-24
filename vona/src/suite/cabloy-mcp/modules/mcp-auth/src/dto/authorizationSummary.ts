import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';
import { z } from 'zod';

export interface IDtoOptionsAuthorizationSummary extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsAuthorizationSummary>()
export class DtoAuthorizationSummary {
  @Api.field(z.string())
  clientName: string;

  @Api.field(z.string())
  resource: string;

  @Api.field(z.string())
  scope: string;

  @Api.field(z.number())
  expiresAt: number;
}
