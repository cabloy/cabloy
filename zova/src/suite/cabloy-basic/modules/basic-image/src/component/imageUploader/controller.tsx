import type { TableIdentity } from 'table-identity';
import type { VNode } from 'vue';
import type { IComponentOptions } from 'zova';
import type { IImageSceneRecord } from 'zova-module-a-openapi';

import { BeanControllerBase, ClientOnly, Use } from 'zova';
import { Controller } from 'zova-module-a-bean';
import { $QueryEnsureLoaded } from 'zova-module-a-model';
import { prepareImageFile } from 'zova-module-basic-image';

import type { IImageCropDialogLabels, IImageResizeOptions } from '../../lib/imageTransform.js';

import { ModelImage } from '../../model/image.js';

export interface IImageUploaderResult {
  id: TableIdentity;
  url?: string;
  filename?: string;
  contentType?: string;
  size?: number;
  width?: number;
  height?: number;
  public?: boolean;
  signed?: boolean;
}

export interface IImageUploaderPolicyState {
  acceptAttr: string;
  multiple: boolean;
  pending: boolean;
}

export interface IImageUploaderRenderState {
  isUploading: boolean;
  errorMessage?: string;
  policy: IImageUploaderPolicyState;
  chooseFiles: () => void;
  clear: () => void;
  onError: (error: Error) => void;
}

export interface ControllerImageUploaderProps {
  imageScene: keyof IImageSceneRecord | string;
  previewUrl?: string;
  emptyPreviewUrl?: string;
  accept?: string | string[];
  mimeTypes?: string[];
  extensions?: string[];
  maxSize?: number;
  minSize?: number;
  multiple?: boolean;
  onBeforeUpload?: (fileCount: number, policy: IImageUploaderPolicyState) => string | undefined;
  previewAlt?: string;
  previewShape?: 'rect' | 'round';
  chooseText?: string;
  clearText?: string;
  crop?: {
    labels: IImageCropDialogLabels;
    aspectRatio?: number;
    shape?: 'rect' | 'round';
  };
  resize?: IImageResizeOptions;
  slotDefault?: (state: IImageUploaderRenderState) => VNode;
  onUploaded?: (result: IImageUploaderResult) => void;
  onUploadedBatch?: (results: IImageUploaderResult[], policy: IImageUploaderPolicyState) => void;
  onCleared?: () => void;
  onError?: (error: Error) => void;
}

@Controller()
export class ControllerImageUploader extends BeanControllerBase {
  static $propsDefault = {};
  static $componentOptions: IComponentOptions = { inheritAttrs: false };

  fileInputRef?: HTMLInputElement;
  isUploading = false;
  errorMessage?: string;
  private _failedPreviewUrl?: string;
  private _generation = 0;

  @Use()
  $$modelImage: ModelImage;

  protected render() {
    const props = this.$props as ControllerImageUploaderProps;
    const policy = this._getUploadPolicyState(props);
    const state: IImageUploaderRenderState = {
      isUploading: this.isUploading,
      errorMessage: this.errorMessage,
      policy,
      chooseFiles: () => void this._chooseFiles(props),
      clear: () => this._clear(props),
      onError: error => this._setError(error, props),
    };
    return (
      <>
        <ClientOnly>
          <input
            ref={ref => {
              this.fileInputRef = ref as HTMLInputElement;
            }}
            class="hidden"
            type="file"
            accept={policy.acceptAttr}
            multiple={policy.multiple}
            disabled={this.isUploading || policy.pending}
            onChange={event => void this._handleFileChange(event, props)}
          />
        </ClientOnly>
        {props.slotDefault?.(state) ?? this._renderDefault(props, state)}
      </>
    );
  }

  private _renderDefault(props: ControllerImageUploaderProps, state: IImageUploaderRenderState) {
    const previewUrl = this._getPreviewUrl(props);
    const previewClass = props.previewShape === 'rect' ? 'rounded-box' : 'rounded-full';
    return (
      <div class="flex items-center gap-4">
        <img
          class={`h-16 w-16 object-cover ${previewClass}`}
          src={previewUrl}
          alt={props.previewAlt ?? 'image'}
          onError={event => this._handlePreviewError(event, props, previewUrl)}
        />
        <div class="flex flex-wrap gap-2">
          <button
            class={
              state.isUploading || state.policy.pending
                ? 'btn btn-outline btn-sm btn-disabled'
                : 'btn btn-outline btn-sm'
            }
            type="button"
            disabled={state.isUploading || state.policy.pending}
            onClick={state.chooseFiles}
          >
            {props.chooseText ?? this.scope.locale.SelectImage()}
          </button>
          <button
            class="btn btn-outline btn-sm"
            type="button"
            disabled={state.isUploading}
            onClick={state.clear}
          >
            {props.clearText ?? this.scope.locale.RemoveImage()}
          </button>
        </div>
        {state.errorMessage && (
          <p role="alert" class="basis-full text-sm text-error">
            {state.errorMessage}
          </p>
        )}
      </div>
    );
  }

