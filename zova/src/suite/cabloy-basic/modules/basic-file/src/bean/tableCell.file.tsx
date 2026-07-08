import type { IResourceTableCellOptionsBase } from 'zova-module-a-openapi';
import type {
  IJsxRenderContextTableCell,
  ITableCellRender,
  NextTableCellRender,
} from 'zova-module-a-table';

import { BeanBase } from 'zova';
import { TableCell } from 'zova-module-a-table';

import type { IFilePreviewItem } from '../types/file.js';

import {
  collectFileRelationPreviewItems,
  inferFileRelationName,
  resolveFileDownloadUrl,
} from '../lib/index.js';

declare module 'zova-module-a-openapi' {
  export interface IResourceTableCellRecord {
    'basic-file:file'?: ITableCellOptionsFile;
  }
}

export interface ITableCellOptionsFile extends IResourceTableCellOptionsBase {
  relationName?: string;
}

interface ITableCellFileDownloadItem {
  key: string;
  label: string;
  downloadUrl?: string;
}

@TableCell<ITableCellOptionsFile>()
export class TableCellFile extends BeanBase implements ITableCellRender {
  render(
    options: ITableCellOptionsFile,
    renderContext: IJsxRenderContextTableCell,
    next: NextTableCellRender,
  ) {
    const value = next();
    const relationName = inferFileRelationName(renderContext.$celScope.name, options.relationName);
    const relationValue = relationName
      ? renderContext.cellContext.row.original[relationName]
      : undefined;
    const relationItems = collectFileRelationPreviewItems(relationValue);
    if (relationItems.length === 0) return this._renderSummaryContent(value, 0);

    const firstItem = relationItems[0];
    const summaryLabel = this._resolveSummaryLabel(firstItem, value);
    const contentNode = this._renderSummaryContent(summaryLabel, relationItems.length);
    if (relationItems.length === 1) {
      return this._renderDirectLink(firstItem, contentNode);
    }

    const downloadItems = relationItems.map((item, index) =>
      this._normalizeDownloadItem(item, index),
    );
    const hasDownloadableItem = downloadItems.some(item => !!item.downloadUrl);
    if (!hasDownloadableItem) return contentNode;

    const placeholder = this._resolveSelectPlaceholder(summaryLabel, relationItems.length);
    return this._renderDownloadSelect(renderContext, downloadItems, contentNode, placeholder);
  }

  private _renderSummaryContent(label: unknown, count: number) {
    return (
      <span class="inline-flex min-w-0 items-center gap-2">
        <span class="truncate">{label}</span>
        {count > 1 && (
          <span class="badge badge-sm border-0 whitespace-nowrap px-2 badge-neutral text-neutral-content">
            +{count - 1}
          </span>
        )}
      </span>
    );
  }

  private _renderDirectLink(item: IFilePreviewItem, contentNode: unknown) {
    const downloadUrl = this._resolveDownloadUrl(item);
    if (!downloadUrl) return contentNode;
    return (
      <a
        class="link link-hover inline-flex min-w-0 items-center"
        href={downloadUrl}
        target="_blank"
        rel="noreferrer"
        onClick={event => {
          event.stopPropagation();
        }}
      >
        {contentNode}
      </a>
    );
  }

  private _renderDownloadSelect(
    renderContext: IJsxRenderContextTableCell,
    items: ITableCellFileDownloadItem[],
    contentNode: unknown,
    placeholder: string,
  ) {
    const fieldTitle = renderContext.$celScope.property?.title ?? renderContext.$celScope.name;
    return (
      <span class="relative inline-flex min-w-0 max-w-full items-center">
        <span class="inline-flex min-w-0 max-w-full items-center">{contentNode}</span>
        <select
          class="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          aria-label={fieldTitle}
          title={placeholder}
          onClick={event => {
            event.stopPropagation();
          }}
          onMousedown={event => {
            event.stopPropagation();
          }}
          onChange={event => {
            event.stopPropagation();
            const target = event.target as HTMLSelectElement;
            const selectedValue = target.value;
            target.value = '';
            if (selectedValue === '') return;
            const selectedItem = items.find(item => item.key === selectedValue);
            if (!selectedItem?.downloadUrl) return;
            this._openDownloadUrl(selectedItem.downloadUrl);
          }}
        >
          <option value="">{placeholder}</option>
          {items.map(item => (
            <option key={item.key} value={item.key} disabled={!item.downloadUrl}>
              {item.label}
            </option>
          ))}
        </select>
      </span>
    );
  }

  private _normalizeDownloadItem(
    item: IFilePreviewItem,
    index: number,
  ): ITableCellFileDownloadItem {
    return {
      key: `${String(item.id)}:${index}`,
      label: this._formatFileLabel(item),
      downloadUrl: this._resolveDownloadUrl(item),
    };
  }

  private _resolveSummaryLabel(item: IFilePreviewItem, fallbackValue: unknown): string {
    return (
      (item.filename ?? this._stringifyFallbackValue(fallbackValue)) || this._formatFileId(item)
    );
  }

  private _resolveSelectPlaceholder(label: string, count: number): string {
    return `${label} +${count - 1}`;
  }

  private _formatFileLabel(item: IFilePreviewItem): string {
    return item.filename ?? this._formatFileId(item);
  }

  private _formatFileId(item: IFilePreviewItem): string {
    return `#${String(item.id)}`;
  }

  private _stringifyFallbackValue(value: unknown): string {
    if (typeof value === 'string') return value;
    if (typeof value === 'number' || typeof value === 'bigint' || typeof value === 'boolean') {
      return String(value);
    }
    return '';
  }

  private _openDownloadUrl(downloadUrl: string) {
    const anchor = globalThis.document?.createElement('a');
    if (!anchor) {
      globalThis.open?.(downloadUrl, '_blank');
      return;
    }
    anchor.href = downloadUrl;
    anchor.target = '_blank';
    anchor.rel = 'noreferrer';
    anchor.click();
  }

  private _resolveDownloadUrl(item: IFilePreviewItem): string | undefined {
    return resolveFileDownloadUrl(item.downloadUrl, this.sys.config.api.baseURL);
  }
}
