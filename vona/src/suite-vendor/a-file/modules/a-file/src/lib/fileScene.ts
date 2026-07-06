import { createBeanDecorator } from 'vona';

import type { IDecoratorFileSceneOptions } from '../types/fileScene.ts';

export function FileScene(options?: IDecoratorFileSceneOptions): ClassDecorator {
  return createBeanDecorator('fileScene', options);
}
