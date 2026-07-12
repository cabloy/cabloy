import type {
  EntityFile,
  IFileProviderDeliveryOptions,
  IFileProviderResource,
  IFileUploadInput,
} from 'vona-module-a-file';

import fse from 'fs-extra';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { BeanBase, getRuntimePathPhysicalRoot, uuidv4 } from 'vona';
import { Service } from 'vona-module-a-bean';

import type { IFileProviderNativeClientOptions } from '../bean/fileProvider.native.ts';

type IFileNativeStoredFile = Pick<
  EntityFile,
  'id' | 'resourceId' | 'filename' | 'storagePath' | 'public' | 'objectKey' | 'deliveryBaseUrl'
>;

@Service()
export class ServiceFileNative extends BeanBase {
  async upload(
    input: IFileUploadInput,
    options: IFileProviderNativeClientOptions,
  ): Promise<IFileProviderResource> {
    const resourceId = uuidv4();
    const objectKey = this._getObjectKey(resourceId, input, options);
    const targetPath = await this._getTargetPath(
      objectKey,
      input.public ?? options.public,
      options,
    );
    await fse.ensureDir(path.dirname(targetPath));
    await fse.copy(input.file, targetPath);
    const stat = await fse.stat(targetPath);
    return {
      resourceId,
      objectKey,
      size: Number(stat.size),
      etag: await this._calculateEtag(targetPath),
      storagePath: targetPath,
      deliveryBaseUrl: options.deliveryBaseUrl,
      public: input.public ?? options.public,
    };
  }

  async remove(file: IFileNativeStoredFile) {
    if (!file.storagePath) return;
    if (!(await fse.pathExists(file.storagePath))) return;
    await fse.remove(file.storagePath);
  }

  async getDownloadUrl(
    file: IFileNativeStoredFile,
    options: IFileProviderNativeClientOptions,
    _deliveryOptions?: IFileProviderDeliveryOptions,
  ) {
    if (!file.storagePath) {
      throw new Error(`File storage path missing: ${file.resourceId}`);
    }
    if (!(file.public ?? options.public)) {
      const routePath = this.scope.util.combineApiPath('file/download', false, true);
      const routeUrl = this.app.util.getAbsoluteUrlByApiPath(routePath);
      const url = new URL(routeUrl);
      url.searchParams.set('fileId', String(file.id ?? file.resourceId));
      return url.toString();
    }
    return await this._buildUrl(file.storagePath, options.deliveryBaseUrl);
  }

  private async _getTargetPath(
    objectKey: string,
    isPublic: boolean | undefined,
    options: IFileProviderNativeClientOptions,
  ) {
    if (isPublic) {
      const publicPath = await this.app.util.getPublicPathPhysical(
        path.join('file-native', options.subdir ?? 'default'),
        true,
      );
      return path.join(publicPath, objectKey);
    }
    const runtimeRoot = getRuntimePathPhysicalRoot(this.app);
    const basePath = path.join(
      runtimeRoot,
      this.ctx.instance.id.toString(),
      'file-native',
      options.subdir ?? 'default',
    );
    await fse.ensureDir(basePath);
    return path.join(basePath, objectKey);
  }

  private _getObjectKey(
    resourceId: string,
    input: IFileUploadInput,
    options: IFileProviderNativeClientOptions,
  ) {
    if (input.objectKey) return input.objectKey.replace(/^\/+/, '');
    const ext = path.extname(input.filename ?? '') || path.extname(input.file) || '.bin';
    const prefix = options.subdir ? `${options.subdir.replace(/\/+$/, '')}/` : '';
    return `${prefix}${resourceId}${ext}`;
  }

  private async _buildUrl(targetPath: string, deliveryBaseUrl?: string) {
    const staticPath = await this._getStaticPath(targetPath);
    if (deliveryBaseUrl) {
      return `${deliveryBaseUrl.replace(/\/$/, '')}/${staticPath}`;
    }
    return this.app.util.combineStaticPath(`/${staticPath}`);
  }

  private async _getStaticPath(targetPath: string) {
    const publicRoot = await this.app.util.getPublicPathPhysical(undefined, true);
    const relativePath = path.relative(publicRoot, targetPath).split(path.sep).join(path.posix.sep);
    return path.posix.join('public', this.ctx.instance.id.toString(), relativePath);
  }

  private async _calculateEtag(targetPath: string) {
    const buffer = await fse.readFile(targetPath);
    return createHash('md5').update(buffer).digest('hex');
  }
}
