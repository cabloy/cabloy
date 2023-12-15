module.exports = class Version {
  async update(options) {
    if (options.version === 1) {
      // aAuthProvider: add scenes
      let sql = `
      ALTER TABLE aAuthProvider
        ADD COLUMN scenes JSON DEFAULT NULL
                `;
      await this.ctx.model.query(sql);
      // aAuth: add providerScene
      sql = `
      ALTER TABLE aAuth
        ADD COLUMN providerScene varchar(255) DEFAULT NULL
                `;
      await this.ctx.model.query(sql);
    }
  }

  async init(options) {}

  async test() {}
};
