import type { TableIdentity } from 'table-identity';
import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';

import { $locale } from '../.metadata/locales.ts';

export interface IDtoOptionsStudentSummary extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsStudentSummary>()
export class DtoStudentSummary {
  @Api.field(v.tableIdentity())
  id: TableIdentity;

  @Api.field(v.title($locale('Name')))
  name: string;

  @Api.field(v.title($locale('Description')), v.optional())
  description?: string;

  @Api.field(v.title($locale('Level')))
  level: number;
}
