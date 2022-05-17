module.exports = function (ctx) {
  class VersionUpdate17 {
    async run() {
      // aStatus
      const sql = `
        delete from aStatus where name like 'user-layoutConfig:%'
      `;
      await ctx.model.query(sql);
    }
  }

  return VersionUpdate17;
};
