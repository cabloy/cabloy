import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';
import z from 'zod';

import type { ICaptchaProviderRecord } from '../types/captchaProvider.ts';

export interface IDtoOptionsCaptchaData extends IDecoratorDtoOptions {}

const captchaStatusSchema = z.enum(['accepted', 'rejected', 'unknown', 'limited']);

@Dto<IDtoOptionsCaptchaData>()
export class DtoCaptchaData {
  @Api.field()
  id: string;

  @Api.field(z.string())
  provider: keyof ICaptchaProviderRecord;

  @Api.field(v.optional())
  token?: unknown;

  @Api.field()
  payload: unknown;

  @Api.field(
    v.openapi({ type: 'string', enum: captchaStatusSchema.options }),
    v.optional(),
    captchaStatusSchema,
  )
  status?: 'accepted' | 'rejected' | 'unknown' | 'limited';

  @Api.field(v.openapi({ type: 'number' }), v.optional(), z.number())
  serverNow?: number;

  @Api.field(v.openapi({ type: 'number' }), v.optional(), z.number())
  expiresAt?: number;

  @Api.field(v.openapi({ type: 'number' }), v.optional(), z.number())
  resendAt?: number;

  @Api.field(v.openapi({ type: 'number' }), v.optional(), z.number())
  retryAt?: number;
}
