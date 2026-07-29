import type { TableIdentity } from 'table-identity';
import type { IDecoratorEntityOptions } from 'vona-module-a-orm';

import { Api, v } from 'vona-module-a-openapiutils';
import { Entity, EntityBase } from 'vona-module-a-orm';
import { z } from 'zod';

export interface IEntityOptionsWebhookInbox extends IDecoratorEntityOptions {}

@Entity<IEntityOptionsWebhookInbox>('payWebhookInbox')
export class EntityWebhookInbox extends EntityBase {
  @Api.field(v.required(), v.min(1), v.max(100))
  providerName: string;

  @Api.field(v.required(), v.min(1), v.max(100))
  clientName: string;

  @Api.field(z.enum(['sandbox', 'live']))
  environment: 'sandbox' | 'live';

  @Api.field(v.required(), v.min(1), v.max(255))
  providerEventId: string;

  @Api.field(v.required(), v.min(1), v.max(100))
  eventType: string;

  @Api.field(v.optional(), v.tableIdentity())
  paymentSessionId?: TableIdentity;

  @Api.field(v.optional(), v.tableIdentity())
  refundOperationId?: TableIdentity;

  @Api.field(v.required(), v.min(64), v.max(64))
  payloadHash: string;

  @Api.field(z.enum(['received', 'processed', 'failed']))
  state: 'received' | 'processed' | 'failed';

  @Api.field(z.number().int().nonnegative())
  retryCount: number;

  @Api.field(v.optional())
  processedAt?: Date;

  @Api.field(v.optional(), v.max(255))
  errorSummary?: string;
}
