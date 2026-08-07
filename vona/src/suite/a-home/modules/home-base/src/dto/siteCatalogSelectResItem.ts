import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';

export interface IDtoOptionsSiteCatalogSelectResItem extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsSiteCatalogSelectResItem>()
export class DtoSiteCatalogSelectResItem {
  @Api.field(v.required())
  siteId: string;

  @Api.field(v.required())
  title: string;
}
