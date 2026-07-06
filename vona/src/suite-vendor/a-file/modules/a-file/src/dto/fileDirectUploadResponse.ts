import type { TableIdentity } from 'table-identity';
import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';
import z from 'zod';

import type { IFileProviderRecord } from '../types/fileProvider.ts';
import type { IFileSceneRecord } from '../types/fileScene.ts';

export interface IDtoOptionsFileDirectUploadResponse extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsFileDirectUploadResponse>()
export class DtoFileDirectUploadResponse {
  @Api.field(v.tableIdentity())
  id: TableIdentity;

  @Api.field(z.string())
  provider: keyof IFileProviderRecord;

  @Api.field()
  clientName: string;

  @Api.field()
  resourceId: string;

  @Api.field()
  uploadUrl: string;

  @Api.field(v.optional(), z.record(z.string(), z.string()))
  headers?: Record<string, string>;

  @Api.field(v.optional(), z.enum(['PUT', 'POST']))
  method?: 'PUT' | 'POST';

  @Api.field(v.optional())
  filename?: string;

  @Api.field(v.optional(), z.string())
  fileScene?: keyof IFileSceneRecord;
}
