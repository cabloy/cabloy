import { BeanBase, cast } from 'zova';
import {
  Command,
  ICommandExecute,
  ICommandOptionsBase,
  NextCommandExecute,
} from 'zova-module-a-command';
import { IJsxRenderContextFormField } from 'zova-module-a-form';
import { IJsxRenderContextBase } from 'zova-module-a-openapi';

export type TypeCommandSetValueResult = unknown;

export interface ICommandOptionsSetValue extends ICommandOptionsBase<TypeCommandSetValueResult> {
  name?: string;
  value?: any;
  disableNotifyChanged?: boolean;
}

@Command<ICommandOptionsSetValue>()
export class CommandSetValue extends BeanBase implements ICommandExecute {
  execute(
    options: ICommandOptionsSetValue,
    renderContext: IJsxRenderContextBase,
    next: NextCommandExecute,
  ) {
    if (renderContext.$scene === 'formField') {
      const { $celScope, $jsx, $$form } = renderContext as IJsxRenderContextFormField;
      const name = options.name ?? $celScope.name;
      // null means valid prop value
      const value = options.value !== undefined ? options.value : cast($jsx.event?.target)?.value;
      $$form.setFieldValue(name, value, options.disableNotifyChanged);
    }
    return next();
  }
}
