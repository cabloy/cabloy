import type { ILocaleRecord, OmitNever } from 'vona';
import type { IMenuGroup, IMenuItem } from 'vona-module-a-menu';
import type { IOnionOptionsEnable, ServiceOnion } from 'vona-module-a-onion';
import type { IRoleNameRecord } from 'vona-module-a-user';

import type { ISsrMenuGroupRecord } from './ssrMenuGroup.ts';
import type { IDecoratorSsrSiteOptions, ISsrSiteRecord } from './ssrSite.ts';

export interface ISsrMenuRecord {}

export interface ISsrMenuItem<Pages extends {} = {}, Icons extends {} = {}> extends Omit<
  IMenuItem<Pages, Icons>,
  'name' | 'group'
> {
  group?: keyof ISsrMenuGroupRecord | (keyof ISsrMenuGroupRecord)[];
  roles?: (keyof IRoleNameRecord)[];
}

export type ISsrMenuItemPrepared = IMenuItem<any, any> & Pick<ISsrMenuItem<any, any>, 'roles'>;

export interface ISsrMenuEligibility {
  ssrSiteName: string;
  ssrMenuName: string;
  rolesDefined: boolean;
}

export interface ISsrMenuCatalogSiteInfo {
  ssrSiteName: string;
  title: string;
}

export interface ISsrMenuCatalogMenu {
  ssrSiteName: string;
  ssrMenuName: string;
  onionName: string;
  roles?: (keyof IRoleNameRecord)[];
  title?: IMenuItem['title'];
  description?: IMenuItem['description'];
  icon?: IMenuItem['icon'];
  order?: IMenuItem['order'];
  group?: IMenuItem['group'];
  separator?: IMenuItem['separator'];
  link?: IMenuItem['link'];
  external?: IMenuItem['external'];
  target?: IMenuItem['target'];
  meta?: IMenuItem['meta'];
}

export interface ISsrMenuCatalogGroup {
  ssrSiteName: string;
  ssrMenuGroupName: string;
  onionName: string;
  title?: IMenuGroup['title'];
  description?: IMenuGroup['description'];
  icon?: IMenuGroup['icon'];
  order?: IMenuGroup['order'];
  group?: IMenuGroup['group'];
  collapsed?: IMenuGroup['collapsed'];
}

export interface ISsrMenuCatalog {
  sites: ISsrMenuCatalogSiteInfo[];
  menus: ISsrMenuCatalogMenu[];
  groups: ISsrMenuCatalogGroup[];
}

export interface ISsrMenuCatalogPresentationMenu extends IMenuItem<any, any> {
  ssrSiteName: string;
  ssrMenuName: string;
  configurable: boolean;
}

export interface ISsrMenuCatalogPresentationGroup extends IMenuGroup<any> {
  ssrSiteName: string;
}

export interface ISsrMenuCatalogPresentation {
  menus: ISsrMenuCatalogPresentationMenu[];
  groups: ISsrMenuCatalogPresentationGroup[];
}

export interface ISsrMenusPrepared {
  menus?: ISsrMenuItemPrepared[];
  groups?: IMenuGroup[];
}

export interface ISsrMenuCatalogSite {
  ssrSiteName: string;
  menus: ISsrMenuItemPrepared[];
  groups: IMenuGroup[];
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
