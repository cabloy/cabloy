module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Cms {

    get build() {
      return ctx.bean._getBean(moduleInfo.relativeName, 'local.build');
    }

    get render() {
      return ctx.bean._getBean(moduleInfo.relativeName, 'local.render');
    }

  }

  return Cms;
};
