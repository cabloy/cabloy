
const __departmentFieldMap = [
  [ 'departmentId', 'departmentParentId', 'departmentName', 'departmentNameEn', 'departmentOrder' ],
  [ 'id', 'parentid', 'name', 'name_en', 'order' ],
  [ 'number', 'number', 'string', 'string', 'number' ],
];

const __departmentFieldMap_XML = [
  [ 'departmentId', 'departmentParentId', 'departmentName', 'departmentOrder' ],
  [ 'Id', 'ParentId', 'Name', 'Order' ],
  [ 'number', 'number', 'string', 'number' ],
];

module.exports = app => {

  class Contacts extends app.Service {

    async queueSync({ type, progressId }) {
      if (type === 'departments') {
        await this._queueSyncDepartments({ progressId });
      } else {

      }

    }

    async queueChangeContact({ message }) {
      if (message.ChangeType.indexOf('_party') > -1) {
        await this._queueChangeContactDepartment({ message });
      } else if (message.ChangeType.indexOf('_user') > -1) {
        await this._queueChangeContactMember({ message });
      }
    }

    async _queueChangeContactDepartment({ message }) {
      // department
      const department = {};
      this._adjustFields(department, message, __departmentFieldMap_XML);
      // do
      if (message.ChangeType === 'create_party') {
        // create
        await this._createRoleAndDepartment({ department });
        // build roles
        await this.ctx.meta.role.build();
      } else if (message.ChangeType === 'update_party') {
        // update
        await this._updateRoleAndDepartment({ localDepartment: null, department });
      } else if (message.ChangeType === 'delete_party') {
        await this._deleteRoleAndDepartment({ localDepartment: null, department });
        // build roles
        await this.ctx.meta.role.build();
      }
    }

    async _queueChangeContactMember({ message }) {

    }

    async _queueSyncDepartments({ progressId }) {
      try {
        // prepare context
        const context = {
          remoteDepartments: null,
          progressId,
        };
        // progress
        await this.ctx.meta.progress.update({ progressId, text: `--- ${this.ctx.text('Sync Started')} ---` });
        // remote departments
        const res = await this.ctx.meta.wxwork.app.contacts.getDepartmentList();
        if (res.errcode) {
          throw new Error(res.errmsg);
        }
        context.remoteDepartments = res.department;
        // progress
        await this.ctx.meta.progress.update({ progressId, text: `--- ${this.ctx.text('Department Count')}: ${context.remoteDepartments.length} ---` });
        // local departments
        context.localDepartments = await this.ctx.model.department.select();
        context.localDepartmentsMap = {};
        for (const localDepartment of context.localDepartments) {
          localDepartment.__status = 0;
          context.localDepartmentsMap[localDepartment.departmentId] = localDepartment;
        }
        // loop create/update
        for (const remoteDepartment of context.remoteDepartments) {
          await this._queueSyncDepartment({ context, remoteDepartment });
        }
        // delete __status===0
        for (const departmentId in context.localDepartmentsMap) {
          const localDepartment = context.localDepartmentsMap[departmentId];
          if (localDepartment.__status === 0) {
            await this._deleteRoleAndDepartment({ localDepartment, department: null });
            // progress
            await this.ctx.meta.progress.update({ progressId, text: `- ${localDepartment.departmentName}` });
          }
        }
        // build roles
        await this.ctx.meta.role.build();
        // progress done
        await this.ctx.meta.progress.done({ progressId, message: `--- ${this.ctx.text('Sync Completed')} ---` });
      } catch (err) {
        // progress error
        await this.ctx.meta.progress.error({ progressId, message: err.message });
        // throw err
        throw err;
      }
    }

    async _queueSyncDepartment({ context, remoteDepartment }) {
      const department = {};
      this._adjustFields(department, remoteDepartment, __departmentFieldMap);
      const departmentId = department.departmentId;
      // check if local department exists
      const localDepartment = context.localDepartmentsMap[departmentId];
      // new department
      if (!localDepartment) {
        await this._createRoleAndDepartment({ department });
        // progress
        await this.ctx.meta.progress.update({ progressId: context.progressId, text: `+ ${department.departmentName}` });
        // done
        return;
      }
      // update
      await this._updateRoleAndDepartment({ localDepartment, department });
      // progress: not prompt
      // done
      localDepartment.__status = 1; // handled
      return;
    }

    async _deleteRoleAndDepartment({ localDepartment, department }) {
      // localDepartment
      if (!localDepartment) {
        localDepartment = await this.ctx.model.department.get({ departmentId: department.departmentId });
        if (!localDepartment) {
          this.ctx.throw(1004, department.departmentId);
        }
      }
      // delete role
      await this.ctx.meta.role.delete({ roleId: localDepartment.roleId, force: true });
      // delete department
      await this.ctx.model.department.delete({ id: localDepartment.id });
    }

    async _updateRoleAndDepartment({ localDepartment, department }) {
      // localDepartment
      if (!localDepartment) {
        localDepartment = await this.ctx.model.department.get({ departmentId: department.departmentId });
        if (!localDepartment) {
          this.ctx.throw(1004, department.departmentId);
        }
      }
      // update role name
      if (department.departmentName) {
        await this.ctx.meta.role.save({
          roleId: localDepartment.roleId,
          data: { roleName: department.departmentName },
        });
      }
      // update department
      department.id = localDepartment.id;
      await this.ctx.model.department.update(department);
    }

    async _createRoleAndDepartment({ department }) {
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
        // force change parent role to catalog=1
      await this.ctx.meta.role.save({
        roleId: roleParent.id,
        data: { catalog: 1 },
      });
      // creat department
      department.roleId = roleIdCurrent;
      const res = await this.ctx.model.department.insert(department);
      return res.insertId;
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
          itemDest[fieldDest] = this._adjustFieldType(itemSrc[field], fieldMap[2][index]);
        }
      }
    }
    _adjustFieldType(value, type) {
      if (type === 'number') return Number(value);
      else if (type === 'string') return String(value);
      return value;
    }

  }

  return Contacts;
};
