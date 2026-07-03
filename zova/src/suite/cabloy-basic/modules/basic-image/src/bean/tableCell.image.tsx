import type { VNode } from 'vue';
import type { IResourceTableCellOptionsBase } from 'zova-module-a-openapi';
import type {
  IJsxRenderContextTableCell,
  ITableCellRender,
  NextTableCellRender,
} from 'zova-module-a-table';

import { classes } from 'typestyle';
import { reactive } from 'vue';
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

interface IImagePreviewSource {
  kind: 'relation' | 'url';
  value: unknown;
}

interface IImagePreviewSummary {
  count: number;
  item?: IImagePreviewItem;
  source: IImagePreviewSource;
}

interface IImagePreviewDialogState {
  activeIndex: number;
}

@TableCell<ITableCellOptionsImage>({
  size: 40,
  fit: 'cover',
})
export class TableCellImage extends BeanBase implements ITableCellRender {
  private previewDialogBodyRef: HTMLElement | undefined;

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
    const items = this._resolveDialogItems(preview);
    if (items.length === 0) return;
    const dialogState = reactive<IImagePreviewDialogState>({
      activeIndex: 0,
    });
    this.$appModal.dialog(
      {
        title: this._getPreviewTitle(preview),
        slotDefault: () => this._renderPreviewDialogBody(items, dialogState),
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

  private _renderPreviewDialogBody(
    items: IImagePreviewItem[],
    dialogState: IImagePreviewDialogState,
  ): VNode {
    const leadItem = items[dialogState.activeIndex] ?? items[0];
    const leadPreviewUrl = leadItem ? this._resolvePreviewUrl(leadItem.url) : undefined;
    return (
      <div
        ref={ref => {
          const element = ref as HTMLElement | null;
          if (!element) return;
          const isNewElement = this.previewDialogBodyRef !== element;
          this.previewDialogBodyRef = element;
          if (isNewElement) {
            element.focus();
          }
        }}
        class="space-y-4 focus:outline-none"
        tabindex={0}
        onKeydown={event => {
          this._handlePreviewDialogKeydown(event, items, dialogState);
        }}
      >
        {leadPreviewUrl && (
          <div class="overflow-hidden rounded-box bg-base-200 p-2">
            <img
              class="mx-auto max-h-[70vh] w-full object-contain"
              src={leadPreviewUrl}
              alt={leadItem?.filename ?? 'image'}
            />
          </div>
        )}
        {(!!leadItem?.filename || items.length > 1) && (
          <div class="flex items-center justify-between gap-3">
            <div class="min-w-0 text-sm font-medium text-base-content/70">
              {!!leadItem?.filename && <div class="truncate">{leadItem.filename}</div>}
            </div>
            {items.length > 1 && (
              <div class="shrink-0 text-sm font-medium text-base-content/60">
                {this._getPreviewCounterText(items.length, dialogState.activeIndex)}
              </div>
            )}
          </div>
        )}
        {items.length > 1 && (
          <div class="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {items.map((item, index) =>
              this._renderPreviewDialogItem(
                item,
                index,
                index === dialogState.activeIndex,
                dialogState,
              ),
            )}
          </div>
        )}
      </div>
    );
  }

  private _renderPreviewDialogItem(
    item: IImagePreviewItem,
    index: number,
    active: boolean,
    dialogState: IImagePreviewDialogState,
  ): VNode {
    const previewUrl = this._resolvePreviewUrl(item.url);
    return (
      <button
        key={`${item.url}-${index}`}
        type="button"
        class={classes(
          'space-y-2 rounded-box bg-base-200 p-2 text-left transition duration-150',
          active && 'ring-2 ring-primary shadow-md',
          !active && 'hover:shadow-sm hover:ring-1 hover:ring-base-300',
        )}
        title={item.filename ?? `image-${index + 1}`}
        onClick={() => {
          dialogState.activeIndex = index;
        }}
      >
        <div class="aspect-square overflow-hidden rounded-box bg-base-100">
          <img
            class="h-full w-full object-cover"
            loading="lazy"
            src={previewUrl}
            alt={item.filename ?? `image-${index + 1}`}
          />
        </div>
        {!!item.filename && (
          <div class="truncate text-sm text-base-content/70">{item.filename}</div>
        )}
      </button>
    );
  }

