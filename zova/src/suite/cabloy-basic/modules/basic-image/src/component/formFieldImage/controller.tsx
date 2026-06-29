import type { IComponentOptions } from 'zova';
import type { ControllerFormField, IFormFieldComponentOptions } from 'zova-module-a-form';
import type { IResourceFormFieldOptionsBase } from 'zova-module-a-openapi';

import { classes } from 'typestyle';
import { CircleStencil, Cropper, RectangleStencil } from 'vue-advanced-cropper';
import { BeanControllerBase, ClientOnly } from 'zova';
import { Controller } from 'zova-module-a-bean';
import { ZFormField, ZFormFieldPreset } from 'zova-module-a-form';

import type { IImageTransformOptions } from '../../api/image.js';
import 'vue-advanced-cropper/dist/style.css';

declare module 'zova-module-a-openapi' {
  export interface IResourceFormFieldRecord {
    'basic-image:formFieldImage'?: IResourceFormFieldImageOptions;
  }
}

export interface IResourceFormFieldImageResizeOptions {
  width?: number;
  height?: number;
  fit?: 'scale-down' | 'contain' | 'cover' | 'crop' | 'pad';
  background?: string;
  quality?: number;
  format?: IImageTransformOptions['format'];
}

export interface IResourceFormFieldImageOptions extends IResourceFormFieldOptionsBase {
  multiple?: boolean;
  maxCount?: number;
  accept?: string | string[];
  mimeTypes?: string[];
  extensions?: string[];
  maxSize?: number;
  minSize?: number;
  placeholder?: string;
  enableCrop?: boolean;
  cropAspectRatio?: number;
  cropShape?: 'rect' | 'round';
  resize?: IResourceFormFieldImageResizeOptions;
}

export interface ControllerFormFieldImageProps extends IFormFieldComponentOptions {
  options?: IResourceFormFieldImageOptions;
}

interface IImagePreviewItem {
  url: string;
  filename?: string;
  width?: number;
  height?: number;
}

@Controller()
export class ControllerFormFieldImage extends BeanControllerBase {
  static $propsDefault = {
    options: {
      accept: ['image/png', 'image/jpeg', 'image/webp'],
      maxCount: 1,
      enableCrop: true,
      cropAspectRatio: 1,
      cropShape: 'rect',
      resize: {
        width: 512,
        height: 512,
        fit: 'cover',
        format: 'jpeg',
        quality: 90,
      },
    },
  };

  static $componentOptions: IComponentOptions = { inheritAttrs: false, deepExtendDefault: true };

  fileInputRef?: HTMLInputElement;
  errorMessage?: string;
  isUploading = false;
  currentValue?: string | string[];
  currentOptions: IResourceFormFieldImageOptions = {};
  $$formField?: ControllerFormField;
  uploadedPreviewMap: Record<string, IImagePreviewItem> = {};

  protected async __init__() {}

