import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';

export interface IDtoOptionsFileDownloadRequest extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsFileDownloadRequest>()
export class DtoFileDownloadRequest {
  @Api.field(v.tableIdentity())
  fileId: number | string;

  @Api.field(v.optional())
  token?: string;
}