  private _handlePreviewDialogKeydown(
    event: KeyboardEvent,
    items: IImagePreviewItem[],
    dialogState: IImagePreviewDialogState,
  ) {
    if (items.length <= 1) return;
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      this._movePreviewDialogSelection(items.length, dialogState, -1);
      return;
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      this._movePreviewDialogSelection(items.length, dialogState, 1);
    }
  }

  private _movePreviewDialogSelection(
    count: number,
    dialogState: IImagePreviewDialogState,
    step: number,
  ) {
    dialogState.activeIndex = (dialogState.activeIndex + step + count) % count;
  }

  private _getPreviewCounterText(count: number, activeIndex: number) {
    return `${activeIndex + 1} / ${count}`;
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
    const relationValue = relationName
      ? renderContext.cellContext.row.original[relationName]
      : undefined;
    const { count, item } = this._summarizeRelationValue(relationValue);
    return {
      count,
      item,
      source: { kind: 'relation', value: relationValue },
    };
  }

  private _summarizeRelationValue(relationValue: unknown): {
    count: number;
    item?: IImagePreviewItem;
  } {
    if (!Array.isArray(relationValue)) {
      if (!this._isPreviewItem(relationValue)) return { count: 0, item: undefined };
      return { count: 1, item: relationValue };
    }
    let count = 0;
    let item: IImagePreviewItem | undefined;
    for (const relationItem of relationValue) {
      if (!this._isPreviewItem(relationItem)) continue;
      count += 1;
      if (!item) item = relationItem;
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
      if (!value) {
        return {
          count: 0,
          source: { kind: 'url', value },
        };
      }
      const item = { url: String(value) };
      return {
        count: 1,
        item,
        source: { kind: 'url', value },
      };
    }
    let count = 0;
    let item: IImagePreviewItem | undefined;
    for (const valueItem of value) {
      if (!valueItem) continue;
      count += 1;
      if (!item) item = { url: String(valueItem) };
    }
    return {
      count,
      item,
      source: { kind: 'url', value },
    };
  }

  private _resolveDialogItems(preview: IImagePreviewSummary): IImagePreviewItem[] {
    if (preview.source.kind === 'relation') {
      return this._collectRelationItems(preview.source.value);
    }
    return this._collectUrlItems(preview.source.value);
  }

  private _collectRelationItems(value: unknown): IImagePreviewItem[] {
    if (!Array.isArray(value)) {
      if (!this._isPreviewItem(value)) return [];
      return [value];
    }
    const items: IImagePreviewItem[] = [];
    for (const relationItem of value) {
      if (!this._isPreviewItem(relationItem)) continue;
      items.push(relationItem);
    }
    return items;
  }

  private _collectUrlItems(value: unknown): IImagePreviewItem[] {
    if (!Array.isArray(value)) {
      if (!value) return [];
      return [{ url: String(value) }];
    }
    const items: IImagePreviewItem[] = [];
    for (const valueItem of value) {
      if (!valueItem) continue;
      items.push({ url: String(valueItem) });
    }
    return items;
  }

  private _isPreviewItem(value: unknown): value is IImagePreviewItem {
    if (!value || typeof value !== 'object') return false;
    if (!('url' in value)) return false;
    return typeof value.url === 'string' && !!value.url;
  }

  private _resolvePreviewUrl(url: string) {
    if (!url.startsWith('/api/')) return url;
    const baseURL = this.sys.config.api.baseURL;
    if (!baseURL) return url;
    return `${baseURL.replace(/\/$/, '')}${url}`;
  }
}
