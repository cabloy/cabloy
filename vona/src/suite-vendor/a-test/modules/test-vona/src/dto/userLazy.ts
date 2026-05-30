import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';

import { DtoRoleLazy } from './roleLazy.ts';

export interface IDtoOptionsUserLazy extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsUserLazy>()
export class DtoUserLazy {
  @Api.field()
  name: string;

  @Api.field(v.optional(), v.lazy(() => DtoUserLazy))
  user?: DtoUserLazy;

  @Api.field(v.optional(), v.array(v.lazy(() => DtoRoleLazy)))
  roles?: DtoRoleLazy[];
}
