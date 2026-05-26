import type { IJsxRenderContextBase } from 'zova-module-a-openapi';

import {
  BeanCommandRowBase,
  Command,
  type ICommandExecute,
  type ICommandRowOptionsBase,
  type NextCommandExecute,
} from 'zova-module-a-command';

export type TypeCommandDeleteResult = unknown;

export interface ICommandOptionsDelete extends ICommandRowOptionsBase<TypeCommandDeleteResult> {}

@Command<ICommandOptionsDelete>()
export class CommandDelete extends BeanCommandRowBase implements ICommandExecute {
  async execute(
    options: ICommandOptionsDelete,
    renderContext: IJsxRenderContextBase,
    next: NextCommandExecute,
  ) {
    const { resource, id } = this.getResourceAndId(options, renderContext);
    const { ctx } = renderContext;
    const modelResource = await ctx.bean._getBeanSelector(
      'rest-resource.model.resource',
      true,
      resource,
    );
    const mutation = modelResource.delete(id);
    await mutation.mutateAsync();
    return next();
  }
}
