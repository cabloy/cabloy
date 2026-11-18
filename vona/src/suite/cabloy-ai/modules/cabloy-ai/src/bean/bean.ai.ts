import { BeanBase } from 'vona';
import { Bean } from 'vona-module-a-bean';

import type { IAiSceneRecord, TypeAiSceneOverrides } from '../types/aiScene.ts';

@Bean()
export class BeanAi extends BeanBase {
  async create(
    sceneName: keyof IAiSceneRecord = 'cabloy-ai:default',
    overrides?: TypeAiSceneOverrides,
  ) {
    return await this.scope.service.configuration.create(sceneName, overrides);
  }
}
