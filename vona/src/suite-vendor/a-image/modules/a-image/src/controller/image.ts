import type { IUploadFile } from 'vona-module-a-upload';
import type { IDecoratorControllerOptions } from 'vona-module-a-web';

import { BeanBase } from 'vona';
import { Core } from 'vona-module-a-core';
import { Api, v } from 'vona-module-a-openapiutils';
import { Passport } from 'vona-module-a-user';
import { Arg, Controller, Web } from 'vona-module-a-web';

import { DtoImageDeliveryRequest } from '../dto/imageDeliveryRequest.ts';
import { DtoImageDirectUploadFinalizeRequest } from '../dto/imageDirectUploadFinalizeRequest.ts';
import { DtoImageDirectUploadFinalizeResponse } from '../dto/imageDirectUploadFinalizeResponse.ts';
import { DtoImageDirectUploadRequest } from '../dto/imageDirectUploadRequest.ts';
import { DtoImageDirectUploadResponse } from '../dto/imageDirectUploadResponse.ts';
import { DtoImageUploadPolicyRequest } from '../dto/imageUploadPolicyRequest.ts';
import { DtoImageUploadPolicyResponse } from '../dto/imageUploadPolicyResponse.ts';
import { DtoImageUploadResponse } from '../dto/imageUploadResponse.ts';
import { DtoImageUploadTokenRequest } from '../dto/imageUploadTokenRequest.ts';
import { DtoImageUploadTokenResponse } from '../dto/imageUploadTokenResponse.ts';
import { DtoImageUploadUrlRequest } from '../dto/imageUploadUrlRequest.ts';

export interface IControllerOptionsImage extends IDecoratorControllerOptions {}

@Controller<IControllerOptionsImage>({ path: 'image' })
export class ControllerImage extends BeanBase {
  @Web.post('upload-policy')
  @Api.body(DtoImageUploadPolicyResponse)
  async getUploadPolicy(@Arg.body() data: DtoImageUploadPolicyRequest) {
    return await this.bean.imageUploadPolicy.resolveSceneUploadPolicy(data);
  }

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
    await this.bean.imageUploadPolicy.validateUploadFile(
      {
        file: file.file,
        filename: file.info.filename,
        mimeType: file.info.mimeType,
      },
      payload,
    );
    const image = await this.bean.image.upload(
      payload.providerName,
      {
        file: file.file,
        filename: file.info.filename,
        contentType: file.info.mimeType,
        requireSignedURLs: payload.requireSignedURLs,
      },
      {
        clientName: payload.clientName,
        meta: payload.meta,
        imageScene: payload.imageScene,
      },
    );
    return await this.bean.image.createImageActionResponse(image);
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
        requireSignedURLs: policy.requireSignedURLs,
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

  @Web.post('direct-upload/finalize')
  @Api.body(DtoImageDirectUploadFinalizeResponse)
  async finalizeDirectUpload(@Arg.body() data: DtoImageDirectUploadFinalizeRequest) {
    const image = await this.bean.image.finalizeDirectUpload(data.imageId);
    return await this.bean.image.createImageActionResponse(image);
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
        requireSignedURLs: policy.requireSignedURLs,
      },
      {
        clientName: policy.clientName,
        meta: policy.meta,
        imageScene: policy.imageScene,
      },
    );
    return await this.bean.image.createImageActionResponse(image);
  }

  @Web.get('delivery/:imageId')
  @Passport.public()
  async delivery(
    @Arg.param('imageId', v.tableIdentity()) imageId: number,
    @Arg.query(v.object(DtoImageDeliveryRequest)) query: DtoImageDeliveryRequest,
  ) {
    const payload = await this.bean.imageUploadPolicy.verifyDeliveryToken(
      query.token,
      this.scope.util.combineApiPath(`image/delivery/${imageId}`, false, true),
    );
    if (String(payload.imageId) !== String(imageId)) {
      return this.app.throw(401);
    }
    this.ctx.redirect(payload.targetUrl);
  }
}
