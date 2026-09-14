import type { TableIdentity } from 'table-identity';
import type {
  IResourceRenderBlockOptionsBlock,
  IResourceTableSelectionPayload,
  ITableQuery,
} from 'zova-module-a-openapi';

export const resourcePickerPageContextKey = '$resourcePickerPageContext';
export const resourcePickerPageHostKey = '$resourcePickerPageHost';

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

export interface IResourcePickerPageDialog {
  resolve(value: IResourceTableSelectionPayload): void;
  cancel(): void;
}

export interface IResourcePickerPageContext {
  options: IResourcePickerPageOptions;
  session: IResourcePickerPageSession;
  dialog: IResourcePickerPageDialog;
}

export interface IResourcePickerPageHost extends IResourcePickerPageDialog {
  options: IResourcePickerPageOptions;
  session: IResourcePickerPageSession;
  prepareBlocks(
    blocks: IResourceRenderBlockOptionsBlock[] | undefined,
    context: IResourcePickerPageContext,
  ): IResourceRenderBlockOptionsBlock[] | undefined;
}
