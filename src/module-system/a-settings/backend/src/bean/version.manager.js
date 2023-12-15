module.exports = class Version {
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
      // empty
    }
  }
};
