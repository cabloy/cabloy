import type { LocalizedTextMap } from 'vona-module-a-user';

export interface IRoleConfig {
  title: string;
  titleLocales?: LocalizedTextMap;
  siteIds: string[];
}

export const builtinRoles: Record<string, IRoleConfig> = {
  registeredUser: {
    title: 'Registered User',
    titleLocales: {
      'zh-cn': '注册用户',
    },
    siteIds: ['web'],
  },
  systemAdmin: {
    title: 'System Administrator',
    titleLocales: {
      'zh-cn': '系统管理员',
    },
    siteIds: ['web', 'admin'],
  },
};
