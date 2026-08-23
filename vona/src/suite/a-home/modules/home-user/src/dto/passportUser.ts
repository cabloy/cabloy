import type { TableIdentity } from 'table-identity';
import type { ILocaleRecord } from 'vona';
import type { TypeAccountStatus } from 'vona-module-a-user';
import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';
import { z } from 'zod';

export interface IDtoOptionsPassportUser extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsPassportUser>()
export class DtoPassportUser {
  @Api.field(v.tableIdentity())
  id: TableIdentity;

  @Api.field()
  name: string;

  @Api.field(v.optional())
  avatar?: string;

  @Api.field(v.optional())
  email?: string;

  @Api.field(v.optional())
  mobile?: string;

  @Api.field(v.optional())
  activated?: boolean;

  @Api.field(v.default('active'), z.enum(['active', 'disabled']))
  accountStatus: TypeAccountStatus;

  @Api.field(v.optional())
  locale?: keyof ILocaleRecord;

  @Api.field(v.optional())
  tz?: string;

  @Api.field(v.optional())
  anonymous?: boolean;
}
