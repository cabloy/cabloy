import type { LocalizedTextMap } from 'vona-module-a-user';

import { roleSiteIdAll } from 'vona-module-a-openapiutils';

export interface IRoleConfig {
  title: string;
  titleLocales?: LocalizedTextMap;
  siteIds: string[];
  builtin: boolean;
}

export const builtinRoles: Record<string, IRoleConfig> = {
  registeredUser: {
    title: 'Registered User',
    builtin: true,
    titleLocales: {
      'zh-cn': '注册用户',
    },
    siteIds: [roleSiteIdAll],
  },
  systemAdmin: {
    title: 'System Administrator',
    builtin: true,
    titleLocales: {
      'zh-cn': '系统管理员',
    },
    siteIds: [roleSiteIdAll],
  },
};
