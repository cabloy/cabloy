module.exports = app => {

  class Version extends app.Service {

    async update(options) {
      if (options.version === 1) {
        // aProgress
        const sql = `
        CREATE TABLE aProgress (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            done int(11) DEFAULT '0',
            progressNo int(11) DEFAULT '0',
            total int(11) DEFAULT '0',
            progress int(11) DEFAULT '0',
            text text DEFAULT NULL,
            PRIMARY KEY (id)
          )
                  `;
        await this.ctx.model.query(sql);
      }
    }

    async init(options) {
    }

    async test() {
    }

  }

  return Version;
};
