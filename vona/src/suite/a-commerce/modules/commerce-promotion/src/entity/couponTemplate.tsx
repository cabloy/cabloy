import type { IDecoratorEntityOptions } from 'vona-module-a-orm';

import { $makeMetadata, Api, v } from 'vona-module-a-openapiutils';
import { Entity, EntityBase } from 'vona-module-a-orm';
import { z } from 'zod';
import { ZovaRender } from 'zova-rest-cabloy-basic-admin';

import { $locale } from '../.metadata/locales.ts';

export type TypeCouponTemplateState = 'draft' | 'active' | 'disabled';

export const couponTemplateStateItems = [
  { value: 'draft', title: $locale('CouponTemplateStateDraft') },
  { value: 'active', title: $locale('CouponTemplateStateActive') },
  { value: 'disabled', title: $locale('CouponTemplateStateDisabled') },
];

export const couponTemplateStateItemsCreate = couponTemplateStateItems.slice(0, 2);

const currencyRendererOptions = { fixed: 2, exp: 2, zero: 2 };
const dateFieldRendererOptions = { inputType: 'date' as const, preset: 'DATE_SHORT' as const };
const dateCellRendererOptions = { preset: 'DATE_SHORT' as const };

export interface IEntityOptionsCouponTemplate extends IDecoratorEntityOptions {}

@Entity<IEntityOptionsCouponTemplate>('commercePromotionCouponTemplate', {
  openapi: { title: $locale('CouponTemplate') },
  fields: {
    id: $makeMetadata(ZovaRender.order(1, 'core')),
    iid: $makeMetadata(ZovaRender.visible(false)),
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
export class EntityCouponTemplate extends EntityBase {
  @Api.field(
    v.title($locale('Name')),
    v.required(),
    v.min(2),
    v.max(100),
    ZovaRender.order(1),
    ZovaRender.cell('basic-table:actionView'),
  )
  name: string;

  @Api.field(
    v.title($locale('CouponTemplateState')),
    v.required(),
    ZovaRender.field('basic-select:formFieldSelect', { items: couponTemplateStateItems }),
    ZovaRender.cell('basic-select:select', { items: couponTemplateStateItems }),
    z.enum(['draft', 'active', 'disabled']),
  )
  state: TypeCouponTemplateState;

  @Api.field(v.title($locale('Currency')), v.required(), z.literal('USD'))
  currency: 'USD';

  @Api.field(
    v.title($locale('DiscountCents')),
    v.required(),
    ZovaRender.field('basic-currency:formFieldCurrency', currencyRendererOptions),
    ZovaRender.cell('basic-currency:currency', currencyRendererOptions),
    z.number().int().positive(),
  )
  discountCents: number;

  @Api.field(
    v.title($locale('MinSpendCents')),
    v.required(),
    ZovaRender.field('basic-currency:formFieldCurrency', currencyRendererOptions),
    ZovaRender.cell('basic-currency:currency', currencyRendererOptions),
    z.number().int().nonnegative(),
  )
  minSpendCents: number;

  @Api.field(
    v.title($locale('ValidFrom')),
    v.required(),
    ZovaRender.field('basic-date:formFieldDate', dateFieldRendererOptions),
    ZovaRender.cell('basic-date:date', dateCellRendererOptions),
  )
  validFrom: Date;

  @Api.field(
    v.title($locale('ValidUntil')),
    v.required(),
    ZovaRender.field('basic-date:formFieldDate', dateFieldRendererOptions),
    ZovaRender.cell('basic-date:date', dateCellRendererOptions),
  )
  validUntil: Date;

  @Api.field(v.title($locale('TotalIssueLimit')), v.optional(), z.number().int().positive())
  totalIssueLimit?: number;

  @Api.field(v.title($locale('TotalUsageLimit')), v.optional(), z.number().int().positive())
  totalUsageLimit?: number;

  @Api.field(v.title($locale('PerCustomerIssueLimit')), v.optional(), z.number().int().positive())
  perCustomerIssueLimit?: number;

  @Api.field(v.title($locale('IssuedCount')), v.required(), z.number().int().nonnegative())
  issuedCount: number;

  @Api.field(v.title($locale('RedeemedCount')), v.required(), z.number().int().nonnegative())
  redeemedCount: number;

  @Api.field(v.title($locale('Description')), v.optional(), v.max(255))
  description?: string;
}
