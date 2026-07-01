import { BeanBase } from 'vona';
import { ImageScene } from 'vona-module-a-image';

@ImageScene({
  upload: {
    maxSize: 2 * 1024 * 1024,
    mimeTypes: ['image/png', 'image/jpeg', 'image/webp'],
  },
})
export class ImageSceneStudentImage extends BeanBase {}
