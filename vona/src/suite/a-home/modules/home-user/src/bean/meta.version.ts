import type {
  IMetaVersionInit,
  IMetaVersionInitOptions,
  IMetaVersionUpdate,
  IMetaVersionUpdateOptions,
} from 'vona-module-a-version';

import { BeanBase } from 'vona';
import { Meta } from 'vona-module-a-meta';

@Meta()
export class MetaVersion extends BeanBase implements IMetaVersionUpdate, IMetaVersionInit {
  async update(options: IMetaVersionUpdateOptions) {
    if (options.version === 1) {
      // homeRole
      const entityRole = this.scope.entity.role;
      await this.bean.model.createTable(entityRole.$table, table => {
        table.comment(entityRole.$comment.$table);
        table.basicFields();
        table.string(entityRole.name, 255).comment(entityRole.$comment.name);
      });
      // homeUser
      const entityUser = this.scope.entity.user;
      await this.bean.model.createTable(entityUser.$table, table => {
        table.comment(entityUser.$comment.$table);
        table.basicFields();
        table.string(entityUser.name, 255).comment(entityUser.$comment.name);
        table.string(entityUser.avatar, 255).comment(entityUser.$comment.avatar);
        table.string(entityUser.email, 255).comment(entityUser.$comment.email);
        table.string(entityUser.mobile, 255).comment(entityUser.$comment.mobile);
        table
          .boolean(entityUser.activated)
          .defaultTo(entityUser.$default.activated)
          .comment(entityUser.$comment.activated);
        table.string(entityUser.locale, 255).comment(entityUser.$comment.locale);
        table.string(entityUser.tz, 255).comment(entityUser.$comment.tz);
      });
      // homeRoleUser
      const entityRoleUser = this.scope.entity.roleUser;
      await this.bean.model.createTable(entityRoleUser.$table, table => {
        table.basicFields();
        table.tableIdentity('userId');
        table.tableIdentity('roleId');
      });
    }
  }

  async init(options: IMetaVersionInitOptions) {
    if (options.version === 1) {
      // role: admin
      if (!this.scope.config.disableRoleAdmin) {
        await this.scope.model.role.insert({
          name: 'admin',
        });
      }
      // user: admin
      if (!this.scope.config.disableUserAdmin) {
        await this.bean.auth.authenticate('auth-simple:simple', {
          clientOptions: {
            username: 'admin',
            password: options.password || this.scope.config.passwordDefault.admin,
            avatar: ':emoji:flower',
            confirmed: true,
          },
          state: { intention: 'register' },
          clientName: 'default',
        });
      }
    }
  }
}
