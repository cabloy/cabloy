import type {
  IMetaVersionInit,
  IMetaVersionInitOptions,
  IMetaVersionUpdate,
  IMetaVersionUpdateOptions,
} from 'vona-module-a-version';

import { BeanBase } from 'vona';
import { Meta } from 'vona-module-a-meta';

const roleSiteIds = {
  registeredUser: ['commerce'],
  systemAdmin: ['commerce', 'commerceAdmin'],
};

@Meta()
export class MetaVersion extends BeanBase implements IMetaVersionUpdate, IMetaVersionInit {
  async update(_options: IMetaVersionUpdateOptions) {}

  async init(options: IMetaVersionInitOptions) {
    if (options.version !== 1) return;
    const modelRole = this.app.scope('home-user').model.role;
    for (const [roleName, requiredSiteIds] of Object.entries(roleSiteIds)) {
      const role = await modelRole.getByName(roleName);
      if (!role) continue;

      const siteIds = [...new Set([...role.siteIds, ...requiredSiteIds])];
      if (siteIds.length === role.siteIds.length) continue;
      await modelRole.updateById(role.id, { siteIds });
    }
  }
}
