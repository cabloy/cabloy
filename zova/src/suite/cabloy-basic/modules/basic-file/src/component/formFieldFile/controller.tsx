import type { TableIdentity } from 'table-identity';
import type { IComponentOptions } from 'zova';
import type { IJsxRenderContextFormField } from 'zova-module-a-form';
import type { ControllerFormField, IFormFieldComponentOptions } from 'zova-module-a-form';
import type { IResourceFormFieldOptionsBase } from 'zova-module-a-openapi';

import { classes } from 'typestyle';
import { BeanControllerBase, ClientOnly, Use } from 'zova';
import { Controller } from 'zova-module-a-bean';
import { ZFormField } from 'zova-module-a-form';
import { $QueryEnsureLoaded } from 'zova-module-a-model';

import type { IFilePreviewItem } from '../../types/file.js';

import {
  formatFileDate,
  formatFileSize,
  inferFileRelationName,
  resolveFileDownloadUrl,
} from '../../lib/index.js';
import { ModelFile } from '../../model/file.js';

declare module 'zova-module-a-openapi' {
  export interface IResourceFormFieldRecord {
    'basic-file:formFieldFile'?: IResourceFormFieldFileOptions;
  }
}

export interface IResourceFormFieldFileOptions extends IResourceFormFieldOptionsBase {
  fileScene?: string;
  relationName?: string;
  multiple?: boolean;
  maxCount?: number;
  accept?: string | string[];
  mimeTypes?: string[];
  extensions?: string[];
  maxSize?: number;
  minSize?: number;
  placeholder?: string;
}

export interface ControllerFormFieldFileProps extends IFormFieldComponentOptions {
  options?: IResourceFormFieldFileOptions;
}

interface IUploadPolicyState {
  acceptAttr?: string;
  multiple: boolean;
  pending: boolean;
}

@Controller()
export class ControllerFormFieldFile extends BeanControllerBase {
  static $propsDefault = {
    options: {
      maxCount: 1,
    },
  };

  static $componentOptions: IComponentOptions = { inheritAttrs: false, deepExtendDefault: true };

  fileInputRef?: HTMLInputElement;
  errorMessage?: string;
  isUploading = false;
  currentValue?: TableIdentity | TableIdentity[] | string;
  currentOptions: IResourceFormFieldFileOptions = {};
  $$formField?: ControllerFormField;
  uploadedPreviewMap: Record<string, IFilePreviewItem> = {};

