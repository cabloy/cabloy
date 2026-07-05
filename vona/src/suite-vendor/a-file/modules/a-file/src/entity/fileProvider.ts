import type { IDecoratorEntityOptions } from 'vona-module-a-orm';

import { Api, v } from 'vona-module-a-openapiutils';
import { Entity, EntityBaseSimple } from 'vona-module-a-orm';
import z from 'zod';

import type { IFileProviderClientOptions, IFileProviderRecord } from '../types/fileProvider.ts';

export interface IEntityOptionsFileProvider extends IDecoratorEntityOptions {}

@Entity<IEntityOptionsFileProvider>('aFileProvider')
export class EntityFileProvider extends EntityBaseSimple {
  @Api.field(v.default(false))
  disabled: boolean;

  @Api.field(z.string())
  providerName: keyof IFileProviderRecord;

  @Api.field()
  clientName: string;

  @Api.field(v.optional())
  clientOptions?: IFileProviderClientOptions;
}
