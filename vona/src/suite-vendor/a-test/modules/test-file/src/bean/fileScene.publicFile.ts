import { BeanBase } from 'vona';
import { FileScene } from 'vona-module-a-file';

@FileScene({
  upload: {
    maxSize: 2 * 1024 * 1024,
    mimeTypes: ['text/plain'],
    public: true,
  },
})
export class FileScenePublicFile extends BeanBase {}