  private _getPreviewUrl(props: ControllerImageUploaderProps) {
    const previewUrl = props.previewUrl || props.emptyPreviewUrl;
    if (previewUrl === this._failedPreviewUrl) return props.emptyPreviewUrl;
    return previewUrl;
  }

  private _handlePreviewError(
    _event: Event,
    props: ControllerImageUploaderProps,
    previewUrl: string | undefined,
  ) {
    if (!previewUrl || previewUrl === props.emptyPreviewUrl) return;
    this._failedPreviewUrl = previewUrl;
  }

  private _getUploadPolicyQuery(props: ControllerImageUploaderProps) {
    return this.$$modelImage.getUploadPolicy(props.imageScene as string);
  }

  private _getUploadPolicyState(props: ControllerImageUploaderProps): IImageUploaderPolicyState {
    const query = this._getUploadPolicyQuery(props);
    const policy = query?.data;
    return {
      acceptAttr: this._getAcceptAttr(props, policy),
      multiple: this._getEffectiveMultiple(props, policy),
      pending: !!query && query.data === undefined && !!(query.isPending || query.isFetching),
    };
  }

  private _getCachedUploadPolicy(props: ControllerImageUploaderProps) {
    return this._getUploadPolicyQuery(props)?.data;
  }

  private async _waitForUploadPolicy(props: ControllerImageUploaderProps) {
    await $QueryEnsureLoaded(() => this._getUploadPolicyQuery(props));
  }

  private async _chooseFiles(props: ControllerImageUploaderProps) {
    if (this.isUploading) return;
    try {
      await this._waitForUploadPolicy(props);
      if (this.isUploading) return;
      const policy = this._getUploadPolicyState(props);
      if (policy.pending) return;
      this.fileInputRef?.click();
    } catch (error: unknown) {
      const normalizedError = this._normalizeError(error);
      this.errorMessage = normalizedError.message || this.scope.locale.ImageUploadFailed();
      this._setError(normalizedError, props);
    }
  }

  private async _handleFileChange(event: Event, props: ControllerImageUploaderProps) {
    const input = event.target as HTMLInputElement;
    const files = Array.from(input.files ?? []);
    input.value = '';
    if (files.length === 0 || this.isUploading) return;
    const generation = ++this._generation;
    this.errorMessage = undefined;
    this.isUploading = true;
    try {
      await this._waitForUploadPolicy(props);
      if (generation !== this._generation) return;
      const multiple = this._getEffectiveMultiple(props);
      const policyState = this._getUploadPolicyState(props);
      const beforeUploadError = props.onBeforeUpload?.(files.length, policyState);
      if (beforeUploadError) throw new Error(beforeUploadError);
      const filesToUpload = multiple ? files : files.slice(0, 1);
      const results: IImageUploaderResult[] = [];
      for (const file of filesToUpload) {
        const validationError = this._validateFile(file, props);
        if (validationError) throw new Error(validationError);
        const preparedFile = await prepareImageFile(file, {
          appModal: this.$appModal,
          crop: props.crop,
          resize: props.resize,
        });
        if (generation !== this._generation) return;
        if (!preparedFile) continue;
        const preparedValidationError = this._validateFile(preparedFile, props);
        if (preparedValidationError) throw new Error(preparedValidationError);
        const result = await this._uploadPreparedFile(
          preparedFile,
          file,
          props,
          !!this._getCachedUploadPolicy(props)?.directUpload,
        );
        if (generation !== this._generation) return;
        results.push(result);
      }
      if (results.length === 0 || generation !== this._generation) return;
      for (const result of results) props.onUploaded?.(result);
      props.onUploadedBatch?.(results, policyState);
    } catch (error: unknown) {
      if (generation !== this._generation) return;
      this._setError(this._normalizeError(error), props);
    } finally {
      if (generation === this._generation) this.isUploading = false;
    }
  }

