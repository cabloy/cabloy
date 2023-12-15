const moduleInfo = module.info;
module.exports = class Cms {
  get render() {
    return this.ctx.bean._getBean(moduleInfo.relativeName, 'local.render');
  }

  get site() {
    return this.ctx.bean._getBean(moduleInfo.relativeName, 'local.site');
  }

  build({ atomClass }) {
    return this.ctx.bean._newBean(`${moduleInfo.relativeName}.local.build`, atomClass);
  }
};
