import type { SharpConstructor } from 'sharp';
import type {
  EntityImage,
  IImageDeliveryOptions,
  IImageDirectUploadInput,
  IImageProviderDirectUploadResource,
  IImageProviderResolvedVariant,
  IImageProviderResource,
  IImageTransformOptions,
  IImageUploadInput,
  IImageVariantRequest,
} from 'vona-module-a-image';
import type { IUploadFile } from 'vona-module-a-upload';

import fse from 'fs-extra';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { BeanBase, getRuntimePathPhysicalRoot, uuidv4 } from 'vona';
import { Service } from 'vona-module-a-bean';
import { resolveImageVariantRequestToTransform } from 'vona-module-a-image';

import type { IImageProviderNativeClientOptions } from '../bean/imageProvider.native.ts';

type IImageNativeStoredImage = Pick<
  EntityImage,
  'id' | 'resourceId' | 'filename' | 'contentType' | 'public' | 'storagePath' | 'variants'
>;

type IImageNativeDraftImage = Pick<
  EntityImage,
  | 'resourceId'
  | 'filename'
  | 'contentType'
  | 'meta'
  | 'imageScene'
  | 'public'
  | 'storagePath'
  | 'deliveryBaseUrl'
  | 'variants'
  | 'clientName'
>;

@Service()
export class ServiceImageNative extends BeanBase {
  private _sharpInstance: SharpConstructor;

  private async getSharp() {
    if (!this._sharpInstance) {
      this._sharpInstance = (await import('sharp')).default;
    }
    return this._sharpInstance;
  }

  async upload(
    input: IImageUploadInput,
    options: IImageProviderNativeClientOptions,
  ): Promise<IImageProviderResource> {
    const resourceId = uuidv4();
    const isPublic = input.public ?? options.public;
    const targetPath = await this._getFinalPath(
      resourceId,
      input.filename,
      isPublic,
      options,
      input.file,
    );
    await fse.ensureDir(path.dirname(targetPath));
    await fse.copy(input.file, targetPath);
    return await this._buildStoredResource(targetPath, {
      resourceId,
      filename: input.filename,
      contentType: input.contentType,
      meta: input.meta,
      public: isPublic,
      variants: options.variants ?? this.scope.config.imageNative.variants,
      deliveryBaseUrl: options.deliveryBaseUrl,
    });
  }

  async createDirectUpload(
    input: IImageDirectUploadInput,
    options: IImageProviderNativeClientOptions,
  ): Promise<IImageProviderDirectUploadResource> {
    const resourceId = this._sanitizeResourceId(input.customId) ?? uuidv4();
    const isPublic = input.public ?? options.public;
    const storagePath = await this._getFinalPath(resourceId, input.filename, isPublic, options);
    const routePath = this.scope.util.combineApiPath(
      `image-native/direct-upload/${encodeURIComponent(resourceId)}`,
      false,
      true,
    );
    const tokenPath = this.scope.util.combineApiPath(
      'image-native/direct-upload/:resourceId',
      false,
      true,
    );
    const tokenPayload = await this.bean.imageUploadPolicy.createDirectUploadToken({
      resourceId,
      path: tokenPath,
    });
    const uploadUrl = new URL(this.app.util.getAbsoluteUrlByApiPath(routePath));
    uploadUrl.searchParams.set('token', tokenPayload.token);
    return {
      resourceId,
      filename: input.filename,
      contentType: input.contentType,
      meta: input.meta,
      public: isPublic,
      variants: options.variants ?? this.scope.config.imageNative.variants,
      deliveryBaseUrl: options.deliveryBaseUrl,
      storagePath,
      uploadUrl: uploadUrl.toString(),
      draft: true,
    };
  }

  async uploadDirectFile(image: IImageNativeDraftImage, file: IUploadFile) {
    const draftPath = this._getDraftPath(image.storagePath, image.resourceId);
    await fse.ensureDir(path.dirname(draftPath));
    await fse.move(file.file, draftPath, { overwrite: true });
    return draftPath;
  }

