import type { IDecoratorEntityOptions } from 'vona-module-a-orm';

import { Api, v } from 'vona-module-a-openapiutils';
import { Entity, EntityBaseSimple } from 'vona-module-a-orm';

import type { IImageProviderClientOptions, IImageProviderRecord } from '../types/imageProvider.ts';

export interface IEntityOptionsImageProvider extends IDecoratorEntityOptions {}

@Entity<IEntityOptionsImageProvider>('aImageProvider')
export class EntityImageProvider extends EntityBaseSimple {
  @Api.field(v.default(false))
  disabled: boolean;

  @Api.field()
  providerName: keyof IImageProviderRecord;

  @Api.field()
  clientName: string;

  @Api.field(v.optional())
  clientOptions?: IImageProviderClientOptions;
}
