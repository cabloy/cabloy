import type { IUploadFile } from 'vona-module-a-upload';
import type { IDecoratorControllerOptions } from 'vona-module-a-web';

import fse from 'fs-extra';
import { BeanBase } from 'vona';
import { Core } from 'vona-module-a-core';
import { Api } from 'vona-module-a-openapiutils';
import { Arg, Controller, Web } from 'vona-module-a-web';

import { DtoImageUploadResponse } from '../dto/imageUploadResponse.ts';

export interface IControllerOptionsImage extends IDecoratorControllerOptions {}

@Controller<IControllerOptionsImage>({ path: 'image' })
export class ControllerImage extends BeanBase {
  @Web.post('upload')
  @Core.fileUpload()
  @Api.body(DtoImageUploadResponse)
  @Api.contentType('application/json')
  async upload(@Arg.file('image') file: IUploadFile) {
    await this._validateUploadFile(file);
    const image = await this.bean.image.upload(
      this.scope.config.image.defaultProvider,
      {
        file: file.file,
        filename: file.info.filename,
        contentType: file.info.mimeType,
      },
      {
        clientName: this.scope.config.image.defaultClientName,
      },
    );
    return {
      ...image,
      url: await this.bean.image.getVariantUrl(image.id),
    };
  }

  private async _validateUploadFile(file: IUploadFile) {
    const uploadConfig = this.scope.config.image.upload;
    const stat = await fse.stat(file.file);
    if (uploadConfig.maxSize && Number(stat.size) > uploadConfig.maxSize) {
      return this.app.throw(403, `image too large: maxSize=${uploadConfig.maxSize}`);
    }
    if (uploadConfig.mimeTypes?.length && !uploadConfig.mimeTypes.includes(file.info.mimeType)) {
      return this.app.throw(403, `unsupported image mimeType: ${file.info.mimeType}`);
    }
  }
}
