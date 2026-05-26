import { Api, v } from 'vona-module-a-openapiutils';

import { $locale } from '../.metadata/locales.ts';
import { EntityBaseEmpty } from './entityBaseEmpty.ts';

export class EntityBaseInner extends EntityBaseEmpty {
  @Api.field(v.title($locale('CreatedAt')))
  createdAt: Date;

  @Api.field(v.title($locale('UpdatedAt')))
  updatedAt: Date;

  @Api.field(v.title($locale('Deleted')), v.default(false))
  deleted: boolean;

  @Api.field(v.title($locale('InstanceId')), v.default(0))
  iid: number;
}
