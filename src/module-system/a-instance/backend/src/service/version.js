module.exports = app => {

  class Version extends app.Service {

    async update(options) {
      if (options.version === 1) {
        // create table: aInstance
        const sql = `
          CREATE TABLE aInstance (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            disabled int(11) DEFAULT '0',
            name varchar(255) DEFAULT NULL,
            PRIMARY KEY (id)
          )
        `;
        await this.ctx.db.query(sql);
      }
      if (options.version === 2) {
        // aInstance
        const sql = `
          ALTER TABLE aInstance
          ADD COLUMN title varchar(255) DEFAULT NULL
        `;
        await this.ctx.model.query(sql);
      }
      if (options.version === 3) {
        // aInstance
        const sql = `
          ALTER TABLE aInstance
          ADD COLUMN meta json DEFAULT NULL
        `;
        await this.ctx.model.query(sql);
      }
    }

    async init(options) {
      if (options.version === 1) {
        await this.ctx.db.insert('aInstance', { name: options.subdomain, disabled: 0 });
      }
      if (options.version === 2) {
        if (options.title) {
          const instance = await this.ctx.db.get('aInstance', { name: options.subdomain });
          await this.ctx.db.update('aInstance', { id: instance.id, title: options.title });
        }
      }
      if (options.version === 3) {
        if (options.meta) {
          const instance = await this.ctx.db.get('aInstance', { name: options.subdomain });
          await this.ctx.db.update('aInstance', { id: instance.id, meta: JSON.stringify(options.meta) });
        }
      }
    }

  }

  return Version;
};
