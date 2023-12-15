module.exports = class Version {
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
      const userRoot = await this.ctx.bean.user.get({ userName: 'root' });
      await this.ctx.bean.authSimple.add({
        userId: userRoot.id,
        password: options.password,
      });
      // admin
      const userAdmin = await this.ctx.bean.user.get({ userName: 'admin' });
      if (userAdmin) {
        await this.ctx.bean.authSimple.add({
          userId: userAdmin.id,
          password: '123456',
        });
      }
    }
  }

  async test() {}
};
