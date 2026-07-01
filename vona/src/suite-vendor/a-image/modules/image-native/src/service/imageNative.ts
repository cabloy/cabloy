import type {
  IImageNamedVariants,
  IImageProviderClientOptionsBase,
  IImageProviderResolvedVariant,
  IImageProviderResource,
  IImageTransformOptions,
  IImageUploadInput,
  IImageVariantRequest,
} from 'vona-module-a-image';

import fse from 'fs-extra';
import { createHash } from 'node:crypto';
import path from 'node:path';
import sharp from 'sharp';
import { BeanBase, uuidv4 } from 'vona';
import { Service } from 'vona-module-a-bean';
import { resolveImageVariantRequestToTransform } from 'vona-module-a-image';

export interface IImageProviderNativeClientRecord {
  default: never;
  local: never;
}

export interface IImageProviderNativeClientOptions extends IImageProviderClientOptionsBase {
  subdir?: string;
}

interface IImageNativeStoredImage {
  resourceId: string;
  filename?: string;
  storagePath?: string;
  variants?: IImageNamedVariants;
}

@Service()
export class ServiceImageNative extends BeanBase {
  async upload(
    input: IImageUploadInput,
    options: IImageProviderNativeClientOptions,
  ): Promise<IImageProviderResource> {
    const publicPath = await this.app.util.getPublicPathPhysical(
      path.join('image-native', options.subdir ?? 'default'),
      true,
    );
    const resourceId = uuidv4();
    const ext = this._getOriginalExt(input.filename, input.file);
    const targetName = `${resourceId}${ext}`;
    const targetPath = path.join(publicPath, targetName);
    await fse.copy(input.file, targetPath);
    const metadata = await sharp(targetPath).metadata();
    const stat = await fse.stat(targetPath);
    const variants = options.variants ?? this.scope.config.imageNative.variants;
    await this._generateNamedVariants(
      { resourceId, filename: input.filename, storagePath: targetPath, variants },
      options,
    );
    return {
      resourceId,
      size: Number(stat.size),
      width: metadata.width,
      height: metadata.height,
      storagePath: targetPath,
      deliveryBaseUrl: options.deliveryBaseUrl,
      requireSignedURLs: options.requireSignedURLs,
      variants,
    };
  }

  async remove(image: IImageNativeStoredImage) {
    if (!image.storagePath) return;
    const dir = path.dirname(image.storagePath);
    if (!(await fse.pathExists(dir))) return;
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
  ) {
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

  private async _generateNamedVariants(
    image: IImageNativeStoredImage,
    options: IImageProviderNativeClientOptions,
  ) {
    const variantNames = Object.keys(image.variants ?? {}) as Array<
      keyof NonNullable<IImageNamedVariants>
    >;
    for (const variantName of variantNames) {
      if (variantName === 'original') continue;
      await this._ensureVariantFile(
        image,
        resolveImageVariantRequestToTransform({ variantName }, 'original', image.variants),
      );
    }
    if (!image.variants?.original) return;
    await this.getVariantUrl(image, { variantName: 'original' }, options);
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
    const relativePath = path.relative(publicRoot, targetPath).split(path.sep).join(path.posix.sep);
    return path.posix.join('public', this.ctx.instance.id.toString(), relativePath);
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
    const cacheKey = this._buildTransformCacheKey(resolved.transformOptions);
    return path.join(dir, `${image.resourceId}__t_${cacheKey}${ext}`);
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

  private _buildTransformCacheKey(transformOptions: IImageTransformOptions) {
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
