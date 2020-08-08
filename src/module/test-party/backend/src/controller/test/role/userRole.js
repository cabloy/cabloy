const require3 = require('require3');
const assert = require3('assert');

module.exports = app => {

  class UserRoleController extends app.Controller {

    async userRole() {
      // userIds
      const userIds = this.ctx.cache.mem.get('userIds');
      // roleIds
      const roleIds = this.ctx.cache.mem.get('roleIds');

      // direct
      let list = await this.ctx.meta.role.getUserRolesDirect({ userId: userIds.root });
      assert.equal(list.length, 1);
      // parent
      list = await this.ctx.meta.role.getUserRolesParent({ userId: userIds.root });
      assert.equal(list.length, 3);
      // expand
      list = await this.ctx.meta.role.getUserRolesExpand({ userId: userIds.root });
      assert(list.length > 3);

      // direct
      let res = await this.ctx.meta.role.userInRoleDirect({
        userId: userIds.root, roleId: roleIds.superuser,
      });
      assert.equal(res, true);
      // parent
      res = await this.ctx.meta.role.userInRoleParent({
        userId: userIds.root, roleId: roleIds.root,
      });
      assert.equal(res, true);
      // expand
      res = await this.ctx.meta.role.userInRoleExpand({
        userId: userIds.root, roleId: roleIds.system,
      });
      assert.equal(res, true);

      // done
      this.ctx.success();
    }

  }

  return UserRoleController;
};

