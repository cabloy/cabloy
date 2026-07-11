import type { TableIdentity } from 'table-identity';
import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';

export interface IDtoOptionsFileDirectUploadFinalizeRequest extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsFileDirectUploadFinalizeRequest>()
export class DtoFileDirectUploadFinalizeRequest {
  @Api.field(v.tableIdentity())
  fileId: TableIdentity;
}
