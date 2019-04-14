module.exports = function(ctx) {

  class VersionUpdate6 {

    async run() {

      // aUser
      const sql = `
        ALTER TABLE aUser
          ADD COLUMN emailConfirmed int(11) DEFAULT '0',
          ADD COLUMN mobileVerified int(11) DEFAULT '0'
                  `;
      await ctx.model.query(sql);

    }

  }

  return VersionUpdate6;
};
