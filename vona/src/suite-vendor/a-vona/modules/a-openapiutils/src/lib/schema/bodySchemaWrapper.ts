import { z } from 'zod';

export function bodySchemaWrapperDefault(bodySchema: any) {
  return z.object({
    code: z.string(),
    message: z.string(),
    data: bodySchema,
  });
}
