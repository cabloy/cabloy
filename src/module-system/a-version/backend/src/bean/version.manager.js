module.exports = app => {
  class Version extends app.meta.BeanBase {

    async update(options) {
      if (options.version === 1) {
        // do nothing
      }

      if (options.version === 2) {
        await this.ctx.db.query(`
          CREATE TABLE aVersionInit (
            id INT NOT NULL AUTO_INCREMENT,
            subdomain VARCHAR(50) NULL,
            module VARCHAR(50) NULL,
            version INT NULL,
            createdAt TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (id));
          `);
      }
    }

  }

  return Version;
};
