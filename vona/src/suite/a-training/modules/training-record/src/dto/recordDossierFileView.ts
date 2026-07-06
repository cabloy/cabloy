import type { TableIdentity } from 'table-identity';
import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';
import z from 'zod';

export interface IDtoOptionsRecordDossierFileView extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsRecordDossierFileView>()
export class DtoRecordDossierFileView {
  @Api.field(v.tableIdentity())
  id: TableIdentity;

  @Api.field(z.string())
  provider: string;

  @Api.field(z.string())
  clientName: string;

  @Api.field(v.optional(), z.string())
  fileScene?: string;

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

  @Api.field(v.optional(), z.record(z.string(), z.unknown()))
  meta?: Record<string, unknown>;

  @Api.field(z.string())
  downloadUrl: string;

  @Api.field(v.default(true))
  signed: boolean;
}
