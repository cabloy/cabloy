const require3 = require('require3');
const mparse = require3('egg-born-mparse').default;

module.exports = ctx => {
  // const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Atom {
    async exportBulk({ atomClass, options, fields, user }) {
      // atomClass
      let atomClassBase;
      if (atomClass) {
        atomClass = await ctx.bean.atomClass.get(atomClass);
        atomClassBase = await ctx.bean.atomClass.atomClass(atomClass);
      }
      // select
      const items = await this.select({ atomClass, options, user, pageForce: false });
      // export
      const _moduleInfo = mparse.parseInfo(atomClass.module);
      const beanFullName = `${_moduleInfo.relativeName}.atom.${atomClassBase.bean}`;
      const resExport = await ctx.meta.util.executeBean({
        beanModule: _moduleInfo.relativeName,
        beanFullName,
        context: { atomClass, options, fields, items, user },
        fn: 'exportBulk',
      });
      // file
      const resFile = await ctx.bean.file._upload({
        fileContent: resExport.data,
        meta: resExport.meta,
        user,
      });
      // ok
      return resFile;
    }
  }

  return Atom;
};
