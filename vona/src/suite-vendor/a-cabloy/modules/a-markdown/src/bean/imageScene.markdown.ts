import { BeanBase } from 'vona';
import { ImageScene } from 'vona-module-a-image';

@ImageScene({
  public: true,
  upload: {
    maxSize: 5 * 1024 * 1024,
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
    extensions: ['.jpg', '.jpeg', '.png', '.webp'],
    multiple: false,
  },
})
export class ImageSceneMarkdown extends BeanBase {}
