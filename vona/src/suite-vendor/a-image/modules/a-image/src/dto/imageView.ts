import type { TableIdentity } from 'table-identity';
import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';
import z from 'zod';

export interface IDtoOptionsImageView extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsImageView>()
export class DtoImageView {
  @Api.field(v.tableIdentity())
  id: TableIdentity;

  @Api.field(z.string())
  url: string;

  @Api.field(v.optional())
  filename?: string;

  @Api.field(v.optional())
  width?: number;

  @Api.field(v.optional())
  height?: number;

  @Api.field(v.optional())
  public?: boolean;

  @Api.field(v.default(true))
  signed: boolean;
}
