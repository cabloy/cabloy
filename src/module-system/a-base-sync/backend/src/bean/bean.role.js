module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const __atomClassRole = {
    module: moduleInfo.relativeName,
    atomClassName: 'role',
  };

  class Role extends ctx.app.meta.BeanModuleBase {
    constructor(moduleName) {
      super(ctx, 'role');
      this.moduleName = moduleName || ctx.module.info.relativeName;
    }

    get model() {
      return ctx.model.module(moduleInfo.relativeName).role;
    }

    get modelRoleInc() {
      return ctx.model.module(moduleInfo.relativeName).roleInc;
    }

    get modelUserRole() {
      return ctx.model.module(moduleInfo.relativeName).userRole;
    }

    get modelRoleRight() {
      return ctx.model.module(moduleInfo.relativeName).roleRight;
    }

    get modelRoleRightRef() {
      return ctx.model.module(moduleInfo.relativeName).roleRightRef;
    }

    get modelAtom() {
      return ctx.model.module(moduleInfo.relativeName).atom;
    }

    async get(where) {
      return await this.model.get(where);
    }

    async getSystemRole({ roleName }) {
      return await this.get({
        roleName,
        system: 1,
      });
    }

    // add role
    //  { module,roleName,...}
    async add(data) {
      const user = { id: 0 };
      // create
      const itemCreate = {
        catalog: 0,
        system: data.system,
        roleIdParent: data.roleIdParent,
      };
      if (data.module && data.roleName) {
        itemCreate.atomStaticKey = `${data.module}:role_${data.roleName}`;
      }
      const roleKey = await ctx.bean.atom.create({
        atomClass: __atomClassRole,
        item: itemCreate,
        user,
      });
      // write
      const item = {
        atomName: data.roleName,
        ...data,
      };
      await ctx.bean.atom.write({
        key: roleKey,
        item,
        user,
      });
      // submit
      await ctx.bean.atom.submit({
        key: roleKey,
        options: { ignoreFlow: true },
        user,
      });
      // roleId
      const roleId = roleKey.itemId;
      return roleId;
    }

    async move({ roleId, roleIdParent }) {
      // role
      const role = await this.get({ id: roleId });
      // roleIdParentOld
      const roleIdParentOld = role.roleIdParent;
      if (roleIdParentOld === roleIdParent) return;
      // update
      await this.model.update({ id: roleId, roleIdParent });

      // adjust catalog
      await this.adjustCatalog(roleIdParentOld);
      await this.adjustCatalog(roleIdParent);

      // set dirty
      await this.setDirty(true);
    }

    async delete({ roleAtomId, roleId, force = false }) {
      // roleId
      if (!roleAtomId) {
        const atom = await this.modelAtom.get({ itemId: roleId });
        roleAtomId = atom.id;
      }
      // delete this
      await ctx.bean.atom.delete({ key: { atomId: roleAtomId }, options: { force } });
    }

    // for donothing on roleId === 0
    async adjustCatalog(roleId) {
      if (roleId === 0) return;
      const children = await this.children({ roleId, page: false });
      await this.model.update({
        id: roleId,
        catalog: children.length === 0 ? 0 : 1,
      });
    }

    async parseRoleNames({ roleNames, force = false }) {
      const arr = roleNames.split(',');
      const res = [];
      for (const roleName of arr) {
        const role = await this.parseRoleName({ roleName, force });
        res.push(role); // not check if null
      }
      return res;
    }

    // roleA.roleB
    async parseRoleName({ roleName, roleIdParent, force = false }) {
      if (!roleName) throw new Error('roleName should not be empty');
      const roleNames = roleName.split('.');
      let role;
      for (const _roleName of roleNames) {
        if (roleIdParent === undefined) {
          role = await this.get({ roleName: _roleName });
        } else {
          role = await this.child({
            roleId: roleIdParent,
            roleName: _roleName,
          });
        }
        // next
        if (role) {
          roleIdParent = role.id;
          continue;
        }
        // null
        if (!roleIdParent || !force) return null;
        // create
        const roleId = await this._register({
          roleName: _roleName,
          roleIdParent,
        });
        role = await this.get({ id: roleId });
        // next
        roleIdParent = roleId;
      }
      return role;
    }

    async _register({ roleName, roleIdParent }) {
      return await ctx.meta.util.lock({
        resource: `${moduleInfo.relativeName}.role.register`,
        fn: async () => {
          return await ctx.meta.util.executeBeanIsolate({
            beanModule: moduleInfo.relativeName,
            beanFullName: 'role',
            context: { roleName, roleIdParent },
            fn: '_registerLock',
          });
        },
      });
    }

    async _registerLock({ roleName, roleIdParent }) {
      // get again
      const role = await this.child({
        roleId: roleIdParent,
        roleName,
      });
      if (role) return role.id;
      // add
      return await this.add({ roleName, roleIdParent });
    }

    // add role include
    async addRoleInc({ roleId, roleIdInc }) {
      const res = await this.modelRoleInc.insert({
        roleId,
        roleIdInc,
      });
      const id = res.insertId;

      // set dirty
      await this.setDirty(true);

      return id;
    }

    // remove role include
    async removeRoleInc({ id }) {
      await this.modelRoleInc.delete({ id });

      // set dirty
      await this.setDirty(true);
    }

    // add user role
    async addUserRole({ userId, roleId }) {
      const res = await this.modelUserRole.insert({
        userId,
        roleId,
      });
      return res.insertId;
    }

    async deleteUserRole({ id, userId, roleId }) {
      if (!id) {
        const item = await this.modelUserRole.get({
          userId,
          roleId,
        });
        if (!item) return;
        id = item.id;
      }
      await this.modelUserRole.delete({ id });
    }

    async deleteAllUserRoles({ userId }) {
      await this.modelUserRole.delete({ userId });
    }

    // add role right
    async addRoleRight({ roleId, atomClassId, action, scope }) {
      if (scope) {
        if (typeof scope === 'string') {
          scope = scope.split(',');
        } else if (!Array.isArray(scope)) {
          scope = [scope];
        }
      }
      // force action exists in db
      await ctx.bean.atomAction.get({ atomClassId, code: action });

      // roleRight
      const res = await this.modelRoleRight.insert({
        roleId,
        atomClassId,
        action,
        scope: JSON.stringify(scope),
      });
      const roleRightId = res.insertId;
      // roleRightRef
      if (scope) {
        for (const roleIdScope of scope) {
          await this.modelRoleRightRef.insert({
            roleRightId,
            roleId,
            atomClassId,
            action,
            roleIdScope,
          });
        }
      }
      return roleRightId;
    }

    // delete role right
    async deleteRoleRight({ id }) {
      await this.modelRoleRight.delete({ id });
      await this.modelRoleRightRef.delete({ roleRightId: id });
    }

    // child
    async child({ roleId, roleName }) {
      const list = await this.children({ roleId, roleName, page: false });
      return list[0];
    }

    // childrenTop
    async childrenTop({ page, user }) {
      // page
      page = ctx.bean.util.page(page, false);
      // atomClass
      const atomClass = await ctx.bean.atomClass.get(__atomClassRole);
      // roles by authed
      let roleIds;
      if (user.id === 0) {
        const roleRoot = await this.parseRoleName({ roleName: 'root' });
        roleIds = [roleRoot.id];
      } else {
        const roles = await ctx.model.query(
          `
            select * from aViewUserRightRefAtomClass a 
              where a.iid=? and a.userIdWho=? and a.atomClassId=? and a.action=2
          `,
          [ctx.instance.id, user.id, atomClass.id]
        );
        roleIds = roles.map(item => item.roleIdWhom);
      }
      if (roleIds.length === 0) return [];
      // select
      const list = await ctx.bean.atom.select({
        atomClass,
        options: {
          orders: [['a.id', 'asc']],
          page,
          stage: 'formal',
          where: {
            'f.id': {
              op: 'in',
              val: roleIds,
            },
          },
        },
        user,
        pageForce: false,
      });
      return list;
    }

    // children
    async children({ roleId, roleName, page }) {
      page = ctx.bean.util.page(page, false);
      // roleId
      if (!roleId || roleId === 'root') {
        roleId = 0;
      }
      // where
      const where = { roleIdParent: roleId };
      if (roleName !== undefined) where.roleName = roleName;
      // select
      const options = {
        where,
        orders: [
          ['sorting', 'asc'],
          ['roleName', 'asc'],
        ],
      };
      if (page.size !== 0) {
        options.limit = page.size;
        options.offset = page.index;
      }
      return await this.model.select(options);
    }

    // save
    async save({ roleId, data: { roleName, leader, sorting, catalog } }) {
      const role = await this.get({ id: roleId });
      if (roleName !== undefined) role.roleName = roleName;
      if (leader !== undefined) role.leader = leader;
      if (sorting !== undefined) role.sorting = sorting;
      if (catalog !== undefined) role.catalog = catalog;
      await this.model.update(role);
      // atomName
      if (roleName !== undefined && role.roleName !== roleName) {
        await this.modelAtom.update({ id: role.atomId, atomName: roleName });
      }
    }

    // includes
    async includes({ roleId, page }) {
      page = ctx.bean.util.page(page, false);
      const _limit = ctx.model._limit(page.size, page.index);
      return await ctx.model.query(
        `
        select a.*,b.roleName from aRoleInc a
          left join aRole b on a.roleIdInc=b.id
            where a.iid=? and a.roleId=?
            ${_limit}
        `,
        [ctx.instance.id, roleId]
      );
    }

    // role rights
    async roleRights({ roleId, page }) {
      page = ctx.bean.util.page(page, false);
      const _limit = ctx.model._limit(page.size, page.index);
      const list = await ctx.model.query(
        `
        select a.*,b.module,b.atomClassName,c.name as actionName,c.bulk as actionBulk from aRoleRight a
          left join aAtomClass b on a.atomClassId=b.id
          left join aAtomAction c on a.atomClassId=c.atomClassId and a.action=c.code
            where a.iid=? and a.roleId=?
            order by b.module,a.atomClassId,a.action
            ${_limit}
        `,
        [ctx.instance.id, roleId]
      );
      // scope
      for (const item of list) {
        const scope = JSON.parse(item.scope);
        item.scopeRoles = await this._scopeRoles({ scope });
      }
      return list;
    }

    // role spreads
    async roleSpreads({ roleId, page }) {
      page = ctx.bean.util.page(page, false);
      const _limit = ctx.model._limit(page.size, page.index);
      const list = await ctx.model.query(
        `
        select d.*,d.id as roleExpandId,a.id as roleRightId,a.scope,b.module,b.atomClassName,c.code as actionCode,c.name as actionName,c.bulk as actionBulk,e.roleName from aRoleRight a
          left join aAtomClass b on a.atomClassId=b.id
          left join aAtomAction c on a.atomClassId=c.atomClassId and a.action=c.code
          left join aRoleExpand d on a.roleId=d.roleIdBase
          left join aRole e on d.roleIdBase=e.id
            where d.iid=? and d.roleId=?
            order by b.module,a.atomClassId,a.action
            ${_limit}
        `,
        [ctx.instance.id, roleId]
      );
      // scope
      for (const item of list) {
        const scope = JSON.parse(item.scope);
        item.scopeRoles = await this._scopeRoles({ scope });
      }
      return list;
    }

    // atom rights of user
    async atomRightsOfUser({ userId, page }) {
      page = ctx.bean.util.page(page, false);
      const _limit = ctx.model._limit(page.size, page.index);
      const list = await ctx.model.query(
        `
        select a.*,b.module,b.atomClassName,c.code as actionCode,c.name as actionName,c.bulk as actionBulk,e.roleName from aViewUserRightAtomClass a
          left join aAtomClass b on a.atomClassId=b.id
          left join aAtomAction c on a.atomClassId=c.atomClassId and a.action=c.code
          left join aRole e on a.roleIdBase=e.id
            where a.iid=? and a.userIdWho=?
            order by b.module,a.atomClassId,a.action
            ${_limit}
        `,
        [ctx.instance.id, userId]
      );
      // scope
      for (const item of list) {
        const scope = JSON.parse(item.scope);
        item.scopeRoles = await this._scopeRoles({ scope });
      }
      return list;
    }

    async _scopeRoles({ scope }) {
      if (!scope || scope.length === 0) return null;
      return await ctx.model.query(
        `
            select a.* from aRole a
              where a.iid=? and a.id in (${scope.join(',')})
            `,
        [ctx.instance.id]
      );
    }

    async getUserRolesDirect({ userId }) {
      const list = await ctx.model.query(
        `
        select a.* from aRole a
          left join aUserRole b on a.id=b.roleId
            where a.iid=? and b.userId=?
        `,
        [ctx.instance.id, userId]
      );
      return list;
    }

    async getUserRolesParent({ userId }) {
      const list = await ctx.model.query(
        `
        select a.* from aRole a
          left join aViewUserRoleRef b on a.id=b.roleIdParent
            where a.iid=? and b.userId=?
        `,
        [ctx.instance.id, userId]
      );
      return list;
    }

    async getUserRolesExpand({ userId }) {
      const list = await ctx.model.query(
        `
        select a.* from aRole a
          left join aViewUserRoleExpand b on a.id=b.roleIdBase
            where a.iid=? and b.userId=?
        `,
        [ctx.instance.id, userId]
      );
      return list;
    }

    async userInRoleDirect({ userId, roleId }) {
      const list = await ctx.model.query(
        `
        select count(*) as count from aUserRole a
          where a.iid=? and a.userId=? and a.roleId=?
        `,
        [ctx.instance.id, userId, roleId]
      );
      return list[0].count > 0;
    }

    async userInRoleParent({ userId, roleId }) {
      const list = await ctx.model.query(
        `
        select count(*) as count from aViewUserRoleRef a
          where a.iid=? and a.userId=? and a.roleIdParent=?
        `,
        [ctx.instance.id, userId, roleId]
      );
      return list[0].count > 0;
    }

    async userInRoleExpand({ userId, roleId }) {
      const list = await ctx.model.query(
        `
        select count(*) as count from aViewUserRoleExpand a
          where a.iid=? and a.userId=? and a.roleIdBase=?
        `,
        [ctx.instance.id, userId, roleId]
      );
      return list[0].count > 0;
    }

    async usersOfRoleDirect({ roleId, disabled, page, removePrivacy }) {
      // disabled
      let _disabled = '';
      if (disabled !== undefined) {
        _disabled = `and disabled=${parseInt(disabled)}`;
      }
      // page
      page = ctx.bean.util.page(page, false);
      const _limit = ctx.model._limit(page.size, page.index);
      // fields
      const fields = await ctx.bean.user.getFieldsSelect({ removePrivacy, alias: 'a' });
      // query
      const list = await ctx.model.query(
        `
        select ${fields} from aUser a
          inner join aUserRole b on a.id=b.userId
            where a.iid=? and a.deleted=0 ${_disabled} and b.roleId=?
            order by a.userName
            ${_limit}
        `,
        [ctx.instance.id, roleId]
      );
      return list;
    }

    async usersOfRoleParent({ roleId, disabled, page, removePrivacy, query }) {
      // disabled
      let _disabled = '';
      if (disabled !== undefined) {
        _disabled = `and disabled=${parseInt(disabled)}`;
      }
      // page
      page = ctx.bean.util.page(page, false);
      const _limit = ctx.model._limit(page.size, page.index);
      // fields
      const fields = await ctx.bean.user.getFieldsSelect({ removePrivacy, alias: 'a' });
      // query
      let where;
      if (query) {
        const clause = {};
        clause.__or__ = [
          { 'a.userName': { op: 'like', val: query } },
          { 'a.realName': { op: 'like', val: query } },
          { 'a.mobile': { op: 'like', val: query } },
        ];
        where = ctx.model._where(clause);
      }
      where = where ? `${where} AND` : ' WHERE';
      // select
      const list = await ctx.model.query(
        `
        select ${fields} from aUser a
          inner join aViewUserRoleRef b on a.id=b.userId
            ${where} a.iid=? and a.deleted=0 ${_disabled} and b.roleIdParent=?
            order by a.userName
            ${_limit}
        `,
        [ctx.instance.id, roleId]
      );
      return list;
    }

    async usersOfRoleExpand({ roleId, disabled, page, removePrivacy }) {
      // disabled
      let _disabled = '';
      if (disabled !== undefined) {
        _disabled = `and disabled=${parseInt(disabled)}`;
      }
      // page
      page = ctx.bean.util.page(page, false);
      const _limit = ctx.model._limit(page.size, page.index);
      // fields
      const fields = await ctx.bean.user.getFieldsSelect({ removePrivacy, alias: 'a' });
      // query
      const list = await ctx.model.query(
        `
        select ${fields} from aUser a
          inner join aViewUserRoleExpand b on a.id=b.userId
            where a.iid=? and a.deleted=0 ${_disabled} and b.roleIdBase=?
            order by a.userName
            ${_limit}
        `,
        [ctx.instance.id, roleId]
      );
      return list;
    }

    // set dirty
    async setDirty(dirty) {
      await ctx.bean.status.module(moduleInfo.relativeName).set('roleDirty', dirty);
    }

    async getDirty() {
      return await ctx.bean.status.module(moduleInfo.relativeName).get('roleDirty');
    }

    // build roles
    async build(options) {
      // queue
      await ctx.meta.util.queuePushAsync({
        module: moduleInfo.relativeName,
        queueName: 'roleBuild',
        data: { options },
      });
    }

    async _buildQueue(options) {
      options = options || {};
      const progressId = options.progressId;
      // total
      let total;
      if (progressId) {
        total = await this.model.count();
      }
      // progress
      const progress = { progressId, total, progress: 0 };
      try {
        // iid
        const iid = ctx.instance.id;
        // remove
        await this._buildRolesRemove({ iid });
        // add
        await this._buildRolesAdd({ iid, roleIdParent: 0 }, progress);
        // setDirty
        await this.setDirty(false);
        // done
        if (progressId) {
          await ctx.bean.progress.done({ progressId });
        }
      } catch (err) {
        // error
        if (progressId) {
          await ctx.bean.progress.error({ progressId, message: err.message });
        }
        throw err;
      }
    }

    // const roleRights = [
    //   { roleName: 'cms-writer', action: 'create' },
    //   { roleName: 'cms-writer', action: 'write', scopeNames: 0 },
    //   { roleName: 'cms-writer', action: 'delete', scopeNames: 0 },
    //   { roleName: 'cms-writer', action: 'read', scopeNames: 'authenticated' },
    //   { roleName: 'root', action: 'read', scopeNames: 'authenticated' },
    // ];
    async addRoleRightBatch({ module, atomClassName, atomClassIdParent = 0, roleRights }) {
      // module
      module = module || this.moduleName;
      // const _module = ctx.app.meta.modules[module];
      // atomClass
      const atomClass = await ctx.bean.atomClass.get({ module, atomClassName, atomClassIdParent });
      // roleRights
      if (!roleRights || !roleRights.length) return;
      for (const roleRight of roleRights) {
        // role
        const role = await this.parseRoleName({ roleName: roleRight.roleName, force: true });
        // scope
        let scope;
        if (!roleRight.scopeNames) {
          scope = 0;
        } else {
          scope = [];
          const scopeNames = Array.isArray(roleRight.scopeNames)
            ? roleRight.scopeNames
            : roleRight.scopeNames.split(',');
          for (const scopeName of scopeNames) {
            const roleScope = await this.get({ roleName: scopeName });
            scope.push(roleScope.id);
          }
        }
        // add role right
        const actionCode = ctx.bean.atomAction.parseActionCode({
          action: roleRight.action,
          atomClass: {
            module,
            atomClassName,
          },
        });
        await this.addRoleRight({
          roleId: role.id,
          atomClassId: atomClass.id,
          action: actionCode,
          scope,
        });
      }
    }

    async _buildRolesRemove({ iid }) {
      await ctx.model.query(`delete from aRoleRef where aRoleRef.iid=${iid}`);
      await ctx.model.query(`delete from aRoleIncRef where aRoleIncRef.iid=${iid}`);
      await ctx.model.query(`delete from aRoleExpand where aRoleExpand.iid=${iid}`);
    }

    async _buildRolesAdd({ iid, roleIdParent }, progress) {
      const list = await ctx.model.query(
        `select a.id,a.roleName,a.catalog from aRole a where a.iid=${iid} and a.roleIdParent=${roleIdParent}`
      );
      for (const item of list) {
        // info
        const roleId = item.id;
        const catalog = item.catalog;
        // build
        await this._buildRoleRef({ iid, roleId });
        await this._buildRoleIncRef({ iid, roleId });
        await this._buildRoleExpand({ iid, roleId });
        // catalog
        if (catalog === 1) {
          await this._buildRolesAdd({ iid, roleIdParent: roleId }, progress);
        }
        // progress
        if (progress.progressId) {
          await ctx.bean.progress.update({
            progressId: progress.progressId,
            progressNo: 0,
            total: progress.total,
            progress: progress.progress++,
            text: item.roleName,
          });
        }
      }
    }

    async _buildRoleRef({ iid, roleId }) {
      let level = 0;
      let roleIdParent = roleId;
      // loop
      while (level !== -1) {
        await ctx.model.query(
          `insert into aRoleRef(iid,roleId,roleIdParent,level)
             values(${iid},${roleId},${roleIdParent},${level})
          `
        );
        const item = await ctx.model.queryOne(
          `select a.roleIdParent from aRole a where a.iid=${iid} and a.id=${roleIdParent}`
        );
        if (!item || !item.roleIdParent) {
          level = -1;
        } else {
          roleIdParent = item.roleIdParent;
          level++;
        }
      }
    }

    async _buildRoleIncRef({ iid, roleId }) {
      await ctx.model.query(
        `insert into aRoleIncRef(iid,roleId,roleIdInc,roleIdSrc)
            select ${iid},${roleId},a.roleIdInc,a.roleId from aRoleInc a
              where a.iid=${iid} and a.roleId in (select b.roleIdParent from aRoleRef b where b.iid=${iid} and b.roleId=${roleId})
        `
      );
    }

    async _buildRoleExpand({ iid, roleId }) {
      await ctx.model.query(
        `insert into aRoleExpand(iid,roleId,roleIdBase)
            select a.iid,a.roleId,a.roleIdParent from aRoleRef a
              where a.iid=${iid} and a.roleId=${roleId}
        `
      );
      await ctx.model.query(
        `insert into aRoleExpand(iid,roleId,roleIdBase)
            select a.iid,a.roleId,a.roleIdInc from aRoleIncRef a
              where a.iid=${iid} and a.roleId=${roleId}
        `
      );
    }

    async _checkRightWriteOfRole({ roleAtomId, roleId, user }) {
      if (!user || user.id === 0) return true;
      // roleId
      if (!roleAtomId) {
        const atom = await this.modelAtom.get({ itemId: roleId });
        roleAtomId = atom.id;
      }
      // check
      const res = await ctx.bean.atom.checkRightAction({
        atom: { id: roleAtomId },
        action: 'write',
        user,
      });
      return !!res;
    }
  }

  return Role;
};
