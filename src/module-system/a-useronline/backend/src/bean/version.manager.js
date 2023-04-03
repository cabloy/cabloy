module.exports = app => {
  class Version extends app.meta.BeanBase {
    async update(options) {
      if (options.version === 1) {
        // create table: aUserOnline
        let sql = `
          CREATE TABLE aUserOnline (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            atomId int(11) DEFAULT '0',
            userId int(11) DEFAULT '0',
            loginCount int(11) DEFAULT '0',
            loginIPLast varchar(50) DEFAULT NULL,
            loginTimeLast timestamp DEFAULT NULL,
            onlineCount int(11) DEFAULT '0',
            onlineIPLast varchar(50) DEFAULT NULL,
            onlineTimeLast timestamp DEFAULT NULL,
            expireTime timestamp DEFAULT NULL,
            PRIMARY KEY (id)
          )
        `;
        await this.ctx.model.query(sql);
        // create table: aUserOnlineHistory
        sql = `
          CREATE TABLE aUserOnlineHistory (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            atomId int(11) DEFAULT '0',
            userId int(11) DEFAULT '0',
            onlineIP varchar(50) DEFAULT NULL,
            onlineTime timestamp DEFAULT NULL,
            isLogin int(11) DEFAULT '0',
            PRIMARY KEY (id)
          )
        `;
        await this.ctx.model.query(sql);
      }

      if (options.version === 2) {
        // aAtom: drop atomId
        const sql = `
          ALTER TABLE aUserOnlineHistory
            DROP COLUMN atomId
        `;
        await this.ctx.model.query(sql);
      }
    }

    async init(options) {
      if (options.version === 1) {
        // add role rights
        let roleRights = [
          //
          { roleName: 'system', action: 'read', scopeNames: 'authenticated' },
          // custom
          { roleName: 'system', action: 'kickOut', scopeNames: 'authenticated' },
        ];
        await this.ctx.bean.role.addRoleRightBatch({ atomClassName: 'userOnline', roleRights });
        //
        roleRights = [
          //
          { roleName: 'system', action: 'read' },
          { roleName: 'system', action: 'delete' },
          { roleName: 'system', action: 'deleteBulk' },
          { roleName: 'system', action: 'exportBulk' },
        ];
        await this.ctx.bean.role.addRoleRightBatch({ atomClassName: 'userOnlineHistory', roleRights });
      }
    }

    async test() {}
  }

  return Version;
};
