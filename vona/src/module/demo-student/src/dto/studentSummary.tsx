import type { TableIdentity } from 'table-identity';
import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';

import { $locale } from '../.metadata/locales.ts';

export interface IDtoOptionsStudentSummary extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsStudentSummary>()
export class DtoStudentSummary {
  @Api.field(v.tableIdentity(), v.title($locale('Student')))
  id: TableIdentity;

  @Api.field(v.title($locale('Name')))
  name: string;

  @Api.field(
    v.title($locale('Mobile')),
    v.serializerReplace({
      patternFrom: /^(.{3}).{4}(.*)$/,
      patternTo: '$1****$2',
    }),
  )
  mobile: string;

  @Api.field(v.title($locale('Description')), v.optional())
  description?: string;

  @Api.field(v.openapi({ title: $locale('Level'), enum: [1, 2, 3] }))
  level: number;
}
