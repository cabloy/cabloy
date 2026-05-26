import { useApp } from 'vona';
import { Api } from 'vona-module-a-openapiutils';
import z from 'zod';

import { DtoQueryBase } from './dtoQueryBase.ts';

const app = useApp();
const ormConfig = app.util.getModuleConfigRaw('a-orm');
const pageSizeDefault = ormConfig?.rest?.query?.pageSize?.default ?? 20;
const pageSizeMax = ormConfig?.rest?.query?.pageSize?.max ?? 100;

export class DtoQueryPageBase extends DtoQueryBase {
  @Api.field(z.number().min(1).default(1))
  pageNo: number;

  @Api.field(z.number().min(1).max(pageSizeMax).default(pageSizeDefault))
  pageSize: number;
}
