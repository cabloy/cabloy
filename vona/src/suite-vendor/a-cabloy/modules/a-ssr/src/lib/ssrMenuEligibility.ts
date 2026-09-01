import type { IOnionSlice } from 'vona-module-a-onion';

import type {
  IDecoratorSsrMenuOptions,
  ISsrMenuCatalog,
  ISsrMenuEligibility,
  ISsrMenuRecord,
} from '../types/ssrMenu.ts';
import type { IDecoratorSsrMenuGroupOptions, ISsrMenuGroupRecord } from '../types/ssrMenuGroup.ts';
import type { IDecoratorSsrSiteOptions } from '../types/ssrSite.ts';

export function checkSsrBinding<T>(expect: T, target: T | T[] | null | ''): boolean {
  if (target === undefined || target === null || target === '') return true;
  if (Array.isArray(target)) return target.some(item => item === expect);
  return target === expect;
}

export function resolveSsrMenuCatalog(
  sites: ISsrMenuCatalog['sites'],
  ssrMenus: IOnionSlice<ISsrMenuRecord, keyof ISsrMenuRecord, unknown>[],
  ssrMenuGroups: IOnionSlice<ISsrMenuGroupRecord, keyof ISsrMenuGroupRecord, unknown>[] = [],
): ISsrMenuCatalog {
  const menus: ISsrMenuCatalog['menus'] = [];
  const groups: ISsrMenuCatalog['groups'] = [];
  for (const { ssrSiteName } of sites) {
    for (const ssrMenu of ssrMenus) {
      const options = ssrMenu.beanOptions.options as
        | IDecoratorSsrMenuOptions<IDecoratorSsrSiteOptions>
        | undefined;
      if (!options || !checkSsrBinding(ssrSiteName, options.site)) continue;
      const items = options.items || (options.item && { '': options.item });
      if (!items) continue;
      for (const key of Object.keys(items)) {
        const item = items[key];
        menus.push({
          ssrSiteName,
          ssrMenuName: key ? `${ssrMenu.name}#${key}` : ssrMenu.name,
          onionName: ssrMenu.name,
          roles: item.roles,
          ...withoutUndefined({
            title: item.title,
            description: item.description,
            icon: item.icon,
            order: item.order,
            group: item.group,
            separator: item.separator,
            link: item.link,
            external: item.external,
            target: item.target,
            meta: item.meta,
          }),
        });
      }
    }
  }
  for (const { ssrSiteName } of sites) {
    for (const ssrMenuGroup of ssrMenuGroups) {
      const options = ssrMenuGroup.beanOptions.options as
        | IDecoratorSsrMenuGroupOptions<IDecoratorSsrSiteOptions>
        | undefined;
      if (!options || !checkSsrBinding(ssrSiteName, options.site) || !options.item) {
        continue;
      }
      const item = options.item;
      groups.push({
        ssrSiteName,
        ssrMenuGroupName: ssrMenuGroup.name,
        onionName: ssrMenuGroup.name,
        title: item.title,
        description: item.description,
        icon: item.icon,
        order: item.order,
        group: item.group,
        collapsed: item.collapsed,
      });
    }
  }
  return { sites: [...sites], menus, groups };
}

function withoutUndefined<T extends object>(value: T): T {
  return Object.fromEntries(Object.entries(value).filter(([, item]) => item !== undefined)) as T;
}

export function resolveSsrMenuEligibility(
  ssrSiteName: string,
  ssrMenuName: string,
  ssrMenus: IOnionSlice<ISsrMenuRecord, keyof ISsrMenuRecord, unknown>[],
): ISsrMenuEligibility | undefined {
  for (const ssrMenu of ssrMenus) {
    const options = ssrMenu.beanOptions.options as
      | IDecoratorSsrMenuOptions<IDecoratorSsrSiteOptions>
      | undefined;
    if (!options || !checkSsrBinding(ssrSiteName, options.site)) continue;
    const menus = options.items || (options.item && { '': options.item });
    if (!menus) continue;
    for (const key of Object.keys(menus)) {
      const name = key ? `${ssrMenu.name}#${key}` : ssrMenu.name;
      if (name !== ssrMenuName) continue;
      return {
        ssrSiteName,
        ssrMenuName,
        rolesDefined: menus[key].roles !== undefined,
      };
    }
  }
}
