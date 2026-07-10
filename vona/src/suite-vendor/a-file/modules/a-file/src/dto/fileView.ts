import type { TableIdentity } from 'table-identity';
import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';
import z from 'zod';

import type { IFileProviderRecord } from '../types/fileProvider.ts';

export interface IDtoOptionsFileView extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsFileView>()
export class DtoFileView {
  @Api.field(v.tableIdentity())
  id: TableIdentity;

  @Api.field(z.string())
  provider: keyof IFileProviderRecord;

  @Api.field(v.optional())
  filename?: string;

  @Api.field(v.optional())
  contentType?: string;

  @Api.field(v.optional())
  size?: number;

  @Api.field(v.optional())
  public?: boolean;

  @Api.field(v.optional())
  uploadedAt?: Date;

  @Api.field(z.string())
  downloadUrl: string;

  @Api.field(v.default(true))
  signed: boolean;
}
