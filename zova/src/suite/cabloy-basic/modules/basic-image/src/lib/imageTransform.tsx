import type { CropperResult } from 'vue-advanced-cropper';

import { nextTick, reactive } from 'vue';
import { CircleStencil, Cropper, RectangleStencil } from 'vue-advanced-cropper';
import { ClientOnly } from 'zova';

import type { IImageTransformOptions } from '../types/image.js';
import 'vue-advanced-cropper/dist/style.css';

export interface IImageResizeOptions {
  width?: number;
  height?: number;
  fit?: 'scale-down' | 'contain' | 'cover' | 'crop' | 'pad';
  background?: string;
  quality?: number;
  format?: IImageTransformOptions['format'];
}

export interface IImageCropDialogLabels {
  title: string;
  adjust: string;
  cancel: string;
  apply: string;
}

export interface IImageCropDialogOptions {
  appModal: {
    dialog(options: Record<string, any>, config?: Record<string, any>): unknown;
  };
  labels: IImageCropDialogLabels;
  aspectRatio?: number;
  shape?: 'rect' | 'round';
}

export interface IPrepareImageFileOptions {
  appModal?: IImageCropDialogOptions['appModal'];
  crop?: Omit<IImageCropDialogOptions, 'appModal'>;
  resize?: IImageResizeOptions;
}

export async function prepareImageFile(file: File, options: IPrepareImageFileOptions) {
  if (!process.env.CLIENT) return file;
  let canvas: HTMLCanvasElement | undefined;
  if (options.crop && options.appModal) {
    canvas = await openImageCropDialog(file, {
      appModal: options.appModal,
      ...options.crop,
    });
    if (!canvas) return undefined;
  }
  const resizeOptions = options.resize;
  if (!canvas && !resizeOptions) return file;
  const sourceCanvas = canvas ?? (await createCanvasFromFile(file));
  const targetCanvas = resizeCanvas(sourceCanvas, resizeOptions);
  return await canvasToFile(targetCanvas, file, resizeOptions);
}

export async function openImageCropDialog(
  file: File,
  options: IImageCropDialogOptions,
): Promise<HTMLCanvasElement | undefined> {
  const src = URL.createObjectURL(file);
  try {
    return await new Promise<HTMLCanvasElement | undefined>(resolve => {
      let settled = false;
      let cropperResult: CropperResult | undefined;
      let cropperRef: { getResult?: () => CropperResult } | undefined;
      const dialogState = reactive({ applying: false });
      const dialog = options.appModal.dialog(
        {
          title: options.labels.title,
          slotDefault: () => (
            <ClientOnly>
              <div class="space-y-4">
                <div class="h-105 overflow-hidden rounded-box bg-base-200">
                  <Cropper
                    ref={ref => {
                      cropperRef = ref as any;
                      if (cropperRef?.getResult) {
                        cropperResult = cropperRef.getResult();
                      }
                    }}
                    class="h-full w-full"
                    src={src}
                    canvas={true}
                    debounce={0}
                    stencilComponent={options.shape === 'round' ? CircleStencil : RectangleStencil}
                    stencilProps={{ aspectRatio: options.aspectRatio }}
                    imageRestriction="stencil"
                    onReady={() => {
                      cropperResult = cropperRef?.getResult?.();
                    }}
                    onChange={(result: CropperResult) => {
                      cropperResult = result;
                    }}
                  ></Cropper>
                </div>
                <p class="text-sm text-base-content/70">{options.labels.adjust}</p>
              </div>
            </ClientOnly>
          ),
          slotActions: (modal: { close: () => void }) => (
            <>
              <button
                type="button"
                class="btn btn-ghost"
                onClick={() => {
                  if (settled) return;
                  settled = true;
                  modal.close();
                  resolve(undefined);
                }}
              >
                {options.labels.cancel}
              </button>
              <button
                type="button"
                class={dialogState.applying ? 'btn btn-primary btn-disabled' : 'btn btn-primary'}
                disabled={dialogState.applying}
                onClick={() => {
                  if (settled || dialogState.applying) return;
                  dialogState.applying = true;
                  void nextTick(async () => {
                    if (settled) return;
                    const canvas = await waitForCropCanvas(
                      () => cropperResult?.canvas ?? cropperRef?.getResult?.()?.canvas,
                    );
                    if (!canvas || settled) {
                      dialogState.applying = false;
                      return;
                    }
                    settled = true;
                    modal.close();
                    resolve(canvas);
                  });
                }}
              >
                {options.labels.apply}
              </button>
            </>
          ),
          onClose: () => {
            if (settled) return;
            settled = true;
            resolve(undefined);
          },
        },
        {
          maxWidth: 960,
          showCloseButton: true,
          closeOnBackdrop: false,
        },
      );
      void dialog;
    });
  } finally {
    URL.revokeObjectURL(src);
  }
}

