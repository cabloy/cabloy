import type { IDecoratorEntityOptions } from 'vona-module-a-orm';

import { Api } from 'vona-module-a-openapiutils';
import { Entity, EntityBase } from 'vona-module-a-orm';
import z from 'zod';

import type { IAiProviderDefinition } from '../types/config.ts';

import { aiProviderSchema } from '../lib/configuration.ts';

export interface IEntityOptionsAiProvider extends IDecoratorEntityOptions {}

@Entity<IEntityOptionsAiProvider>('cabloyAiProvider')
export class EntityAiProvider extends EntityBase {
  @Api.field(z.string().min(1).max(100))
  name: string;

  @Api.field(aiProviderSchema)
  overrides: IAiProviderDefinition;
}
