import type {
  ICommandExecute,
  ICommandSelectedOptionsBase,
  NextCommandExecute,
} from 'zova-module-a-command';
import type { IJsxRenderContextBase, IJsxRenderContextPage } from 'zova-module-a-openapi';

import { BeanCommandSelectedBase, Command } from 'zova-module-a-command';

export type TypeCommandDeleteBulkResult = unknown;

export interface ICommandOptionsDeleteBulk extends ICommandSelectedOptionsBase<TypeCommandDeleteBulkResult> {}

@Command<ICommandOptionsDeleteBulk>()
export class CommandDeleteBulk extends BeanCommandSelectedBase implements ICommandExecute {
  async execute(
    options: ICommandOptionsDeleteBulk,
    renderContext: IJsxRenderContextBase,
    next: NextCommandExecute,
  ) {
    const { resource, ids } = this.getResourceAndIds(options, renderContext);
    const { ctx } = renderContext;
    const modelResource = await ctx.bean._getBeanSelector(
      'rest-resource.model.resource',
      true,
      resource,
    );
    const mutation = modelResource.deleteBulk();
    await mutation.mutateAsync({ ids });
    if (renderContext.$scene === 'page') {
      (renderContext as IJsxRenderContextPage).$$page.clearSelectionAfterMutation(ids);
    }
    return next();
  }
}
