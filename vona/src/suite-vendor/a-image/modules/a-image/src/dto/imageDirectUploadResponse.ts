import type { TableIdentity } from 'table-identity';
import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';
import z from 'zod';

import type { TypeImageStatus } from '../types/image.ts';
import type { IImageProviderRecord } from '../types/imageProvider.ts';
import type { IImageSceneRecord } from '../types/imageScene.ts';

export interface IDtoOptionsImageDirectUploadResponse extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsImageDirectUploadResponse>()
export class DtoImageDirectUploadResponse {
  @Api.field(v.tableIdentity())
  id: TableIdentity;

  @Api.field(z.string())
  provider: keyof IImageProviderRecord;

  @Api.field()
  clientName: string;

  @Api.field()
  resourceId: string;

  @Api.field()
  uploadUrl: string;

  @Api.field(v.optional())
  draft?: boolean;

  @Api.field(v.optional())
  filename?: string;

  @Api.field(v.optional())
  requireSignedURLs?: boolean;

  @Api.field(v.optional(), z.string())
  status?: TypeImageStatus;

  @Api.field(v.optional())
  draftExpiresAt?: Date;

  @Api.field(v.optional(), z.string())
  imageScene?: keyof IImageSceneRecord;
}
