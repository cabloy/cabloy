import type { IUploadFile } from 'vona-module-a-upload';
import type { IDecoratorControllerOptions } from 'vona-module-a-web';

import fse from 'fs-extra';
import { BeanBase } from 'vona';
import { Core } from 'vona-module-a-core';
import { Passport } from 'vona-module-a-user';
import { Arg, Controller, Web } from 'vona-module-a-web';

export interface IControllerOptionsImage extends IDecoratorControllerOptions {}

@Controller<IControllerOptionsImage>({ path: 'image-native' })
export class ControllerImage extends BeanBase {
  @Web.post('direct-upload/:resourceId')
  @Passport.public()
  @Core.fileUpload()
  async directUpload(
    @Arg.param('resourceId') resourceId: string,
    @Arg.query('token') token: string,
    @Arg.file('image') file: IUploadFile,
  ) {
    const payload = await this.bean.imageUploadPolicy.verifyDirectUploadToken(
      token,
      this.ctx.route.routePathRaw,
    );
    if (payload.resourceId !== resourceId) {
      return this.app.throw(401);
    }
    const modelImage = this.app.bean._getBean<any>('a-image.model.image' as never);
    const image = await modelImage.get({
      providerName: 'image-native:native',
      resourceId,
    });
    if (!image || image.status !== 'draft') {
      return this.app.throw(403, `image is not draft: ${resourceId}`);
    }
    if (!image.imageScene) {
      throw new Error(`image scene missing: ${resourceId}`);
    }
    const stat = await fse.stat(file.file);
    const policy = await this.bean.imageUploadPolicy.resolveUploadPolicy({
      imageScene: image.imageScene,
      size: Number(stat.size),
      mimeType: file.info.mimeType,
    });
    await this.bean.imageUploadPolicy.validateUploadFile(
      {
        file: file.file,
        filename: file.info.filename,
        mimeType: file.info.mimeType,
      },
      policy,
    );
    await this.scope.service.imageNative.uploadDirectFile(image, file);
    return { ok: true };
  }
}
