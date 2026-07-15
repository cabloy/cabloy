import type { ILocaleRecord } from 'vona';

export interface IRoleConfig {
  title: string;
  locales?: Partial<Record<keyof ILocaleRecord, string>>;
  siteIds: string[];
}

export const builtinRoles: Record<string, IRoleConfig> = {
  registeredUser: {
    title: 'Registered User',
    locales: {
      'zh-cn': '注册用户',
    },
    siteIds: ['web'],
  },
  systemAdmin: {
    title: 'System Administrator',
    locales: {
      'zh-cn': '系统管理员',
    },
    siteIds: ['web', 'admin'],
  },
};
