module.exports = class Version {
  async update(options) {
    if (options.version === 1) {
      // create table: aDashboardProfile
      const sql = `
          CREATE TABLE aDashboardProfile (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            userId int(11) DEFAULT '0',
            profileName varchar(255) DEFAULT NULL,
            profileValue json DEFAULT NULL,
            PRIMARY KEY (id)
          )
        `;
      await this.ctx.model.query(sql);
    }

    if (options.version === 2) {
      // drop table: aDashboardProfile
      let sql = `
          DROP TABLE aDashboardProfile
        `;
      await this.ctx.model.query(sql);

      // create table: aDashboard
      sql = `
          CREATE TABLE aDashboard (
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

      // create table: aDashboardContent
      sql = `
          CREATE TABLE aDashboardContent (
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

      // create table: aDashboardUser
      sql = `
          CREATE TABLE aDashboardUser (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            userId int(11) DEFAULT '0',
            dashboardDefault int(11) DEFAULT '0',
            dashboardAtomId int(11) DEFAULT '0',
            dashboardName varchar(255) DEFAULT NULL,
            content JSON DEFAULT NULL,
            PRIMARY KEY (id)
          )
        `;
      await this.ctx.model.query(sql);

      // create view: aDashboardViewFull
      sql = `
          CREATE VIEW aDashboardViewFull as
            select a.*,b.content from aDashboard a
              left join aDashboardContent b on a.id=b.itemId
        `;
      await this.ctx.model.query(sql);
    }
  }

  async init(options) {
    if (options.version === 1) {
      // empty
    }

    if (options.version === 2) {
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
      // await this.ctx.bean.role.addRoleRightBatch({ atomClassName: 'dashboard', roleRights });
    }

    if (options.version === 3) {
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
      await this.ctx.bean.role.addRoleRightBatch({ atomClassName: 'dashboard', roleRights });
    }
  }

  async test() {}
};
