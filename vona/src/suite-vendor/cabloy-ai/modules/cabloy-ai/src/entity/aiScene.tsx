import type { IDecoratorEntityOptions } from 'vona-module-a-orm';

import { Api } from 'vona-module-a-openapiutils';
import { Entity, EntityBase } from 'vona-module-a-orm';
import z from 'zod';

import type { IDecoratorAiSceneOptions } from '../types/aiScene.ts';

import { aiSceneSchema } from '../lib/configuration.ts';

export interface IEntityOptionsAiScene extends IDecoratorEntityOptions {}

@Entity<IEntityOptionsAiScene>('cabloyAiScene')
export class EntityAiScene extends EntityBase {
  @Api.field(z.string().min(1).max(100))
  name: string;

  @Api.field(aiSceneSchema)
  overrides: IDecoratorAiSceneOptions;
}
