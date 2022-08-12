module.exports = function (ctx) {
  class VersionUpdate13 {
    async run() {
      // aUser
      const sql = `
      ALTER TABLE aUser
        Add COLUMN allowChangeUserName int(11) DEFAULT '1',
        Add COLUMN lastTimeChangeUserName timestamp DEFAULT NULL
                `;
      await ctx.model.query(sql);
    }
  }

  return VersionUpdate13;
};
