import type { TableIdentity } from 'table-identity';
import type { IComponentOptions } from 'zova';
import type { IJsxRenderContextFormField } from 'zova-module-a-form';
import type { ControllerFormField, IFormFieldComponentOptions } from 'zova-module-a-form';
import type { IImageSceneRecord, IResourceFormFieldOptionsBase } from 'zova-module-a-openapi';

import { classes } from 'typestyle';
import { CircleStencil, Cropper, RectangleStencil } from 'vue-advanced-cropper';
import { BeanControllerBase, ClientOnly, Use } from 'zova';
import { Controller } from 'zova-module-a-bean';
import { ZFormField } from 'zova-module-a-form';
import {
  buildImagePreviewTitle,
  inferImageRelationName,
  openImagePreviewDialog,
  resolveImagePreviewUrl,
} from 'zova-module-basic-image';

import type { IImageTransformOptions } from '../../types/image.js';

import { ModelImage } from '../../model/image.js';
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
  imageScene?: keyof IImageSceneRecord | string;
  relationName?: string;
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

interface IUploadPolicyState {
  acceptAttr: string;
  multiple: boolean;
  pending: boolean;
}

interface IImagePreviewItem {
  id: TableIdentity;
  url?: string;
  filename?: string;
  width?: number;
  height?: number;
}

