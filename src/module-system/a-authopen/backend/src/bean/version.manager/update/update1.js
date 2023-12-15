module.exports = class VersionUpdate {
  async run() {
    // create table: aAuthOpen
    let sql = `
      CREATE TABLE aAuthOpen (
        id int(11) NOT NULL AUTO_INCREMENT,
        createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        deleted int(11) DEFAULT '0',
        iid int(11) DEFAULT '0',
        atomId int(11) DEFAULT '0',
        description varchar(255) DEFAULT NULL,
        userId int(11) DEFAULT '0',
        scopeRoleId int(11) DEFAULT '0',
        neverExpire int(11) DEFAULT '1',
        expireTime timestamp DEFAULT NULL,
        clientID varchar(50) DEFAULT NULL,
        clientSecret text DEFAULT NULL,
        clientSecretHidden int(11) DEFAULT '0',
        PRIMARY KEY (id)
      )
    `;
    await this.ctx.model.query(sql);
    // view: aAuthOpenView
    sql = `
          CREATE VIEW aAuthOpenView as
            select a.*,b.roleName as scopeRoleName from aAuthOpen a
              left join aRole b on a.scopeRoleId=b.id
        `;
    await this.ctx.model.query(sql);
  }
};