  protected render() {
    if (this.$props.readonly) {
      return this._renderReadonlyPreset();
    }
    return (
      <ZFormField
        {...this.$props}
        slotDefault={({ propsBucket, props }, $$formField) => {
          this.$$formField = $$formField;
          this.currentValue = propsBucket.value;
          this.currentOptions = propsBucket.options ?? {};
          const items = this._getPreviewItems(propsBucket.value);
          const hasValidationError = !$$formField.field.state.meta.isValid;
          const cardClass = classes(
            'rounded-box border border-base-300 bg-base-100 p-4',
            (hasValidationError || !!this.errorMessage) && 'border-error',
            props.class,
          );
          return (
            <div class={cardClass}>
              <input
                ref={ref => {
                  this.fileInputRef = ref as HTMLInputElement;
                }}
                class="hidden"
                type="file"
                accept={this._getAcceptAttr(propsBucket.options)}
                multiple={!!propsBucket.options?.multiple}
                onChange={event => {
                  void this._handleFileChange(event, propsBucket.disableNotifyChanged);
                }}
              />
              <div class="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  class={classes('btn btn-primary', this.isUploading && 'btn-disabled')}
                  onClick={() => {
                    if (this.isUploading) return;
                    this.fileInputRef?.click();
                  }}
                >
                  {this._getUploadButtonText(items.length)}
                </button>
                {this.isUploading && (
                  <span class="inline-flex items-center gap-2 text-sm text-base-content/70">
                    <span class="loading loading-spinner loading-sm text-primary"></span>
                    {this.scope.locale.Uploading()}
                  </span>
                )}
                {!items.length && !this.isUploading && (
                  <span class="text-sm text-base-content/60">
                    {propsBucket.options?.placeholder ?? this.scope.locale.NoImageSelected()}
                  </span>
                )}
              </div>
              {!!this.errorMessage && <p class="mt-3 text-sm text-error">{this.errorMessage}</p>}
              {!!items.length && (
                <div class="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((item, index) => {
                    return this._renderPreviewCard(
                      item,
                      index,
                      false,
                      propsBucket.disableNotifyChanged,
                    );
                  })}
                </div>
              )}
            </div>
          );
        }}
      ></ZFormField>
    );
  }

  private _renderReadonlyPreset() {
    const value = this._normalizeOutputValue(this.$props.value);
    if (!value.displayValue) {
      return (
        <ZFormFieldPreset
          {...this.$props}
          render="basic-input:formFieldInput"
          options={{ value: this.scope.locale.NoImageSelected() }}
        ></ZFormFieldPreset>
      );
    }
    return (
      <ZFormField
        {...this.$props}
        slotDefault={({ propsBucket, props }) => {
          const items = this._getPreviewItems(propsBucket.value);
          return <div class={props.class}>{this._renderReadonlyItems(items)}</div>;
        }}
      ></ZFormField>
    );
  }

  private _renderReadonlyItems(items: IImagePreviewItem[]) {
    if (!items.length) {
      return (
        <span class="text-sm text-base-content/60">{this.scope.locale.NoImageSelected()}</span>
      );
    }
    return (
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, index) => this._renderPreviewCard(item, index, true, false))}
      </div>
    );
  }

  private _renderPreviewCard(
    item: IImagePreviewItem,
    index: number,
    readonly: boolean,
    disableNotifyChanged?: boolean,
  ) {
    return (
      <div
        key={`${item.url}-${index}`}
        class="rounded-box border border-base-300 bg-base-100 shadow-sm"
      >
        <div class="aspect-square overflow-hidden rounded-t-box bg-base-200">
          <img
            class="h-full w-full object-cover"
            src={item.url}
            alt={item.filename ?? `image-${index + 1}`}
          />
        </div>
        <div class="space-y-2 p-3">
          <div class="min-h-10 text-sm text-base-content/70">
            <div class="truncate font-medium text-base-content">{item.filename ?? item.url}</div>
            {(item.width || item.height) && (
              <div class="text-xs text-base-content/60">
                {item.width ?? '-'} × {item.height ?? '-'}
              </div>
            )}
          </div>
          <div class="flex flex-wrap gap-2">
            <a class="btn btn-sm btn-outline" href={item.url} target="_blank" rel="noreferrer">
              {this.scope.locale.PreviewImage()}
            </a>
            {!readonly && (
              <button
                type="button"
                class="btn btn-sm btn-outline btn-error"
                onClick={() => {
                  this._removeItem(item.url, disableNotifyChanged);
                }}
              >
                {this.scope.locale.RemoveImage()}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  private _getUploadButtonText(itemCount: number) {
    const options = this.currentOptions ?? {};
    if (options.multiple) {
      return itemCount > 0 ? this.scope.locale.AddImage() : this.scope.locale.SelectImage();
    }
    return itemCount > 0 ? this.scope.locale.ReplaceImage() : this.scope.locale.SelectImage();
  }

  private async _handleFileChange(event: Event, disableNotifyChanged?: boolean) {
    const input = event.target as HTMLInputElement;
    const files = Array.from(input.files ?? []);
    input.value = '';
    if (files.length === 0) return;
    this.errorMessage = undefined;
    const options = this.currentOptions ?? {};
    const currentUrls = this._normalizeValueToUrls(this.currentValue, !!options.multiple);
    const filesToHandle = options.multiple ? files : files.slice(0, 1);
    const maxCount = this._getMaxCount(options);
    if (currentUrls.length + filesToHandle.length > maxCount) {
      this.errorMessage = this.scope.locale.TooManyImages(maxCount);
      return;
    }
    this.isUploading = true;
    try {
      const uploadedItems: IImagePreviewItem[] = [];
      for (const file of filesToHandle) {
        const validationMessage = this._validateFile(file, options);
        if (validationMessage) {
          this.errorMessage = validationMessage;
          continue;
        }
        const preparedFile = await this._prepareFile(file, options);
        if (!preparedFile) continue;
        const uploaded = await this.scope.api.image.upload({ image: preparedFile });
        if (!uploaded?.url) {
          throw new Error(this.scope.locale.ImageUploadFailed());
        }
        const item: IImagePreviewItem = {
          url: uploaded.url,
          filename: uploaded.filename,
          width: uploaded.width,
          height: uploaded.height,
        };
        this.uploadedPreviewMap[item.url] = item;
        uploadedItems.push(item);
      }
      if (uploadedItems.length === 0) return;
      const nextUrls = options.multiple
        ? [...currentUrls, ...uploadedItems.map(item => item.url)]
        : [uploadedItems[uploadedItems.length - 1].url];
      this._setFieldValue(nextUrls, disableNotifyChanged, !!options.multiple);
      this.errorMessage = undefined;
    } catch (err: any) {
      this.errorMessage = err?.message ?? this.scope.locale.ImageUploadFailed();
    } finally {
      this.isUploading = false;
    }
  }

  private _removeItem(url: string, disableNotifyChanged?: boolean) {
    const multiple = !!this.currentOptions?.multiple;
    const currentUrls = this._normalizeValueToUrls(this.currentValue, multiple);
    const nextUrls = currentUrls.filter(item => item !== url);
    delete this.uploadedPreviewMap[url];
    this._setFieldValue(nextUrls, disableNotifyChanged, multiple);
    this.errorMessage = undefined;
  }

  private _setFieldValue(
    urls: string[],
    disableNotifyChanged: boolean | undefined,
    multiple: boolean,
  ) {
    const nextValue = multiple ? urls : urls[0];
    this.currentValue = multiple ? urls : nextValue;
    this.$$formField?.setValue(nextValue, disableNotifyChanged);
    this.$$formField?.handleBlur();
  }

  private _getPreviewItems(value: unknown) {
    const urls = this._normalizeValueToUrls(value, !!this.currentOptions?.multiple);
    return urls.map(url => this.uploadedPreviewMap[url] ?? { url });
  }

  private _normalizeOutputValue(value: unknown) {
    const urls = this._normalizeValueToUrls(value, !!this.currentOptions?.multiple);
    return {
      urls,
      displayValue: urls.join(', '),
    };
  }

  private _normalizeValueToUrls(value: unknown, multiple: boolean) {
    if (Array.isArray(value)) {
      return value.filter(item => !!item).map(item => String(item));
    }
    if (!multiple && value) {
      return [String(value)];
    }
    return [];
  }

  private _getMaxCount(options: IResourceFormFieldImageOptions) {
    if (!options.multiple) return 1;
    return Math.max(options.maxCount ?? 1, 1);
  }

  private _getAcceptAttr(options?: IResourceFormFieldImageOptions) {
    if (!options) return 'image/*';
    if (typeof options.accept === 'string') return options.accept;
    if (options.accept?.length) return options.accept.join(',');
    const parts = [...(options.mimeTypes ?? []), ...(options.extensions ?? [])];
    return parts.length > 0 ? parts.join(',') : 'image/*';
  }

  private _validateFile(file: File, options: IResourceFormFieldImageOptions) {
    const acceptTokens = this._collectAcceptTokens(options);
    if (acceptTokens.length > 0 && !this._matchesAccept(file, acceptTokens)) {
      return this.scope.locale.InvalidImageType();
    }
    if (options.maxSize && file.size > options.maxSize) {
      return this.scope.locale.ImageTooLarge(this._formatBytes(options.maxSize));
    }
    if (options.minSize && file.size < options.minSize) {
      return this.scope.locale.ImageTooSmall(this._formatBytes(options.minSize));
    }
    return undefined;
  }

  private _collectAcceptTokens(options: IResourceFormFieldImageOptions) {
    const accept = options.accept
      ? Array.isArray(options.accept)
        ? options.accept
        : options.accept.split(',')
      : [];
    return [...accept, ...(options.mimeTypes ?? []), ...(options.extensions ?? [])]
      .map(item => item.trim().toLowerCase())
      .filter(item => !!item);
  }

  private _matchesAccept(file: File, acceptTokens: string[]) {
    const mimeType = file.type.toLowerCase();
    const extension = this._getFileExtension(file.name);
    return acceptTokens.some(token => {
      if (token === 'image/*') return mimeType.startsWith('image/');
      if (token.startsWith('.')) return extension === token;
      if (token.endsWith('/*')) {
        const prefix = token.slice(0, token.length - 1);
        return mimeType.startsWith(prefix);
      }
      return mimeType === token;
    });
  }

  private _getFileExtension(filename: string) {
    const index = filename.lastIndexOf('.');
    if (index === -1) return '';
    return filename.slice(index).toLowerCase();
  }

  private async _prepareFile(file: File, options: IResourceFormFieldImageOptions) {
    if (!process.env.CLIENT) return file;
    let canvas: HTMLCanvasElement | undefined;
    if (options.enableCrop) {
      canvas = await this._openCropDialog(file, options);
      if (!canvas) return undefined;
    }
    const resizeOptions = options.resize;
    if (!canvas && !resizeOptions) {
      return file;
    }
    const sourceCanvas = canvas ?? (await this._createCanvasFromFile(file));
    const targetCanvas = this._resizeCanvas(sourceCanvas, resizeOptions);
    return await this._canvasToFile(targetCanvas, file, resizeOptions);
  }

  private async _openCropDialog(file: File, options: IResourceFormFieldImageOptions) {
    const src = URL.createObjectURL(file);
    try {
      return await new Promise<HTMLCanvasElement | undefined>(resolve => {
        let settled = false;
        let cropperRef: { getResult?: () => { canvas?: HTMLCanvasElement } } | undefined;
        const dialog = this.$appModal.dialog(
          {
            title: this.scope.locale.CropImage(),
            slotDefault: () => {
              return (
                <ClientOnly>
                  <div class="space-y-4">
                    <div class="h-[420px] overflow-hidden rounded-box bg-base-200">
                      <Cropper
                        ref={ref => {
                          cropperRef = ref as any;
                        }}
                        class="h-full w-full"
                        src={src}
                        stencilComponent={
                          options.cropShape === 'round' ? CircleStencil : RectangleStencil
                        }
                        stencilProps={{
                          aspectRatio: options.cropAspectRatio,
                        }}
                        imageRestriction="stencil"
                      ></Cropper>
                    </div>
                    <p class="text-sm text-base-content/70">{this.scope.locale.AdjustImage()}</p>
                  </div>
                </ClientOnly>
              );
            },
            slotActions: modal => {
              return (
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
                    {this.scope.locale.CancelCrop()}
                  </button>
                  <button
                    type="button"
                    class="btn btn-primary"
                    onClick={() => {
                      if (settled) return;
                      const canvas = cropperRef?.getResult?.()?.canvas;
                      settled = true;
                      modal.close();
                      resolve(canvas);
                    }}
                  >
                    {this.scope.locale.ApplyCrop()}
                  </button>
                </>
              );
            },
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

  private async _createCanvasFromFile(file: File) {
    const src = URL.createObjectURL(file);
    try {
      return await this._createCanvasFromUrl(src);
    } finally {
      URL.revokeObjectURL(src);
    }
  }

  private async _createCanvasFromUrl(src: string) {
    const image = await this._loadImage(src);
    const canvas = document.createElement('canvas');
    canvas.width = image.naturalWidth || image.width;
    canvas.height = image.naturalHeight || image.height;
    const context = canvas.getContext('2d');
    if (!context) throw new Error(this.scope.locale.ImageUploadFailed());
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    return canvas;
  }

  private _resizeCanvas(
    sourceCanvas: HTMLCanvasElement,
    resizeOptions?: IResourceFormFieldImageResizeOptions,
  ) {
    if (!resizeOptions?.width && !resizeOptions?.height) {
      return sourceCanvas;
    }
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

  private async _canvasToFile(
    canvas: HTMLCanvasElement,
    file: File,
    resizeOptions?: IResourceFormFieldImageResizeOptions,
  ) {
    const mimeType = this._resolveMimeType(file.type, resizeOptions?.format);
    const quality = this._resolveQuality(resizeOptions?.quality);
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        result => {
          if (!result) {
            reject(new Error(this.scope.locale.ImageUploadFailed()));
            return;
          }
          resolve(result);
        },
        mimeType,
        quality,
      );
    });
    return new File([blob], this._replaceExtension(file.name, mimeType), {
      type: mimeType,
      lastModified: Date.now(),
    });
  }

  private _resolveMimeType(
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

  private _resolveQuality(quality?: number) {
    if (quality === undefined) return 0.92;
    if (quality > 1) return Math.min(quality / 100, 1);
    return quality;
  }

  private _replaceExtension(filename: string, mimeType: string) {
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

  private _loadImage(src: string) {
    return new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error(this.scope.locale.ImageUploadFailed()));
      image.src = src;
    });
  }

  private _formatBytes(bytes: number) {
    if (bytes >= 1024 * 1024) {
      return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
    }
    if (bytes >= 1024) {
      return `${Math.round(bytes / 1024)} KB`;
    }
    return `${bytes} B`;
  }
}
