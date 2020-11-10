const require3 = require('require3');
const extend = require3('extend2');
const assert = require3('assert');

const __nodeRefOptionsDefault = {
  assignees: {
    users: null,
    roles: null,
    vars: null,
  },
  confirmation: false,
  bidding: false,
  completionCondition: {
    passed: 1,
    rejected: '100%',
  },
  rejectedNode: null,
  allowRejectTask: true,
  allowCancelFlow: false,
};

module.exports = ctx => {
  class FlowNode extends ctx.app.meta.FlowNodeBase {
    constructor(options) {
      super(ctx, options);
    }

    getNodeRefOptions() {
      const options = super.getNodeRefOptions();
      return extend(true, {}, __nodeRefOptionsDefault, options);
    }

    async onNodeEnter() {
      // super
      await super.onNodeEnter();

      // prepare assignees
      const res = await this._prepareAssignees();
      if (!res) return false;

      // ok
      return true;
    }

    async onNodeBegin() {
      // super
      await super.onNodeBegin();

      // var: _assignees
      const assignees = this.contextNode.vars.get('_assignees');
      assert(assignees && assignees.length > 0);

      // create tasks
      for (const userIdAssignee of assignees) {
        await ctx.bean.flowTask._createTaskInstance({
          nodeInstance: this.nodeInstance,
          userIdAssignee,
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

    async _prepareAssignees() {
      // check var: _assignees
      let assignees = this.contextNode.vars.get('_assignees');
      if (assignees && assignees.length > 0) return true;

      // init
      assignees = [];

      // options
      const options = this.getNodeRefOptions();

      // 1. users
      const users = this._ensureIntArray(options.assignees.users);
      if (users) {
        assignees = assignees.concat(users);
      }

      // 2. roles
      const roles = this._ensureIntArray(options.assignees.roles);
      if (roles) {
        for (const roleId of roles) {
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

      // save var: _assignees
      this.contextNode.vars.set('_assignees', assignees);

      // ok
      return true;
    }

    async _parseUserVar({ _var }) {
      if (_var === 'flowUser') {
        return this.context._flow.flowUserId;
      }
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
