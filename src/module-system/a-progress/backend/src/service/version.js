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
            progressId varchar(50) DEFAULT NULL,
            counter int(11) DEFAULT '0',
            done int(11) DEFAULT '0',
            abort int(11) DEFAULT '0',
            data text DEFAULT NULL,
            PRIMARY KEY (id)
          )
                  `;
        await this.ctx.model.query(sql);
      }

      if (options.version === 2) {
        // aProgress: add field userId
        const sql = `
        ALTER TABLE aProgress
          ADD COLUMN userId int(11) DEFAULT '0'
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
