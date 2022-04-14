module.exports = app => {
  class Version extends app.meta.BeanBase {
    async update(options) {
      if (options.version === 1) {
        // create table: aAuthOpen
        const sql = `
          CREATE TABLE aAuthOpen (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            atomId int(11) DEFAULT '0',
            description varchar(255) DEFAULT NULL,
            PRIMARY KEY (id)
          )
        `;
        await this.ctx.model.query(sql);
      }
    }

    async init(options) {
      if (options.version === 1) {
        // rights
        await this._init_1_rights();
        // open auth scopes
        await this._init_1_scopes();
      }
    }

    async test() {}

    async _init_1_rights() {
      // add role rights
      const roleRights = [
        { roleName: 'authenticated', action: 'create' },
        { roleName: 'authenticated', action: 'read', scopeNames: 0 },
        { roleName: 'authenticated', action: 'write', scopeNames: 0 },
        { roleName: 'authenticated', action: 'delete', scopeNames: 0 },
        { roleName: 'authenticated', action: 'clone', scopeNames: 0 },
        { roleName: 'authenticated', action: 'deleteBulk' },
        { roleName: 'authenticated', action: 'exportBulk' },
        { roleName: 'system', action: 'read', scopeNames: 'authenticated' },
      ];
      await this.ctx.bean.role.addRoleRightBatch({ atomClassName: 'authOpen', roleRights });
    }

    async _init_1_scopes() {
      // scopes
      const scopes = {
        OpenAuthScope: {
          atomName: 'OpenAuthScope',
          atomStaticKey: 'roleScope_openAuthScope',
          atomRevision: 0,
          description: '',
          system: 1,
          sorting: 0,
          roleTypeCode: 6,
          roleIdParent: 'authenticated',
        },
        Full: {
          atomName: 'Full',
          atomStaticKey: 'roleScope_full',
          atomRevision: 0,
          description: '',
          system: 1,
          sorting: 0,
          roleTypeCode: 6,
          roleIdParent: 'OpenAuthScope',
        },
      };
    }
  }

  return Version;
};
