import type { ILocaleRecord, OmitNever } from 'vona';
import type { IMenuItem } from 'vona-module-a-menu';
import type { IOnionOptionsEnable, ServiceOnion } from 'vona-module-a-onion';
import type { IResourceRecord } from 'vona-module-a-openapi';
import type { TypeRequestMethod } from 'vona-module-a-web';

import type { ISsrMenuGroupRecord } from './ssrMenuGroup.ts';
import type { IDecoratorSsrSiteOptions, ISsrSiteRecord } from './ssrSite.ts';

export interface ISsrMenuRecord {}

export interface ISsrMenuItem<Pages extends {} = {}, Icons extends {} = {}> extends Omit<
  IMenuItem<Pages, Icons>,
  'name' | 'group'
> {
  group?: keyof ISsrMenuGroupRecord | (keyof ISsrMenuGroupRecord)[];
}

// should not set default generic = IDecoratorSsrSiteOptions
export interface IDecoratorSsrMenuOptions<
  SsrSiteOptions extends IDecoratorSsrSiteOptions,
> extends IOnionOptionsEnable {
  item?: ISsrMenuItem<SsrSiteOptions['pages'], SsrSiteOptions['icons']>;
  items?: Record<string, ISsrMenuItem<SsrSiteOptions['pages'], SsrSiteOptions['icons']>>;
  site?: keyof ISsrSiteRecord | (keyof ISsrSiteRecord)[];
  locale?: keyof ILocaleRecord | (keyof ILocaleRecord)[];
}

declare module 'vona-module-a-onion' {
  export interface BeanOnion {
    ssrMenu: ServiceOnion<ISsrMenuRecord>;
  }
}

declare module 'vona' {
  export interface ConfigOnions {
    ssrMenu: OmitNever<ISsrMenuRecord>;
  }

  export interface IBeanSceneRecord {
    ssrMenu: never;
  }
}

declare module 'vona-module-a-menu' {
  export interface IMenuItemMetaParams {
    resource?: keyof IResourceRecord;
  }

  export interface IMenuItemMetaQuery {
    api?: string;
    apiMethod?: TypeRequestMethod;
  }
}
