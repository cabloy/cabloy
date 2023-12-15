const moduleInfo = module.info;
module.exports = class Detail extends module.meta.class.BeanModuleBase {
  get modelDetailBase() {
    return this.ctx.model.module(moduleInfo.relativeName).detailBase;
  }

  async _loopDetailClasses({ atomClass, fn }) {
    // all details of atom
    const atomClassBase = await this.ctx.bean.atomClass.atomClass(atomClass);
    const atomClassDetails = atomClassBase.details;
    if (!atomClassDetails) return; // do nothing
    // loop
    for (let atomClassDetail of atomClassDetails) {
      atomClassDetail = await this.ctx.bean.atomClass.get(atomClassDetail);
      const atomClassBaseDetail = await this.ctx.bean.atomClass.atomClass(atomClassDetail);
      await fn({ atomClassDetail, atomClassBaseDetail });
    }
  }
};
