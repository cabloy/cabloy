module.exports = function(ctx) {

  class VersionUpdate2 {

    async run() {
      // enable 0
      await ctx.model.query('SET SESSION sql_mode=\'NO_AUTO_VALUE_ON_ZERO\'');
      // add userId 0
      await ctx.db.insert('aUser', {
        id: 0,
        iid: 0,
        userName: 'system',
        realName: 'system',
      });
      // add roleId 0
      await ctx.db.insert('aRole', {
        id: 0,
        iid: 0,
        roleName: 'system',
        catalog: 1,
        system: 1,
        roleIdParent: -1,
      });
      // disable 0
      await ctx.model.query('SET SESSION sql_mode=\'\'');
    }

  }

  return VersionUpdate2;
};
