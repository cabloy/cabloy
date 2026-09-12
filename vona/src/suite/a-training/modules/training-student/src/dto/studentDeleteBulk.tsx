import type { TableIdentity } from 'table-identity';
import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';
import { z } from 'zod';

export interface IDtoOptionsStudentDeleteBulk extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsStudentDeleteBulk>()
export class DtoStudentDeleteBulk {
  @Api.field(v.required(), z.array(v.tableIdentity()()).min(1).max(100))
  ids: TableIdentity[];
}
