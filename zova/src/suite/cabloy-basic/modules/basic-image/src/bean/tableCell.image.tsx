import type { VNode } from 'vue';
import type { IResourceTableCellOptionsBase } from 'zova-module-a-openapi';
import type {
  IJsxRenderContextTableCell,
  ITableCellRender,
  NextTableCellRender,
} from 'zova-module-a-table';

import { classes } from 'typestyle';
import { BeanBase } from 'zova';
import { TableCell } from 'zova-module-a-table';

declare module 'zova-module-a-openapi' {
  export interface IResourceTableCellRecord {
    'basic-image:image'?: ITableCellOptionsImage;
  }
}

export interface ITableCellOptionsImage extends IResourceTableCellOptionsBase {
  size?: number;
  fit?: 'cover' | 'contain';
  relationName?: string;
}

interface IImagePreviewItem {
  url: string;
  filename?: string;
}

interface IImagePreviewSummary {
  count: number;
  item?: IImagePreviewItem;
}

@TableCell<ITableCellOptionsImage>({
  size: 40,
  fit: 'cover',
})
export class TableCellImage extends BeanBase implements ITableCellRender {
  render(
    options: ITableCellOptionsImage,
    renderContext: IJsxRenderContextTableCell,
    next: NextTableCellRender,
  ) {
    const value = next();
    const preview = this._resolvePreviewSummary(options, renderContext, value);
    const item = preview.item;
    const previewUrl = item ? this._resolvePreviewUrl(item.url) : undefined;
    if (!previewUrl) return item?.filename ?? value;
    const imageNode = this._renderPreviewImage(options, item!, previewUrl);
    return this._renderPreviewWithBadge(imageNode, preview.count);
  }

  private _renderPreviewWithBadge(imageNode: VNode, count: number): VNode {
    if (count <= 1) return imageNode;
    return (
      <div class="flex items-center gap-2 min-w-0">
        {imageNode}
        <span class="badge badge-sm font-medium border-0 whitespace-nowrap px-2 badge-neutral text-neutral-content">
          +{count - 1}
        </span>
      </div>
    );
  }

  private _renderPreviewImage(
    options: ITableCellOptionsImage,
    item: IImagePreviewItem,
    previewUrl: string,
  ): VNode {
    const size = options.size ?? 40;
    const style = {
      ...(options.style as any),
      width: `${size}px`,
      height: `${size}px`,
    } as any;
    return (
      <div
        class={classes('overflow-hidden rounded-box bg-base-200 shrink-0', options.class)}
        style={style}
      >
        <img
          class="h-full w-full object-cover"
          style={{ objectFit: options.fit ?? 'cover' }}
          src={previewUrl}
          alt={item.filename ?? 'image'}
        />
      </div>
    );
  }

  private _resolvePreviewSummary(
    options: ITableCellOptionsImage,
    renderContext: IJsxRenderContextTableCell,
    value: unknown,
  ): IImagePreviewSummary {
    const relationPreview = this._getRelationPreviewSummary(options, renderContext);
    if (relationPreview.count) return relationPreview;
    return this._normalizeUrlPreview(value);
  }

  private _getRelationPreviewSummary(
    options: ITableCellOptionsImage,
    renderContext: IJsxRenderContextTableCell,
  ): IImagePreviewSummary {
    const relationName = this._getRelationName(options, renderContext.$celScope.name);
    if (!relationName) return { count: 0 };
    const relationValue = renderContext.cellContext.row.original[relationName];
    if (Array.isArray(relationValue)) return this._summarizeRelationItems(relationValue);
    if (!relationValue?.url) return { count: 0 };
    return { count: 1, item: relationValue };
  }

  private _summarizeRelationItems(relationItems: IImagePreviewItem[]): IImagePreviewSummary {
    let item: IImagePreviewItem | undefined;
    let count = 0;
    for (const relationItem of relationItems) {
      if (!relationItem?.url) continue;
      item ??= relationItem;
      count++;
    }
    return { count, item };
  }

  private _getRelationName(options: ITableCellOptionsImage, fieldName: string) {
    if (options.relationName) return options.relationName;
    if (fieldName.endsWith('Ids')) {
      return `${fieldName.slice(0, -3)}s`;
    }
    if (fieldName.endsWith('Id')) {
      return fieldName.slice(0, -2);
    }
    return undefined;
  }

  private _normalizeUrlPreview(value: unknown): IImagePreviewSummary {
    if (!Array.isArray(value)) {
      return value ? { count: 1, item: { url: String(value) } } : { count: 0 };
    }
    let item: IImagePreviewItem | undefined;
    let count = 0;
    for (const valueItem of value) {
      if (!valueItem) continue;
      item ??= { url: String(valueItem) };
      count++;
    }
    return { count, item };
  }

  private _resolvePreviewUrl(url: string) {
    if (!url.startsWith('/api/')) return url;
    const baseURL = this.sys.config.api.baseURL;
    if (!baseURL) return url;
    return `${baseURL.replace(/\/$/, '')}${url}`;
  }
}
