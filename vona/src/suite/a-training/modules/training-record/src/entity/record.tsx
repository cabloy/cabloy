import type { IDecoratorEntityOptions } from 'vona-module-a-orm';

import { Entity, EntityBase } from 'vona-module-a-orm';

export interface IEntityOptionsRecord extends IDecoratorEntityOptions {}

@Entity<IEntityOptionsRecord>('trainingRecord')
export class EntityRecord extends EntityBase {}
