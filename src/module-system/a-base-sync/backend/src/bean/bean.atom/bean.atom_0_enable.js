const require3 = require('require3');
const mparse = require3('egg-born-mparse').default;

module.exports = ctx => {
  // const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Atom {
    async enable({ key: keyOuter, atomClass: atomClassOuter, options: optionsOuter, user }) {
      // atomClass
      const { key, atomClass, atomClassBase, options } = await this._prepareKeyAndAtomAndAtomClass({
        key: keyOuter,
        atomClass: atomClassOuter,
        options: optionsOuter,
      });
      // atom bean
      const _moduleInfo = mparse.parseInfo(atomClass.module);
      const beanFullName = `${_moduleInfo.relativeName}.atom.${atomClassBase.bean}`;
      await ctx.meta.util.executeBean({
        beanModule: _moduleInfo.relativeName,
        beanFullName,
        context: { atomClass, key, options, user },
        fn: 'enable',
      });
    }

    async disable({ key: keyOuter, atomClass: atomClassOuter, options: optionsOuter, user }) {
      // atomClass
      const { key, atomClass, atomClassBase, options } = await this._prepareKeyAndAtomAndAtomClass({
        key: keyOuter,
        atomClass: atomClassOuter,
        options: optionsOuter,
      });
      // atom bean
      const _moduleInfo = mparse.parseInfo(atomClass.module);
      const beanFullName = `${_moduleInfo.relativeName}.atom.${atomClassBase.bean}`;
      await ctx.meta.util.executeBean({
        beanModule: _moduleInfo.relativeName,
        beanFullName,
        context: { atomClass, key, options, user },
        fn: 'disable',
      });
    }
  }

  return Atom;
};
