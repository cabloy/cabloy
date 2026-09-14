import type {
  IResourceBlockOptionsBase,
  IResourceRenderBlockOptionsBlock,
  IResourceTableSelectionPayload,
} from 'zova-module-a-openapi';
import type { IRoutedDialogContext } from 'zova-module-basic-app';
import type {
  IResourcePickerPageContext,
  IResourcePickerPageHost,
} from 'zova-module-rest-resource';

import { deepExtend } from 'zova';

export function createResourcePickerPageHost(
  dialog: IRoutedDialogContext<
    IResourceTableSelectionPayload,
    IResourcePickerPageContext['options'],
    IResourcePickerPageContext['session']
  >,
): IResourcePickerPageHost {
  const options = dialog.props;
  const session = dialog.session;
  if (!options || !session) {
    throw new Error('resource picker requires dialog options and session');
  }
  return {
    options,
    session,
    resolve: selection => dialog.resolve(selection),
    cancel: () => dialog.cancel(),
    prepareBlocks: (blocks, pickerContext) => {
      if (!blocks) return;
      return blocks.map(block => {
        if (block.render !== 'basic-page:blockPage') return block;
        return {
          ...block,
          options: deepExtend({}, block.options, {
            actionPath: pickerContext.options.actionPath,
            queryFixed: pickerContext.options.query,
            selectionPolicy: 'always',
            selectionMode: pickerContext.options.selectionMode,
            selectionMax: pickerContext.options.selectionMax,
            selectedIds: pickerContext.session.selectedIds,
            selectedRows: pickerContext.session.selectedRows,
            onSelectionChange: (selection: IResourceTableSelectionPayload) => {
              pickerContext.session.selectedIds = [...selection.ids];
              pickerContext.session.selectedRows = selection.rows.map(row => ({ ...row }));
            },
            blocks: [
              ...((
                block.options as IResourceBlockOptionsBase & {
                  blocks?: IResourceRenderBlockOptionsBlock[];
                }
              ).blocks ?? []),
              {
                render: 'basic-resource:blockResourcePickerActions',
              },
            ],
          }),
        };
      });
    },
  };
}
