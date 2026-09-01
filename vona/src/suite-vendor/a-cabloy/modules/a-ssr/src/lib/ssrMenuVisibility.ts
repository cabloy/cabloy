import type { IMenuGroup, IMenuItem } from 'vona-module-a-menu';

import type { ISsrMenuItemPrepared } from '../types/ssrMenu.ts';

export function resolveSsrMenuVisibilityDefault(
  menus: ISsrMenuItemPrepared[],
  checkRoleName: (roles: NonNullable<ISsrMenuItemPrepared['roles']>) => boolean,
): ISsrMenuItemPrepared[] {
  return menus.filter(menu => {
    if (menu.roles === undefined) return true;
    if (!menu.roles.length) return false;
    return checkRoleName(menu.roles);
  });
}

export function resolveVisibleSsrMenuGroups(
  menus: ISsrMenuItemPrepared[],
  groups: IMenuGroup[],
): IMenuGroup[] {
  const groupsByName = new Map(groups.map(group => [group.name, group]));
  const visibleGroupNames = new Set<string>();
  const retainGroup = (name: string) => {
    const group = groupsByName.get(name);
    if (!group || visibleGroupNames.has(name)) return;
    visibleGroupNames.add(name);
    for (const parentName of getGroupNames(group.group)) {
      retainGroup(parentName);
    }
  };
  for (const menu of menus) {
    for (const groupName of getGroupNames(menu.group)) {
      retainGroup(groupName);
    }
  }
  return groups.filter(group => visibleGroupNames.has(group.name));
}

export function projectPublicSsrMenus(menus: ISsrMenuItemPrepared[]): IMenuItem[] {
  return menus.map(menu => {
    const {
      name,
      title,
      description,
      icon,
      order,
      group,
      separator,
      link,
      external,
      target,
      meta,
    } = menu;
    return _withoutUndefined<IMenuItem>({
      name,
      title,
      description,
      icon,
      order,
      group,
      separator,
      link,
      external,
      target,
      meta,
    });
  });
}

export function projectPublicSsrMenuGroups(groups: IMenuGroup[]): IMenuGroup[] {
  return groups.map(group => {
    const { name, title, description, icon, order, group: parentGroup, collapsed } = group;
    return _withoutUndefined<IMenuGroup>({
      name,
      title,
      description,
      icon,
      order,
      group: parentGroup,
      collapsed,
    });
  });
}

function _withoutUndefined<T extends { name: string }>(value: T): T {
  return Object.fromEntries(Object.entries(value).filter(([, item]) => item !== undefined)) as T;
}

function getGroupNames(group: string | string[] | undefined): string[] {
  if (!group) return [];
  return Array.isArray(group) ? group : [group];
}
