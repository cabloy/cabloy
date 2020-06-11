
const __departmentFieldMap = [
  [ 'departmentId', 'departmentParentId', 'departmentName', 'departmentNameEn', 'departmentOrder' ],
  [ 'id', 'parentid', 'name', 'name_en', 'order' ],
];

module.exports = app => {

  class Contacts extends app.Service {

    async queueSync({ type, mode }) {
      if (type === 'departments') {
        await this._queueSyncDepartments({ mode });
      } else {

      }

    }

    async _queueSyncDepartments({ mode }) {
      // prepare context
      const context = {
        mode,
        remoteDepartments: null,
      };
      // remote departments
      const res = await this.ctx.meta.wxwork.app.contacts.getDepartmentList();
      if (res.errcode) {
        throw new Error(res.errmsg);
      }
      context.remoteDepartments = res.department;
      // loop
      for (const remoteDepartment of context.remoteDepartments) {
        await this._queueSyncDepartment({ context, remoteDepartment });
      }
      // build roles
      await this.ctx.meta.role.build();
    }

    async _queueSyncDepartment({ context, remoteDepartment }) {
      const department = {};
      this._adjustFields(department, remoteDepartment, __departmentFieldMap);
      const departmentId = department.departmentId;
      // check if local department exists
      const localDepartment = await this.ctx.model.department.get({ departmentId });
      // new department
      if (!localDepartment) {
        // get parent role
        const roleParent = await this._getRoleOfDepartment({ departmentId: department.departmentParentId });
        if (!roleParent) {
          this.ctx.throw(1003, department.departmentParentId);
        }
        // create current role
        const roleIdCurrent = await this.ctx.meta.role.add({
          roleName: department.departmentName,
          catalog: 0, // update by sub role
          sorting: department.departmentOrder,
          roleIdParent: roleParent.id,
        });
        // change parent role
        await this.ctx.meta.role.save({
          roleId: roleParent.id,
          data: { catalog: 1 },
        });
        // creat department
        department.roleId = roleIdCurrent;
        await this.ctx.model.department.insert(department);
        return;
      }
      // update department

    }

    // not create new role here
    async _getRoleOfDepartment({ departmentId }) {
      // user root
      if (departmentId === 0) {
        return await this.ctx.meta.role.get({ roleName: this.ctx.config.sync.departmentRoot });
      }
      // department
      const department = await this.ctx.model.department.get({ departmentId });
      if (!department) return null;
      return await this.ctx.meta.role.get({ id: department.roleId });
    }

    _adjustFields(itemDest, itemSrc, fieldMap) {
      for (const index in fieldMap[1]) {
        const field = fieldMap[1][index];
        if (itemSrc[field] !== undefined) {
          const fieldDest = fieldMap[0][index];
          itemDest[fieldDest] = itemSrc[field];
        }
      }
    }

  }

  return Contacts;
};
