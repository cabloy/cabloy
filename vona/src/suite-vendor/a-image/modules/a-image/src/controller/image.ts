import type { IUploadFile } from 'vona-module-a-upload';
import type { IDecoratorControllerOptions } from 'vona-module-a-web';

import fse from 'fs-extra';
import { BeanBase } from 'vona';
import { Core } from 'vona-module-a-core';
import { Api } from 'vona-module-a-openapiutils';
import { Arg, Controller, Web } from 'vona-module-a-web';

import type { IImageUploadTokenPayload } from '../types/image.ts';

import { BeanImageUploadPolicy } from '../bean/bean.imageUploadPolicy.ts';
import { DtoImageUploadResponse } from '../dto/imageUploadResponse.ts';
import {
  DtoImageUploadTokenRequest,
  DtoImageUploadTokenResponse,
} from '../dto/imageUploadToken.ts';

export interface IControllerOptionsImage extends IDecoratorControllerOptions {}

@Controller<IControllerOptionsImage>({ path: 'image' })
export class ControllerImage extends BeanBase {
  @Web.post('upload-token')
  @Api.body(DtoImageUploadTokenResponse)
  async createUploadToken(@Arg.body() data: DtoImageUploadTokenRequest) {
    return await this._getBeanImageUploadPolicy().createUploadToken(data);
  }

  @Web.post('upload')
  @Core.fileUpload()
  @Api.body(DtoImageUploadResponse)
  @Api.contentType('application/json')
  async upload(@Arg.field('token') token: string, @Arg.file('image') file: IUploadFile) {
    const payload = await this._getBeanImageUploadPolicy().verifyUploadToken(
      token,
      this.ctx.route.routePathRaw,
    );
    await this._validateUploadFile(file, payload);
    const image = await this.bean.image.upload(
      payload.providerName,
      {
        file: file.file,
        filename: file.info.filename,
        contentType: file.info.mimeType,
      },
      {
        clientName: payload.clientName,
        meta: payload.meta,
        imageScene: payload.imageScene,
      },
    );
    return {
      ...image,
      url: await this.bean.image.getVariantUrl(image.id),
    };
  }

  private _getBeanImageUploadPolicy() {
    return this.bean._getBean(BeanImageUploadPolicy as any) as BeanImageUploadPolicy;
  }

  private async _validateUploadFile(file: IUploadFile, payload: IImageUploadTokenPayload) {
    const stat = await fse.stat(file.file);
    const fileSize = Number(stat.size);
    if (fileSize !== payload.fileSize) {
      return this.app.throw(403, `image size mismatch: size=${fileSize}`);
    }
    if (payload.maxSize && fileSize > payload.maxSize) {
      return this.app.throw(403, `image too large: maxSize=${payload.maxSize}`);
    }
    const mimeType = file.info.mimeType.toLowerCase();
    if (mimeType !== payload.mimeType) {
      return this.app.throw(403, `image mimeType mismatch: mimeType=${mimeType}`);
    }
    if (payload.mimeTypes?.length && !this._matchesMimeType(mimeType, payload.mimeTypes)) {
      return this.app.throw(403, `unsupported image mimeType: ${mimeType}`);
    }
    const extension = this._getExtension(file.info.filename);
    if (payload.extensions?.length && extension && !payload.extensions.includes(extension)) {
      return this.app.throw(403, `unsupported image extension: ${extension}`);
    }
  }

  private _matchesMimeType(mimeType: string, mimeTypes: string[]) {
    return mimeTypes.some(item => {
      if (item === mimeType) return true;
      if (item.endsWith('/*')) {
        return mimeType.startsWith(`${item.slice(0, -1)}`);
      }
      return false;
    });
  }

  private _getExtension(filename?: string) {
    if (!filename) return '';
    const index = filename.lastIndexOf('.');
    if (index === -1) return '';
    return filename.slice(index).toLowerCase();
  }
}
