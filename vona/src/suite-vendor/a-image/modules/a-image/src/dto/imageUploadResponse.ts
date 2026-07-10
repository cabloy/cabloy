import type { TableIdentity } from 'table-identity';
import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';
import z from 'zod';

import type { IImageProviderRecord } from '../types/imageProvider.ts';

export interface IDtoOptionsImageUploadResponse extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsImageUploadResponse>()
export class DtoImageUploadResponse {
  @Api.field(v.tableIdentity())
  id: TableIdentity;

  @Api.field(z.string())
  provider: keyof IImageProviderRecord;

  @Api.field()
  resourceId: string;

  @Api.field(v.optional())
  filename?: string;

  @Api.field(v.optional())
  contentType?: string;

  @Api.field(v.optional())
  size?: number;

  @Api.field(v.optional())
  width?: number;

  @Api.field(v.optional())
  height?: number;

  @Api.field(v.optional())
  public?: boolean;

  @Api.field(v.optional())
  uploadedAt?: Date;

  @Api.field(v.optional())
  url?: string;

  @Api.field(v.optional())
  signed?: boolean;
}
