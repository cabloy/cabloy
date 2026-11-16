import { BeanBase } from 'vona';
import { ImageScene } from 'vona-module-a-image';

@ImageScene({
  public: false,
  processing: {
    enableCrop: false,
    resize: {
      width: 1280,
      height: 1280,
      fit: 'contain',
      format: 'jpeg',
      quality: 90,
    },
  },
  upload: {
    maxSize: 2 * 1024 * 1024,
    mimeTypes: ['image/png', 'image/jpeg', 'image/webp'],
    multiple: true,
  },
})
export class ImageSceneSceneImage extends BeanBase {}
