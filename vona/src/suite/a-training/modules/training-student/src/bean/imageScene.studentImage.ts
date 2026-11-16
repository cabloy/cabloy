import { BeanBase } from 'vona';
import { ImageScene } from 'vona-module-a-image';

@ImageScene({
  public: true,
  processing: {
    enableCrop: true,
    cropAspectRatio: 1,
    resize: {
      width: 512,
      height: 512,
      fit: 'cover',
      format: 'jpeg',
      quality: 90,
    },
  },
  upload: {
    maxSize: 2 * 1024 * 1024,
    mimeTypes: ['image/png', 'image/jpeg', 'image/webp'],
  },
})
export class ImageSceneStudentImage extends BeanBase {}
