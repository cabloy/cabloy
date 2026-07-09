import { BeanBase } from 'vona';
import { ImageScene } from 'vona-module-a-image';

@ImageScene({
  requireSignedURLs: true,
  upload: {
    maxSize: 2 * 1024 * 1024,
    mimeTypes: ['image/png', 'image/jpeg', 'image/webp'],
    multiple: true,
  },
})
export class ImageSceneSceneImage extends BeanBase {}
