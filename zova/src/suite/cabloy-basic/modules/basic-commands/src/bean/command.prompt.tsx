import type {
  ICommandExecute,
  ICommandOptionsBase,
  NextCommandExecute,
} from 'zova-module-a-command';
import type { IJsxRenderContextBase } from 'zova-module-a-openapi';
import type { IModalDialogOptions, IModalPromptOptions } from 'zova-module-basic-app';

import { BeanBase } from 'zova';
import { Command } from 'zova-module-a-command';

export type TypeCommandPromptResult = unknown;

export interface ICommandOptionsPrompt
  extends ICommandOptionsBase<TypeCommandPromptResult>, IModalPromptOptions {
  dialogOptions?: IModalDialogOptions;
}

@Command<ICommandOptionsPrompt>()
export class CommandPrompt extends BeanBase implements ICommandExecute {
  async execute(
    options: ICommandOptionsPrompt,
    renderContext: IJsxRenderContextBase,
    next: NextCommandExecute,
  ) {
    const { $host } = renderContext;
    const res = await $host.$appModal.prompt(options, options.dialogOptions);
    return next(res);
  }
}
