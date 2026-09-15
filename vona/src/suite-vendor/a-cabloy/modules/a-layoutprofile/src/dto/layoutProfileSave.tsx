import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';
import { z } from 'zod';

import { DtoLayoutProfileLoad } from './layoutProfileLoad.tsx';

export interface IDtoOptionsLayoutProfileSave extends IDecoratorDtoOptions {}

const width = z.union([z.literal('auto'), z.number().int().min(1).max(2000)]);
const column = z.object({
  key: z.string().trim().min(1).max(100),
  visible: z.union([z.literal(true), z.literal(false)]),
  width,
});
const profile = z.object({
  version: z.literal(1),
  schemaFingerprint: z.string().trim().max(255).optional(),
  columns: z.array(column).max(200),
});

@Dto<IDtoOptionsLayoutProfileSave>()
export class DtoLayoutProfileSave extends DtoLayoutProfileLoad {
  @Api.field(v.required(), profile)
  profile: {
    version: 1;
    schemaFingerprint?: string;
    columns: Array<{ key: string; visible: boolean; width: number | 'auto' }>;
  };
}
