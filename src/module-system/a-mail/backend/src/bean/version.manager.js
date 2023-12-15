module.exports = class Version {
  async update(options) {
    if (options.version === 1) {
      // create table: aMail
      const sql = `
          CREATE TABLE aMail (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            scene varchar(50) DEFAULT NULL,
            status int(11) DEFAULT '0',
            mailTo text DEFAULT NULL,
            mailSubject text DEFAULT NULL,
            message LONGTEXT DEFAULT NULL,
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

  async test() {}
};
