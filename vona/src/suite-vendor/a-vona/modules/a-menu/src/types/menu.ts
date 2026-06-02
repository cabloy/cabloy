import type { ILocaleMagic } from 'vona';
import type { IResourceRecord } from 'vona-module-a-openapi';
import type { TypeRequestMethod } from 'vona-module-a-web';

export interface IMenus<Pages extends {} = any, Icons extends {} = any> {
  menus?: IMenuItem<Pages, Icons>[];
  groups?: IMenuGroup<Icons>[];
}

export interface IMenuItemMetaParams {
  resource?: keyof IResourceRecord;
  locale?: true | string;
}

export interface IMenuItemMetaQuery {
  api?: string;
  apiMethod?: TypeRequestMethod;
}

export interface IMenuItemMeta {
  params?: IMenuItemMetaParams;
  query?: IMenuItemMetaQuery;
}

export interface IMenuItem<Pages extends {} = any, Icons extends {} = any> {
  name: string;
  title?: string | ILocaleMagic;
  description?: string | ILocaleMagic;
  icon?: keyof Icons;
  order?: number;
  group?: string | string[];
  separator?: boolean;
  link?: keyof Pages;
  external?: boolean;
  target?: string;
  meta?: IMenuItemMeta;
}

export interface IMenuGroup<Icons extends {} = any> {
  name: string;
  title?: string | ILocaleMagic;
  description?: string | ILocaleMagic;
  icon?: keyof Icons;
  order?: number;
  group?: string | string[];
  collapsed?: boolean;
}
