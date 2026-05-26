import type { IBeanSceneRecord, IDecoratorBeanOptionsBase } from 'vona';
import type { ServiceOnion } from 'vona-module-a-onion';

export type TypeHmrWatchScene =
  | keyof IBeanSceneRecord
  | '_error'
  | '_locale'
  | '_config'
  | '_constant';

export interface IHmrRecord {}

export interface IHmrReload {
  reload: (beanOptions: IDecoratorBeanOptionsBase) => Promise<void>;
}

declare module 'vona-module-a-onion' {
  export interface BeanOnion {
    hmr: ServiceOnion<IHmrRecord>;
  }
}

declare module 'vona' {
  export interface IBeanSceneRecord {
    hmr: never;
  }
}
