import type { IUploadFile } from 'vona-module-a-upload';
import type { IDecoratorControllerOptions } from 'vona-module-a-web';

import fse from 'fs-extra';
import { BeanBase } from 'vona';
import { Core } from 'vona-module-a-core';
import { Api, v } from 'vona-module-a-openapiutils';
import { Arg, Controller, Web } from 'vona-module-a-web';

import type { IImageUploadTokenPayload } from '../types/image.ts';

import { DtoImageDeliveryRequest } from '../dto/imageDeliveryRequest.ts';
import { DtoImageDirectUploadRequest } from '../dto/imageDirectUploadRequest.ts';
import { DtoImageDirectUploadResponse } from '../dto/imageDirectUploadResponse.ts';
import { DtoImageUploadResponse } from '../dto/imageUploadResponse.ts';
import { DtoImageUploadTokenRequest } from '../dto/imageUploadTokenRequest.ts';
import { DtoImageUploadTokenResponse } from '../dto/imageUploadTokenResponse.ts';
import { DtoImageUploadUrlRequest } from '../dto/imageUploadUrlRequest.ts';

export interface IControllerOptionsImage extends IDecoratorControllerOptions {}

@Controller<IControllerOptionsImage>({ path: 'image' })
export class ControllerImage extends BeanBase {
  @Web.post('upload-token')
  @Api.body(DtoImageUploadTokenResponse)
  async createUploadToken(@Arg.body() data: DtoImageUploadTokenRequest) {
    return await this.bean.imageUploadPolicy.createUploadToken(data);
  }

  @Web.post('upload')
  @Core.fileUpload()
  @Api.body(DtoImageUploadResponse)
  @Api.contentType('application/json')
  async upload(@Arg.field('token') token: string, @Arg.file('image') file: IUploadFile) {
    const payload = await this.bean.imageUploadPolicy.verifyUploadToken(
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
      signed: !!image.requireSignedURLs,
    };
  }

  @Web.post('direct-upload')
  @Api.body(DtoImageDirectUploadResponse)
  async createDirectUpload(@Arg.body() data: DtoImageDirectUploadRequest) {
    const policy = await this.bean.imageUploadPolicy.resolveUploadPolicy({
      imageScene: data.imageScene,
      size: data.size,
      mimeType: data.mimeType,
    });
    return await this.bean.image.createDirectUpload(
      policy.providerName,
      {
        filename: data.filename,
        contentType: data.contentType,
        expiry: data.expiry,
        customId: data.customId,
      },
      {
        clientName: policy.clientName,
        meta: policy.meta,
        imageScene: policy.imageScene,
      },
    );
  }

  @Web.post('upload-url')
  @Api.body(DtoImageUploadResponse)
  async uploadUrl(@Arg.body() data: DtoImageUploadUrlRequest) {
    const policy = await this.bean.imageUploadPolicy.resolveUploadPolicy({
      imageScene: data.imageScene,
      size: data.size,
      mimeType: data.mimeType,
    });
    const image = await this.bean.image.uploadUrl(
      policy.providerName,
      {
        url: data.url,
        filename: data.filename,
        contentType: data.contentType,
      },
      {
        clientName: policy.clientName,
        meta: policy.meta,
        imageScene: policy.imageScene,
      },
    );
    return {
      ...image,
      url: await this.bean.image.getVariantUrl(image.id),
      signed: !!image.requireSignedURLs,
    };
  }

  @Web.get('delivery/:imageId')
  async delivery(
    @Arg.param('imageId', v.tableIdentity()) imageId: number,
    @Arg.query(v.object(DtoImageDeliveryRequest)) query: DtoImageDeliveryRequest,
  ) {
    const payload = await this.bean.imageUploadPolicy.verifyDeliveryToken(
      query.token,
      this.ctx.route.routePathRaw,
    );
    if (String(payload.imageId) !== String(imageId)) {
      return this.app.throw(401);
    }
    this.ctx.redirect(payload.targetUrl);
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
