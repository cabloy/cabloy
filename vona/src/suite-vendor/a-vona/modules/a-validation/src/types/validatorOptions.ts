import type { TypeErrorsInternal } from 'vona';
import type { ISchemaObjectOptions } from 'vona-module-a-openapi';
import type { z } from 'zod';

export interface ValidatorOptions<T = any> extends ISchemaObjectOptions {
  // Explicit false disables query adaptation; omitted/true preserves the inherited policy.
  queryCoercion?: boolean;
  disableErrorMessages: boolean;
  errorHttpStatusCode: keyof TypeErrorsInternal | number;
  exceptionFactory?: (error: z.ZodError<T>) => any;
}
