import type { TableIdentity } from 'table-identity';
import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';

import { $locale } from '../.metadata/locales.ts';

export interface IDtoOptionsAddressMineItem extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsAddressMineItem>()
export class DtoAddressMineItem {
  @Api.field(v.tableIdentity())
  id: TableIdentity;

  @Api.field(v.title($locale('RecipientName')), v.required(), v.min(2), v.max(100))
  recipientName: string;

  @Api.field(v.title($locale('Phone')), v.required(), v.min(1), v.max(50))
  phone: string;

  @Api.field(v.title($locale('CountryCode')), v.required(), v.min(2), v.max(10))
  countryCode: string;

  @Api.field(v.title($locale('Region')), v.required(), v.min(1), v.max(100))
  region: string;

  @Api.field(v.title($locale('City')), v.required(), v.min(1), v.max(100))
  city: string;

  @Api.field(v.title($locale('PostalCode')), v.required(), v.min(1), v.max(30))
  postalCode: string;

  @Api.field(v.title($locale('AddressLine1')), v.required(), v.min(1), v.max(255))
  addressLine1: string;

  @Api.field(v.title($locale('AddressLine2')), v.optional(), v.max(255))
  addressLine2?: string;
}
