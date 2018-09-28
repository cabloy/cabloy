module.exports = app => {
  class Version extends app.Service {

    async update(options) {
      if (options.version === 1) {
        // create table: aStatus
        const sql = `
          CREATE TABLE aAuthSimple (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            userId int(11) DEFAULT '0',
            hash text DEFAULT NULL,
            PRIMARY KEY (id)
          )
        `;
        await this.ctx.model.query(sql);
      }
    }

    async init(options) {
      if (options.version === 1) {
        // root
        const user = await this.ctx.meta.user.get({ userName: 'root' });
        await this.ctx.service.auth.add({
          userId: user.id,
          password: options.password,
        });
      }
    }

    async test() {

    }

  }

  return Version;
};
