import { useApp } from 'vona';
import { Api, v } from 'vona-module-a-openapiutils';
import z from 'zod';

const app = useApp();
const ormConfig = app.util.getModuleConfigRaw('a-orm');
const ordersDefault = ormConfig?.rest?.query?.orders?.default ?? 'createdAt,desc';

export class DtoQueryBase {
  @Api.field(v.optional(), v.array(String, { separator: ',' }))
  columns?: string[];

  @Api.field(v.optional(), z.looseObject({}))
  where?: object;

  @Api.field(
    v.default(ordersDefault),
    v.optional(),
    z.union([z.string(), z.array(z.array(z.string()))]),
  )
  orders?: string | string[][];
}
