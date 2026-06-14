import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { $makeSchema, v } from 'vona-module-a-openapiutils';
import { $Dto } from 'vona-module-a-orm';
import { Dto } from 'vona-module-a-web';
import z from 'zod';
import { ZovaRender } from 'zova-rest-cabloy-basic-admin';

import { EntityStudent } from '../entity/student.tsx';

export interface IDtoOptionsStudentSelectReq extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsStudentSelectReq>({
  openapi: { filter: { table: 'demoStudent' } },
  fields: {
    name: $makeSchema(v.optional(), z.string()),
    createdAt: $makeSchema(
      ZovaRender.field('basic-date:formFieldDateRange'),
      v.filterTransform('a-web:dateRange'),
      v.optional(),
      z.string(),
    ),
  },
})
export class DtoStudentSelectReq extends $Dto.queryPage(EntityStudent, ['name', 'createdAt']) {}
