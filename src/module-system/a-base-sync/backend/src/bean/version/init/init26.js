module.exports = function (ctx) {
  class VersionInit {
    async run() {
      // init roleRight actions
      await ctx.bean.atomAction.init({
        atomClass: { module: 'a-base', atomClassName: 'roleRight' },
        actions: 'create,read,write,delete',
      });
    }
  }

  return VersionInit;
};
