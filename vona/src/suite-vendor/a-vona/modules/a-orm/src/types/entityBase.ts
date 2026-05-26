import type { TableIdentity } from 'table-identity';

import { Api, v } from 'vona-module-a-openapiutils';

import { $locale } from '../.metadata/locales.ts';
import { EntityBaseInner } from './entityBaseInner.ts';

export class EntityBase extends EntityBaseInner {
  @Api.field(v.title($locale('TableIdentity')), v.tableIdentity())
  id: TableIdentity;
}
