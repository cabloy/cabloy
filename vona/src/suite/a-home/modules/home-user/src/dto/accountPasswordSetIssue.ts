import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';

export interface IDtoOptionsAccountPasswordSetIssue extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsAccountPasswordSetIssue>()
export class DtoAccountPasswordSetIssue {
  @Api.field(v.email(), v.trim())
  email: string;

  @Api.field(v.min(1), v.max(2048), v.trim())
  consumerUrl: string;
}
