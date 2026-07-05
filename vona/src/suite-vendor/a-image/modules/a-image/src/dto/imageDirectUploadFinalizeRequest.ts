import type { TableIdentity } from 'table-identity';
import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';

export interface IDtoOptionsImageDirectUploadFinalizeRequest extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsImageDirectUploadFinalizeRequest>()
export class DtoImageDirectUploadFinalizeRequest {
  @Api.field(v.tableIdentity())
  imageId: TableIdentity;
}
