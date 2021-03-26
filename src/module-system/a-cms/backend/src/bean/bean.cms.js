module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Cms {

    get render() {
      return ctx.bean._getBean(moduleInfo.relativeName, 'local.render');
    }

    get site() {
      return ctx.bean._getBean(moduleInfo.relativeName, 'local.site');
    }

    build({ atomClass }) {
      return ctx.bean._newBean(`${moduleInfo.relativeName}.local.build`, atomClass);
    }

  }

  return Cms;
};
