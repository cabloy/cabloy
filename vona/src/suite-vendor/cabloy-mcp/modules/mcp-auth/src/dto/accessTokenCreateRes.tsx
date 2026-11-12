import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api } from 'vona-module-a-openapiutils';
import { $Dto } from 'vona-module-a-orm';
import { Dto } from 'vona-module-a-web';

import { ModelAuthorization } from '../model/authorization.ts';

export interface IDtoOptionsAccessTokenCreateRes extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsAccessTokenCreateRes>()
export class DtoAccessTokenCreateRes extends $Dto.get(() => ModelAuthorization, {
  columns: ['id', 'resource', 'scope', 'tokenExpiresAt'],
}) {
  @Api.field()
  accessToken: string;
}
