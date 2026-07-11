import type { IUploadFile } from 'vona-module-a-upload';
import type { IDecoratorControllerOptions } from 'vona-module-a-web';

import fse from 'fs-extra';
import { BeanBase } from 'vona';
import { Core } from 'vona-module-a-core';
import { Api, v } from 'vona-module-a-openapiutils';
import { Passport } from 'vona-module-a-user';
import { Arg, Controller, Web } from 'vona-module-a-web';
import z from 'zod';

import type { IFileSceneRecord } from '../types/fileScene.ts';

import { DtoFileDirectUploadFinalizeRequest } from '../dto/fileDirectUploadFinalizeRequest.ts';
import { DtoFileDirectUploadFinalizeResponse } from '../dto/fileDirectUploadFinalizeResponse.ts';
import { DtoFileDirectUploadRequest } from '../dto/fileDirectUploadRequest.ts';
import { DtoFileDirectUploadResponse } from '../dto/fileDirectUploadResponse.ts';
import { DtoFileDownloadRequest } from '../dto/fileDownloadRequest.ts';
import { DtoFileUploadPolicyRequest } from '../dto/fileUploadPolicyRequest.ts';
import { DtoFileUploadPolicyResponse } from '../dto/fileUploadPolicyResponse.ts';
import { DtoFileUploadResponse } from '../dto/fileUploadResponse.ts';
import { DtoFileUploadUrlRequest } from '../dto/fileUploadUrlRequest.ts';

export interface IControllerOptionsFile extends IDecoratorControllerOptions {}

@Controller<IControllerOptionsFile>({ path: 'file' })
export class ControllerFile extends BeanBase {
  @Web.post('upload-policy')
  @Api.body(DtoFileUploadPolicyResponse)
  async getUploadPolicy(@Arg.body() data: DtoFileUploadPolicyRequest) {
    return await this.bean.fileUploadPolicy.resolveSceneUploadPolicy(data);
  }

  @Web.post('upload')
  @Core.fileUpload({
    busboy: {
      limits: {
        fields: 1,
        files: 1,
        parts: 3,
      },
    },
  })
  @Api.body(DtoFileUploadResponse)
  @Api.contentType('application/json')
  async upload(
    @Arg.field('fileScene', v.required(), z.string()) fileScene: keyof IFileSceneRecord,
    @Arg.file('file', v.required()) file: IUploadFile,
  ) {
    const stat = await fse.stat(file.file);
    const policy = await this.bean.fileUploadPolicy.resolveUploadPolicy({
      fileScene,
      size: Number(stat.size),
      mimeType: file.info.mimeType,
    });
    await this.bean.fileUploadPolicy.validateUploadFile(
      {
        file: file.file,
        filename: file.info.filename,
        mimeType: file.info.mimeType,
      },
      policy,
    );
    const uploadedFile = await this.bean.file.upload(
      policy.providerName,
      {
        file: file.file,
        filename: file.info.filename,
        contentType: policy.mimeType,
        public: policy.public,
      },
      {
        clientName: policy.clientName,
        meta: policy.meta,
        public: policy.public,
        fileScene: policy.fileScene,
      },
    );
    return await this.bean.file.createFileActionResponse(uploadedFile);
  }

  @Web.post('direct-upload')
  @Api.body(DtoFileDirectUploadResponse)
  async createDirectUpload(@Arg.body() data: DtoFileDirectUploadRequest) {
    const policy = await this.bean.fileUploadPolicy.resolveUploadPolicy({
      fileScene: data.fileScene,
      size: data.size,
      mimeType: data.mimeType,
    });
    return await this.bean.file.createDirectUpload(
      policy.providerName,
      {
        filename: data.filename,
        contentType: policy.mimeType,
        size: policy.fileSize,
        public: policy.public,
        expiry: data.expiry,
      },
      {
        clientName: policy.clientName,
        meta: policy.meta,
        public: policy.public,
        fileScene: policy.fileScene,
      },
    );
  }

  @Web.post('direct-upload/finalize')
  @Api.body(DtoFileDirectUploadFinalizeResponse)
  async finalizeDirectUpload(@Arg.body() data: DtoFileDirectUploadFinalizeRequest) {
    const file = await this.bean.file.finalizeDirectUpload(data.fileId);
    return await this.bean.file.createFileActionResponse(file);
  }

  @Web.post('upload-url')
  @Api.body(DtoFileUploadResponse)
  async uploadUrl(@Arg.body() data: DtoFileUploadUrlRequest) {
    const policy = await this.bean.fileUploadPolicy.resolveUploadUrlPolicy({
      fileScene: data.fileScene,
    });
    const uploadedFile = await this.bean.file.uploadUrl(
      policy.providerName,
      {
        url: data.url,
        policy,
        filename: data.filename,
        public: policy.public,
      },
      {
        clientName: policy.clientName,
        meta: policy.meta,
        public: policy.public,
        fileScene: policy.fileScene,
      },
    );
    return await this.bean.file.createFileActionResponse(uploadedFile);
  }

  @Web.get('download/:fileId')
  @Passport.public()
  async download(
    @Arg.param('fileId', v.tableIdentity()) fileId: number,
    @Arg.query(v.object(DtoFileDownloadRequest)) query: DtoFileDownloadRequest,
  ) {
    const file = await this.bean.file.get(fileId);
    if (!file) return this.app.throw(404);
    if (!file.public) {
      const payload = await this.bean.fileUploadPolicy.verifyDownloadToken(
        query.token,
        this.scope.util.combineApiPath(`file/download/${fileId}`, false, true),
      );
      if (String(payload.fileId) !== String(fileId)) {
        return this.app.throw(401);
      }
    }
    const result = await this.bean.file.download(
      fileId,
      file.public
        ? undefined
        : {
            signed: false,
            responseMode: 'buffer',
          },
    );
    if (result.kind === 'url') {
      if (!result.url) {
        throw new Error(`file download url missing: ${fileId}`);
      }
      this.ctx.redirect(result.url);
      return;
    }
    if (result.contentType) {
      this.ctx.type = result.contentType;
    }
    if (result.filename) {
      this.ctx.attachment(result.filename);
    }
    this.ctx.body = result.buffer;
  }
}
