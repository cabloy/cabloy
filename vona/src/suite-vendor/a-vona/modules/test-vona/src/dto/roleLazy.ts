import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';

import { DtoUserLazy } from './userLazy.ts';

export interface IDtoOptionsRoleLazy extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsRoleLazy>()
export class DtoRoleLazy {
  @Api.field()
  name: string;

  @Api.field(v.optional(), v.array(v.lazy(() => DtoUserLazy)))
  users?: DtoUserLazy[];
}
