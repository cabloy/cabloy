import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';
import z from 'zod';

export interface IDtoOptionsPlay extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsPlay>()
export class DtoPlay {
  @Api.field(v.array(z.string()))
  args: string[];

  @Api.field()
  projectPath: string;
}
