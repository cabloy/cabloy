import type { IImageProviderResource, IImageUploadInput } from 'vona-module-a-image';

import fse from 'fs-extra';
import path from 'node:path';
import { BeanBase, uuidv4 } from 'vona';
import { Service } from 'vona-module-a-bean';

export interface IImageProviderNativeClientRecord {
  default: never;
  local: never;
}

export interface IImageProviderNativeClientOptions {
  deliveryBaseUrl?: string;
  variants?: Record<string, string>;
  requireSignedURLs?: boolean;
  subdir?: string;
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
    const ext = path.extname(input.filename ?? '') || path.extname(input.file) || '.bin';
    const targetName = `${resourceId}${ext}`;
    const targetPath = path.join(publicPath, targetName);
    await fse.copy(input.file, targetPath);
    const stat = await fse.stat(targetPath);
    const variants = this._getVariants(resourceId, targetName, options);
    return {
      resourceId,
      size: Number(stat.size),
      storagePath: targetPath,
      deliveryBaseUrl: options.deliveryBaseUrl,
      requireSignedURLs: options.requireSignedURLs,
      variants,
    };
  }

  async remove(storagePath?: string) {
    if (!storagePath) return;
    if (await fse.pathExists(storagePath)) {
      await fse.remove(storagePath);
    }
  }

  getVariantUrl(
    resourceId: string,
    filename: string | undefined,
    variant: string,
    options: IImageProviderNativeClientOptions,
  ) {
    const variantPath = this._getVariantPath(resourceId, filename, variant, options);
    if (options.deliveryBaseUrl) {
      return `${options.deliveryBaseUrl.replace(/\/$/, '')}/${variantPath}`;
    }
    return this.app.util.combineStaticPath(`/${variantPath}`);
  }

  private _getVariants(
    resourceId: string,
    filename: string | undefined,
    options: IImageProviderNativeClientOptions,
  ) {
    const variants = options.variants ?? this.scope.config.imageNative.variants;
    return Object.keys(variants).map(variant =>
      this.getVariantUrl(resourceId, filename, variant, options),
    );
  }

  private _getVariantPath(
    resourceId: string,
    filename: string | undefined,
    _variant: string,
    options: IImageProviderNativeClientOptions,
  ) {
    const ext = path.extname(filename ?? '') || '.bin';
    const subdir = options.subdir ?? 'default';
    return path.posix.join(
      'public',
      this.ctx.instance.id.toString(),
      'image-native',
      subdir,
      `${resourceId}${ext}`,
    );
  }
}
