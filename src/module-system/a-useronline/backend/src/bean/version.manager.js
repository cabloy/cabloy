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
            clientIPLast varchar(50) DEFAULT NULL,
            loginTimeLast timestamp NOT NULL,
            expireTime timestamp NOT NULL,
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
            clientIP varchar(50) DEFAULT NULL,
            loginTime timestamp NOT NULL,
            PRIMARY KEY (id)
          )
        `;
        await this.ctx.model.query(sql);
      }
    }

    async init(options) {
      if (options.version === 1) {
        // add role rights
        const roleRights = [
          //
          { roleName: 'system', action: 'read', scopeNames: 'authenticated' },
        ];
        await this.ctx.bean.role.addRoleRightBatch({ atomClassName: 'userOnline', roleRights });
        await this.ctx.bean.role.addRoleRightBatch({ atomClassName: 'userOnlineHistory', roleRights });
      }
    }

    async test() {}
  }

  return Version;
};
