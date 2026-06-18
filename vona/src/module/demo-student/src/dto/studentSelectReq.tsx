import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { $makeSchema, v } from 'vona-module-a-openapiutils';
import { $Dto } from 'vona-module-a-orm';
import { Dto } from 'vona-module-a-web';
import z from 'zod';
import { ZovaRender } from 'zova-rest-cabloy-basic-admin';

import { $locale } from '../.metadata/locales.ts';
import { EntityStudent, studentLevelItems, studentLevelSchema } from '../entity/student.tsx';

export interface IDtoOptionsStudentSelectReq extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsStudentSelectReq>({
  openapi: { filter: { table: 'demoStudent' } },
  fields: {
    name: $makeSchema(v.optional(), z.string()),
    level: $makeSchema(
      v.title($locale('Level')),
      v.optional(),
      z.preprocess(value => {
        if (typeof value === 'string') return Number.parseInt(value);
        return value;
      }, studentLevelSchema),
      ZovaRender.field('basic-select:formFieldSelect', {
        items: studentLevelItems,
        placeholder: $locale('Level'),
      }),
    ),
    createdAt: $makeSchema(
      ZovaRender.field('basic-date:formFieldDateRange'),
      v.filterTransform('a-web:dateRange'),
      v.optional(),
      z.string(),
    ),
  },
})
export class DtoStudentSelectReq extends $Dto.queryPage(EntityStudent, ['name', 'level', 'createdAt']) {}
