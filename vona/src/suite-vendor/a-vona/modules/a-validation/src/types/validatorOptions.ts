import type { TypeErrorsInternal } from 'vona';
import type { ISchemaObjectOptions } from 'vona-module-a-openapi';
import type { z } from 'zod';

export interface ValidatorOptions<T = any> extends ISchemaObjectOptions {
  disableErrorMessages: boolean;
  errorHttpStatusCode: keyof TypeErrorsInternal | number;
  exceptionFactory?: (error: z.ZodError<T>) => any;
}