  async finalizeDirectUpload(
    image: IImageNativeDraftImage,
    options: IImageProviderNativeClientOptions,
  ): Promise<IImageProviderResource | undefined> {
    const isPublic = image.public ?? options.public;
    const storagePath =
      image.storagePath ??
      (await this._getFinalPath(image.resourceId, image.filename, isPublic, options));
    const draftPath = this._getDraftPath(storagePath, image.resourceId);
    if (!(await fse.pathExists(draftPath))) return undefined;
    await fse.ensureDir(path.dirname(storagePath));
    await fse.move(draftPath, storagePath, { overwrite: true });
    return await this._buildStoredResource(storagePath, {
      resourceId: image.resourceId,
      filename: image.filename,
      contentType: image.contentType,
      meta: image.meta,
      public: isPublic,
      variants: image.variants ?? options.variants ?? this.scope.config.imageNative.variants,
      deliveryBaseUrl: image.deliveryBaseUrl ?? options.deliveryBaseUrl,
    });
  }

  async remove(image: IImageNativeStoredImage) {
    if (!image.storagePath) return;
    const dir = path.dirname(image.storagePath);
    if (!(await fse.pathExists(dir))) return;
    const draftPath = this._getDraftPath(image.storagePath, image.resourceId);
    await fse.remove(draftPath);
    const entries = await fse.readdir(dir);
    await Promise.all(
      entries
        .filter(
          name =>
            name === path.basename(image.storagePath!) || name.startsWith(`${image.resourceId}__`),
        )
        .map(name => fse.remove(path.join(dir, name))),
    );
  }

  async getVariantUrl(
    image: IImageNativeStoredImage,
    request: IImageVariantRequest,
    options: IImageProviderNativeClientOptions,
    _deliveryOptions?: IImageDeliveryOptions,
  ) {
    if (!(image.public ?? options.public)) {
      throw new Error(
        `Private image-native variant URL requires signed delivery: ${image.resourceId}`,
      );
    }
    const resolved = resolveImageVariantRequestToTransform(request, 'original', image.variants);
    if (
      resolved.variantName === 'original' &&
      this._isOriginalTransform(resolved.transformOptions)
    ) {
      return await this._getOriginalUrl(image, options);
    }
    const targetPath = await this._ensureVariantFile(image, resolved);
    return await this._buildUrl(targetPath, options.deliveryBaseUrl);
  }

  async downloadBuffer(
    image: IImageNativeStoredImage,
    request: IImageVariantRequest,
  ): Promise<{
    buffer: Buffer;
    filename?: string;
    contentType?: string;
  } | null> {
    if (!image.storagePath) {
      throw new Error(`Image storage path missing: ${image.resourceId}`);
    }
    const resolved = resolveImageVariantRequestToTransform(request, 'original', image.variants);
    const targetPath =
      resolved.variantName === 'original' && this._isOriginalTransform(resolved.transformOptions)
        ? image.storagePath
        : await this._ensureVariantFile(image, resolved);
    if (!(await fse.pathExists(targetPath))) return null;
    return {
      buffer: await fse.readFile(targetPath),
      filename: image.filename,
      contentType: this._resolveContentType(
        targetPath,
        image.contentType,
        resolved.transformOptions,
      ),
    };
  }

  private async _buildStoredResource(
    targetPath: string,
    data: {
      resourceId: string;
      filename?: string;
      contentType?: string;
      meta?: Record<string, unknown>;
      public?: boolean;
      variants?: EntityImage['variants'];
      deliveryBaseUrl?: string;
    },
  ): Promise<IImageProviderResource> {
    const sharp = await this.getSharp();
    const metadata = await sharp(targetPath).metadata();
    const stat = await fse.stat(targetPath);
    return {
      resourceId: data.resourceId,
      filename: data.filename,
      contentType: data.contentType,
      size: Number(stat.size),
      width: metadata.width,
      height: metadata.height,
      public: data.public,
      variants: data.variants,
      meta: data.meta,
      storagePath: targetPath,
      deliveryBaseUrl: data.deliveryBaseUrl,
    };
  }

  private async _getFinalPath(
    resourceId: string,
    filename: string | undefined,
    isPublic: boolean | undefined,
    options: IImageProviderNativeClientOptions,
    filePath?: string,
  ) {
    const basePath = await this._getBasePath(isPublic, options);
    const ext = this._getOriginalExt(filename, filePath ?? resourceId);
    return path.join(basePath, `${resourceId}${ext}`);
  }

