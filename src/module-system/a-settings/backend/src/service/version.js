module.exports = app => {

  class Version extends app.Service {

    async update(options) {
      if (options.version === 1) {
        // create table: aSettings
        let sql = `
          CREATE TABLE aSettings (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            module varchar(255) DEFAULT NULL,
            scene int(11) DEFAULT '0',
            userId int(11) DEFAULT '0',
            value json DEFAULT NULL,
            PRIMARY KEY (id)
          )
        `;
        await this.ctx.model.query(sql);

        // create table: aSettingsRef
        sql = `
          CREATE TABLE aSettingsRef (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            module varchar(255) DEFAULT NULL,
            scene int(11) DEFAULT '0',
            userId int(11) DEFAULT '0',
            name varchar(255) DEFAULT NULL,
            value json DEFAULT NULL,
            PRIMARY KEY (id)
          )
        `;
        await this.ctx.model.query(sql);
      }
    }

    async init(options) {
      if (options.version === 1) {
        // function
        const func = await this.ctx.meta.function.get({
          name: 'settings',
        });
        // role function right
        const role = await this.ctx.meta.role.getSystemRole({ roleName: 'system' });
        await this.ctx.meta.role.addRoleFunction({
          roleId: role.id,
          functionId: func.id,
        });
      }
    }

  }

  return Version;
};
