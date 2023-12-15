module.exports = class Version {
  async update(options) {
    if (options.version === 1) {
      let sql;

      // create table: aShare
      sql = `
          CREATE TABLE aShare (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            uuid varchar(50) DEFAULT NULL,
            atomId int(11) DEFAULT '0',
            userId int(11) DEFAULT '0',
            host varchar(255) DEFAULT NULL,
            url varchar(255) DEFAULT NULL,
            PRIMARY KEY (id)
          )
        `;
      await this.ctx.model.query(sql);

      // create table: aShareRecordPV
      sql = `
          CREATE TABLE aShareRecordPV (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            shareId int(11) DEFAULT '0',
            userId int(11) DEFAULT '0',
            PRIMARY KEY (id)
          )
        `;
      await this.ctx.model.query(sql);

      // create table: aShareRecordUV
      sql = `
          CREATE TABLE aShareRecordUV (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            atomId int(11) DEFAULT '0',
            userIdSource int(11) DEFAULT '0',
            userIdTarget int(11) DEFAULT '0',
            PRIMARY KEY (id)
          )
        `;
      await this.ctx.model.query(sql);
    }
  }

  async init(options) {}

  async test() {}
};
