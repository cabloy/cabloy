import type { IUploadFile } from 'vona-module-a-upload';
import type { IDecoratorControllerOptions } from 'vona-module-a-web';

import fse from 'fs-extra';
import { BeanBase } from 'vona';
import { Core } from 'vona-module-a-core';
import { Api, v } from 'vona-module-a-openapiutils';
import { Arg, Controller, Web } from 'vona-module-a-web';

import type { IFileUploadTokenPayload } from '../types/file.ts';

import { DtoFileDirectUploadRequest } from '../dto/fileDirectUploadRequest.ts';
import { DtoFileDirectUploadResponse } from '../dto/fileDirectUploadResponse.ts';
import { DtoFileDownloadRequest } from '../dto/fileDownloadRequest.ts';
import { DtoFileUploadResponse } from '../dto/fileUploadResponse.ts';
import { DtoFileUploadTokenRequest } from '../dto/fileUploadTokenRequest.ts';
import { DtoFileUploadTokenResponse } from '../dto/fileUploadTokenResponse.ts';
import { DtoFileUploadUrlRequest } from '../dto/fileUploadUrlRequest.ts';

export interface IControllerOptionsFile extends IDecoratorControllerOptions {}

@Controller<IControllerOptionsFile>({ path: 'file' })
export class ControllerFile extends BeanBase {
  @Web.post('upload-token')
  @Api.body(DtoFileUploadTokenResponse)
  async createUploadToken(@Arg.body() data: DtoFileUploadTokenRequest) {
    return await this.bean.fileUploadPolicy.createUploadToken(data);
  }

  @Web.post('upload')
  @Core.fileUpload()
  @Api.body(DtoFileUploadResponse)
  @Api.contentType('application/json')
  async upload(@Arg.field('token') token: string, @Arg.file('file') file: IUploadFile) {
    const payload = await this.bean.fileUploadPolicy.verifyUploadToken(
      token,
      this.ctx.route.routePathRaw,
    );
    await this._validateUploadFile(file, payload);
    const uploadedFile = await this.bean.file.upload(
      payload.providerName,
      {
        file: file.file,
        filename: file.info.filename,
        contentType: file.info.mimeType,
        public: payload.public,
      },
      {
        clientName: payload.clientName,
        meta: payload.meta,
        public: payload.public,
        fileScene: payload.fileScene,
      },
    );
    return {
      ...uploadedFile,
      url: await this.bean.file.getDownloadUrl(uploadedFile.id),
      signed: !uploadedFile.public,
    };
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
        contentType: data.contentType,
        size: data.size,
        objectKey: data.objectKey,
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

  @Web.post('upload-url')
  @Api.body(DtoFileUploadResponse)
  async uploadUrl(@Arg.body() data: DtoFileUploadUrlRequest) {
    const policy = await this.bean.fileUploadPolicy.resolveUploadPolicy({
      fileScene: data.fileScene,
      size: data.size,
      mimeType: data.mimeType,
    });
    const uploadedFile = await this.bean.file.uploadUrl(
      policy.providerName,
      {
        url: data.url,
        filename: data.filename,
        contentType: data.contentType,
        size: data.size,
        objectKey: data.objectKey,
        public: policy.public,
      },
      {
        clientName: policy.clientName,
        meta: policy.meta,
        public: policy.public,
        fileScene: policy.fileScene,
      },
    );
    return {
      ...uploadedFile,
      url: await this.bean.file.getDownloadUrl(uploadedFile.id),
      signed: !uploadedFile.public,
    };
  }

  @Web.get('download/:fileId')
  async download(
    @Arg.param('fileId', v.tableIdentity()) fileId: number,
    @Arg.query(v.object(DtoFileDownloadRequest)) query: DtoFileDownloadRequest,
  ) {
    const file = await this.bean.file.get(fileId);
    if (!file) return this.app.throw(404);
    if (!file.public) {
      const payload = await this.bean.fileUploadPolicy.verifyDownloadToken(
        query.token,
        this.ctx.route.routePathRaw,
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

  private async _validateUploadFile(file: IUploadFile, payload: IFileUploadTokenPayload) {
    const stat = await fse.stat(file.file);
    const fileSize = Number(stat.size);
    if (fileSize !== payload.fileSize) {
      return this.app.throw(403, `file size mismatch: size=${fileSize}`);
    }
    if (payload.maxSize && fileSize > payload.maxSize) {
      return this.app.throw(403, `file too large: maxSize=${payload.maxSize}`);
    }
    const mimeType = file.info.mimeType.toLowerCase();
    if (mimeType !== payload.mimeType) {
      return this.app.throw(403, `file mimeType mismatch: mimeType=${mimeType}`);
    }
    if (payload.mimeTypes?.length && !this._matchesMimeType(mimeType, payload.mimeTypes)) {
      return this.app.throw(403, `unsupported file mimeType: ${mimeType}`);
    }
    const extension = this._getExtension(file.info.filename);
    if (payload.extensions?.length && extension && !payload.extensions.includes(extension)) {
      return this.app.throw(403, `unsupported file extension: ${extension}`);
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
