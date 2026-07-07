import type { IResourceTableCellOptionsBase } from 'zova-module-a-openapi';
import type {
  IJsxRenderContextTableCell,
  ITableCellRender,
  NextTableCellRender,
} from 'zova-module-a-table';

import { BeanBase } from 'zova';
import { TableCell } from 'zova-module-a-table';

import {
  inferFileRelationName,
  resolveFileDownloadUrl,
  summarizeFileRelationPreviewValue,
} from '../lib/index.js';

declare module 'zova-module-a-openapi' {
  export interface IResourceTableCellRecord {
    'basic-file:file'?: ITableCellOptionsFile;
  }
}

export interface ITableCellOptionsFile extends IResourceTableCellOptionsBase {
  relationName?: string;
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
    const preview = summarizeFileRelationPreviewValue(relationValue);
    const item = preview.item;
    const label = item?.filename ?? value;
    const downloadUrl = item?.downloadUrl
      ? resolveFileDownloadUrl(item.downloadUrl, this.sys.config.api.baseURL)
      : undefined;
    const contentNode = (
      <span class="inline-flex min-w-0 items-center gap-2">
        <span class="truncate">{label}</span>
        {preview.count > 1 && (
          <span class="badge badge-sm border-0 whitespace-nowrap px-2 badge-neutral text-neutral-content">
            +{preview.count - 1}
          </span>
        )}
      </span>
    );
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
}
