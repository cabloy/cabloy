module.exports = class Version {
  async update(options) {
    if (options.version === 1) {
      // create table: aApp
      let sql = `
          CREATE TABLE aApp (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            atomId int(11) DEFAULT '0',
            description varchar(255) DEFAULT NULL,
            appSorting int(11) DEFAULT '0',
            appIcon varchar(255) DEFAULT NULL,
            appIsolate int(11) DEFAULT '0',
            appLanguage int(11) DEFAULT '0',
            appCms int(11) DEFAULT '0',
            PRIMARY KEY (id)
          )
        `;
      await this.ctx.model.query(sql);

      // create table: aAppContent
      sql = `
          CREATE TABLE aAppContent (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            atomId int(11) DEFAULT '0',
            itemId int(11) DEFAULT '0',
            content JSON DEFAULT NULL,
            PRIMARY KEY (id)
          )
        `;
      await this.ctx.model.query(sql);

      // create view: aAppViewFull
      sql = `
          CREATE VIEW aAppViewFull as
            select a.*,b.content from aApp a
              left join aAppContent b on a.id=b.itemId
        `;
      await this.ctx.model.query(sql);
    }

    if (options.version === 2) {
      let sql = `
          ALTER TABLE aApp
            ADD COLUMN appHidden int(11) DEFAULT '0'
        `;
      await this.ctx.model.query(sql);

      // alter view: aAppViewFull
      await this.ctx.model.query('drop view aAppViewFull');
      sql = `
          CREATE VIEW aAppViewFull as
            select a.*,b.content from aApp a
              left join aAppContent b on a.id=b.itemId
        `;
      await this.ctx.model.query(sql);
    }
  }

  async init(options) {
    if (options.version === 1) {
      // app: add role rights
      const roleRights = [
        { roleName: 'system', action: 'create' },
        { roleName: 'system', action: 'read', scopeNames: 0 },
        { roleName: 'system', action: 'read', scopeNames: 'authenticated' },
        { roleName: 'system', action: 'write', scopeNames: 0 },
        { roleName: 'system', action: 'write', scopeNames: 'authenticated' },
        { roleName: 'system', action: 'delete', scopeNames: 0 },
        { roleName: 'system', action: 'delete', scopeNames: 'authenticated' },
        { roleName: 'system', action: 'clone', scopeNames: 0 },
        { roleName: 'system', action: 'clone', scopeNames: 'authenticated' },
        { roleName: 'system', action: 'authorize', scopeNames: 0 },
        { roleName: 'system', action: 'authorize', scopeNames: 'authenticated' },
        { roleName: 'system', action: 'deleteBulk' },
        { roleName: 'system', action: 'exportBulk' },
      ];
      await this.ctx.bean.role.addRoleRightBatch({ atomClassName: 'app', roleRights });
    }
  }

  async test() {}
};
