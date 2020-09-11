module.exports = app => {

  class Version extends app.meta.BeanBase {

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
    }

    async init(options) {
      if (options.version === 1) {
        // roleFunctions: widgets
        const roleWidgets = [
          { roleName: null, name: 'widgetAbout' },
        ];
        await this.ctx.bean.role.addRoleFunctionBatch({ roleFunctions: roleWidgets });
      }
    }

    async test() {
    }

  }

  return Version;
};
