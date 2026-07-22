import type { TableIdentity } from 'table-identity';
import type { IDecoratorEntityOptions } from 'vona-module-a-orm';

import { $makeMetadata, Api, v } from 'vona-module-a-openapiutils';
import { Entity, EntityBase } from 'vona-module-a-orm';
import { z } from 'zod';
import { ZovaRender } from 'zova-rest-cabloy-basic-admin';

import { $locale } from '../.metadata/locales.ts';

export type TypeCouponGrantState = 'available' | 'reserved' | 'redeemed' | 'expired';

export interface IEntityOptionsCouponGrant extends IDecoratorEntityOptions {}

@Entity<IEntityOptionsCouponGrant>('commercePromotionCouponGrant', {
  openapi: { title: $locale('CouponGrant') },
  fields: {
    id: $makeMetadata(ZovaRender.order(1, 'core')),
    iid: $makeMetadata(ZovaRender.visible(false)),
    userId: $makeMetadata(ZovaRender.visible(false)),
    deleted: $makeMetadata(ZovaRender.visible(false)),
    createdAt: $makeMetadata(
      ZovaRender.order(-2, 'max'),
      ZovaRender.field('basic-date:formFieldDate'),
      ZovaRender.cell('basic-date:date'),
    ),
    updatedAt: $makeMetadata(
      ZovaRender.order(-1, 'max'),
      ZovaRender.field('basic-date:formFieldDate'),
      ZovaRender.cell('basic-date:date'),
    ),
  },
})
export class EntityCouponGrant extends EntityBase {
  @Api.field(v.title($locale('CouponTemplateId')), v.required(), v.tableIdentity())
  templateId: TableIdentity;

  @Api.field(v.title($locale('UserId')), v.required(), v.tableIdentity())
  userId: TableIdentity;

  @Api.field(v.title($locale('CouponCode')), v.required(), v.min(1), v.max(80))
  couponCode: string;

  @Api.field(
    v.title($locale('CouponGrantState')),
    v.required(),
    z.enum(['available', 'reserved', 'redeemed', 'expired']),
  )
  state: TypeCouponGrantState;

  @Api.field(v.title($locale('TemplateNameSnapshot')), v.required(), v.min(1), v.max(100))
  templateNameSnapshot: string;

  @Api.field(v.title($locale('Currency')), v.required(), z.literal('USD'))
  currencySnapshot: 'USD';

  @Api.field(v.title($locale('DiscountCents')), v.required(), z.number().int().positive())
  discountCentsSnapshot: number;

  @Api.field(v.title($locale('MinSpendCents')), v.required(), z.number().int().nonnegative())
  minSpendCentsSnapshot: number;

  @Api.field(v.title($locale('ValidFrom')), v.required())
  validFromSnapshot: Date;

  @Api.field(v.title($locale('ValidUntil')), v.required())
  validUntilSnapshot: Date;

  @Api.field(v.title($locale('ReservationOrderId')), v.optional(), v.tableIdentity())
  reservationOrderId?: TableIdentity;

  @Api.field(v.title($locale('ReservationCorrelationId')), v.optional(), v.max(100))
  reservationCorrelationId?: string;

  @Api.field(v.title($locale('ReservedAt')), v.optional())
  reservedAt?: Date;

  @Api.field(v.title($locale('RedeemedOrderId')), v.optional(), v.tableIdentity())
  redeemedOrderId?: TableIdentity;

  @Api.field(v.title($locale('RedeemedAt')), v.optional())
  redeemedAt?: Date;
}
