import { createBeanDecorator } from 'vona';

import type { IDecoratorAiSceneOptions } from '../types/aiScene.ts';

export function AiScene(options?: IDecoratorAiSceneOptions): ClassDecorator {
  return createBeanDecorator('aiScene', options);
}
