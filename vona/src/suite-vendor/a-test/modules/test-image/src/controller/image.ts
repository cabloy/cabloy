import type { IUploadFile } from 'vona-module-a-upload';
import type { IDecoratorControllerOptions } from 'vona-module-a-web';

import { BeanBase } from 'vona';
import { Core } from 'vona-module-a-core';
import { Api } from 'vona-module-a-openapiutils';
import { Passport } from 'vona-module-a-user';
import { Arg, Controller, Web } from 'vona-module-a-web';

export interface IControllerOptionsImage extends IDecoratorControllerOptions {}

@Controller<IControllerOptionsImage>({ path: 'image', meta: { mode: ['test', 'dev'] } })
export class ControllerImage extends BeanBase {
  @Web.post('upload')
  @Passport.public()
  @Core.fileUpload()
  @Api.contentType('application/json')
  async upload(@Arg.file('image') file: IUploadFile) {
    return await this.bean.image.upload('image-native:native', {
      file: file.file,
      filename: file.info.filename,
      contentType: file.info.mimeType,
    });
  }
}
