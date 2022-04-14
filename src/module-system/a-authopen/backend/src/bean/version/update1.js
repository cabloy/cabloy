module.exports = function (ctx) {
  class VersionUpdate {
    async run() {
      // create table: aAuthOpen
      const sql = `
      CREATE TABLE aAuthOpen (
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

  return VersionUpdate;
};
