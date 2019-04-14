module.exports = app => {

  class Version extends app.Service {

    async update(options) {
      if (options.version === 1) {
        // create table: aCache
        const sql = `
          CREATE TABLE aCache (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            module varchar(255) DEFAULT NULL,
            name varchar(255) DEFAULT NULL,
            value json DEFAULT NULL,
            timeout int(11) DEFAULT '0',
            PRIMARY KEY (id)
          )
        `;
        await this.ctx.db.query(sql);
      }

      if (options.version === 2) {
        let sql;
        // delete
        sql = `
          delete from aCache
        `;
        await this.ctx.db.query(sql);
        // alter table: aCache
        sql = `
          ALTER TABLE aCache
            DROP COLUMN timeout,
            ADD COLUMN expired timestamp DEFAULT NULL
        `;
        await this.ctx.db.query(sql);
      }
    }

  }

  return Version;
};
