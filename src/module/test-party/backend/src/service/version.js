const VersionTestFn = require('./version/test.js');

module.exports = app => {

  class Version extends app.Service {

    async update(options) {
      // only in test/local
      if (!this.app.meta.isTest && !this.app.meta.isLocal) return;

      // update
      if (options.version === 1) {
        let sql = `
          CREATE TABLE testParty (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            atomId int(11) DEFAULT '0',
            personCount int(11) DEFAULT '0',
            partyTypeId int(11) DEFAULT '0',
            PRIMARY KEY (id)
          )
        `;
        await this.ctx.model.query(sql);

        sql = `
          CREATE TABLE testPartyType (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            name varchar(255) DEFAULT NULL,
            PRIMARY KEY (id)
          )
        `;
        await this.ctx.model.query(sql);

        sql = `
          CREATE VIEW testPartyView as
            select a.*,b.name as partyTypeName from testParty a
              left join testPartyType b on a.partyTypeId=b.id
        `;
        await this.ctx.model.query(sql);

        sql = `
          CREATE TABLE testPartyPublic (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            atomId int(11) DEFAULT '0',
            PRIMARY KEY (id)
          )
        `;
        await this.ctx.model.query(sql);
      }
    }

    async init(options) {
      // only in test/local
      if (!this.app.meta.isTest && !this.app.meta.isLocal) return;

      // init
      if (options.version === 1) {
        // types
        for (const name of [ 'Birthday', 'Dance', 'Garden' ]) {
          await this.ctx.model.partyType.insert({ name });
        }
      }

      //
      if (options.version === 2) {
        // roleFunctions
        const roleRoot = await this.ctx.meta.role.getSystemRole({ roleName: 'root' });
        const functions = [ 'kichenSink' ];
        for (const functionName of functions) {
          const func = await this.ctx.meta.function.get({
            name: functionName,
          });
          await this.ctx.meta.role.addRoleFunction({
            roleId: roleRoot.id,
            functionId: func.id,
          });
        }
      }

    }

    async test() {
      const versionTest = new (VersionTestFn(this.ctx))();
      await versionTest.run();
    }

  }

  return Version;
};
