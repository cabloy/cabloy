import type { ILocaleMagic } from 'vona';

export interface IMenus<Pages extends {} = any, Icons extends {} = any> {
  menus?: IMenuItem<Pages, Icons>[];
  groups?: IMenuGroup<Icons>[];
}

export interface IMenuItemMetaParams {}
export interface IMenuItemMetaQuery {}
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
