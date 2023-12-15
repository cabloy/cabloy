let __icons = null;

// const moduleInfo = module.info;
module.exports = class Icon extends module.meta.class.BeanModuleBase {
  getIcons() {
    if (!__icons) {
      __icons = this._prepareIcons();
    }
    return __icons;
  }

  _prepareIcons() {
    const icons = {};
    for (const relativeName in this.ctx.app.meta.modules) {
      const module = this.ctx.app.meta.modules[relativeName];
      const groups = this.ctx.bean.util.getProperty(module.main.meta, 'icon.groups');
      if (groups) {
        icons[relativeName] = groups;
      }
    }
    return icons;
  }
};
