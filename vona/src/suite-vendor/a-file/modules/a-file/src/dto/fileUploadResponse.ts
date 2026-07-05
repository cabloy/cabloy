import type { TableIdentity } from 'table-identity';
import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';
import z from 'zod';

import type { IFileProviderRecord } from '../types/fileProvider.ts';
import type { IFileSceneRecord } from '../types/fileScene.ts';

export interface IDtoOptionsFileUploadResponse extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsFileUploadResponse>()
export class DtoFileUploadResponse {
  @Api.field(v.tableIdentity())
  id: TableIdentity;

  @Api.field(z.string())
  provider: keyof IFileProviderRecord;

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

  @Api.field(v.optional(), z.string())
  fileScene?: keyof IFileSceneRecord;

  @Api.field(v.optional())
  uploadedAt?: Date;

  @Api.field(v.optional())
  url?: string;

  @Api.field(v.optional())
  signed?: boolean;
}
