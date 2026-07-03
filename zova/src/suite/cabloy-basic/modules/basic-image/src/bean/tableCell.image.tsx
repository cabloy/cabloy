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
  items: IImagePreviewItem[];
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
    if (!item || !previewUrl) return item?.filename ?? value;
    const imageNode = this._renderPreviewImage(options, item, previewUrl);
    const contentNode = this._renderPreviewWithBadge(imageNode, preview.count);
    return this._renderPreviewTrigger(contentNode, preview);
  }

  private _renderPreviewTrigger(contentNode: VNode, preview: IImagePreviewSummary): VNode {
    return (
      <button
        type="button"
        class="group inline-flex min-w-0 cursor-zoom-in items-center gap-2 rounded-box border-0 bg-transparent p-0 text-left align-middle"
        title={this._getPreviewTitle(preview)}
        onClick={event => {
          event.preventDefault();
          event.stopPropagation();
          this._openPreviewDialog(preview);
        }}
      >
        {contentNode}
      </button>
    );
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
        class={classes(
          'overflow-hidden rounded-box bg-base-200 shrink-0 transition duration-150 group-hover:shadow-md group-hover:ring-2 group-hover:ring-primary/30',
          options.class,
        )}
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

  private _openPreviewDialog(preview: IImagePreviewSummary) {
    if (preview.items.length === 0) return;
    this.$appModal.dialog(
      {
        title: this._getPreviewTitle(preview),
        slotDefault: () => this._renderPreviewDialogBody(preview),
      },
      {
        maxWidth: 960,
        maxHeight: 'calc(100vh - 2rem)',
        closeOnBackdrop: true,
        closeOnEscape: true,
        showCloseButton: true,
      },
    );
  }

  private _renderPreviewDialogBody(preview: IImagePreviewSummary): VNode {
    const leadItem = preview.item ?? preview.items[0];
    const leadPreviewUrl = leadItem ? this._resolvePreviewUrl(leadItem.url) : undefined;
    return (
      <div class="space-y-4">
        {leadPreviewUrl && (
          <div class="overflow-hidden rounded-box bg-base-200 p-2">
            <img
              class="mx-auto max-h-[70vh] w-full object-contain"
              src={leadPreviewUrl}
              alt={leadItem?.filename ?? 'image'}
            />
          </div>
        )}
        {preview.items.length > 1 && (
          <div class="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {preview.items.map((item, index) => this._renderPreviewDialogItem(item, index))}
          </div>
        )}
      </div>
    );
  }

  private _renderPreviewDialogItem(item: IImagePreviewItem, index: number): VNode {
    const previewUrl = this._resolvePreviewUrl(item.url);
    return (
      <div key={`${item.url}-${index}`} class="space-y-2 rounded-box bg-base-200 p-2">
        <div class="aspect-square overflow-hidden rounded-box bg-base-100">
          <img
            class="h-full w-full object-cover"
            src={previewUrl}
            alt={item.filename ?? `image-${index + 1}`}
          />
        </div>
        {!!item.filename && (
          <div class="truncate text-sm text-base-content/70">{item.filename}</div>
        )}
      </div>
    );
  }

  private _getPreviewTitle(preview: IImagePreviewSummary) {
    const filename = preview.item?.filename;
    if (preview.count <= 1) {
      return filename ?? this.scope.locale.PreviewImage();
    }
    return filename
      ? `${filename} (+${preview.count - 1})`
      : `${this.scope.locale.PreviewImage()} (+${preview.count - 1})`;
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
    if (!relationName) return { count: 0, items: [] };
    const relationValue = renderContext.cellContext.row.original[relationName];
    if (Array.isArray(relationValue)) return this._summarizeRelationItems(relationValue);
    if (!relationValue?.url) return { count: 0, items: [] };
    return { count: 1, item: relationValue, items: [relationValue] };
  }

  private _summarizeRelationItems(relationItems: IImagePreviewItem[]): IImagePreviewSummary {
    const items: IImagePreviewItem[] = [];
    for (const relationItem of relationItems) {
      if (!relationItem?.url) continue;
      items.push(relationItem);
    }
    return { count: items.length, item: items[0], items };
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
      if (!value) return { count: 0, items: [] };
      const item = { url: String(value) };
      return { count: 1, item, items: [item] };
    }
    const items: IImagePreviewItem[] = [];
    for (const valueItem of value) {
      if (!valueItem) continue;
      items.push({ url: String(valueItem) });
    }
    return { count: items.length, item: items[0], items };
  }

  private _resolvePreviewUrl(url: string) {
    if (!url.startsWith('/api/')) return url;
    const baseURL = this.sys.config.api.baseURL;
    if (!baseURL) return url;
    return `${baseURL.replace(/\/$/, '')}${url}`;
  }
}
