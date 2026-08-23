import type { ILocaleRecord } from 'vona';
import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';

export interface IDtoOptionsAccountCurrent extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsAccountCurrent>()
export class DtoAccountCurrent {
  @Api.field()
  name: string;

  @Api.field(v.optional())
  avatar?: string;

  @Api.field(v.optional())
  locale?: keyof ILocaleRecord;

  @Api.field(v.optional())
  tz?: string;

  @Api.field()
  hasSimpleAuth: boolean;

  @Api.field()
  canSendSetPasswordLink: boolean;

  @Api.field(v.optional())
  eligibleEmailMasked?: string;
}
