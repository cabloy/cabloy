import type { IDecoratorModelOptions } from 'vona-module-a-orm';

import { BeanModelBase, Model } from 'vona-module-a-orm';

import { EntityMail } from '../entity/mail.ts';

export interface IModelOptionsMail extends IDecoratorModelOptions<EntityMail> {}

@Model<IModelOptionsMail>({ entity: EntityMail })
export class ModelMail extends BeanModelBase<EntityMail> {}
