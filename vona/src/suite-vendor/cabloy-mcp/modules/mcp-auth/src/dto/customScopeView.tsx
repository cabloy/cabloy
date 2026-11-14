import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { $Dto } from 'vona-module-a-orm';
import { Dto } from 'vona-module-a-web';

import { ModelCustomScope } from '../model/customScope.ts';

export interface IDtoOptionsCustomScopeView extends IDecoratorDtoOptions {}

@Dto()
export class DtoCustomScopeView extends $Dto.get(() => ModelCustomScope, {
  columns: ['id', 'resource', 'scope', 'name', 'description', 'tools', 'createdAt', 'updatedAt'],
}) {}

@Dto()
export class DtoCustomScopeMineRes {
  @Api.field(v.array(v.object(DtoCustomScopeView)))
  list: DtoCustomScopeView[];
}
