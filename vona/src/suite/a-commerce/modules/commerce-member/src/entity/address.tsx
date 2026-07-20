import type { TableIdentity } from 'table-identity';
import type { IDecoratorEntityOptions } from 'vona-module-a-orm';

import { $makeMetadata, Api, v } from 'vona-module-a-openapiutils';
import { Entity, EntityBase } from 'vona-module-a-orm';
import { ZovaRender } from 'zova-rest-cabloy-basic-admin';

import { $locale } from '../.metadata/locales.ts';

export interface IEntityOptionsAddress extends IDecoratorEntityOptions {}

@Entity<IEntityOptionsAddress>('commerceMemberAddress', {
  openapi: { title: $locale('Address') },
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
export class EntityAddress extends EntityBase {
  @Api.field(v.tableIdentity())
  userId: TableIdentity;

  @Api.field(
    v.title($locale('RecipientName')),
    v.required(),
    v.min(2),
    v.max(100),
    ZovaRender.order(1),
  )
  recipientName: string;

  @Api.field(v.title($locale('Phone')), v.required(), v.min(1), v.max(50), ZovaRender.order(2))
  phone: string;

  @Api.field(
    v.title($locale('CountryCode')),
    v.required(),
    v.min(2),
    v.max(10),
    ZovaRender.order(3),
  )
  countryCode: string;

  @Api.field(v.title($locale('Region')), v.required(), v.min(1), v.max(100), ZovaRender.order(4))
  region: string;

  @Api.field(v.title($locale('City')), v.required(), v.min(1), v.max(100), ZovaRender.order(5))
  city: string;

  @Api.field(v.title($locale('PostalCode')), v.required(), v.min(1), v.max(30), ZovaRender.order(6))
  postalCode: string;

  @Api.field(
    v.title($locale('AddressLine1')),
    v.required(),
    v.min(1),
    v.max(255),
    ZovaRender.order(7),
  )
  addressLine1: string;

  @Api.field(v.title($locale('AddressLine2')), v.optional(), v.max(255), ZovaRender.order(8))
  addressLine2?: string;
}
