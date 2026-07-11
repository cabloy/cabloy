import type { TableIdentity } from 'table-identity';
import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';

export interface IDtoOptionsImageDirectUploadResponse extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsImageDirectUploadResponse>()
export class DtoImageDirectUploadResponse {
  @Api.field(v.tableIdentity())
  id: TableIdentity;

  @Api.field()
  uploadUrl: string;

  @Api.field(v.optional())
  filename?: string;

  @Api.field(v.optional())
  public?: boolean;
}
