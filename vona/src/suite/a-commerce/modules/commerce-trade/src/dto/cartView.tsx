import type { TableIdentity } from 'table-identity';
import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';

import { DtoCartItem } from './cartItem.tsx';

export interface IDtoOptionsCartView extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsCartView>()
export class DtoCartView {
  @Api.field(v.optional(), v.tableIdentity())
  id?: TableIdentity;

  @Api.field(v.required(), v.array(DtoCartItem))
  items: DtoCartItem[];
}
