import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api } from 'vona-module-a-openapiutils';
import { $Dto } from 'vona-module-a-orm';
import { Dto } from 'vona-module-a-web';

import { ModelAuthorization } from '../model/authorization.ts';

export interface IDtoOptionsAuthorizationGrant extends IDecoratorDtoOptions {}

export const authorizationGrantColumns = [
  'id',
  'resource',
  'scope',
  'state',
  'createdAt',
  'tokenExpiresAt',
  'refreshEnabled',
  'refreshExpiresAt',
  'expiresAt',
] as const;

@Dto<IDtoOptionsAuthorizationGrant>()
export class DtoAuthorizationGrant extends $Dto.get(() => ModelAuthorization, {
  columns: [...authorizationGrantColumns],
}) {
  @Api.field()
  clientId: string;

  @Api.field()
  clientName: string;
}
