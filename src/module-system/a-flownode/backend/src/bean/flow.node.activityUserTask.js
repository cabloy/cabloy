const require3 = require('require3');
const assert = require3('assert');

module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class FlowNode extends ctx.app.meta.FlowNodeBase {
    constructor(options) {
      super(ctx, options);
    }

    async onNodeEnter() {
      // super
      await super.onNodeEnter();

      // options
      const options = this.getNodeRefOptions();

      // prepare assignees
      const res = await this._prepareAssignees({ options });
      if (!res) return false;

      // ok
      return true;
    }

    async onNodeBegin() {
      // super
      await super.onNodeBegin();

      // user
      const user = this._getOpUser();

      // var: _assignees
      const assignees = this.contextNode.vars.get('_assignees');
      assert(assignees && assignees.length > 0);

      // create tasks
      for (const userIdAssignee of assignees) {
        await ctx.bean.flowTask._createTaskInstance({
          nodeInstance: this.nodeInstance,
          userIdAssignee,
          user,
        });
      }

      // ok
      return true;
    }

    async onNodeDoing() {
      // super
      await super.onNodeDoing();

      // break
      return false;
    }

    async _prepareAssignees({ options }) {
      // check var: _assignees
      let assignees = this.contextNode.vars.get('_assignees');
      if (assignees && assignees.length > 0) return true;

      // assignees
      assignees = await this._parseAssignees({ options });

      // confirmation
      if (assignees.length === 0 || options.confirmation) {
        // user
        const user = this._getOpUser();
        const taskInstance = await ctx.bean.flowTask._createTaskInstance({
          nodeInstance: this.nodeInstance,
          userIdAssignee: user.id,
          user,
        });
        await this._taskConfirmationClaim({ taskInstance });
        // break
        return false;
      }

      // save var: _assignees
      this.contextNode.vars.set('_assignees', assignees);

      // ok
      return true;
    }

    async _taskConfirmationClaim({ taskInstance }) {
      // specificFlag timeClaimed
      const specificFlag = 1;
      const timeClaimed = new Date();
      taskInstance.contextTask._flowTask.specificFlag = specificFlag;
      taskInstance.contextTask._flowTask.timeClaimed = timeClaimed;
      await taskInstance.modelFlowTask.update(taskInstance.contextTask._flowTask);
      // history
      taskInstance.contextTask._flowTaskHistory.specificFlag = specificFlag;
      taskInstance.contextTask._flowTaskHistory.timeClaimed = timeClaimed;
      await taskInstance.modelFlowTaskHistory.update(taskInstance.contextTask._flowTaskHistory);
    }

    async _parseAssignees({ options }) {
      // init
      let assignees = [];

      // 1. users
      const users = this._ensureIntArray(options.assignees.users);
      if (users) {
        assignees = assignees.concat(users);
      }

      // 2. roles
      const roles = this._ensureArray(options.assignees.roles);
      if (roles) {
        for (let roleId of roles) {
          if (isNaN(roleId)) {
            const role = await ctx.bean.role.get({ roleName: roleId });
            if (!role) ctx.throw.module(moduleInfo.relativeName, 1008, roleId);
            roleId = role.id;
          }
          const list = await ctx.bean.role.usersOfRoleParent({ roleId, disabled: 0 });
          assignees = assignees.concat(list.map(item => item.id));
        }
      }

      // 3. vars
      const vars = this._ensureArray(options.assignees.vars);
      if (vars) {
        for (const _var of vars) {
          const userId = await this._parseUserVar({ _var });
          if (userId) {
            assignees.push(userId);
          }
        }
      }

      // unique
      assignees = Array.from(new Set(assignees));

      // ok
      return assignees;
    }

    async _parseUserVar({ _var }) {
      if (_var === 'flowUser') {
        return this.context._flow.flowUserId;
      }
    }

    _getOpUser() {
      let user = ctx.state.user && ctx.state.user.op;
      if (!user || user.anonymous === 1) {
        user = { id: this.context._flow.flowUserId };
      }
      return user;
    }

    _ensureIntArray(str) {
      if (!str) return null;
      if (!Array.isArray(str)) {
        str = str.toString().split(',');
      }
      return str.map(item => parseInt(item));
    }

    _ensureArray(str) {
      if (!str) return null;
      if (!Array.isArray(str)) {
        str = str.toString().split(',');
      }
      return str;
    }

  }

  return FlowNode;
};