  private async _uploadPreparedFile(
    preparedFile: File,
    sourceFile: File,
    props: ControllerImageUploaderProps,
    directUpload: boolean,
  ): Promise<IImageUploaderResult> {
    const imageScene = props.imageScene;
    if (!imageScene) throw new Error(this.scope.locale.ImageUploadSceneRequired());
    if (!directUpload) {
      return await this.scope.api.image.upload({ imageScene, image: preparedFile });
    }
    const directUploadRes = await this.scope.api.image.createDirectUpload({
      imageScene,
      filename: preparedFile.name,
      size: preparedFile.size,
      mimeType: preparedFile.type || sourceFile.type,
    });
    const formData = new FormData();
    formData.append('file', preparedFile);
    const providerRes = await fetch(directUploadRes.uploadUrl, {
      method: 'POST',
      body: formData,
    });
    if (!providerRes.ok) {
      throw new Error(`image direct upload failed: ${providerRes.status}`);
    }
    return await this.scope.api.image.finalizeDirectUpload({ imageId: directUploadRes.id });
  }

  private _clear(props: ControllerImageUploaderProps) {
    if (this.isUploading) return;
    this._generation++;
    this.errorMessage = undefined;
    props.onCleared?.();
  }

  private _setError(error: Error, props: ControllerImageUploaderProps) {
    this.errorMessage = error.message || this.scope.locale.ImageUploadFailed();
    props.onError?.(error);
  }

  private _getEffectiveMultiple(
    props: ControllerImageUploaderProps,
    policy = this._getCachedUploadPolicy(props),
  ) {
    return !!policy?.multiple && props.multiple !== false;
  }

  private _getAcceptAttr(
    props: ControllerImageUploaderProps,
    policy = this._getCachedUploadPolicy(props),
  ) {
    const parts = [
      ...this._getExplicitAcceptTokens(props),
      ...(policy?.mimeTypes ?? []),
      ...(policy?.extensions ?? []),
    ];
    return parts.length > 0 ? parts.join(',') : 'image/*';
  }

  private _validateFile(file: File, props: ControllerImageUploaderProps) {
    if (file.size === 0) return this.scope.locale.ImageUploadFailed();
    const explicitTokens = this._getExplicitAcceptTokens(props);
    const policy = this._getCachedUploadPolicy(props);
    const policyTokens = [...(policy?.mimeTypes ?? []), ...(policy?.extensions ?? [])];
    if (!this._matchesImageFile(file)) return this.scope.locale.InvalidImageType();
    if (explicitTokens.length > 0 && !this._matchesAccept(file, explicitTokens)) {
      return this.scope.locale.InvalidImageType();
    }
    if (policyTokens.length > 0 && !this._matchesAccept(file, policyTokens)) {
      return this.scope.locale.InvalidImageType();
    }
    const maxSize = this._getMaxSize(props, policy?.maxSize);
    if (maxSize !== undefined && file.size > maxSize) {
      return this.scope.locale.ImageTooLarge(this._formatBytes(maxSize));
    }
    if (props.minSize !== undefined && file.size < props.minSize) {
      return this.scope.locale.ImageTooSmall(this._formatBytes(props.minSize));
    }
    return undefined;
  }

  private _getExplicitAcceptTokens(props: ControllerImageUploaderProps) {
    const accept = props.accept
      ? Array.isArray(props.accept)
        ? props.accept
        : props.accept.split(',')
      : [];
    return [...accept, ...(props.mimeTypes ?? []), ...(props.extensions ?? [])]
      .map(item => item.trim().toLowerCase())
      .filter(Boolean);
  }

  private _getMaxSize(props: ControllerImageUploaderProps, policyMaxSize?: number) {
    if (props.maxSize === undefined) return policyMaxSize;
    if (policyMaxSize === undefined) return props.maxSize;
    return Math.min(props.maxSize, policyMaxSize);
  }

  private _matchesImageFile(file: File) {
    return file.type.toLowerCase().startsWith('image/');
  }

  private _matchesAccept(file: File, tokens: string[]) {
    const mimeType = file.type.toLowerCase();
    const extension = this._getFileExtension(file.name);
    return tokens.some(token => {
      if (token === 'image/*') return mimeType.startsWith('image/');
      if (token.startsWith('.')) return extension === token;
      if (token.endsWith('/*')) return mimeType.startsWith(token.slice(0, -1));
      return mimeType === token;
    });
  }

  private _getFileExtension(filename: string) {
    const index = filename.lastIndexOf('.');
    return index === -1 ? '' : filename.slice(index).toLowerCase();
  }

  private _normalizeError(error: unknown) {
    return error instanceof Error ? error : new Error(String(error));
  }

  private _formatBytes(size: number) {
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${Math.ceil(size / 1024)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  }
}
