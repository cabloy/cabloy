import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { BeanBase, getRuntimePathPhysicalRoot } from 'vona';
import { Service } from 'vona-module-a-bean';

import type { DtoImageUploadBase64Request } from '../dto/imageUploadBase64Request.tsx';

import { decodeImageUploadBase64 } from '../lib/imageUploadBase64.ts';

@Service()
export class ServiceImageUpload extends BeanBase {
  async uploadBase64(data: DtoImageUploadBase64Request) {
    let decoded: Awaited<ReturnType<typeof decodeImageUploadBase64>>;
    try {
      decoded = await decodeImageUploadBase64(data);
    } catch {
      return this.app.throw(400, 'Invalid image content, filename or base64 encoding');
    }
    const policy = await this.bean.imageUploadPolicy.resolveUploadPolicy({
      imageScene: data.imageScene,
      size: decoded.buffer.length,
      mimeType: decoded.mimeType,
    });
    const directory = await mkdtemp(
      path.join(getRuntimePathPhysicalRoot(this.app), '.image-upload-'),
    );
    try {
      const file = path.join(directory, 'image');
      await writeFile(file, decoded.buffer, { flag: 'wx', mode: 0o600 });
      await this.bean.imageUploadPolicy.validateUploadFile(
        { file, filename: decoded.filename, mimeType: decoded.mimeType },
        policy,
      );
      const image = await this.bean.image.upload(
        policy.providerName,
        {
          file,
          filename: decoded.filename,
          contentType: decoded.mimeType,
          public: policy.public,
        },
        {
          clientName: policy.clientName,
          meta: policy.meta,
          imageScene: policy.imageScene,
        },
      );
      this.$logger.debug('image.uploadBase64.completed', {
        imageId: image.id,
        size: decoded.buffer.length,
        mimeType: decoded.mimeType,
      });
      return await this.bean.image.createImageActionResponse(image);
    } finally {
      await rm(directory, { recursive: true, force: true });
    }
  }
}
