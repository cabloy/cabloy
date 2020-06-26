const WxworkHelperFn = require('../common/wxworkHelper.js');

// department

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

// member

const __memberFieldMap = [
  [ 'memberId', 'name', 'alias', 'mobile', 'department', 'sorting', 'position', 'gender', 'email', 'telephone', 'is_leader_in_dept', 'avatar', 'thumb_avatar', 'qr_code', 'status', 'extattr', 'external_profile', 'external_position', 'address', 'hide_mobile', 'english_name', 'open_userid', 'main_department' ],
  [ 'userid', 'name', 'alias', 'mobile', 'department', 'order', 'position', 'gender', 'email', 'telephone', 'is_leader_in_dept', 'avatar', 'thumb_avatar', 'qr_code', 'status', 'extattr', 'external_profile', 'external_position', 'address', 'hide_mobile', 'english_name', 'open_userid', 'main_department' ],
  [ 'string', 'string', 'string', 'string', 'array', 'array', 'string', 'number', 'string', 'string', 'array', 'string', 'string', 'string', 'number', 'json', 'json', 'string', 'string', 'number', 'string', 'string', 'number' ],
];

const __memberFieldMap_XML = [
  [ 'memberIdNew', 'memberId', 'name', 'alias', 'mobile', 'department', 'position', 'gender', 'email', 'telephone', 'is_leader_in_dept', 'avatar', 'status', 'extattr', 'address' ],
  [ 'NewUserID', 'UserID', 'Name', 'Alias', 'Mobile', 'Department', 'Position', 'Gender', 'Email', 'Telephone', 'IsLeaderInDept', 'Avatar', 'Status', 'ExtAttr', 'Address' ],
  [ 'string', 'string', 'string', 'string', 'string', 'string', 'string', 'number', 'string', 'string', 'string', 'string', 'number', 'json', 'string' ],
];

