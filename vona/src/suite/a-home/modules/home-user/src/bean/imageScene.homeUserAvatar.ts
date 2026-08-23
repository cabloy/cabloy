import { BeanBase } from 'vona';
import { ImageScene } from 'vona-module-a-image';

@ImageScene({
  public: true,
  upload: {
    maxSize: 2 * 1024 * 1024,
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
    extensions: ['.jpg', '.jpeg', '.png', '.webp'],
    multiple: false,
  },
  meta: ctx => {
    const user = ctx.state.passport?.user;
    if (!user || user.anonymous) return ctx.app.throw(401);
    return { ownerUserId: user.id.toString() };
  },
})
export class ImageSceneHomeUserAvatar extends BeanBase {}
