import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { DtoAuth } from 'vona-module-a-auth';
import { Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';
import { EntityRole } from 'vona-module-home-user';

import { DtoPassportUser } from './passportUser.ts';

export interface IDtoOptionsPassport extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsPassport>()
export class DtoPassport {
  @Api.field()
  user: DtoPassportUser;

  @Api.field()
  auth: DtoAuth;

  @Api.field(v.array(EntityRole))
  roles: EntityRole[];
}
