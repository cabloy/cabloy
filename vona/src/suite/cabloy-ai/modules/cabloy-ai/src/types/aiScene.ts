import type { OmitNever } from 'vona';
import type { ServiceOnion } from 'vona-module-a-onion';

import type { IAiModelDefinition } from './config.ts';

export interface IAiSceneRecord {}
export interface IAiLimits {
  maxInputCharacters: number;
  maxOutputTokens: number;
  timeoutMs: number;
}
export interface IDecoratorAiSceneOptions extends Omit<IAiModelDefinition, 'provider' | 'modelId'> {
  aiModel?: string;
  instructions?: string;
  limits?: Partial<IAiLimits>;
}
export type TypeAiSceneOverrides = Omit<IDecoratorAiSceneOptions, 'enabled' | 'limits'>;

declare module 'vona-module-a-onion' {
  export interface BeanOnion {
    aiScene: ServiceOnion<IAiSceneRecord>;
  }
}
declare module 'vona' {
  export interface ConfigOnions {
    aiScene: OmitNever<IAiSceneRecord>;
  }
  export interface IBeanSceneRecord {
    aiScene: never;
  }
}
