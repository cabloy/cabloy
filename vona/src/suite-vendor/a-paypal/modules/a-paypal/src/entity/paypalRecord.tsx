import type { TableIdentity } from 'table-identity';
import type { IDecoratorEntityOptions } from 'vona-module-a-orm';

import { Api, v } from 'vona-module-a-openapiutils';
import { Entity, EntityBase } from 'vona-module-a-orm';

import type { IPaypalOrderRecordOptions, IPaypalOrderRecordPayload } from '../types/paypal.ts';

import { DtoPaypalOrderRecordOptions } from '../dto/paypalOrderRecordOptions.tsx';
import { DtoPaypalOrderRecordPayload } from '../dto/paypalOrderRecordPayload.tsx';

export interface IEntityOptionsPaypalRecord extends IDecoratorEntityOptions {}

@Entity<IEntityOptionsPaypalRecord>('paypalRecord')
export class EntityPaypalRecord extends EntityBase {
  @Api.field(v.tableIdentity())
  userId: TableIdentity;

  @Api.field(v.default(0))
  status: number;

  @Api.field()
  prepayId: string;

  @Api.field(v.object(DtoPaypalOrderRecordPayload))
  payload: IPaypalOrderRecordPayload;

  @Api.field(v.object(DtoPaypalOrderRecordOptions))
  options: IPaypalOrderRecordOptions;
}
