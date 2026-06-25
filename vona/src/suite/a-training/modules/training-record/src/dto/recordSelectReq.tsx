import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { $makeSchema, v } from 'vona-module-a-openapiutils';
import { $Dto } from 'vona-module-a-orm';
import { Dto } from 'vona-module-a-web';
import z from 'zod';
import { ZovaRender } from 'zova-rest-cabloy-basic-admin';

import { $locale } from '../.metadata/locales.ts';
import { EntityRecord } from '../entity/record.tsx';

export interface IDtoOptionsRecordSelectReq extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsRecordSelectReq>({
  openapi: { filter: { table: 'trainingRecord' } },
  fields: {
    studentId: $makeSchema(
      v.title($locale('Student')),
      ZovaRender.field('basic-input:formFieldInput'),
      v.optional(),
      z.any(),
    ),
    createdAt: $makeSchema(
      ZovaRender.field('basic-date:formFieldDateRange'),
      v.filterTransform('a-web:dateRange'),
      v.optional(),
      z.string(),
    ),
  },
})
export class DtoRecordSelectReq extends $Dto.queryPage(EntityRecord, [
  'name',
  'studentId',
  'createdAt',
]) {}
