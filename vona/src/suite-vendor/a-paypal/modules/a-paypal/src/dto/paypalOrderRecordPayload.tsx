import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';

export interface IDtoOptionsPaypalOrderRecordPayload extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsPaypalOrderRecordPayload>()
export class DtoPaypalOrderRecordPayload {
  @Api.field()
  remark: string;

  @Api.field()
  total: string;

  @Api.field()
  currencyCode: string;
}
