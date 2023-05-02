const require3 = require('require3');
const mparse = require3('egg-born-mparse').default;

module.exports = ctx => {
  // const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Atom {
    async importBulk({ atomClass, options, file, user }) {
      // atomClass
      let atomClassBase;
      if (atomClass) {
        atomClass = await ctx.bean.atomClass.get(atomClass);
        atomClassBase = await ctx.bean.atomClass.atomClass(atomClass);
      }
      // options
      if (!options) {
        const actionBase = ctx.bean.base.action({
          module: atomClass.module,
          atomClassName: atomClass.atomClassName,
          name: 'importBulk',
        });
        // options
        options = actionBase.params;
      }
      try {
        // prepare file
        if (options.file.mode === 'buffer') {
          const res = await ctx.bean.file.loadBuffer({ downloadId: file.downloadId });
          options.file.buffer = res.buffer;
        }
        // import
        let resImport;
        if (options.transaction) {
          resImport = await ctx.transaction.begin(async () => {
            return await this._importBulk_inner({ atomClass, atomClassBase, options, file, user });
          });
        } else {
          resImport = await this._importBulk_inner({ atomClass, atomClassBase, options, file, user });
        }
        // ok
        return resImport;
      } finally {
        // delete file
        await ctx.bean.file.delete({ downloadId: file.downloadId });
      }
    }

    async _importBulk_inner({ atomClass, atomClassBase, options, file, user }) {
      const _moduleInfo = mparse.parseInfo(atomClass.module);
      const beanFullName = `${_moduleInfo.relativeName}.atom.${atomClassBase.bean}`;
      return await ctx.meta.util.executeBean({
        beanModule: _moduleInfo.relativeName,
        beanFullName,
        context: { atomClass, options, file, user },
        fn: 'importBulk',
      });
    }
  }

  return Atom;
};
