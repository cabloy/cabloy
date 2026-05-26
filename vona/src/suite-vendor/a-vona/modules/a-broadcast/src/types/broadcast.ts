import type { OmitNever } from 'vona';
import type { IGeneralInfoOptions } from 'vona-module-a-executor';
import type { ServiceOnion } from 'vona-module-a-onion';

export interface IBroadcastEmitOptions extends IGeneralInfoOptions {}

export interface IBroadcastExecute<DATA = unknown> {
  execute(data?: DATA, isEmitter?: boolean): Promise<void>;
}

export interface IBroadcastJobContext<DATA> {
  broadcastName: keyof IBroadcastRecord;
  data?: DATA;
  options?: IBroadcastEmitOptions;
  callerId?: string;
}

export interface IBroadcastRecord {}

export interface IDecoratorBroadcastOptions {
  transaction?: boolean;
  instance?: boolean;
}

declare module 'vona-module-a-onion' {
  export interface BeanOnion {
    broadcast: ServiceOnion<IBroadcastRecord>;
  }
}

declare module 'vona' {
  export interface ConfigOnions {
    broadcast: OmitNever<IBroadcastRecord>;
  }

  export interface IBeanSceneRecord {
    broadcast: never;
  }
}
