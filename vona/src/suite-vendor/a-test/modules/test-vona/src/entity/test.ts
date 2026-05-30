import type { IDecoratorEntityOptions } from 'vona-module-a-orm';

import { Api, v } from 'vona-module-a-openapiutils';
import { Entity, EntityBase } from 'vona-module-a-orm';

import { $locale } from '../.metadata/locales.ts';

export interface IEntityOptionsTest extends IDecoratorEntityOptions {}

@Entity<IEntityOptionsTest>('testVonaTest', { openapi: { title: $locale('Test') } })
export class EntityTest extends EntityBase {
  @Api.field(v.title($locale('Test')))
  title: string;

  @Api.field()
  description: string;

  @Api.field(
    v.default(() => {
      return new Date();
    }),
  )
  testDate: Date;
}
