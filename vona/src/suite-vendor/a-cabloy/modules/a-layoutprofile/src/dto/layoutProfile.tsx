import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';
import { z } from 'zod';

export interface IDtoOptionsLayoutProfile extends IDecoratorDtoOptions {}

const width = z.union([z.literal('auto'), z.number().int().min(1).max(2000)]);
const column = z.object({
  key: z.string().trim().min(1).max(100),
  visible: z.union([z.literal(true), z.literal(false)]),
  width,
});

@Dto<IDtoOptionsLayoutProfile>()
export class DtoLayoutProfile {
  @Api.field(v.required(), z.literal(1))
  version: 1;

  @Api.field(z.string().trim().max(255).optional())
  schemaFingerprint?: string;

  @Api.field(v.required(), z.array(column).max(200))
  columns: Array<{ key: string; visible: boolean; width: number | 'auto' }>;
}