  private async _getBasePath(
    isPublic: boolean | undefined,
    options: IImageProviderNativeClientOptions,
  ) {
    if (isPublic) {
      return await this.app.util.getPublicPathPhysical(
        path.join('image-native', options.subdir ?? 'default'),
        true,
      );
    }
    const runtimeRoot = getRuntimePathPhysicalRoot(this.app);
    const basePath = path.join(
      runtimeRoot,
      this.ctx.instance.id.toString(),
      'image-native',
      options.subdir ?? 'default',
    );
    await fse.ensureDir(basePath);
    return basePath;
  }

  private _getDraftPath(storagePath: string | undefined, resourceId: string) {
    if (!storagePath) {
      throw new Error(`Image storage path missing: ${resourceId}`);
    }
    const dir = path.dirname(storagePath);
    const ext = path.extname(storagePath) || '.bin';
    return path.join(dir, `${resourceId}__draft${ext}`);
  }

  private async _ensureVariantFile(
    image: IImageNativeStoredImage,
    resolved: IImageProviderResolvedVariant,
  ) {
    if (!image.storagePath) {
      throw new Error(`Image storage path missing: ${image.resourceId}`);
    }
    const targetPath = await this._getVariantAbsolutePath(image, resolved);
    if (!(await fse.pathExists(targetPath))) {
      await this._writeTransformedFile(image.storagePath, targetPath, resolved.transformOptions);
    }
    return targetPath;
  }

  private async _writeTransformedFile(
    sourcePath: string,
    targetPath: string,
    transformOptions: IImageTransformOptions,
  ) {
    await fse.ensureDir(path.dirname(targetPath));
    if (this._isOriginalTransform(transformOptions)) {
      await fse.copy(sourcePath, targetPath, { overwrite: true });
      return;
    }
    const sharp = await this.getSharp();
    let pipeline = sharp(sourcePath, { failOn: 'none' });
    const width =
      transformOptions.width && transformOptions.dpr
        ? Math.round(transformOptions.width * transformOptions.dpr)
        : transformOptions.width;
    const height =
      transformOptions.height && transformOptions.dpr
        ? Math.round(transformOptions.height * transformOptions.dpr)
        : transformOptions.height;
    if (
      width ||
      height ||
      transformOptions.fit ||
      transformOptions.gravity ||
      transformOptions.background
    ) {
      pipeline = pipeline.resize({
        width,
        height,
        fit: this._mapFit(transformOptions.fit),
        position: this._mapGravity(transformOptions.gravity),
        background: transformOptions.background,
      });
    }
    if (transformOptions.rotate !== undefined) {
      pipeline = pipeline.rotate(transformOptions.rotate);
    }
    if (transformOptions.sharpen !== undefined) {
      pipeline = pipeline.sharpen({ sigma: transformOptions.sharpen });
    }
    const format = this._normalizeFormat(transformOptions.format);
    if (format === 'jpeg') {
      pipeline = pipeline.jpeg({ quality: transformOptions.quality });
    } else if (format === 'png') {
      pipeline = pipeline.png({ quality: transformOptions.quality });
    } else if (format === 'webp') {
      pipeline = pipeline.webp({ quality: transformOptions.quality });
    } else if (format === 'avif') {
      pipeline = pipeline.avif({ quality: transformOptions.quality });
    }
    await pipeline.toFile(targetPath);
  }

  private async _getOriginalUrl(
    image: IImageNativeStoredImage,
    options: IImageProviderNativeClientOptions,
  ) {
    if (!image.storagePath) {
      throw new Error(`Image storage path missing: ${image.resourceId}`);
    }
    return await this._buildUrl(image.storagePath, options.deliveryBaseUrl);
  }

  private async _buildUrl(targetPath: string, deliveryBaseUrl?: string) {
    const variantPath = await this._getVariantStaticPath(targetPath);
    if (deliveryBaseUrl) {
      return `${deliveryBaseUrl.replace(/\/$/, '')}/${variantPath}`;
    }
    return this.app.util.combineStaticPath(`/${variantPath}`);
  }

