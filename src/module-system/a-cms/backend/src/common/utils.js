module.exports = {
  atomClass(atomClass) {
    let _atomClass;
    if (atomClass) {
      _atomClass = {
        module: atomClass.module,
        atomClassName: atomClass.atomClassName,
      };
      if (atomClass.id) _atomClass.id = atomClass.id;
    } else {
      _atomClass = {
        module: 'a-cms',
        atomClassName: 'article',
      };
    }
    return _atomClass;
  },
  async atomClass2(ctx, atomClass) {
    const _atomClass = this.atomClass(atomClass);
    if (!_atomClass.id) {
      const res = await ctx.bean.atomClass.get(_atomClass);
      _atomClass.id = res.id;
    }
    return _atomClass;
  },
};
