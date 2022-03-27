module.exports = app => {
  class Version extends app.meta.BeanBase {
    async update(options) {
      if (options.version === 1) {
        // create table: aDict
        let sql = `
          CREATE TABLE aDict (
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
        // create table: aDictContent
        sql = `
          CREATE TABLE aDictContent (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            atomId int(11) DEFAULT '0',
            itemId int(11) DEFAULT '0',
            dictItems JSON DEFAULT NULL,
            dictLocales JSON DEFAULT NULL,
            PRIMARY KEY (id)
          )
        `;
        await this.ctx.model.query(sql);
        // create view: aDictViewFull
        sql = `
          CREATE VIEW aDictViewFull as
            select a.*,b.dictItems,b.dictLocales from aDict a
              left join aDictContent b on a.id=b.itemId
        `;
        await this.ctx.model.query(sql);
      }
    }

    async init(options) {
      if (options.version === 1) {
        // // add role rights
        // const roleRights = [
        //   { roleName: 'system', action: 'create' },
        //   { roleName: 'system', action: 'read', scopeNames: 0 },
        //   { roleName: 'system', action: 'read', scopeNames: 'superuser' },
        //   { roleName: 'system', action: 'write', scopeNames: 0 },
        //   { roleName: 'system', action: 'write', scopeNames: 'superuser' },
        //   { roleName: 'system', action: 'delete', scopeNames: 0 },
        //   { roleName: 'system', action: 'delete', scopeNames: 'superuser' },
        //   { roleName: 'system', action: 'clone', scopeNames: 0 },
        //   { roleName: 'system', action: 'clone', scopeNames: 'superuser' },
        //   { roleName: 'system', action: 'authorize', scopeNames: 0 },
        //   { roleName: 'system', action: 'authorize', scopeNames: 'superuser' },
        //   { roleName: 'system', action: 'deleteBulk' },
        //   { roleName: 'system', action: 'exportBulk' },
        // ];
        // await this.ctx.bean.role.addRoleRightBatch({ atomClassName: 'dict', roleRights });
      }

      if (options.version === 2) {
        // add role rights
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
        await this.ctx.bean.role.addRoleRightBatch({ atomClassName: 'dict', roleRights });
      }
    }

    async test() {}
  }

  return Version;
};
