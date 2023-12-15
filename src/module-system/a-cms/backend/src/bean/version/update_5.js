const utils = require('../../common/utils.js');

const moduleInfo = module.info;
module.exports = class Version {
  async _update_5(options) {
    // alter table: aCmsCategory
    let sql = `
      ALTER TABLE aCmsCategory
        ADD COLUMN atomClassId int(11) DEFAULT '0'
                `;
    await this.ctx.model.query(sql);
    // alter table: aCmsTag
    sql = `
      ALTER TABLE aCmsTag
        ADD COLUMN atomClassId int(11) DEFAULT '0'
                `;
    await this.ctx.model.query(sql);

    // atomClass
    await this._update5AtomClassIds(options);
  }

  async _update5AtomClassIds(options) {
    // all instances
    const instances = await this.ctx.bean.instance.list({ where: {} });
    for (const instance of instances) {
      await this.ctx.meta.util.executeBean({
        subdomain: instance.name,
        beanModule: moduleInfo.relativeName,
        beanFullName: `${moduleInfo.relativeName}.version.manager`,
        context: options,
        fn: '_update5AtomClassIdsInstance',
      });
    }
  }

  async _update5AtomClassIdsInstance() {
    const atomClass = await utils.atomClass2(this.ctx, null);
    // update aCmsCategory's atomClassId
    await this.ctx.model.query(
      `update aCmsCategory set atomClassId=?
             where iid=?`,
      [atomClass.id, this.ctx.instance.id]
    );
    // update aCmsTag's atomClassId
    await this.ctx.model.query(
      `update aCmsTag set atomClassId=?
             where iid=?`,
      [atomClass.id, this.ctx.instance.id]
    );
  }
};