  private async _getVariantStaticPath(targetPath: string) {
    const publicRoot = await this.app.util.getPublicPathPhysical(undefined, true);
    const relativePath = path.relative(publicRoot, targetPath);
    if (relativePath.startsWith('..') || path.isAbsolute(relativePath)) {
      throw new Error(`Image target path is not publicly accessible: ${targetPath}`);
    }
    return path.posix.join(
      'public',
      this.ctx.instance.id.toString(),
      relativePath.split(path.sep).join(path.posix.sep),
    );
  }

  private async _getVariantAbsolutePath(
    image: IImageNativeStoredImage,
    resolved: IImageProviderResolvedVariant,
  ) {
    if (!image.storagePath) throw new Error(`Image storage path missing: ${image.resourceId}`);
    const dir = path.dirname(image.storagePath);
    const ext = this._getVariantExt(image.filename, image.storagePath, resolved.transformOptions);
    if (resolved.variantName !== 'custom') {
      const variantName = this._sanitizeVariantName(resolved.variantName);
      return path.join(dir, `${image.resourceId}__${variantName}${ext}`);
    }
    const transformKey = this._buildTransformKey(resolved.transformOptions);
    return path.join(dir, `${image.resourceId}__t_${transformKey}${ext}`);
  }

  private _getVariantExt(
    filename: string | undefined,
    storagePath: string | undefined,
    transformOptions: IImageTransformOptions,
  ) {
    const format = this._normalizeFormat(transformOptions.format);
    if (format) {
      return format === 'jpeg' ? '.jpg' : `.${format}`;
    }
    return path.extname(filename ?? '') || path.extname(storagePath ?? '') || '.bin';
  }

  private _getOriginalExt(filename: string | undefined, filePath: string) {
    return path.extname(filename ?? '') || path.extname(filePath) || '.bin';
  }

  private _normalizeFormat(format: IImageTransformOptions['format']) {
    if (!format || format === 'auto') return undefined;
    return format === 'jpeg' ? 'jpeg' : format;
  }

  private _resolveContentType(
    targetPath: string,
    contentType: string | undefined,
    transformOptions: IImageTransformOptions,
  ) {
    const format = this._normalizeFormat(transformOptions.format);
    if (format === 'jpeg') return 'image/jpeg';
    if (format === 'png') return 'image/png';
    if (format === 'webp') return 'image/webp';
    if (format === 'avif') return 'image/avif';
    const ext = path.extname(targetPath).toLowerCase();
    if (ext === '.jpg' || ext === '.jpeg') return 'image/jpeg';
    if (ext === '.png') return 'image/png';
    if (ext === '.webp') return 'image/webp';
    if (ext === '.avif') return 'image/avif';
    return contentType;
  }

  private _buildTransformKey(transformOptions: IImageTransformOptions) {
    const stable = this._stableStringify(transformOptions);
    return createHash('sha1').update(stable).digest('hex').slice(0, 12);
  }

  private _stableStringify(value: unknown): string {
    if (Array.isArray(value)) {
      return `[${value.map(item => this._stableStringify(item)).join(',')}]`;
    }
    if (value && typeof value === 'object') {
      const entries = Object.entries(value as Record<string, unknown>).sort(([a], [b]) =>
        a.localeCompare(b),
      );
      return `{${entries
        .map(([key, item]) => `${JSON.stringify(key)}:${this._stableStringify(item)}`)
        .join(',')}}`;
    }
    return JSON.stringify(value);
  }

  private _sanitizeResourceId(resourceId: string | undefined) {
    if (!resourceId) return undefined;
    const sanitized = resourceId.replace(/[^\w.-]/g, '-');
    return sanitized || undefined;
  }

  private _sanitizeVariantName(variantName: string) {
    return variantName.replace(/[^\w.-]/g, '-');
  }

  private _isOriginalTransform(transformOptions: IImageTransformOptions) {
    return Object.keys(transformOptions).length === 0;
  }

  private _mapFit(fit: IImageTransformOptions['fit']) {
    if (fit === 'scale-down') return 'inside' as const;
    if (fit === 'contain' || fit === 'pad') return 'contain' as const;
    if (fit === 'cover' || fit === 'crop') return 'cover' as const;
    return undefined;
  }

  private _mapGravity(gravity: IImageTransformOptions['gravity']) {
    if (gravity === 'top') return 'north';
    if (gravity === 'bottom') return 'south';
    if (gravity === 'left') return 'west';
    if (gravity === 'right') return 'east';
    return 'centre';
  }
}
