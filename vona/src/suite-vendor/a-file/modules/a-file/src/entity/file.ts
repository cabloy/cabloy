import type { IDecoratorEntityOptions } from 'vona-module-a-orm';

import { Api, v } from 'vona-module-a-openapiutils';
import { Entity, EntityBase } from 'vona-module-a-orm';
import z from 'zod';

import type { IFileProviderRecord } from '../types/fileProvider.ts';
import type { IFileSceneRecord } from '../types/fileScene.ts';

export interface IEntityOptionsFile extends IDecoratorEntityOptions {}

@Entity<IEntityOptionsFile>('aFile')
export class EntityFile extends EntityBase {
  @Api.field(z.string())
  providerName: keyof IFileProviderRecord;

  @Api.field()
  clientName: string;

  @Api.field()
  resourceId: string;

  @Api.field(v.optional())
  bucket?: string;

  @Api.field(v.optional())
  objectKey?: string;

  @Api.field(v.optional())
  filename?: string;

  @Api.field(v.optional())
  contentType?: string;

  @Api.field(v.optional())
  size?: number;

  @Api.field(v.optional())
  etag?: string;

  @Api.field(v.optional())
  public?: boolean;

  @Api.field(v.optional())
  meta?: Record<string, any>;

  @Api.field(v.optional())
  storagePath?: string;

  @Api.field(v.optional())
  deliveryBaseUrl?: string;

  @Api.field(v.optional(), z.string())
  fileScene?: keyof IFileSceneRecord;
}