async function waitForCropCanvas(
  getCanvas: () => HTMLCanvasElement | undefined,
  attempts = 10,
): Promise<HTMLCanvasElement | undefined> {
  for (let index = 0; index < attempts; index++) {
    const canvas = getCanvas();
    if (canvas) return canvas;
    await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
  }
  return undefined;
}

export async function createCanvasFromFile(file: File) {
  const src = URL.createObjectURL(file);
  try {
    return await createCanvasFromUrl(src);
  } finally {
    URL.revokeObjectURL(src);
  }
}

export async function createCanvasFromUrl(src: string) {
  const image = await loadImage(src);
  const canvas = document.createElement('canvas');
  canvas.width = image.naturalWidth || image.width;
  canvas.height = image.naturalHeight || image.height;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('image canvas is unavailable');
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  return canvas;
}

export function resizeCanvas(sourceCanvas: HTMLCanvasElement, resizeOptions?: IImageResizeOptions) {
  if (!resizeOptions?.width && !resizeOptions?.height) return sourceCanvas;
  const sourceWidth = sourceCanvas.width;
  const sourceHeight = sourceCanvas.height;
  const fallbackRatio = sourceWidth / Math.max(sourceHeight, 1);
  const targetWidth =
    resizeOptions.width ?? Math.round((resizeOptions.height ?? sourceHeight) * fallbackRatio);
  const targetHeight =
    resizeOptions.height ?? Math.round(targetWidth / Math.max(fallbackRatio, 0.0001));
  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const context = canvas.getContext('2d');
  if (!context) return sourceCanvas;
  if (resizeOptions.background) {
    context.fillStyle = resizeOptions.background;
    context.fillRect(0, 0, targetWidth, targetHeight);
  }
  const fit = resizeOptions.fit ?? 'cover';
  if (fit === 'cover' || fit === 'crop') {
    const scale = Math.max(targetWidth / sourceWidth, targetHeight / sourceHeight);
    const width = sourceWidth * scale;
    const height = sourceHeight * scale;
    const left = (targetWidth - width) / 2;
    const top = (targetHeight - height) / 2;
    context.drawImage(sourceCanvas, left, top, width, height);
    return canvas;
  }
  const scaleContain = Math.min(targetWidth / sourceWidth, targetHeight / sourceHeight);
  const scale = fit === 'scale-down' ? Math.min(1, scaleContain) : scaleContain;
  const width = sourceWidth * scale;
  const height = sourceHeight * scale;
  const left = (targetWidth - width) / 2;
  const top = (targetHeight - height) / 2;
  context.drawImage(sourceCanvas, left, top, width, height);
  return canvas;
}

export async function canvasToFile(
  canvas: HTMLCanvasElement,
  file: File,
  resizeOptions?: IImageResizeOptions,
) {
  const mimeType = resolveMimeType(file.type, resizeOptions?.format);
  const quality = resolveQuality(resizeOptions?.quality);
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      result => {
        if (!result) {
          reject(new Error('image encoding failed'));
          return;
        }
        resolve(result);
      },
      mimeType,
      quality,
    );
  });
  return new File([blob], replaceExtension(file.name, mimeType), {
    type: mimeType,
    lastModified: Date.now(),
  });
}

export function resolveMimeType(
  fileType: string | undefined,
  format?: IImageTransformOptions['format'],
) {
  if (format === 'jpeg') return 'image/jpeg';
  if (format === 'png') return 'image/png';
  if (format === 'webp') return 'image/webp';
  if (format === 'avif') return 'image/avif';
  if (fileType && fileType.startsWith('image/')) return fileType;
  return 'image/jpeg';
}

export function resolveQuality(quality?: number) {
  if (quality === undefined) return 0.92;
  if (quality > 1) return Math.min(quality / 100, 1);
  return quality;
}

export function replaceExtension(filename: string, mimeType: string) {
  const ext =
    mimeType === 'image/png'
      ? '.png'
      : mimeType === 'image/webp'
        ? '.webp'
        : mimeType === 'image/avif'
          ? '.avif'
          : '.jpg';
  const index = filename.lastIndexOf('.');
  if (index === -1) return `${filename}${ext}`;
  return `${filename.slice(0, index)}${ext}`;
}

export function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('image loading failed'));
    image.src = src;
  });
}