  @Use()
  $$modelFile: ModelFile;

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
          const fieldOptions = (propsBucket.options ?? {}) as IResourceFormFieldFileOptions;
          const disableNotifyChanged = propsBucket.disableNotifyChanged as boolean | undefined;
          const fieldValue = propsBucket.value as unknown;
          const propsClass = (props as { class?: string }).class;
          this.currentValue = fieldValue as any;
          this.currentOptions = fieldOptions;
          const uploadPolicyState = this._getUploadPolicyState(fieldOptions);
          const items = this._getPreviewItems(fieldValue, uploadPolicyState.multiple);
          const maxCount = this._getMaxCount(fieldOptions);
          const hasValidationError = !$$formField.field.state.meta.isValid;
          const cardClass = classes(
            'rounded-box border border-base-300 bg-base-100 p-4',
            (hasValidationError || !!this.errorMessage) && 'border-error',
            propsClass,
          );
          return (
            <div class={cardClass}>
              <ClientOnly>
                <input
                  ref={ref => {
                    this.fileInputRef = ref as HTMLInputElement;
                  }}
                  class="hidden"
                  type="file"
                  accept={uploadPolicyState.acceptAttr}
                  multiple={uploadPolicyState.multiple}
                  onChange={event => {
                    void this._handleFileChange(event, disableNotifyChanged);
                  }}
                />
              </ClientOnly>
              <div class="flex flex-wrap items-center gap-3">
                {items.length < maxCount && (
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
                )}
                {this.isUploading && (
                  <span class="inline-flex items-center gap-2 text-sm text-base-content/70">
                    <span class="loading loading-spinner loading-sm text-primary"></span>
                    {this.scope.locale.Uploading()}
                  </span>
                )}
                {!items.length && !this.isUploading && (
                  <span class="text-sm text-base-content/60">
                    {fieldOptions.placeholder ?? this.scope.locale.NoFileSelected()}
                  </span>
                )}
              </div>
              {!!this.errorMessage && <p class="mt-3 text-sm text-error">{this.errorMessage}</p>}
              {!!items.length && (
                <div class="mt-4 space-y-3">
                  {items.map((item, index) => {
                    return this._renderPreviewCard(item, index, false, disableNotifyChanged);
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
          const fieldOptions = (propsBucket.options ?? {}) as IResourceFormFieldFileOptions;
          const fieldValue = propsBucket.value as unknown;
          const propsClass = (props as { class?: string }).class;
          this.currentValue = fieldValue as any;
          this.currentOptions = fieldOptions;
          const items = this._getPreviewItems(fieldValue);
          return <div class={propsClass}>{this._renderReadonlyItems(items)}</div>;
        }}
      ></ZFormField>
    );
  }

  private _renderReadonlyItems(items: IFilePreviewItem[]) {
    if (!items.length) {
      return <span class="text-sm text-base-content/60">{this.scope.locale.NoFileSelected()}</span>;
    }
    return (
      <div class="space-y-3">
        {items.map((item, index) => this._renderPreviewCard(item, index, true, false))}
      </div>
    );
  }

  private _renderPreviewCard(
    item: IFilePreviewItem,
    index: number,
    readonly: boolean,
    disableNotifyChanged?: boolean,
  ) {
    const downloadUrl = item.downloadUrl ? this._resolveDownloadUrl(item.downloadUrl) : undefined;
    return (
      <div
        key={`${item.id}-${index}`}
        class="rounded-box border border-base-300 bg-base-100 p-4 shadow-sm"
      >
        <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div class="min-w-0 space-y-1">
            <div class="truncate font-medium text-base-content">
              {item.filename ?? `#${String(item.id)}`}
            </div>
            <div class="text-sm text-base-content/70">
              {item.contentType ?? '-'} · {formatFileSize(item.size)}
            </div>
            <div class="text-xs text-base-content/60">
              {this.scope.locale.UploadedAt()}: {formatFileDate(item.uploadedAt)}
            </div>
          </div>
          <div class="flex flex-wrap gap-2">
            {downloadUrl && (
              <a
                class="btn btn-sm btn-outline"
                href={downloadUrl}
                target="_blank"
                rel="noreferrer"
                onClick={event => {
                  this._openDownloadUrl(event, downloadUrl);
                }}
              >
                {this.scope.locale.DownloadFile()}
              </a>
            )}
            {!readonly && (
              <button
                type="button"
                class="btn btn-sm btn-outline btn-error"
                onClick={() => {
                  this._removeItem(item.id, disableNotifyChanged);
                }}
              >
                {this.scope.locale.RemoveFile()}
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
      return itemCount > 0 ? this.scope.locale.AddFile() : this.scope.locale.SelectFile();
    }
    return itemCount > 0 ? this.scope.locale.ReplaceFile() : this.scope.locale.SelectFile();
  }

  private _getUploadPolicyQuery(options?: IResourceFormFieldFileOptions) {
    return this.$$modelFile.getUploadPolicy(options?.fileScene);
  }

  private _getUploadPolicyState(options?: IResourceFormFieldFileOptions): IUploadPolicyState {
    const query = this._getUploadPolicyQuery(options);
    const policy = query?.data;
    return {
      acceptAttr: this._getAcceptAttr(options, policy),
      multiple: this._getEffectiveMultiple(options, policy),
      pending: query ? query.data === undefined && !!(query.isPending || query.isFetching) : false,
    };
  }

  private _getCachedUploadPolicy(options?: IResourceFormFieldFileOptions) {
    return this._getUploadPolicyQuery(options)?.data;
  }

  private async _waitForUploadPolicy(options?: IResourceFormFieldFileOptions) {
    await $QueryEnsureLoaded(() => this._getUploadPolicyQuery(options));
  }

  private _getEffectiveMultiple(
    options?: IResourceFormFieldFileOptions,
    policy = this._getCachedUploadPolicy(options),
  ) {
    return !!(options?.multiple ?? policy?.multiple);
  }

  private _applyInputPolicy(uploadPolicyState: IUploadPolicyState) {
    if (!this.fileInputRef) return;
    this.fileInputRef.accept = uploadPolicyState.acceptAttr ?? '';
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
      const currentIds = this._normalizeValueToFileIds(this.currentValue, multiple);
      const filesToHandle = multiple ? files : files.slice(0, 1);
      const maxCount = this._getMaxCount(options);
      const nextCountCandidate = multiple
        ? currentIds.length + filesToHandle.length
        : filesToHandle.length;
      if (nextCountCandidate > maxCount) {
        this.errorMessage = this.scope.locale.TooManyFiles(maxCount);
        return;
      }
      const uploadedItems: IFilePreviewItem[] = [];
      for (const file of filesToHandle) {
        const validationMessage = this._validateFile(file, options);
        if (validationMessage) {
          this.errorMessage = validationMessage;
          continue;
        }
        const uploaded = await this._uploadFile(
          uploadTarget.fileScene,
          file,
          this._getCachedUploadPolicy(options)?.directUpload ?? false,
        );
        const item: IFilePreviewItem = {
          id: uploaded.id as TableIdentity,
          filename: uploaded.filename,
          contentType: uploaded.contentType,
          size: uploaded.size,
          uploadedAt: uploaded.uploadedAt,
          downloadUrl: uploaded.url,
          public: uploaded.public,
          signed: uploaded.signed,
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
      this.errorMessage = err?.message ?? this.scope.locale.FileUploadFailed();
    } finally {
      this.isUploading = false;
    }
  }

  private async _uploadFile(fileScene: string, file: File, directUpload: boolean) {
    if (!directUpload) {
      return await this.scope.api.file.upload({ fileScene, file });
    }
    const directUploadResponse = await this.scope.api.file.createDirectUpload({
      fileScene,
      filename: file.name,
      size: file.size,
      mimeType: file.type || 'application/octet-stream',
    });
    const providerResponse = await fetch(directUploadResponse.uploadUrl, {
      method: directUploadResponse.method ?? 'PUT',
      headers: directUploadResponse.headers,
      body: file,
    });
    if (!providerResponse.ok) {
      throw new Error(`file direct upload failed: ${providerResponse.status}`);
    }
    return await this.scope.api.file.finalizeDirectUpload({
      fileId: directUploadResponse.id,
    });
  }

  private _resolveUploadTarget() {
    const fileScene = this.currentOptions.fileScene;
    if (!fileScene) {
      throw new Error('should specify file upload scene');
    }
    return {
      fileScene,
    } as const;
  }

  private _removeItem(fileId: TableIdentity, disableNotifyChanged?: boolean) {
    const multiple = this._getEffectiveMultiple(this.currentOptions);
    const currentIds = this._normalizeValueToFileIds(this.currentValue, multiple);
    const nextIds = currentIds.filter(item => String(item) !== String(fileId));
    delete this.uploadedPreviewMap[String(fileId)];
    this._setFieldValue(nextIds, disableNotifyChanged, multiple);
    this.errorMessage = undefined;
  }

  private _setFieldValue(
    fileIds: TableIdentity[],
    disableNotifyChanged: boolean | undefined,
    multiple: boolean,
  ) {
    const nextValue = multiple ? fileIds : (fileIds[0] ?? '');
    this.currentValue = nextValue as any;
    this._syncRelationField(fileIds, multiple);
    this.$$formField?.setValue(nextValue, disableNotifyChanged);
    this.$$formField?.handleBlur();
  }

  private _syncRelationField(fileIds: TableIdentity[], multiple: boolean) {
    const relationName = this._getRelationName();
    if (!relationName) return;
    const relationMap = this._getRelationPreviewMap();
    const relationItems = fileIds.map(fileId => {
      const key = String(fileId);
      return this.uploadedPreviewMap[key] ?? relationMap[key] ?? { id: fileId };
    });
    const relationValue = multiple ? relationItems : (relationItems[0] ?? undefined);
    this.$$renderContext.$$form.setFieldValue(relationName as never, relationValue, true);
  }

  private _getPreviewItems(
    value: unknown,
    multiple = this._getEffectiveMultiple(this.currentOptions),
  ) {
    const fileIds = this._normalizeValueToFileIds(value, multiple);
    const relationMap = this._getRelationPreviewMap();
    if (fileIds.length === 0) {
      return Object.values(relationMap);
    }
    return fileIds.map(fileId => {
      const key = String(fileId);
      return this.uploadedPreviewMap[key] ?? relationMap[key] ?? { id: fileId };
    });
  }

  private _getRelationPreviewMap() {
    const relationName = this._getRelationName();
    if (!relationName) return {} as Record<string, IFilePreviewItem>;
    const relationValue = this.$$renderContext.$$form.getFieldValue(relationName as never);
    const relationItems = Array.isArray(relationValue)
      ? relationValue
      : relationValue
        ? [relationValue]
        : [];
    const map: Record<string, IFilePreviewItem> = {};
    for (const relationItem of relationItems) {
      const item = relationItem as Partial<IFilePreviewItem> | undefined;
      if (!item?.id) continue;
      map[String(item.id)] = {
        id: item.id,
        filename: item.filename,
        contentType: item.contentType,
        size: item.size,
        uploadedAt: item.uploadedAt,
        downloadUrl: item.downloadUrl,
        public: item.public,
        signed: item.signed,
      };
    }
    return map;
  }

  private _getRelationName() {
    return inferFileRelationName(this.$props.name, this.currentOptions.relationName);
  }

  private _normalizeValueToFileIds(value: unknown, multiple: boolean): TableIdentity[] {
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

  private _getMaxCount(options: IResourceFormFieldFileOptions) {
    if (!this._getEffectiveMultiple(options)) return 1;
    return Math.max(options.maxCount ?? 1, 1);
  }

  private _getAcceptAttr(
    options?: IResourceFormFieldFileOptions,
    policy = this._getCachedUploadPolicy(options),
  ) {
    if (!options) return undefined;
    if (typeof options.accept === 'string') return options.accept;
    if (options.accept?.length) return options.accept.join(',');
    const parts = [
      ...(options.mimeTypes ?? policy?.mimeTypes ?? []),
      ...(options.extensions ?? policy?.extensions ?? []),
    ];
    return parts.length > 0 ? parts.join(',') : undefined;
  }

  private _validateFile(file: File, options: IResourceFormFieldFileOptions) {
    const acceptTokens = this._collectAcceptTokens(options);
    if (acceptTokens.length > 0 && !this._matchesAccept(file, acceptTokens)) {
      return this.scope.locale.InvalidFileType();
    }
    const maxSize = options.maxSize ?? this._getCachedUploadPolicy(options)?.maxSize;
    if (typeof maxSize === 'number' && file.size > maxSize) {
      return this.scope.locale.FileTooLarge(formatFileSize(maxSize));
    }
    if (typeof options.minSize === 'number' && file.size < options.minSize) {
      return this.scope.locale.FileTooSmall(formatFileSize(options.minSize));
    }
    return undefined;
  }

  private _collectAcceptTokens(options: IResourceFormFieldFileOptions) {
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

  private async _openDownloadUrl(event: MouseEvent, downloadUrl: string) {
    if (!process.env.CLIENT) return;
    event.preventDefault();
    const passportCode = await this._getDownloadPassportCode();
    const url = this._resolveDownloadUrl(downloadUrl, passportCode);
    if (url) globalThis.open?.(url, '_blank', 'noopener,noreferrer');
  }

  private async _getDownloadPassportCode() {
    const apiPrefix = this.sys.config.api.prefix ?? '/api';
    return await this.$passport.ensureFreshTempAuthToken({
      path: `${apiPrefix}/file/download`,
      pathMatch: 'prefix',
      staleTime: 30 * 1000,
    });
  }

  private _resolveDownloadUrl(url: string, passportCode?: string) {
    return resolveFileDownloadUrl(url, this.sys.config.api.baseURL, passportCode);
  }
}
