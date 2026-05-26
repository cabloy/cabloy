import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';
import z from 'zod';

import type { ICaptchaProviderRecord } from '../types/captchaProvider.ts';

export interface IDtoOptionsCaptchaData extends IDecoratorDtoOptions {}

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
}
