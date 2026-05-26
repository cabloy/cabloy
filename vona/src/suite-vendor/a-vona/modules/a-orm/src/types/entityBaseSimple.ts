import { Api, v } from 'vona-module-a-openapiutils';

import { $locale } from '../.metadata/locales.ts';
import { EntityBaseInner } from './entityBaseInner.ts';

export class EntityBaseSimple extends EntityBaseInner {
  @Api.field(v.title($locale('TableIdentity')))
  id: number;
}
