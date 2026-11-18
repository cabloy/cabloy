import type { IDecoratorEntityOptions } from 'vona-module-a-orm';

import { Api } from 'vona-module-a-openapiutils';
import { Entity, EntityBase } from 'vona-module-a-orm';
import z from 'zod';

import type { IAiModelDefinition } from '../types/config.ts';

import { aiModelSchema } from '../lib/configuration.ts';

export interface IEntityOptionsAiModel extends IDecoratorEntityOptions {}

@Entity<IEntityOptionsAiModel>('cabloyAiModel')
export class EntityAiModel extends EntityBase {
  @Api.field(z.string().min(1).max(100))
  name: string;

  @Api.field(aiModelSchema)
  overrides: IAiModelDefinition;
}
