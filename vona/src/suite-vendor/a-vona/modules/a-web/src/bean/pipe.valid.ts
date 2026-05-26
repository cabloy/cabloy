import type {
  IDecoratorPipeOptions,
  IDecoratorPipeOptionsArgument,
  IPipeTransform,
} from 'vona-module-a-aspect';
import type { RouteHandlerArgumentMeta } from 'vona-module-a-openapi';
import type { ValidatorOptions } from 'vona-module-a-validation';

import { BeanBase } from 'vona';
import { createArgumentPipe, Pipe } from 'vona-module-a-aspect';

export type TypePipeValidData = unknown;

export type TypePipeValidResult = TypePipeValidData;

export interface IPipeOptionsValid
  extends IDecoratorPipeOptions, IDecoratorPipeOptionsArgument, ValidatorOptions {}

@Pipe<IPipeOptionsValid>({
  // ValidatorOptions
  disableErrorMessages: false,
  errorHttpStatusCode: 400,
  loose: false,
  strict: false,
})
export class PipeValid
  extends BeanBase
  implements IPipeTransform<TypePipeValidData, TypePipeValidResult>
{
  async transform(
    value: TypePipeValidData,
    metadata: RouteHandlerArgumentMeta,
    options: IPipeOptionsValid,
  ): Promise<TypePipeValidResult> {
    if (options.schema) {
      // validateSchema
      return await this.bean.validator.validateSchema(
        options.schema,
        value,
        options,
        metadata.field,
      );
    }
    return value;
  }
}

export const ArgValid = createArgumentPipe('a-web:valid');
