module.exports = app => {
  const moduleInfo = module.info;
  class Version extends app.meta.BeanBase {
    get modelRoleRight() {
      return this.ctx.model.module('a-base').roleRight;
    }

    async update(options) {
      if (options.version === 1) {
        // create table: aLayout
        let sql = `
          CREATE TABLE if not exists aLayout (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            atomId int(11) DEFAULT '0',
            description varchar(255) DEFAULT NULL,
            PRIMARY KEY (id)
          )
          `;
        await this.ctx.model.query(sql);

        // aLayout
        sql = `
          ALTER TABLE aLayout
            Add COLUMN layoutTypeCode INT(11) DEFAULT '0'
          `;
        await this.ctx.model.query(sql);

        // create table: aLayoutContent
        sql = `
          CREATE TABLE if not exists aLayoutContent (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            atomId int(11) DEFAULT '0',
            itemId int(11) DEFAULT '0',
            content JSON DEFAULT NULL,
            PRIMARY KEY (id)
          )
        `;
        await this.ctx.model.query(sql);

        // create view: aLayoutViewFull
        await this.ctx.model.query('drop view if exists aLayoutViewFull');
        sql = `
          CREATE VIEW aLayoutViewFull as
            select a.*,b.content from aLayout a
              left join aLayoutContent b on a.id=b.itemId
        `;
        await this.ctx.model.query(sql);

        // update atomClassLayout
        await this._update_atomClassLayout();
      }
    }

    async init(options) {
      if (options.version === 1) {
        // check if exists
        const roleSystem = await this.ctx.bean.role.getSystemRole({ roleName: 'system' });
        const atomClassLayout = await this.ctx.bean.atomClass.get({
          module: moduleInfo.relativeName,
          atomClassName: 'layout',
        });
        const exists = await this.modelRoleRight.get({
          roleId: roleSystem.id,
          atomClassId: atomClassLayout.id,
          action: 1,
        });
        if (!exists) {
          // add role rights
          const roleRights = [
            { roleName: 'system', action: 'create' },
            { roleName: 'system', action: 'read', scopeNames: 0 },
            { roleName: 'system', action: 'read', scopeNames: 'authenticated' },
            { roleName: 'system', action: 'write', scopeNames: 0 },
            { roleName: 'system', action: 'write', scopeNames: 'authenticated' },
            { roleName: 'system', action: 'delete', scopeNames: 0 },
            { roleName: 'system', action: 'delete', scopeNames: 'authenticated' },
            { roleName: 'system', action: 'clone', scopeNames: 0 },
            { roleName: 'system', action: 'clone', scopeNames: 'authenticated' },
            { roleName: 'system', action: 'authorize', scopeNames: 0 },
            { roleName: 'system', action: 'authorize', scopeNames: 'authenticated' },
            { roleName: 'system', action: 'deleteBulk' },
            { roleName: 'system', action: 'exportBulk' },
          ];
          await this.ctx.bean.role.addRoleRightBatch({ atomClassName: 'layout', roleRights });
        }
      }
    }

    async _update_atomClassLayout() {
      // update atomClass from a-layoutpc to a-baselayout
      //   all iid
      await this.ctx.model.query('update aAtomClass set module=? where module=? and atomClassName=?', [
        'a-baselayout',
        'a-layoutpc',
        'layout',
      ]);
    }
  }

  return Version;
};
