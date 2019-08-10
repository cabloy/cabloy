module.exports = app => {

  class Version extends app.Service {

    async update(options) {
      if (options.version === 1) {
        // create table: {{providerId}}{{atomClassNameCapitalize}}
        const sql = `
          CREATE TABLE {{providerId}}{{atomClassNameCapitalize}} (
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
        // add role rights
        const roleRights = [
          { roleName: 'authenticated', action: 'create' },
          { roleName: 'authenticated', action: 'write', scopeNames: 0 },
          { roleName: 'authenticated', action: 'delete', scopeNames: 0 },
          { roleName: 'authenticated', action: 'read', scopeNames: 0 },
          { roleName: 'system', action: 'read', scopeNames: 'authenticated' },
        ];
        await this.ctx.meta.role.addRoleRightBatch({ atomClassName: '{{atomClassName}}', roleRights });
      }
    }

    async test() {
    }

  }

  return Version;
};