@Controller()
export class ControllerFormFieldImage extends BeanControllerBase {
  static $propsDefault = {
    options: {
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
  currentValue?: TableIdentity | TableIdentity[] | string;
  currentOptions: IResourceFormFieldImageOptions = {};
  $$formField?: ControllerFormField;

  @Use()
  $$modelImage: ModelImage;

  uploadedPreviewMap: Record<string, IImagePreviewItem> = {};

  @Use({ injectionScope: 'host' })
  $$renderContext: IJsxRenderContextFormField;

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
          this.currentValue = propsBucket.value as any;
          this.currentOptions = propsBucket.options ?? {};
          const uploadPolicyState = this._getUploadPolicyState(this.currentOptions);
          const items = this._getPreviewItems(propsBucket.value, uploadPolicyState.multiple);
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
                accept={uploadPolicyState.acceptAttr}
                multiple={uploadPolicyState.multiple}
                onChange={event => {
                  void this._handleFileChange(event, propsBucket.disableNotifyChanged);
                }}
              />
              <div class="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  disabled={this.isUploading || uploadPolicyState.pending}
                  class={classes(
                    'btn btn-primary',
                    (this.isUploading || uploadPolicyState.pending) && 'btn-disabled',
                  )}
                  onClick={() => {
                    if (this.isUploading || uploadPolicyState.pending) return;
                    this._applyInputPolicy(uploadPolicyState);
                    this.fileInputRef?.click();
                  }}
                >
                  {this._getUploadButtonText(items.length, uploadPolicyState.multiple)}
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
                      items,
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
    return (
      <ZFormField
        {...this.$props}
        slotDefault={({ propsBucket, props }) => {
          this.currentValue = propsBucket.value as any;
          this.currentOptions = propsBucket.options ?? {};
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
        {items.map((item, index) => this._renderPreviewCard(item, index, items, true, false))}
      </div>
    );
  }

  private _renderPreviewCard(
    item: IImagePreviewItem,
    index: number,
    items: IImagePreviewItem[],
    readonly: boolean,
    disableNotifyChanged?: boolean,
  ) {
    const previewUrl = item.url ? this._resolvePreviewUrl(item.url) : undefined;
    return (
      <div
        key={`${item.id}-${index}`}
        class="rounded-box border border-base-300 bg-base-100 shadow-sm"
      >
        <div class="aspect-square overflow-hidden rounded-t-box bg-base-200">
          {previewUrl ? (
            <img
              class="h-full w-full object-cover"
              src={previewUrl}
              alt={item.filename ?? `image-${index + 1}`}
            />
          ) : (
            <div class="flex h-full w-full items-center justify-center text-sm text-base-content/50">
              #{String(item.id)}
            </div>
          )}
        </div>
        <div class="space-y-2 p-3">
          <div class="min-h-10 text-sm text-base-content/70">
            <div class="truncate font-medium text-base-content">
              {item.filename ?? `#${String(item.id)}`}
            </div>
            {(item.width || item.height) && (
              <div class="text-xs text-base-content/60">
                {item.width ?? '-'} × {item.height ?? '-'}
              </div>
            )}
          </div>
          <div class="flex flex-wrap gap-2">
            {previewUrl && (
              <button
                type="button"
                class="btn btn-sm btn-outline"
                onClick={() => {
                  this._openPreviewDialog(items, index);
                }}
              >
                {this.scope.locale.PreviewImage()}
              </button>
            )}
            {!readonly && (
              <button
                type="button"
                class="btn btn-sm btn-outline btn-error"
                onClick={() => {
                  this._removeItem(item.id, disableNotifyChanged);
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

  private _getUploadButtonText(
    itemCount: number,
    multiple = this._getEffectiveMultiple(this.currentOptions),
  ) {
    if (multiple) {
      return itemCount > 0 ? this.scope.locale.AddImage() : this.scope.locale.SelectImage();
    }
    return itemCount > 0 ? this.scope.locale.ReplaceImage() : this.scope.locale.SelectImage();
  }

  private _getUploadPolicyQuery(options?: IResourceFormFieldImageOptions) {
    return this.$$modelImage.getUploadPolicy(options?.imageScene as string | undefined);
  }

  private _getUploadPolicyState(options?: IResourceFormFieldImageOptions): IUploadPolicyState {
    const query = this._getUploadPolicyQuery(options);
    const policy = query?.data;
    return {
      acceptAttr: this._getAcceptAttr(options, policy),
      multiple: this._getEffectiveMultiple(options, policy),
      pending: query ? query.data === undefined && !!(query.isPending || query.isFetching) : false,
    };
  }

  private _getCachedUploadPolicy(options?: IResourceFormFieldImageOptions) {
    return this._getUploadPolicyQuery(options)?.data;
  }

  private async _waitForUploadPolicy(options?: IResourceFormFieldImageOptions) {
    const query = this._getUploadPolicyQuery(options);
    if (!query || query.data !== undefined) return query?.data;
    await query.suspense();
    return query.data;
  }

  private _getEffectiveMultiple(
    options?: IResourceFormFieldImageOptions,
    policy = this._getCachedUploadPolicy(options),
  ) {
    return !!(options?.multiple ?? policy?.multiple);
  }

  private _applyInputPolicy(uploadPolicyState: IUploadPolicyState) {
    if (!this.fileInputRef) return;
    this.fileInputRef.accept = uploadPolicyState.acceptAttr;
    this.fileInputRef.multiple = uploadPolicyState.multiple;
  }

  private async _handleFileChange(event: Event, disableNotifyChanged?: boolean) {
    const input = event.target as HTMLInputElement;
    const files = Array.from(input.files ?? []);
    input.value = '';
    if (files.length === 0) return;
    this.errorMessage = undefined;
    const options = this.currentOptions ?? {};
    const uploadTarget = this._resolveUploadTarget();
    this.isUploading = true;
    try {
      await this._waitForUploadPolicy(options);
      const multiple = this._getEffectiveMultiple(options);
      const currentIds = this._normalizeValueToImageIds(this.currentValue, multiple);
      const filesToHandle = multiple ? files : files.slice(0, 1);
      const maxCount = this._getMaxCount(options);
      const nextCountCandidate = multiple
        ? currentIds.length + filesToHandle.length
        : filesToHandle.length;
      if (nextCountCandidate > maxCount) {
        this.errorMessage = this.scope.locale.TooManyImages(maxCount);
        return;
      }
      const uploadedItems: IImagePreviewItem[] = [];
      for (const file of filesToHandle) {
        const validationMessage = this._validateFile(file, options);
        if (validationMessage) {
          this.errorMessage = validationMessage;
          continue;
        }
        const preparedFile = await this._prepareFile(file, options);
        if (!preparedFile) continue;
        const tokenRes = await this.scope.api.image.createUploadToken({
          ...uploadTarget,
          size: preparedFile.size,
          mimeType: preparedFile.type || file.type,
        });
        const uploaded = await this.scope.api.image.upload({
          token: tokenRes.token,
          image: preparedFile,
        });
        const item: IImagePreviewItem = {
          id: uploaded.id,
          url: uploaded.url,
          filename: uploaded.filename,
          width: uploaded.width,
          height: uploaded.height,
        };
        this.uploadedPreviewMap[String(item.id)] = item;
        uploadedItems.push(item);
      }
      if (uploadedItems.length === 0) return;
      const nextIds = multiple
        ? [...currentIds, ...uploadedItems.map(item => item.id)]
        : [uploadedItems[uploadedItems.length - 1].id];
      this._setFieldValue(nextIds, disableNotifyChanged, multiple);
      this.errorMessage = undefined;
    } catch (err: any) {
      this.errorMessage = err?.message ?? this.scope.locale.ImageUploadFailed();
    } finally {
      this.isUploading = false;
    }
  }

  private _resolveUploadTarget() {
    const imageScene = this.currentOptions.imageScene;
    if (!imageScene) {
      throw new Error('should specify image upload scene');
    }
    return {
      imageScene,
    } as const;
  }

  private _removeItem(imageId: TableIdentity, disableNotifyChanged?: boolean) {
    const multiple = this._getEffectiveMultiple(this.currentOptions);
    const currentIds = this._normalizeValueToImageIds(this.currentValue, multiple);
    const nextIds = currentIds.filter(item => String(item) !== String(imageId));
    delete this.uploadedPreviewMap[String(imageId)];
    this._setFieldValue(nextIds, disableNotifyChanged, multiple);
    this.errorMessage = undefined;
  }

  private _setFieldValue(
    imageIds: TableIdentity[],
    disableNotifyChanged: boolean | undefined,
    multiple: boolean,
  ) {
    const nextValue = multiple ? imageIds : (imageIds[0] ?? '');
    this.currentValue = nextValue as any;
    this._syncRelationField(imageIds, multiple);
    this.$$formField?.setValue(nextValue, disableNotifyChanged);
    this.$$formField?.handleBlur();
  }

  private _syncRelationField(imageIds: TableIdentity[], multiple: boolean) {
    const relationName = this._getRelationName();
    if (!relationName) return;
    const relationMap = this._getRelationPreviewMap();
    const relationItems = imageIds.map(imageId => {
      const key = String(imageId);
      return this.uploadedPreviewMap[key] ?? relationMap[key] ?? { id: imageId };
    });
    const relationValue = multiple ? relationItems : (relationItems[0] ?? undefined);
    this.$$renderContext.$$form.setFieldValue(relationName as never, relationValue, true);
  }

  private _getPreviewItems(
    value: unknown,
    multiple = this._getEffectiveMultiple(this.currentOptions),
  ) {
    const imageIds = this._normalizeValueToImageIds(value, multiple);
    const relationMap = this._getRelationPreviewMap();
    if (imageIds.length === 0) {
      return Object.values(relationMap);
    }
    return imageIds.map(imageId => {
      const key = String(imageId);
      return this.uploadedPreviewMap[key] ?? relationMap[key] ?? { id: imageId };
    });
  }

  private _getRelationPreviewMap() {
    const relationName = this._getRelationName();
    if (!relationName) return {} as Record<string, IImagePreviewItem>;
    const relationValue = this.$$renderContext.$$form.getFieldValue(relationName as never);
    const relationItems = Array.isArray(relationValue)
      ? relationValue
      : relationValue
        ? [relationValue]
        : [];
    const map: Record<string, IImagePreviewItem> = {};
    for (const relationItem of relationItems) {
      if (!relationItem?.id) continue;
      map[String(relationItem.id)] = {
        id: relationItem.id,
        url: relationItem.url,
        filename: relationItem.filename,
        width: relationItem.width,
        height: relationItem.height,
      };
    }
    return map;
  }

  private _getRelationName() {
    return inferImageRelationName(this.$props.name, this.currentOptions.relationName);
  }

  private _normalizeValueToImageIds(value: unknown, multiple: boolean): TableIdentity[] {
    if (Array.isArray(value)) {
      return value
        .filter(item => item !== undefined && item !== null && item !== '')
        .map(item => item as TableIdentity);
    }
    if (!multiple && value !== undefined && value !== null && value !== '') {
      return [value as TableIdentity];
    }
    return [];
  }

  private _getMaxCount(options: IResourceFormFieldImageOptions) {
    if (!this._getEffectiveMultiple(options)) return 1;
    return Math.max(options.maxCount ?? 1, 1);
  }

  private _getAcceptAttr(
    options?: IResourceFormFieldImageOptions,
    policy = this._getCachedUploadPolicy(options),
  ) {
    if (!options) return 'image/*';
    if (typeof options.accept === 'string') return options.accept;
    if (options.accept?.length) return options.accept.join(',');
    const parts = [
      ...(options.mimeTypes ?? policy?.mimeTypes ?? []),
      ...(options.extensions ?? policy?.extensions ?? []),
    ];
    return parts.length > 0 ? parts.join(',') : 'image/*';
  }

  private _validateFile(file: File, options: IResourceFormFieldImageOptions) {
    const acceptTokens = this._collectAcceptTokens(options);
    if (acceptTokens.length > 0 && !this._matchesAccept(file, acceptTokens)) {
      return this.scope.locale.InvalidImageType();
    }
    const maxSize = options.maxSize ?? this._getCachedUploadPolicy(options)?.maxSize;
    if (typeof maxSize === 'number' && file.size > maxSize) {
      return this.scope.locale.ImageTooLarge(this._formatBytes(maxSize));
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
    const policy = this._getCachedUploadPolicy(options);
    return [
      ...accept,
      ...(options.mimeTypes ?? policy?.mimeTypes ?? []),
      ...(options.extensions ?? policy?.extensions ?? []),
    ]
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
                    <div class="h-105 overflow-hidden rounded-box bg-base-200">
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

  private _openPreviewDialog(items: IImagePreviewItem[], currentIndex: number) {
    const previewItems = items
      .map((item, index) => ({
        index,
        item,
      }))
      .filter(({ item }) => !!item.url)
      .map(({ index, item }) => ({
        index,
        item: {
          url: item.url!,
          filename: item.filename,
        },
      }));
    if (previewItems.length === 0) return;
    const initialIndex = previewItems.findIndex(({ index }) => index === currentIndex);
    openImagePreviewDialog({
      appModal: this.$appModal,
      title: this._getPreviewDialogTitle(previewItems.length),
      items: previewItems.map(({ item }) => item),
      initialIndex: initialIndex === -1 ? 0 : initialIndex,
      baseURL: this.sys.config.api.baseURL,
    });
  }

  private _getPreviewDialogTitle(count: number) {
    return buildImagePreviewTitle(
      this.$$renderContext.$celScope.property?.title ??
        this.$$renderContext.$celScope.name ??
        this.$props.name,
      count,
      () => this.scope.locale.PreviewImage(),
    );
  }

  private _resolvePreviewUrl(url: string) {
    return resolveImagePreviewUrl(url, this.sys.config.api.baseURL);
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
