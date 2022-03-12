module.exports = app => {
  class Version extends app.meta.BeanBase {
    async update(options) {
      if (options.version === 1) {
        // aAuthProvider: add scenes/locales
        const sql = `
      ALTER TABLE aAuthProvider
        ADD COLUMN scenes JSON DEFAULT NULL,
        ADD COLUMN locales JSON DEFAULT NULL
                `;
        await this.ctx.model.query(sql);
      }
    }

    async init(options) {}

    async test() {}
  }

  return Version;
};
