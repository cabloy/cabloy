import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { $makeSchema, Api, v } from 'vona-module-a-openapiutils';
import { $Dto } from 'vona-module-a-orm';
import { Dto } from 'vona-module-a-web';
import z from 'zod';
import { ZovaRender } from 'zova-rest-cabloy-basic-admin';

import { EntityPost } from '../entity/post.ts';

export interface IDtoOptionsPostSelectReq extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsPostSelectReq>({
  openapi: { filter: { table: 'testVonaPost' } },
  fields: {
    title: $makeSchema(v.optional(), z.string()),
    createdAt: $makeSchema(
      ZovaRender.field('basic-date:formFieldDateRange'),
      v.filterTransform('a-web:dateRange'),
      v.optional(),
      z.string(),
    ),
  },
})
export class DtoPostSelectReq extends $Dto.queryPage(EntityPost, ['title', 'createdAt']) {
  @Api.field(
    v.filter({
      table: 'testVonaUser',
      joinOn: ['userId', 'testVonaUser.id'],
      originalName: 'name',
      op: '_eqI_',
    }),
    v.optional(),
  )
  userName?: string;
}
