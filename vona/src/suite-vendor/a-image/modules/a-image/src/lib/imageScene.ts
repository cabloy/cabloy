import { createBeanDecorator } from 'vona';

import type { IDecoratorImageSceneOptions } from '../types/imageScene.ts';

export function ImageScene(options?: IDecoratorImageSceneOptions): ClassDecorator {
  return createBeanDecorator('imageScene', options);
}
