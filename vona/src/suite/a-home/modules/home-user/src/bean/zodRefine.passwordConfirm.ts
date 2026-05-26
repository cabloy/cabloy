import type {
  IDecoratorZodRefineOptions,
  IZodRefineExecute,
  TypeRefinementCtx,
} from 'vona-module-a-zod';

import { BeanBase } from 'vona';
import { ZodRefine } from 'vona-module-a-zod';

export interface TypeZodRefinePasswordConfirmData {
  password: string;
  passwordConfirm: string;
}

export interface IZodRefineOptionsPasswordConfirm extends IDecoratorZodRefineOptions {}

@ZodRefine<IZodRefineOptionsPasswordConfirm>()
export class ZodRefinePasswordConfirm
  extends BeanBase
  implements IZodRefineExecute<TypeZodRefinePasswordConfirmData>
{
  async execute(
    value: TypeZodRefinePasswordConfirmData,
    refinementCtx: TypeRefinementCtx,
    _options: IZodRefineOptionsPasswordConfirm,
  ) {
    if (value.password !== value.passwordConfirm) {
      refinementCtx.addIssue({
        code: 'custom',
        message: this.scope.locale.PasswordsNotMatch(),
        path: ['passwordConfirm'],
      });
    }
  }
}
