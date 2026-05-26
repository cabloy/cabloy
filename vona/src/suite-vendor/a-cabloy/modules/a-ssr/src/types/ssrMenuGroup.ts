import type { ILocaleRecord, OmitNever } from 'vona';
import type { IMenuGroup } from 'vona-module-a-menu';
import type { IOnionOptionsEnable, ServiceOnion } from 'vona-module-a-onion';

import type { IDecoratorSsrSiteOptions, ISsrSiteRecord } from './ssrSite.ts';

export interface ISsrMenuGroupRecord {}

export interface ISsrMenuGroup<Icons extends {} = {}> extends Omit<
  IMenuGroup<Icons>,
  'name' | 'group'
> {
  group?: keyof ISsrMenuGroupRecord | (keyof ISsrMenuGroupRecord)[];
}

export interface IDecoratorSsrMenuGroupOptions<
  SsrSiteOptions extends IDecoratorSsrSiteOptions,
> extends IOnionOptionsEnable {
  item?: ISsrMenuGroup<SsrSiteOptions['icons']>;
  site?: keyof ISsrSiteRecord | (keyof ISsrSiteRecord)[];
  locale?: keyof ILocaleRecord | (keyof ILocaleRecord)[];
}

declare module 'vona-module-a-onion' {
  export interface BeanOnion {
    ssrMenuGroup: ServiceOnion<ISsrMenuGroupRecord>;
  }
}

declare module 'vona' {
  export interface ConfigOnions {
    ssrMenuGroup: OmitNever<ISsrMenuGroupRecord>;
  }

  export interface IBeanSceneRecord {
    ssrMenuGroup: never;
  }
}
