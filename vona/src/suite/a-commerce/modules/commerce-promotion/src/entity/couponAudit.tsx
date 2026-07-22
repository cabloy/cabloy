import type { TableIdentity } from 'table-identity';
import type { IDecoratorEntityOptions } from 'vona-module-a-orm';

import { $makeMetadata, Api, v } from 'vona-module-a-openapiutils';
import { Entity, EntityBase } from 'vona-module-a-orm';
import { z } from 'zod';
import { ZovaRender } from 'zova-rest-cabloy-basic-admin';

import type { TypeCouponGrantState } from './couponGrant.tsx';

import { $locale } from '../.metadata/locales.ts';

export type TypeCouponAuditOperation = 'issue' | 'reserve' | 'release' | 'redeem' | 'expire';

export interface IEntityOptionsCouponAudit extends IDecoratorEntityOptions {}

@Entity<IEntityOptionsCouponAudit>('commercePromotionCouponAudit', {
  openapi: { title: $locale('CouponAudit') },
  fields: {
    id: $makeMetadata(ZovaRender.order(1, 'core')),
    iid: $makeMetadata(ZovaRender.visible(false)),
    deleted: $makeMetadata(ZovaRender.visible(false)),
    createdAt: $makeMetadata(
      ZovaRender.order(-2, 'max'),
      ZovaRender.field('basic-date:formFieldDate'),
      ZovaRender.cell('basic-date:date'),
    ),
    updatedAt: $makeMetadata(ZovaRender.visible(false)),
  },
})
export class EntityCouponAudit extends EntityBase {
  @Api.field(v.title($locale('CouponGrantId')), v.required(), v.tableIdentity())
  couponGrantId: TableIdentity;

  @Api.field(v.title($locale('CouponTemplateId')), v.required(), v.tableIdentity())
  templateId: TableIdentity;

  @Api.field(v.title($locale('UserId')), v.required(), v.tableIdentity())
  userId: TableIdentity;

  @Api.field(v.title($locale('OrderId')), v.optional(), v.tableIdentity())
  orderId?: TableIdentity;

  @Api.field(v.title($locale('ActorId')), v.optional(), v.tableIdentity())
  actorId?: TableIdentity;

  @Api.field(
    v.title($locale('CouponOperation')),
    v.required(),
    z.enum(['issue', 'reserve', 'release', 'redeem', 'expire']),
  )
  operation: TypeCouponAuditOperation;

  @Api.field(
    v.title($locale('FromState')),
    v.optional(),
    z.enum(['available', 'reserved', 'redeemed', 'expired']),
  )
  fromState?: TypeCouponGrantState;

  @Api.field(
    v.title($locale('ToState')),
    v.required(),
    z.enum(['available', 'reserved', 'redeemed', 'expired']),
  )
  toState: TypeCouponGrantState;

  @Api.field(v.title($locale('Reason')), v.required(), v.min(1), v.max(255))
  reason: string;

  @Api.field(v.title($locale('CorrelationId')), v.required(), v.min(1), v.max(100))
  correlationId: string;
}
