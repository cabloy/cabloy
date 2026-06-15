import type { IDecoratorEntityOptions } from 'vona-module-a-orm';

import { $makeMetadata, Api, v } from 'vona-module-a-openapiutils';
import { Entity, EntityBase } from 'vona-module-a-orm';
import z from 'zod';
import { ZovaRender } from 'zova-rest-cabloy-basic-admin';

import { $locale } from '../.metadata/locales.ts';

const levelSchema = z.union([z.literal(1), z.literal(2), z.literal(3)]);

const levelItems = [
  { title: $locale('LevelBeginner'), value: 1 },
  { title: $locale('LevelIntermediate'), value: 2 },
  { title: $locale('LevelAdvanced'), value: 3 },
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
    v.title($locale('Level')),
    v.required(),
    ZovaRender.order(3),
    ZovaRender.field('basic-select:formFieldSelect', {
      items: levelItems,
      placeholder: $locale('LevelPlaceholder'),
    }),
    ZovaRender.cell('basic-select:select', { items: levelItems }),
    levelSchema,
  )
  level: number;
}
