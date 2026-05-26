import type { IInstanceRecord, IProtocolKeyRecord, VonaConfigOptional, VonaContext } from 'vona';
import type { IDatabaseClientRecord } from 'vona-module-a-orm';

import type { EntityInstance } from '../entity/instance.ts';
import 'vona';

export interface ConfigInstanceBase {
  password?: string;
  title?: string;
  config?: VonaConfigOptional;
  id?: number;
  isolate?: boolean;
  isolateClient?: keyof IDatabaseClientRecord;
}

export type TypeGetInstanceNameFn = (ctx: VonaContext) => keyof IInstanceRecord | undefined | null;

export interface ConfigInstance {
  getInstanceName?: TypeGetInstanceNameFn;
  queryField?: keyof IProtocolKeyRecord;
  headerField?: keyof IProtocolKeyRecord;
  instances: Record<keyof IInstanceRecord, ConfigInstanceBase | false>;
}

declare module 'vona' {
  export interface VonaContext {
    instance: EntityInstance;
  }

  export interface VonaConfig {
    instance: ConfigInstance;
  }
}