module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Contacts extends app.Service {

    async queueSync({ type, progressId, userOp }) {
      if (type === 'departments') {
        await this._queueSyncDepartments({ progressId, userOp });
      } else if (type === 'members') {
        await this._queueSyncMembers({ progressId, userOp });
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
      const member = {};
      this._adjustFields(member, message, __memberFieldMap_XML);
      // do
      if (message.ChangeType === 'create_user') {
        // get member remotely
        const res = await this.ctx.meta.wxwork.app.contacts.getUser(member.memberId);
        if (res.errcode) {
          throw new Error(res.errmsg);
        }
        // create
        const _member = {};
        this._adjustFields(_member, res, __memberFieldMap);
        await this._createUserAndMember({ member: _member });
      } else if (message.ChangeType === 'update_user') {
        // check if memberId changed
        if (member.memberIdNew) {
          // upate memberId of member
          await this.ctx.model.query(
            'update aWxworkUser a set a.memberId=? where a.iid=? and a.memberId=?',
            [ member.memberIdNew, this.ctx.instance.id, member.memberId ]
          );
          // upate profileId of auth
          await this.ctx.model.query(
            'update aAuth a set a.profileId=? where a.iid=? and a.profileId=?',
            [ `wxwork:${member.memberIdNew}`, this.ctx.instance.id, `wxwork:${member.memberId}` ]
          );
        }
        // get member remotely
        const res = await this.ctx.meta.wxwork.app.contacts.getUser(member.memberIdNew || member.memberId);
        if (res.errcode) {
          throw new Error(res.errmsg);
        }
        // update
        const _member = {};
        this._adjustFields(_member, res, __memberFieldMap);
        await this._updateUserAndMember({ localMember: null, member: _member });
      } else if (message.ChangeType === 'delete_user') {
        await this._deleteUserAndMember({ localMember: null, member });
      }
    }

    // queue sync departments
    async _queueSyncDepartments({ progressId, userOp }) {
      // prepare context
      const context = {
        remoteDepartments: null,
        progressId,
        userOp,
      };
      try {
        // progress
        await this._progressPublish({ context, done: 0, text: `--- ${this.ctx.text('Sync Started')} ---` });
        // remote departments
        const res = await this.ctx.meta.wxwork.app.contacts.getDepartmentList();
        if (res.errcode) {
          throw new Error(res.errmsg);
        }
        context.remoteDepartments = res.department;
        // progress
        await this._progressPublish({ context, done: 0, text: `--- ${this.ctx.text('Department Count')}: ${context.remoteDepartments.length} ---` });
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
            await this._progressPublish({ context, done: 0, text: `- ${localDepartment.departmentName}` });
          }
        }
        // build roles
        await this.ctx.meta.role.build();
        // progress done
        await this._progressPublish({ context, done: 1, text: `--- ${this.ctx.text('Sync Completed')} ---` });
      } catch (err) {
        // progress error
        await this._progressPublish({ context, done: -1, text: err.message });
        // throw err
        throw err;
      }
    }

    // queue sync members
    async _queueSyncMembers({ progressId, userOp }) {
      // prepare context
      const context = {
        remoteMembers: null,
        progressId,
        userOp,
      };
      try {
        // progress
        await this._progressPublish({ context, done: 0, text: `--- ${this.ctx.text('Sync Started')} ---` });
        // remote members
        const departmentRoot = await this.ctx.model.department.get({ departmentParentId: 0 });
        if (!departmentRoot) return this.ctx.throw(1006);
        const res = await this.ctx.meta.wxwork.app.contacts.getDepartmentUserList(departmentRoot.departmentId, 1);
        if (res.errcode) {
          throw new Error(res.errmsg);
        }
        context.remoteMembers = res.userlist;
        // progress
        await this._progressPublish({ context, done: 0, text: `--- ${this.ctx.text('Member Count')}: ${context.remoteMembers.length} ---` });
        // local members
        context.localMembers = await this.ctx.model.member.select();
        context.localMembersMap = {};
        for (const localMember of context.localMembers) {
          localMember.__status = 0;
          context.localMembersMap[localMember.memberId] = localMember;
        }
        // loop create/update
        for (const remoteMember of context.remoteMembers) {
          await this._queueSyncMember({ context, remoteMember });
        }
        // delete __status===0
        for (const memberId in context.localMembersMap) {
          const localMember = context.localMembersMap[memberId];
          if (localMember.__status === 0) {
            await this._deleteUserAndMember({ localMember, member: null });
            // progress
            await this._progressPublish({ context, done: 0, text: `- ${localMember.name}` });
          }
        }
        // progress done
        await this._progressPublish({ context, done: 1, text: `--- ${this.ctx.text('Sync Completed')} ---` });
      } catch (err) {
        // progress error
        await this._progressPublish({ context, done: -1, text: err.message });
        // throw err
        throw err;
      }
    }

    async _progressPublish({ context, done, text }) {
      const ioMessage = {
        userIdTo: context.userOp.id,
        messageFilter: context.progressId,
        content: { done, text },
      };
      await this.ctx.meta.io.publish({
        path: `/${moduleInfo.url}/progress/${context.progressId}`,
        message: ioMessage,
        messageClass: {
          module: moduleInfo.relativeName,
          messageClassName: 'progress',
        },
        options: {
          saveMessageAsync: true,
        },
      });
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
        await this._progressPublish({ context, done: 0, text: `+ ${department.departmentName}` });
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

    async _queueSyncMember({ context, remoteMember }) {
      const member = {};
      this._adjustFields(member, remoteMember, __memberFieldMap);
      const memberId = member.memberId;
      // check if local member exists
      const localMember = context.localMembersMap[memberId];
      // new member
      if (!localMember) {
        await this._createUserAndMember({ member });
        // progress
        await this._progressPublish({ context, done: 0, text: `+ ${member.name}` });
        // done
        return;
      }
      // update
      await this._updateUserAndMember({ localMember, member });
      // progress: not prompt
      // done
      localMember.__status = 1; // handled
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

    async _deleteUserAndMember({ localMember, member }) {
      // localMember
      if (!localMember) {
        localMember = await this.ctx.model.member.get({ memberId: member.memberId });
        if (!localMember) {
          this.ctx.throw(1005, member.memberId);
        }
      }
      const userId = localMember.userId;
      // delete user: including roles/auth
      await this.ctx.meta.user.delete({ userId });
      // delete member
      await this.ctx.model.member.delete({ id: localMember.id });
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

    async _updateUserRoles({ userId, departmentIdsOld, departmentIdsNew }) {
      const departmentIdsAdd = [];
      const departmentIdsDelete = [];
      for (const departmentId of departmentIdsNew) {
        if (departmentIdsOld.indexOf(departmentId) === -1) {
          departmentIdsAdd.push(departmentId);
        }
      }
      for (const departmentId of departmentIdsOld) {
        if (departmentIdsNew.indexOf(departmentId) === -1) {
          departmentIdsDelete.push(departmentId);
        }
      }
      // add
      await this._addUserRoles({ userId, departmentIds: departmentIdsAdd });
      // delete
      await this._deleteUserRoles({ userId, departmentIds: departmentIdsDelete });
    }

    async _updateUserAndMember({ localMember, member }) {
      // localMember
      if (!localMember) {
        localMember = await this.ctx.model.member.get({ memberId: member.memberId });
        if (!localMember) {
          this.ctx.throw(1005, member.memberId);
        }
      }
      const userId = localMember.userId;
      // roles
      if (member.department !== undefined && member.department !== localMember.department) {
        await this._updateUserRoles({
          userId,
          departmentIdsOld: (localMember.department || '').split(','),
          departmentIdsNew: (member.department || '').split(','),
        });
      }
      // status
      if (member.status !== undefined && member.status !== localMember.status) {
        await this.ctx.meta.user.disable({ userId, disabled: member.status !== 1 });
      }
      // update member
      member.id = localMember.id;
      await this.ctx.model.member.update(member);
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

    // [1,2]
    async _addUserRoles({ userId, departmentIds }) {
      for (const departmentId of departmentIds) {
        // get role of department
        const roleCurrent = await this._getRoleOfDepartment({ departmentId });
        if (!roleCurrent) {
          this.ctx.throw(1003, departmentId);
        }
        // add user role
        await this.ctx.meta.role.addUserRole({ userId, roleId: roleCurrent.id });
      }
    }

    async _deleteUserRoles({ userId, departmentIds }) {
      for (const departmentId of departmentIds) {
        // get role of department
        const roleCurrent = await this._getRoleOfDepartment({ departmentId });
        if (!roleCurrent) {
          this.ctx.throw(1003, departmentId);
        }
        // add user role
        await this.ctx.meta.role.deleteUserRole({ userId, roleId: roleCurrent.id });
      }
    }

    async _createUserAndMember({ member }) {
      // 1. create user&auth
      // verify auth user
      const wxworkHelper = new (WxworkHelperFn(this.ctx))();
      const verifyUser = await wxworkHelper.verifyAuthUser({ scene: 'wxwork', member, needLogin: false });
      const userId = verifyUser.agent.id;

      // 2. add user to role
      if (member.department) {
        await this._addUserRoles({ userId, departmentIds: member.department.split(',') });
        // delete role:activated (need not)
      }

      // 3. status
      if (member.status !== 1) {
        await this.ctx.meta.user.disable({ userId, disabled: true });
      }

      // 4. create member
      member.userId = userId;
      const res = await this.ctx.model.member.insert(member);
      return res.insertId;
    }

    // not create new role here
    async _getRoleOfDepartment({ departmentId }) {
      // role top
      if (departmentId === 0) {
        return await this._getRoleTop();
      }
      // department
      const department = await this.ctx.model.department.get({ departmentId });
      if (!department) return null;
      return await this.ctx.meta.role.get({ id: department.roleId });
    }

    // get role top
    async _getRoleTop() {
      const roleContainer = await this.ctx.meta.role.get({ roleName: this.ctx.config.sync.department.roleContainer });
      const roleTop = await this.ctx.meta.role.get({ roleName: this.ctx.config.sync.department.roleTop, roleIdParent: roleContainer.id });
      if (roleTop) return roleTop;
      // create role
      const data = {
        roleName: this.ctx.config.sync.department.roleTop,
        catalog: 1,
        sorting: 0,
        roleIdParent: roleContainer.id,
      };
      data.id = await this.ctx.meta.role.add(data);
      return data;
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
      else if (type === 'array') return value.join(',');
      else if (type === 'json') return JSON.stringify(value);
      return value;
    }

  }

  return Contacts;
};
