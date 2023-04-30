module.exports = function (ctx) {
  class VersionInit {
    async run() {
      // need not
      // // init roleRight actions
      // await ctx.bean.atomAction.init({
      //   atomClass: { module: 'a-base', atomClassName: 'roleRight' },
      //   actions: 'create,read,write,delete,clone,deleteBulk',
      // });
    }
  }

  return VersionInit;
};
