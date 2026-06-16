import type { IDecoratorEntityOptions } from 'vona-module-a-orm';

import { $makeMetadata, Api, v } from 'vona-module-a-openapiutils';
import { Entity, EntityBase } from 'vona-module-a-orm';
import z from 'zod';
import { ZovaRender } from 'zova-rest-cabloy-basic-admin';

import { $locale } from '../.metadata/locales.ts';

const StudentLevelItems = [
  { value: 1, title: $locale('LevelBeginner') },
  { value: 2, title: $locale('LevelIntermediate') },
  { value: 3, title: $locale('LevelAdvanced') },
];

export interface IEntityOptionsStudent extends IDecoratorEntityOptions {}

@Entity<IEntityOptionsStudent>('demoStudent', {
  openapi: { title: $locale('Student') },
  fields: {
    id: $makeMetadata(ZovaRender.order(1, 'core')),
    iid: $makeMetadata(ZovaRender.visible(false)),
    deleted: $makeMetadata(ZovaRender.visible(false)),
    createdAt: $makeMetadata(
      ZovaRender.order(-2, 'max'),
      ZovaRender.field('basic-date:formFieldDate'),
      ZovaRender.cell('basic-date:date'),
    ),
    updatedAt: $makeMetadata(
      ZovaRender.order(-1, 'max'),
      ZovaRender.field('basic-date:formFieldDate'),
      ZovaRender.cell('basic-date:date'),
    ),
  },
})
export class EntityStudent extends EntityBase {
  @Api.field(
    v.title($locale('Name')),
    v.required(),
    v.min(2),
    ZovaRender.order(1),
    ZovaRender.cell('basic-table:actionView'),
  )
  name: string;

  @Api.field(v.title($locale('Description')), v.optional(), ZovaRender.order(2))
  description?: string;

  @Api.field(
    v.openapi({ title: $locale('Level'), enum: [1, 2, 3] }),
    v.required(),
    ZovaRender.order(3),
    ZovaRender.field('demo-student:formFieldLevel', {
      items: StudentLevelItems,
      helper: $locale('LevelHelper'),
      placeholder: $locale('LevelPlaceholder'),
    }),
    ZovaRender.cell('demo-student:level', { items: StudentLevelItems }),
    z.number().int().min(1).max(3),
  )
  level: number;
}
