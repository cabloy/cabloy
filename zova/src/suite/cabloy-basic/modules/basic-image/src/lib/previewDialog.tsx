import type { VNode } from 'vue';

import { classes } from 'typestyle';
import { nextTick, reactive } from 'vue';

import { IImagePreviewItem, resolveImagePreviewUrl } from './preview.js';

interface IImagePreviewDialogState {
  activeIndex: number;
}

interface IImagePreviewDialogAppModal {
  dialog(
    options?: {
      title?: string;
      slotDefault?: () => VNode;
    },
    dialogOptions?: {
      maxWidth?: number | string;
      maxHeight?: number | string;
      closeOnBackdrop?: boolean;
      closeOnEscape?: boolean;
      showCloseButton?: boolean;
    },
  ): unknown;
}

export interface IOpenImagePreviewDialogOptions {
  appModal: IImagePreviewDialogAppModal;
  title: string;
  items: IImagePreviewItem[];
  initialIndex?: number;
  baseURL?: string;
}

export function openImagePreviewDialog(options: IOpenImagePreviewDialogOptions) {
  const items = options.items.filter(item => !!item.url);
  if (items.length === 0) return;
  const dialogState = reactive<IImagePreviewDialogState>({
    activeIndex: _normalizePreviewDialogIndex(items.length, options.initialIndex),
  });
  const bodyRefHolder: { value?: HTMLElement } = {};
  options.appModal.dialog(
    {
      title: options.title,
      slotDefault: () =>
        _renderPreviewDialogBody(items, dialogState, bodyRefHolder, options.baseURL),
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

function _renderPreviewDialogBody(
  items: IImagePreviewItem[],
  dialogState: IImagePreviewDialogState,
  bodyRefHolder: { value?: HTMLElement },
  baseURL?: string,
): VNode {
  const leadItem = items[dialogState.activeIndex] ?? items[0];
  const leadPreviewUrl = resolveImagePreviewUrl(leadItem?.url, baseURL);
  return (
    <div
      ref={ref => {
        const element = ref as HTMLElement | null;
        if (!element) return;
        const isNewElement = bodyRefHolder.value !== element;
        bodyRefHolder.value = element;
        if (isNewElement) {
          nextTick(() => {
            element.focus();
          });
        }
      }}
      class="space-y-4 focus:outline-none"
      tabindex={0}
      onKeydown={event => {
        _handlePreviewDialogKeydown(event, items.length, dialogState);
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
              {_getPreviewCounterText(items.length, dialogState.activeIndex)}
            </div>
          )}
        </div>
      )}
      {items.length > 1 && (
        <div class="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {items.map((item, index) =>
            _renderPreviewDialogItem(
              item,
              index,
              index === dialogState.activeIndex,
              dialogState,
              baseURL,
            ),
          )}
        </div>
      )}
    </div>
  );
}

function _renderPreviewDialogItem(
  item: IImagePreviewItem,
  index: number,
  active: boolean,
  dialogState: IImagePreviewDialogState,
  baseURL?: string,
): VNode {
  const previewUrl = resolveImagePreviewUrl(item.url, baseURL);
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
      {!!item.filename && <div class="truncate text-sm text-base-content/70">{item.filename}</div>}
    </button>
  );
}

function _handlePreviewDialogKeydown(
  event: KeyboardEvent,
  count: number,
  dialogState: IImagePreviewDialogState,
) {
  if (count <= 1) return;
  if (event.key === 'ArrowLeft') {
    event.preventDefault();
    dialogState.activeIndex = _movePreviewDialogSelection(count, dialogState.activeIndex, -1);
    return;
  }
  if (event.key === 'ArrowRight') {
    event.preventDefault();
    dialogState.activeIndex = _movePreviewDialogSelection(count, dialogState.activeIndex, 1);
  }
}

function _movePreviewDialogSelection(count: number, activeIndex: number, step: number) {
  return (activeIndex + step + count) % count;
}

function _getPreviewCounterText(count: number, activeIndex: number) {
  return `${activeIndex + 1} / ${count}`;
}

function _normalizePreviewDialogIndex(count: number, initialIndex?: number) {
  if (!count) return 0;
  if (initialIndex === undefined) return 0;
  if (initialIndex < 0) return 0;
  if (initialIndex >= count) return count - 1;
  return initialIndex;
}
