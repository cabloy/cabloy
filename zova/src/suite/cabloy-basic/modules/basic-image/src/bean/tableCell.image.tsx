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

import type { IImagePreviewItem } from '../lib/index.js';

import {
  buildImagePreviewTitle,
  collectImageRelationPreviewItems,
  collectImageUrlPreviewItems,
  inferImageRelationName,
  openImagePreviewDialog,
  resolveImagePreviewUrl,
  summarizeImageRelationPreviewValue,
  summarizeImageUrlPreviewValue,
} from '../lib/index.js';

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

interface IImagePreviewSource {
  kind: 'relation' | 'url';
  value: unknown;
}

interface IImagePreviewSummary {
  count: number;
  item?: IImagePreviewItem;
  source: IImagePreviewSource;
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
    const previewTitle = this._getPreviewTitle(renderContext, preview);
    const imageNode = this._renderPreviewImage(options, item, previewUrl);
    const contentNode = this._renderPreviewWithBadge(imageNode, preview.count);
    return this._renderPreviewTrigger(contentNode, preview, previewTitle);
  }

  private _renderPreviewTrigger(
    contentNode: VNode,
    preview: IImagePreviewSummary,
    previewTitle: string,
  ): VNode {
    return (
      <button
        type="button"
        class="group inline-flex min-w-0 cursor-zoom-in items-center gap-2 rounded-box border-0 bg-transparent p-0 text-left align-middle"
        title={previewTitle}
        onClick={event => {
          event.preventDefault();
          event.stopPropagation();
          this._openPreviewDialog(preview, previewTitle);
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
    const passportCode = this._getDeliveryPassportCode();
    const src = passportCode ? this._resolvePreviewUrl(previewUrl, passportCode) : '';
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
          alt={item.filename ?? 'image'}
          src={src}
        />
      </div>
    );
  }

  private async _openPreviewDialog(preview: IImagePreviewSummary, previewTitle: string) {
    const passportCode = await this._ensureDeliveryPassportCode();
    const items = this._resolveDialogItems(preview).map(item => ({
      ...item,
      url: this._resolvePreviewUrl(item.url, passportCode),
    }));
    openImagePreviewDialog({
      appModal: this.$appModal,
      title: previewTitle,
      items: items.filter(item => !!item.url).map(item => ({ ...item, url: item.url! })),
      baseURL: this.sys.config.api.baseURL,
    });
  }

  private _getPreviewTitle(
    renderContext: IJsxRenderContextTableCell,
    preview: IImagePreviewSummary,
  ) {
    return buildImagePreviewTitle(this._getPreviewFieldTitle(renderContext), preview.count, () =>
      this.scope.locale.PreviewImage(),
    );
  }

  private _getPreviewFieldTitle(renderContext: IJsxRenderContextTableCell) {
    return renderContext.$celScope.property?.title ?? renderContext.$celScope.name;
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
    const relationName = inferImageRelationName(renderContext.$celScope.name, options.relationName);
    const relationValue = relationName
      ? renderContext.cellContext.row.original[relationName]
      : undefined;
    const { count, item } = summarizeImageRelationPreviewValue(relationValue);
    return {
      count,
      item,
      source: { kind: 'relation', value: relationValue },
    };
  }

  private _normalizeUrlPreview(value: unknown): IImagePreviewSummary {
    const { count, item } = summarizeImageUrlPreviewValue(value);
    return {
      count,
      item,
      source: { kind: 'url', value },
    };
  }

  private _resolveDialogItems(preview: IImagePreviewSummary): IImagePreviewItem[] {
    if (preview.source.kind === 'relation') {
      return collectImageRelationPreviewItems(preview.source.value);
    }
    return collectImageUrlPreviewItems(preview.source.value);
  }

  private _getDeliveryPassportCode() {
    const apiPrefix = this.sys.config.api.prefix ?? '/api';
    return this.$passport.getFreshTempAuthToken({
      path: `${apiPrefix}/image/delivery`,
      pathMatch: 'prefix',
      staleTime: 30 * 1000,
    });
  }

  private async _ensureDeliveryPassportCode() {
    const apiPrefix = this.sys.config.api.prefix ?? '/api';
    return await this.$passport.ensureFreshTempAuthToken({
      path: `${apiPrefix}/image/delivery`,
      pathMatch: 'prefix',
      staleTime: 30 * 1000,
    });
  }

  private _resolvePreviewUrl(url: string, passportCode?: string) {
    return resolveImagePreviewUrl(url, this.sys.config.api.baseURL, passportCode);
  }
}
