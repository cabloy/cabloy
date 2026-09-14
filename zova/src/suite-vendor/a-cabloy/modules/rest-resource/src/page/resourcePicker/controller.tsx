import type { TableIdentity } from 'table-identity';
import type { VNode } from 'vue';
import type {
  IResourceBlockOptionsBase,
  IResourceRenderBlockOptionsBlock,
  IResourceTableSelectionPayload,
  ITableQuery,
} from 'zova-module-a-openapi';
import type { IRoutedDialogContext } from 'zova-module-basic-app';

import { z } from 'zod';
import { BeanControllerPageBase, deepExtend, Use, usePrepareArg } from 'zova';
import { ZovaJsx } from 'zova-jsx';
import { Controller } from 'zova-module-a-bean';
import { $QueryEnsureLoaded } from 'zova-module-a-model';
import { routedDialogContextKey } from 'zova-module-basic-app';
import { ZPage } from 'zova-module-home-base';

import type { ModelResource } from '../../model/resource.js';

import { ZResourcePickerContext } from '../../.metadata/component/resourcePickerContext.js';

export const ControllerPageResourcePickerSchemaParams = z.object({
  resource: z.string(),
});

export interface IResourcePickerPageOptions extends Record<string, unknown> {
  resource: string;
  actionPath?: string;
  query?: ITableQuery;
  selectionMode: 'single' | 'multiple';
  selectionMax?: number;
  selectedIds?: readonly TableIdentity[];
}

export interface IResourcePickerPageSession {
  selectedIds: TableIdentity[];
  selectedRows: Record<string, unknown>[];
}

export interface IResourcePickerPageContext {
  options: IResourcePickerPageOptions;
  session: IResourcePickerPageSession;
  dialog: IRoutedDialogContext<
    IResourceTableSelectionPayload,
    IResourcePickerPageOptions,
    IResourcePickerPageSession
  >;
}

@Controller()
export class ControllerPageResourcePicker extends BeanControllerPageBase {
  jsxZova: ZovaJsx;

  @Use({ beanFullName: 'rest-resource.model.resource' })
  get $$modelResource(): ModelResource {
    return usePrepareArg(this.resource, true);
  }

  @Use({ name: routedDialogContextKey, injectionScope: 'host' })
  $$routedDialogContext: IRoutedDialogContext<
    IResourceTableSelectionPayload,
    IResourcePickerPageOptions,
    IResourcePickerPageSession
  >;

  get resource() {
    return this.$params.resource;
  }

  get pickerContext(): IResourcePickerPageContext {
    const options = this.$$routedDialogContext.props;
    const session = this.$$routedDialogContext.session;
    if (!options || !session || options.resource !== this.resource) {
      throw new Error('resource picker context does not match route resource');
    }
    return {
      options,
      session,
      dialog: this.$$routedDialogContext,
    };
  }

  protected async __init__() {
    this.jsxZova = this.bean._newBeanSimple(ZovaJsx, false);
    await $QueryEnsureLoaded(() => this.$$modelResource.apiSchemasSelect.sdk);
  }

  get schemaRow() {
    return this.$$modelResource.schemaRow;
  }

  public render() {
    const blocks = this._prepareBlocks(this.schemaRow?.rest?.blocks);
    if (!blocks || blocks.length === 0) return;
    const domBlocks: VNode[] = [];
    blocks.forEach((block, index) => {
      const options = deepExtend({ key: index }, { resource: this.resource }, block.options);
      const domBlock = this.jsxZova.render(block.render!, options);
      if (!domBlock) return;
      if (Array.isArray(domBlock)) domBlocks.push(...domBlock);
      else domBlocks.push(domBlock);
    });
    return (
      <ZResourcePickerContext context={this.pickerContext}>
        <ZPage>{domBlocks}</ZPage>
      </ZResourcePickerContext>
    );
  }

  private _prepareBlocks(blocks: IResourceRenderBlockOptionsBlock[] | undefined) {
    if (!blocks) return;
    return blocks.map(block => {
      if (block.render !== 'basic-page:blockPage') return block;
      const pickerContext = this.pickerContext;
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
  }
}
