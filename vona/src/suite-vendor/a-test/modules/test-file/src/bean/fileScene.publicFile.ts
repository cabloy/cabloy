import { BeanBase } from 'vona';
import { FileScene } from 'vona-module-a-file';

@FileScene({
  public: true,
  upload: {
    maxSize: 2 * 1024 * 1024,
    mimeTypes: ['text/plain'],
  },
})
export class FileScenePublicFile extends BeanBase {}
